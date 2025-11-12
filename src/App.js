import React, { useState } from 'react';
import { db } from './firebase';
import { collection, addDoc, doc, getDoc } from 'firebase/firestore';
import partsData from './partsData.json';
import './App.css';

function App() {
  const [buildId, setBuildId] = useState(null);
  const [viewMode, setViewMode] = useState('create');
  const [buildName, setBuildName] = useState('');
  const [consoleType, setConsoleType] = useState('gba-sp');
  const [ownConsole, setOwnConsole] = useState(true);
  const [selections, setSelections] = useState({});
  const [shellQuantity, setShellQuantity] = useState(1);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('');

  React.useEffect(() => {
    const pathMatch = window.location.pathname.match(/\/build\/([^/]+)/);
    if (pathMatch) {
      loadBuild(pathMatch[1]);
    }
  }, []);

  const loadBuild = async (id) => {
    try {
      const docRef = doc(db, 'builds', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        setBuildName(data.buildName);
        setConsoleType(data.consoleType);
        setOwnConsole(data.ownConsole);
        setSelections(data.selections);
        setShellQuantity(data.shellQuantity || 1);
        setViewMode('view');
        setBuildId(id);
      } else {
        alert('Build not found');
      }
    } catch (error) {
      console.error('Error loading build:', error);
      alert('Error loading build');
    }
  };

  const handleSelectionChange = (categoryId, value, isMultiSelect = false) => {
    if (isMultiSelect) {
      setSelections(prev => {
        const current = prev[categoryId] || [];
        const newSelections = current.includes(value)
          ? current.filter(v => v !== value)
          : [...current, value];
        return { ...prev, [categoryId]: newSelections };
      });
    } else {
      setSelections(prev => ({ ...prev, [categoryId]: value }));
    }
  };

  const calculateTotal = () => {
    let total = 0;

    if (!ownConsole) {
      total += 100;
    }

    const shellCategory = partsData.categories.find(c => c.id === 'shell');
    if (selections.shell) {
      total += shellCategory.pricePerUnit * shellQuantity;
    }

    partsData.categories.forEach(category => {
      if (category.id === 'shell') return;

      if (category.multiSelect && selections[category.id]) {
        selections[category.id].forEach(optionId => {
          const option = category.options.find(o => o.id === optionId);
          if (option) total += option.price;
        });
      } else if (category.options && !category.options[0]?.subcategory) {
        const selectedOption = category.options.find(o => o.id === selections[category.id]);
        if (selectedOption) total += selectedOption.price;
      } else if (category.options && category.options[0]?.subcategory && selections[category.id]) {
        if (category.id === 'buttons' && selections[category.id] !== 'buttons-stock') {
          total += category.pricePerUnit || 0;
        }
      }
    });

    return total;
  };

  const handleSaveBuild = async () => {
    if (!buildName.trim()) {
      alert('Please enter a build name');
      return;
    }

    const requiredCategories = partsData.categories.filter(c => c.required);
    for (const category of requiredCategories) {
      if (!selections[category.id]) {
        alert(`Please select a ${category.name}`);
        return;
      }
    }

    try {
      const buildData = {
        buildName,
        consoleType,
        ownConsole,
        selections,
        shellQuantity,
        total: calculateTotal(),
        createdAt: new Date()
      };

      const docRef = await addDoc(collection(db, 'builds'), buildData);
      const shareableLink = `${window.location.origin}/build/${docRef.id}`;
      setGeneratedLink(shareableLink);
      setBuildId(docRef.id);
      setShowConfirmation(false);
      alert('Build saved! Link copied to clipboard.');
      navigator.clipboard.writeText(shareableLink);
    } catch (error) {
      console.error('Error saving build:', error);
      alert('Error saving build. Please try again.');
    }
  };

  const renderCategoryOptions = (category) => {
    if (category.multiSelect) {
      return (
        <div className="options-grid">
          {category.options.map(option => (
            <label key={option.id} className="checkbox-option">
              <input
                type="checkbox"
                checked={(selections[category.id] || []).includes(option.id)}
                onChange={() => handleSelectionChange(category.id, option.id, true)}
                disabled={viewMode === 'view'}
              />
              <span>{option.name} (+${option.price})</span>
            </label>
          ))}
        </div>
      );
    }

    if (category.options[0]?.subcategory) {
      const selectedSubcategory = selections[`${category.id}_subcategory`];
      const subcategoryChoices = selectedSubcategory
        ? category.options.find(o => o.subcategory === selectedSubcategory)?.choices || []
        : [];

      return (
        <div className="nested-select">
          <select
            value={selectedSubcategory || ''}
            onChange={(e) => {
              setSelections(prev => ({
                ...prev,
                [`${category.id}_subcategory`]: e.target.value,
                [category.id]: ''
              }));
            }}
            disabled={viewMode === 'view'}
            className="select-dropdown"
          >
            <option value="">Select Style...</option>
            {category.options.map(opt => (
              <option key={opt.subcategory} value={opt.subcategory}>
                {opt.subcategory}
              </option>
            ))}
          </select>

          {selectedSubcategory && (
            <select
              value={selections[category.id] || ''}
              onChange={(e) => handleSelectionChange(category.id, e.target.value)}
              disabled={viewMode === 'view'}
              className="select-dropdown"
            >
              <option value="">Select {selectedSubcategory}...</option>
              {subcategoryChoices.map(choice => (
                <option key={choice.id} value={choice.id}>
                  {choice.name}
                </option>
              ))}
            </select>
          )}
        </div>
      );
    }

    return (
      <select
        value={selections[category.id] || ''}
        onChange={(e) => handleSelectionChange(category.id, e.target.value)}
        disabled={viewMode === 'view'}
        className="select-dropdown"
      >
        <option value="">Select {category.name}...</option>
        {category.options.map(option => (
          <option key={option.id} value={option.id}>
            {option.name} {option.price > 0 ? `(+$${option.price})` : ''}
          </option>
        ))}
      </select>
    );
  };

  const ConfirmationModal = () => (
    <div className="modal-overlay" onClick={() => setShowConfirmation(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Confirm Build</h2>
        <div className="confirmation-details">
          <p><strong>Build Name:</strong> {buildName}</p>
          <p><strong>Console:</strong> {partsData.consoleTypes.find(c => c.id === consoleType)?.name}</p>
          <p><strong>Providing Console:</strong> {ownConsole ? 'Yes' : 'No'}</p>
          <hr />
          {partsData.categories.map(category => {
            const selection = selections[category.id];
            if (!selection || (Array.isArray(selection) && selection.length === 0)) return null;

            let displayText = '';
            if (Array.isArray(selection)) {
              displayText = selection.map(id => 
                category.options.find(o => o.id === id)?.name
              ).join(', ');
            } else if (category.options[0]?.subcategory) {
              const subcategory = selections[`${category.id}_subcategory`];
              const choice = category.options
                .find(o => o.subcategory === subcategory)?.choices
                .find(c => c.id === selection);
              displayText = choice ? `${subcategory} - ${choice.name}` : selection;
            } else {
              const option = category.options.find(o => o.id === selection);
              displayText = option?.name || selection;
            }

            return (
              <p key={category.id}>
                <strong>{category.name}:</strong> {displayText}
                {category.id === 'shell' && shellQuantity > 1 && ` (x${shellQuantity})`}
              </p>
            );
          })}
          <hr />
          <p className="total"><strong>Total:</strong> ${calculateTotal()}</p>
        </div>
        <div className="modal-buttons">
          <button onClick={() => setShowConfirmation(false)} className="btn-secondary">
            Go Back
          </button>
          <button onClick={handleSaveBuild} className="btn-primary">
            Confirm & Save
          </button>
        </div>
      </div>
    </div>
  );

  if (viewMode === 'view') {
    return (
      <div className="App">
        <header>
          <h1>🎮 GB Build Estimator</h1>
          <button onClick={() => { setViewMode('create'); setBuildId(null); window.history.pushState({}, '', '/'); }} className="btn-secondary">
            Create New Build
          </button>
        </header>
        <div className="container">
          <div className="view-mode">
            <h2>{buildName}</h2>
            <div className="build-details">
              <p><strong>Console:</strong> {partsData.consoleTypes.find(c => c.id === consoleType)?.name}</p>
              <p><strong>Providing Console:</strong> {ownConsole ? 'Yes' : 'No (+$100)'}</p>
              <hr />
              {partsData.categories.map(category => {
                const selection = selections[category.id];
                if (!selection || (Array.isArray(selection) && selection.length === 0)) return null;

                let displayText = '';
                if (Array.isArray(selection)) {
                  displayText = selection.map(id => 
                    category.options.find(o => o.id === id)?.name
                  ).join(', ');
                } else if (category.options[0]?.subcategory) {
                  const subcategory = selections[`${category.id}_subcategory`];
                  const choice = category.options
                    .find(o => o.subcategory === subcategory)?.choices
                    .find(c => c.id === selection);
                  displayText = choice ? `${subcategory} - ${choice.name}` : selection;
                } else {
                  const option = category.options.find(o => o.id === selection);
                  displayText = option?.name || selection;
                }

                return (
                  <p key={category.id}>
                    <strong>{category.name}:</strong> {displayText}
                    {category.id === 'shell' && shellQuantity > 1 && ` (x${shellQuantity})`}
                  </p>
                );
              })}
            </div>
            <div className="total-display">
              <h3>Total: ${calculateTotal()}</h3>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <header>
        <h1>🎮 GB Build Estimator</h1>
      </header>

      <div className="container">
        <section className="build-info">
          <div className="form-group">
            <label>Build Name</label>
            <input
              type="text"
              placeholder="e.g., Zac's SP"
              value={buildName}
              onChange={(e) => setBuildName(e.target.value)}
              className="text-input"
            />
          </div>

          <div className="form-group">
            <label>Console Type</label>
            <select value={consoleType} onChange={(e) => setConsoleType(e.target.value)} className="select-dropdown">
              {partsData.consoleTypes.map(console => (
                <option key={console.id} value={console.id} disabled={!console.available}>
                  {console.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>{partsData.questions[0].text}</label>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  checked={ownConsole}
                  onChange={() => setOwnConsole(true)}
                />
                Yes
              </label>
              <label>
                <input
                  type="radio"
                  checked={!ownConsole}
                  onChange={() => setOwnConsole(false)}
                />
                No (+$100)
              </label>
            </div>
          </div>
        </section>

        <section className="parts-selection">
          <h2>Build Configuration</h2>
          {partsData.categories.map(category => (
            <div key={category.id} className="category-section">
              <h3>
                {category.name}
                {category.required && <span className="required">*</span>}
              </h3>
              {category.description && <p className="category-desc">{category.description}</p>}
              
              {category.id === 'shell' && (
                <div className="shell-quantity">
                  <label>Number of Shells:</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={shellQuantity}
                    onChange={(e) => setShellQuantity(parseInt(e.target.value) || 1)}
                    className="number-input"
                  />
                  <span className="price-note">+${category.pricePerUnit} per shell</span>
                </div>
              )}
              
              {renderCategoryOptions(category)}
            </div>
          ))}
        </section>

        <div className="footer-actions">
          <div className="total-display">
            <h3>Estimated Total: ${calculateTotal()}</h3>
          </div>
          <button 
            onClick={() => setShowConfirmation(true)} 
            className="btn-primary btn-large"
          >
            Complete Build
          </button>
        </div>

        {generatedLink && (
          <div className="success-message">
            <h3>✅ Build Saved!</h3>
            <p>Share this link:</p>
            <div className="link-display">
              <input type="text" value={generatedLink} readOnly />
              <button onClick={() => navigator.clipboard.writeText(generatedLink)}>
                Copy
              </button>
            </div>
          </div>
        )}
      </div>

      {showConfirmation && <ConfirmationModal />}
    </div>
  );
}

export default App;
