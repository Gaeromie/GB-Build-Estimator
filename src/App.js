import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, addDoc, doc, getDoc, getDocs, updateDoc, deleteDoc, query, where, orderBy } from 'firebase/firestore';
import partsData from './partsData.json';
import './App.css';

// Admin password
const ADMIN_PASSWORD = 'admin123';

function App() {
  // Routing state
  const [currentView, setCurrentView] = useState('create'); // 'create', 'view', 'admin', 'myBuilds'
  const [buildId, setBuildId] = useState(null);
  
  // Build form state
  const [buildName, setBuildName] = useState('');
  const [consoleType, setConsoleType] = useState('gba-sp');
  const [ownConsole, setOwnConsole] = useState(true);
  const [selections, setSelections] = useState({});
  
  // Multiple shells/buttons
  const [shellQuantity, setShellQuantity] = useState(1);
  const [shellSelections, setShellSelections] = useState([{}]); // Array of shell selections
  const [buttonQuantity, setButtonQuantity] = useState(1);
  const [buttonSelections, setButtonSelections] = useState([{}]); // Start with one empty selection
  
  // UI state
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('');
  const [editMode, setEditMode] = useState(false);
  
  // Admin state
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [allBuilds, setAllBuilds] = useState([]);
  
  // User builds state
  const [userId, setUserId] = useState(null);
  const [userBuilds, setUserBuilds] = useState([]);

  // Initialize user ID from localStorage
  useEffect(() => {
    let storedUserId = localStorage.getItem('gb_user_id');
    if (!storedUserId) {
      storedUserId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('gb_user_id', storedUserId);
    }
    setUserId(storedUserId);
  }, []);

  // Handle routing on mount
  useEffect(() => {
    // Get the full URL to handle GitHub Pages routing
    const fullUrl = window.location.href;
  
    console.log('Current URL:', fullUrl); // Debug log
  
    if (fullUrl.includes('admin')) {
      console.log('Admin route detected');
      setCurrentView('admin');
    } else if (fullUrl.match(/build\/([^/&?#]+)/)) {
      const buildIdMatch = fullUrl.match(/build\/([^/&?#]+)/);
      if (buildIdMatch) {
        console.log('Build route detected:', buildIdMatch[1]);
        loadBuild(buildIdMatch[1]);
      }
    } else if (fullUrl.match(/my-builds\/([^/&?#]+)/)) {
      const userIdMatch = fullUrl.match(/my-builds\/([^/&?#]+)/);
      if (userIdMatch) {
        console.log('My Builds route detected:', userIdMatch[1]);
        loadUserBuilds(userIdMatch[1]);
      }
    }
  }, []);
    
    if (path.includes('/admin')) {
      setCurrentView('admin');
    } else if (path.match(/\/build\/([^/]+)/)) {
      const buildIdMatch = path.match(/\/build\/([^/]+)/);
      if (buildIdMatch) {
        loadBuild(buildIdMatch[1]);
      }
    } else if (path.match(/\/my-builds\/([^/]+)/)) {
      const userIdMatch = path.match(/\/my-builds\/([^/]+)/);
      if (userIdMatch) {
        loadUserBuilds(userIdMatch[1]);
      }
    }
  }, []);

  // Load a specific build
  const loadBuild = async (id) => {
    try {
      const docRef = doc(db, 'builds', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        setBuildName(data.buildName);
        setConsoleType(data.consoleType);
        setOwnConsole(data.ownConsole);
        setSelections(data.selections || {});
        setShellSelections(data.shellSelections || [{}]);
        setShellQuantity(data.shellSelections?.length || 1);
        setButtonSelections(data.buttonSelections || []);
        setButtonQuantity(data.buttonSelections?.length || 0);
        setCurrentView('view');
        setBuildId(id);
      } else {
        alert('Build not found');
      }
    } catch (error) {
      console.error('Error loading build:', error);
      alert('Error loading build');
    }
  };

  // Load all builds for admin
  const loadAllBuilds = async () => {
    try {
      const buildsRef = collection(db, 'builds');
      const q = query(buildsRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const builds = [];
      querySnapshot.forEach((doc) => {
        builds.push({ id: doc.id, ...doc.data() });
      });
      setAllBuilds(builds);
    } catch (error) {
      console.error('Error loading builds:', error);
      alert('Error loading builds');
    }
  };

  // Load user's builds
  const loadUserBuilds = async (uid) => {
    console.log('Loading builds for userId:', uid);
    try {
      const buildsRef = collection(db, 'builds');
      const q = query(buildsRef, where('userId', '==', uid));
      const querySnapshot = await getDocs(q);
      console.log('Found builds:', querySnapshot.size);
      const builds = [];
      querySnapshot.forEach((doc) => {
        builds.push({ id: doc.id, ...doc.data() });
      });
      setUserBuilds(builds);
      setCurrentView('myBuilds');
    } catch (error) {
      console.error('Error loading user builds:', error);
      alert('Error loading user builds');
    }
  };

  // Handle selection changes
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

  // Handle shell quantity change
  const handleShellQuantityChange = (qty) => {
    const newQty = parseInt(qty) || 1;
    setShellQuantity(newQty);
    
    // Adjust shellSelections array
    const newSelections = [...shellSelections];
    if (newQty > shellSelections.length) {
      // Add empty selections
      for (let i = shellSelections.length; i < newQty; i++) {
        newSelections.push({});
      }
    } else {
      // Remove excess selections
      newSelections.splice(newQty);
    }
    setShellSelections(newSelections);
  };

  // Handle button quantity change
  const handleButtonQuantityChange = (qty) => {
    const newQty = parseInt(qty) || 0;
    setButtonQuantity(newQty);
    
    // Adjust buttonSelections array
    const newSelections = [...buttonSelections];
    if (newQty > buttonSelections.length) {
      // Add empty selections
      for (let i = buttonSelections.length; i < newQty; i++) {
        newSelections.push({});
      }
    } else {
      // Remove excess selections
      newSelections.splice(newQty);
    }
    setButtonSelections(newSelections);
  };

  // Handle individual shell selection
  const handleShellSelection = (index, field, value) => {
    const newSelections = [...shellSelections];
    newSelections[index] = { ...newSelections[index], [field]: value };
    
    // Clear the specific choice if subcategory changed
    if (field === 'subcategory') {
      newSelections[index].choice = '';
    }
    
    setShellSelections(newSelections);
  };

  // Handle individual button selection
  const handleButtonSelection = (index, field, value) => {
    const newSelections = [...buttonSelections];
    newSelections[index] = { ...newSelections[index], [field]: value };
    
    // Clear the specific choice if subcategory changed
    if (field === 'subcategory') {
      newSelections[index].choice = '';
    }
    
    setButtonSelections(newSelections);
  };

  // Calculate total price
  const calculateTotal = () => {
    let total = 0;

    // Console cost
    if (!ownConsole) {
      total += 100;
    }

    // Shell cost (multiple shells)
    const shellCategory = partsData.categories.find(c => c.id === 'shell');
    total += shellCategory.pricePerUnit * shellQuantity;

    // Button cost (multiple button sets)
    const buttonCategory = partsData.categories.find(c => c.id === 'buttons');
    if (buttonQuantity > 0) {
      // Check if any button selection is NOT "buttons-stock"
      let chargeableButtons = 0;
      buttonSelections.forEach(button => {
        if (button.choice && button.choice !== 'buttons-stock') {
          chargeableButtons++;
        }
      });
      total += buttonCategory.pricePerUnit * chargeableButtons;
    }

    // Other categories
    partsData.categories.forEach(category => {
      if (category.id === 'shell' || category.id === 'buttons') return;

      if (category.multiSelect && selections[category.id]) {
        selections[category.id].forEach(optionId => {
          const option = category.options.find(o => o.id === optionId);
          if (option) total += option.price;
        });
      } else if (category.options && !category.options[0]?.subcategory) {
        const selectedOption = category.options.find(o => o.id === selections[category.id]);
        if (selectedOption) total += selectedOption.price;
      }
    });

    return total;
  };

  // Save or update build
  const handleSaveBuild = async () => {
    if (!buildName.trim()) {
      alert('Please enter a build name');
      return;
    }

    // Validate shells
    for (let i = 0; i < shellQuantity; i++) {
      if (!shellSelections[i]?.choice) {
        alert(`Please select Shell ${i + 1}`);
        return;
      }
    }

    // Validate buttons (mandatory - at least 1)
    if (buttonQuantity < 1) {
      alert('Please select at least 1 button set');
      return;
    }
    for (let i = 0; i < buttonQuantity; i++) {
      if (!buttonSelections[i]?.choice) {
        alert(`Please select Button Set ${i + 1}`);
        return;
      }
    }

    // Check other required fields
    const requiredCategories = partsData.categories.filter(c => c.required && c.id !== 'shell' && c.id !== 'buttons');
    for (const category of requiredCategories) {
      if (!selections[category.id]) {
        alert(`Please select a ${category.name}`);
        return;
      }
    }

    try {
      console.log('Saving build with userId:', userId);
      const buildData = {
        buildName,
        consoleType,
        ownConsole,
        selections,
        shellSelections,
        buttonSelections,
        total: calculateTotal(),
        userId: userId,
        createdAt: editMode ? (await getDoc(doc(db, 'builds', buildId))).data().createdAt : new Date(),
        updatedAt: new Date()
      };

      if (editMode && buildId) {
        // Update existing build
        await updateDoc(doc(db, 'builds', buildId), buildData);
        alert('Build updated successfully!');
        setEditMode(false);
      } else {
        // Create new build
        const docRef = await addDoc(collection(db, 'builds'), buildData);
        setBuildId(docRef.id);
        
        const buildLink = `${window.location.origin}/GB-Build-Estimator/build/${docRef.id}`;
        const myBuildsLink = `${window.location.origin}/GB-Build-Estimator/my-builds/${userId}`;
        
        setGeneratedLink(buildLink);
        setShowConfirmation(false);
        
        alert(`Build saved!\n\nBuild Link: ${buildLink}\n\nMy Builds: ${myBuildsLink}`);
        navigator.clipboard.writeText(buildLink);
      }
    } catch (error) {
      console.error('Error saving build:', error);
      alert('Error saving build. Please try again.');
    }
  };

  // Delete build (admin only)
  const handleDeleteBuild = async (id) => {
    if (!window.confirm('Are you sure you want to delete this build?')) return;
    
    try {
      await deleteDoc(doc(db, 'builds', id));
      alert('Build deleted');
      loadAllBuilds();
    } catch (error) {
      console.error('Error deleting build:', error);
      alert('Error deleting build');
    }
  };

  // Edit build
  const handleEditBuild = async (id) => {
    await loadBuild(id);
    setEditMode(true);
    setCurrentView('create');
    window.history.pushState({}, '', '/GB-Build-Estimator');
  };

  // Admin login
  const handleAdminLogin = () => {
    if (adminPassword === ADMIN_PASSWORD) {
      setIsAdmin(true);
      loadAllBuilds();
    } else {
      alert('Incorrect password');
    }
  };

  // Render category options (for non-shell, non-button categories)
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
                disabled={currentView === 'view'}
              />
              <span>{option.name} (+${option.price})</span>
            </label>
          ))}
        </div>
      );
    }

    return (
      <select
        value={selections[category.id] || ''}
        onChange={(e) => handleSelectionChange(category.id, e.target.value)}
        disabled={currentView === 'view'}
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

  // Render shell selection interface
  const renderShellSelection = () => {
    const shellCategory = partsData.categories.find(c => c.id === 'shell');
    
    return (
      <div className="category-section">
        <h3>
          Shell
          <span className="required">*</span>
        </h3>
        <p className="category-desc">Includes buttons, membranes, and hardware</p>
        
        <div className="shell-quantity">
          <label>Number of Shells:</label>
          <input
            type="number"
            min="1"
            max="5"
            value={shellQuantity}
            onChange={(e) => handleShellQuantityChange(e.target.value)}
            className="number-input"
            disabled={currentView === 'view'}
          />
          <span className="price-note">+${shellCategory.pricePerUnit} per shell</span>
        </div>

        <div className="multiple-selection-container">
          {shellSelections.map((shell, index) => (
            <div key={index} className="selection-item">
              <div className="selection-item-header">Shell {index + 1}</div>
              <div className="nested-select">
                <select
                  value={shell.subcategory || ''}
                  onChange={(e) => handleShellSelection(index, 'subcategory', e.target.value)}
                  disabled={currentView === 'view'}
                  className="select-dropdown"
                >
                  <option value="">Select Style...</option>
                  {shellCategory.options.map(opt => (
                    <option key={opt.subcategory} value={opt.subcategory}>
                      {opt.subcategory}
                    </option>
                  ))}
                </select>

                {shell.subcategory && (
                  <select
                    value={shell.choice || ''}
                    onChange={(e) => handleShellSelection(index, 'choice', e.target.value)}
                    disabled={currentView === 'view'}
                    className="select-dropdown"
                  >
                    <option value="">Select {shell.subcategory}...</option>
                    {shellCategory.options
                      .find(o => o.subcategory === shell.subcategory)?.choices
                      .map(choice => (
                        <option key={choice.id} value={choice.id}>
                          {choice.name}
                        </option>
                      ))}
                  </select>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render button selection interface
  const renderButtonSelection = () => {
    const buttonCategory = partsData.categories.find(c => c.id === 'buttons');
    
    return (
      <div className="category-section">
        <h3>Buttons (if different from shell)</h3>
        
        <div className="shell-quantity">
          <label>Number of Button Sets:</label>
          <input
            type="number"
            min="1"
            max="3"
            value={buttonQuantity}
            onChange={(e) => handleButtonQuantityChange(e.target.value)}
            className="number-input"
            disabled={currentView === 'view'}
          />
          {buttonQuantity > 0 && (
            <span className="price-note">+${buttonCategory.pricePerUnit} per set</span>
          )}
        </div>

        {buttonQuantity > 0 && (
          <div className="multiple-selection-container">
            {buttonSelections.map((button, index) => (
              <div key={index} className="selection-item">
                <div className="selection-item-header">Button Set {index + 1}</div>
                <div className="nested-select">
                  <select
                    value={button.subcategory || ''}
                    onChange={(e) => handleButtonSelection(index, 'subcategory', e.target.value)}
                    disabled={currentView === 'view'}
                    className="select-dropdown"
                  >
                    <option value="">Select Style...</option>
                    {buttonCategory.options.map(opt => (
                      <option key={opt.subcategory} value={opt.subcategory}>
                        {opt.subcategory}
                      </option>
                    ))}
                  </select>

                  {button.subcategory && (
                    <select
                      value={button.choice || ''}
                      onChange={(e) => handleButtonSelection(index, 'choice', e.target.value)}
                      disabled={currentView === 'view'}
                      className="select-dropdown"
                    >
                      <option value="">Select {button.subcategory}...</option>
                      {buttonCategory.options
                        .find(o => o.subcategory === button.subcategory)?.choices
                        .map(choice => (
                          <option key={choice.id} value={choice.id}>
                            {choice.name}
                          </option>
                        ))}
                    </select>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Confirmation Modal
  const ConfirmationModal = () => (
    <div className="modal-overlay" onClick={() => setShowConfirmation(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Confirm Build</h2>
        <div className="confirmation-details">
          <p><strong>Build Name:</strong> {buildName}</p>
          <p><strong>Console:</strong> {partsData.consoleTypes.find(c => c.id === consoleType)?.name}</p>
          <p><strong>Providing Console:</strong> {ownConsole ? 'Yes' : 'No (+$100)'}</p>
          <hr />
          
          <p><strong>Shells ({shellQuantity}):</strong></p>
          {shellSelections.map((shell, idx) => {
            const shellCategory = partsData.categories.find(c => c.id === 'shell');
            const choice = shellCategory.options
              .find(o => o.subcategory === shell.subcategory)?.choices
              .find(c => c.id === shell.choice);
            return (
              <p key={idx} style={{marginLeft: '20px'}}>
                {idx + 1}. {shell.subcategory} - {choice?.name}
              </p>
            );
          })}

          {buttonQuantity > 0 && (
            <>
              <p><strong>Button Sets ({buttonQuantity}):</strong></p>
              {buttonSelections.map((button, idx) => {
                const buttonCategory = partsData.categories.find(c => c.id === 'buttons');
                const choice = buttonCategory.options
                  .find(o => o.subcategory === button.subcategory)?.choices
                  .find(c => c.id === button.choice);
                return (
                  <p key={idx} style={{marginLeft: '20px'}}>
                    {idx + 1}. {button.subcategory} - {choice?.name}
                  </p>
                );
              })}
            </>
          )}

          {partsData.categories.map(category => {
            if (category.id === 'shell' || category.id === 'buttons') return null;
            
            const selection = selections[category.id];
            if (!selection || (Array.isArray(selection) && selection.length === 0)) return null;

            let displayText = '';
            if (Array.isArray(selection)) {
              displayText = selection.map(id => 
                category.options.find(o => o.id === id)?.name
              ).join(', ');
            } else {
              const option = category.options.find(o => o.id === selection);
              displayText = option?.name || selection;
            }

            return (
              <p key={category.id}>
                <strong>{category.name}:</strong> {displayText}
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
            {editMode ? 'Update Build' : 'Confirm & Save'}
          </button>
        </div>
      </div>
    </div>
  );

  // ADMIN VIEW
  if (currentView === 'admin') {
    if (!isAdmin) {
      return (
        <div className="App">
          <header>
            <h1>🎮 GB Build Estimator - Admin</h1>
          </header>
          <div className="container admin-login">
            <h2>Admin Login</h2>
            <input
              type="password"
              placeholder="Enter admin password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
            />
            <button onClick={handleAdminLogin} className="btn-primary">
              Login
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="App">
        <header>
          <h1>🎮 GB Build Estimator - Admin Dashboard</h1>
          <button onClick={() => { setCurrentView('create'); window.history.pushState({}, '', '/GB-Build-Estimator'); }} className="btn-secondary">
            Create New Build
          </button>
        </header>
        <div className="container admin-container">
          <h2>All Builds ({allBuilds.length})</h2>
          {allBuilds.length === 0 ? (
            <div className="empty-state">
              <h3>No builds yet</h3>
              <p>Builds will appear here once created</p>
            </div>
          ) : (
            <table className="builds-table">
              <thead>
                <tr>
                  <th>Build Name</th>
                  <th>Console</th>
                  <th>Total</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {allBuilds.map(build => (
                  <tr key={build.id}>
                    <td>{build.buildName}</td>
                    <td>{partsData.consoleTypes.find(c => c.id === build.consoleType)?.name}</td>
                    <td>${build.total}</td>
                    <td>{build.createdAt?.toDate?.().toLocaleDateString() || 'N/A'}</td>
                    <td>
                      <div className="action-buttons">
                        <button onClick={() => loadBuild(build.id)} className="btn-small btn-view">
                          View
                        </button>
                        <button onClick={() => handleEditBuild(build.id)} className="btn-small btn-edit">
                          Edit
                        </button>
                        <button onClick={() => handleDeleteBuild(build.id)} className="btn-small btn-delete">
                          Delete
                        </button>
                        <button 
                          onClick={() => {
                            const link = `${window.location.origin}/GB-Build-Estimator/build/${build.id}`;
                            navigator.clipboard.writeText(link);
                            alert('Link copied!');
                          }} 
                          className="btn-small btn-copy"
                        >
                          Copy Link
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    );
  }

  // MY BUILDS VIEW
  if (currentView === 'myBuilds') {
    return (
      <div className="App">
        <header>
          <h1>🎮 My Builds</h1>
          <button onClick={() => { setCurrentView('create'); window.history.pushState({}, '', '/GB-Build-Estimator'); }} className="btn-secondary">
            Create New Build
          </button>
        </header>
        <div className="container my-builds-container">
          <h2>Your Builds ({userBuilds.length})</h2>
          {userBuilds.length === 0 ? (
            <div className="empty-state">
              <h3>No builds yet</h3>
              <p>Create your first build to see it here!</p>
            </div>
          ) : (
            userBuilds.map(build => (
              <div key={build.id} className="build-card">
                <h3>{build.buildName}</h3>
                <p><strong>Console:</strong> {partsData.consoleTypes.find(c => c.id === build.consoleType)?.name}</p>
                <p><strong>Total:</strong> ${build.total}</p>
                <div className="build-card-info">
                  <span>Created: {build.createdAt?.toDate?.().toLocaleDateString() || 'N/A'}</span>
                  <div className="build-card-actions">
                    <button onClick={() => loadBuild(build.id)} className="btn-small btn-view">
                      View
                    </button>
                    <button onClick={() => handleEditBuild(build.id)} className="btn-small btn-edit">
                      Edit
                    </button>
                    <button 
                      onClick={() => {
                        const link = `${window.location.origin}/GB-Build-Estimator/build/${build.id}`;
                        navigator.clipboard.writeText(link);
                        alert('Link copied!');
                      }} 
                      className="btn-small btn-copy"
                    >
                      Share
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  // VIEW BUILD
  if (currentView === 'view') {
    const shellCategory = partsData.categories.find(c => c.id === 'shell');
    const buttonCategory = partsData.categories.find(c => c.id === 'buttons');
    
    return (
      <div className="App">
        <header>
          <h1>🎮 GB Build Estimator</h1>
          <div style={{display: 'flex', gap: '10px'}}>
            {userId && (
              <button onClick={() => loadUserBuilds(userId)} className="btn-secondary">
                My Builds
              </button>
            )}
            <button onClick={() => { setCurrentView('create'); setBuildId(null); setEditMode(false); window.history.pushState({}, '', '/GB-Build-Estimator'); }} className="btn-secondary">
              Create New Build
            </button>
          </div>
        </header>
        <div className="container">
          <div className="view-mode">
            <h2>{buildName}</h2>
            <div className="build-details">
              <p><strong>Console:</strong> {partsData.consoleTypes.find(c => c.id === consoleType)?.name}</p>
              <p><strong>Providing Console:</strong> {ownConsole ? 'Yes' : 'No (+$100)'}</p>
              <hr />
              
              <p><strong>Shells ({shellSelections.length}):</strong></p>
              {shellSelections.map((shell, idx) => {
                const choice = shellCategory.options
                  .find(o => o.subcategory === shell.subcategory)?.choices
                  .find(c => c.id === shell.choice);
                return (
                  <p key={idx} style={{marginLeft: '20px'}}>
                    {idx + 1}. {shell.subcategory} - {choice?.name}
                  </p>
                );
              })}

              {buttonSelections.length > 0 && (
                <>
                  <p><strong>Button Sets ({buttonSelections.length}):</strong></p>
                  {buttonSelections.map((button, idx) => {
                    const choice = buttonCategory.options
                      .find(o => o.subcategory === button.subcategory)?.choices
                      .find(c => c.id === button.choice);
                    return (
                      <p key={idx} style={{marginLeft: '20px'}}>
                        {idx + 1}. {button.subcategory} - {choice?.name}
                      </p>
                    );
                  })}
                </>
              )}

              {partsData.categories.map(category => {
                if (category.id === 'shell' || category.id === 'buttons') return null;
                
                const selection = selections[category.id];
                if (!selection || (Array.isArray(selection) && selection.length === 0)) return null;

                let displayText = '';
                if (Array.isArray(selection)) {
                  displayText = selection.map(id => 
                    category.options.find(o => o.id === id)?.name
                  ).join(', ');
                } else {
                  const option = category.options.find(o => o.id === selection);
                  displayText = option?.name || selection;
                }

                return (
                  <p key={category.id}>
                    <strong>{category.name}:</strong> {displayText}
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

  // CREATE/EDIT BUILD
  return (
    <div className="App">
      <header>
        <h1>🎮 GB Build Estimator</h1>
        {userId && (
          <button onClick={() => loadUserBuilds(userId)} className="btn-secondary">
            My Builds
          </button>
        )}
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
          
          {renderShellSelection()}
          {renderButtonSelection()}
          
          {partsData.categories.map(category => {
            if (category.id === 'shell' || category.id === 'buttons') return null;
            
            return (
              <div key={category.id} className="category-section">
                <h3>
                  {category.name}
                  {category.required && <span className="required">*</span>}
                </h3>
                {category.description && <p className="category-desc">{category.description}</p>}
                {renderCategoryOptions(category)}
              </div>
            );
          })}
        </section>

        <div className="footer-actions">
          <div className="total-display">
            <h3>Estimated Total: ${calculateTotal()}</h3>
          </div>
          <button 
            onClick={() => setShowConfirmation(true)} 
            className="btn-primary btn-large"
          >
            {editMode ? 'Update Build' : 'Complete Build'}
          </button>
        </div>

        {generatedLink && !editMode && (
          <div className="success-message">
            <h3>✅ Build Saved!</h3>
            <p>Share this link:</p>
            <div className="link-display">
              <input type="text" value={generatedLink} readOnly />
              <button onClick={() => navigator.clipboard.writeText(generatedLink)}>
                Copy
              </button>
            </div>
            <p style={{marginTop: '10px'}}>
              <a href={`${window.location.origin}/GB-Build-Estimator/my-builds/${userId}`} 
                 onClick={(e) => { e.preventDefault(); loadUserBuilds(userId); }}>
                View all your builds
              </a>
            </p>
          </div>
        )}
      </div>

      {showConfirmation && <ConfirmationModal />}
    </div>
  );
}

export default App;
