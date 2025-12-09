import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BookList from './components/BookList';
import AddBookForm from './components/AddBookForm';
import LibrarianDashboard from './components/LibrarianDashboard';
import AuthPage from './components/AuthPage';
import { ModalProvider } from './context/ModalContext';
import UserDashboard from './components/UserDashboard'; 
import './App.css';

function App() {
  const [user, setUser] = useState(null); // Holds: { token, username, role }
  const [refresh, setRefresh] = useState(false);

  // Configure Axios to use the token automatically once logged in
  useEffect(() => {
    if (user && user.token) {
        axios.defaults.headers.common['Authorization'] = `Token ${user.token}`;
    }
  }, [user]);

  const triggerRefresh = () => setRefresh(!refresh);

  const handleLogout = () => {
      setUser(null);
      delete axios.defaults.headers.common['Authorization'];
  };

  // --- 1. IF NOT LOGGED IN, SHOW AUTH PAGE ---
  if (!user) {
      return (
        <div className="app-container">
            <h1 className="header-title"> Regent Study Hub</h1>
            <AuthPage onLoginSuccess={setUser} />
        </div>
      );
  }

  // --- 2. IF LOGGED IN, SHOW MAIN APP ---
  return (
    <div className="app-container">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <h1 className="header-title" style={{marginBottom:0}}>Regent Book Club</h1>
        <div style={{textAlign:'right'}}>
            <span style={{marginRight:'15px', color:'#2a6e00'}}>
                Hello, <b>{user.username}</b> ({user.role})
            </span>
            <button className="sims-btn sims-btn-delete" onClick={handleLogout}>Logout</button>
        </div>
      </div>
      
      <div className="main-content" style={{marginTop:'40px'}}>
        
        {/* LEFT COLUMN: Tools & Dashboards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', width: '100%', maxWidth: '500px' }}>
            
            {/* LIBRARIAN VIEW */}
            {user.role === 'LIBRARIAN' && (
                <>
                    <AddBookForm onBookAdded={triggerRefresh} />
                    <LibrarianDashboard refreshTrigger={refresh} onAction={triggerRefresh} />
                </>
            )}

            {/* STUDENT / FACULTY VIEW */}
            {(user.role === 'STUDENT' || user.role === 'FACULTY') && (
                <UserDashboard refreshTrigger={refresh} onAction={triggerRefresh} />
            )}
            
        </div>

        {/* RIGHT COLUMN: Catalogue (Everyone sees this) */}
        <div className = "BookList">
            <BookList 
                refreshTrigger={refresh} 
                onAction={triggerRefresh} 
                currentUser={user}
            />
        </div>
      </div>
    </div>
  );
}

export default App;