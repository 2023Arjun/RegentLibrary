import React, { useState } from 'react';
import axios from 'axios';
import { useModal } from '../context/ModalContext';

const AuthPage = ({ onLoginSuccess }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ username: '', password: '', role: 'STUDENT' });
    const { showAlert } = useModal(); // <--- Hook

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = isLogin ? 'https://regentlibrary-1.onrender.com/api/login/' : 'https://regentlibrary-1.onrender.com/api/register/';
        
        try {
            const response = await axios.post(url, formData);
            if (isLogin) {
                onLoginSuccess(response.data);      // Pass user data to parent
            } else {
                showAlert("Account created! Please log in.", "Welcome", "success");
                setIsLogin(true);             // Switch to login view
            }
        } catch (error) {
            showAlert("Authentication Failed. Please check your credentials.", "Login Error", "error"); // Show error via modal
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
            <div className="sims-panel" style={{ width: '400px', textAlign: 'center' }}>
                <h2 style={{ color: '#2a6e00' }}>{isLogin ? "Library Login System" : "Join the Library"}</h2>
                <form onSubmit={handleSubmit} className="sims-form">
                    <input className="sims-input" type="text" name="username" placeholder="Username" onChange={handleChange} required />
                    <input className="sims-input" type="password" name="password" placeholder="Password" onChange={handleChange} required />
                    {!isLogin && (
                        <select className="sims-input" name="role" onChange={handleChange}>
                            <option value="STUDENT">Student</option>
                            <option value="FACULTY">Faculty</option>
                            <option value="LIBRARIAN">Librarian</option>
                        </select>
                    )}
                    <button type="submit" className="sims-btn">{isLogin ? "Log In" : "Register"}</button>
                </form>
                <p style={{ marginTop: '20px', fontSize: '14px', color: '#666', cursor: 'pointer', fontWeight:'bold'}} onClick={() => setIsLogin(!isLogin)}>
                    {isLogin ? "New user? Create an Account" : "Already have an account? Log In"}
                </p>
            </div>
        </div>
    );
};

export default AuthPage;
