import React, { useState } from 'react';
import axios from 'axios';
import { useModal } from '../context/ModalContext';

// controlled form to add books to the backend catalogue
const AddBookForm = ({ onBookAdded }) => {
    const [formData, setFormData] = useState({ title: '', author: '', isbn: '' });
    const { showAlert } = useModal();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    // Form submit handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8000/api/books/', formData);         // Send new book data to the API
            showAlert("New book added to catalogue.", "Book Added", "success");     // Show success notification via modal
            setFormData({ title: '', author: '', isbn: '' });                       // Clear the form inputs
            onBookAdded();                                                          // Notify parent to refresh book list
        } catch (error) {
            showAlert("Failed to add book.", "Error", "error");                     // Show error notification via modal
        }
    };

    return (
        <div className="sims-panel">
            <h2>Add Book</h2>
            <form onSubmit={handleSubmit} className="sims-form">
                <input className="sims-input" type="text" name="title" placeholder="Book Title" value={formData.title} onChange={handleChange} required />
                <input className="sims-input" type="text" name="author" placeholder="Author" value={formData.author} onChange={handleChange} required />
                <input className="sims-input" type="text" name="isbn" placeholder="ISBN" value={formData.isbn} onChange={handleChange} required />
                <button type="submit" className="sims-btn">Add to Library</button>
            </form>
        </div>
    );
};
export default AddBookForm;