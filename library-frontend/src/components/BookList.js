import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useModal } from '../context/ModalContext';

const BookList = ({ refreshTrigger, onAction, currentUser }) => {    
    const [books, setBooks] = useState([]);
    const [searchTerm, setSearchTerm] = useState(''); // State for search input
    const [simulateLate, setSimulateLate] = useState(false);
    const { showAlert, showConfirm } = useModal(); 

    useEffect(() => {
        fetchBooks();
    }, [refreshTrigger]);

    const fetchBooks = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/books/', {
                params: { search: searchTerm }
            });
            setBooks(response.data);
        } catch (error) {
            console.error("Error fetching books:", error);
        }
    };

    // Trigger search when user clicks button or presses Enter
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        fetchBooks();
    };

    const handleDelete = (id) => {
        // Use custom confirm box
        showConfirm("Are you sure you want to delete this book from the catalogue?", async () => {
            try {
                await axios.delete(`http://localhost:8000/api/books/${id}/`);  
                showAlert("Book deleted successfully.", "Deleted", "success");
                onAction(); 
            } catch (error) {
                showAlert("Failed to delete book.", "Error", "error");
            }
        });
    };

    const handleBorrow = async (id) => {
        try {
            await axios.post(`http://localhost:8000/api/borrow/${id}/`, {
                test_late: simulateLate
            });
            showAlert("Book has been added to your account!", "Borrowed", "success");
            onAction(); 
        } catch (error) {
            const msg = error.response?.data?.error || "Failed to borrow";
            showAlert(msg, "Unavailable", "error");
        }
    };

    return (
        <div className="sims-panel">
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: '15px'}}>
                <h2 style={{margin:0}}>Catalogue</h2>
                
                {/* Simulation Toggle */}
                <label style={{fontSize:'12px', cursor:'pointer'}}>
                    <input 
                        type="checkbox" 
                        checked={simulateLate} 
                        onChange={(e) => setSimulateLate(e.target.checked)} 
                    /> 
                    Test Fee
                </label>
            </div>

            {/* --- SEARCH BAR --- */}
            <form onSubmit={handleSearchSubmit} style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
                <input 
                    type="text" 
                    className="sims-input" 
                    style={{ flex: 1, padding: '8px 15px' }} // Make it fill space
                    placeholder="Search by title..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="submit" className="sims-btn" style={{ padding: '8px 20px' }}>
                    Search
                </button>
            </form>
            {/* ---------------------- */}

            {books.length === 0 ? (
                <p style={{textAlign: 'center', color: '#888'}}>No books found.</p>
            ) : (
                <ul className="sims-list">
                    {books.map((book) => (
                        <li key={book.id} className="sims-list-item">
                            <div>
                                <strong>{book.title}</strong>
                                {book.is_available ? (
                                    <span style={{color:'green', fontSize:'12px', marginLeft:'10px'}}>● Available</span>
                                ) : (
                                    <span style={{color:'red', fontSize:'12px', marginLeft:'10px'}}>● Checked Out</span>
                                )}
                                <br/><small style={{color: '#666'}}>by {book.author}</small>
                            </div>
                            <div style={{display:'flex', gap:'5px'}}>
                                {book.is_available && (
                                    <button className="sims-btn" style={{padding:'8px 15px', fontSize:'12px', backgroundColor: '#0094ff'}}
                                        onClick={() => handleBorrow(book.id)}>Borrow</button>
                                )}
                                {currentUser && currentUser.role === 'LIBRARIAN' && (
                                    <button className="sims-btn sims-btn-delete" onClick={() => handleDelete(book.id)}>Delete</button>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default BookList;