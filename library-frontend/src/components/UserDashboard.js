import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useModal } from '../context/ModalContext';

// Component to display user's borrowed books and handle returns
const UserDashboard = ({ refreshTrigger, onAction }) => {
    const [transactions, setTransactions] = useState([]);
    const { showAlert, showConfirm } = useModal();

    useEffect(() => {
        fetchMyBooks();
    }, [refreshTrigger]);

    const fetchMyBooks = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/my-books/');    // Fetch user's borrowed books
            setTransactions(response.data);
        } catch (error) {
            console.error("Error fetching my books", error);        // Log error to console
        }
    };

    const handleReturn = (txnId, bookTitle) => {
        // Confirmation before returning
        showConfirm(`Are you ready to return "${bookTitle}"?`, async () => {
            try {
                const response = await axios.post(`http://localhost:8000/api/return/${txnId}/`);
                const fee = response.data.fee;
                
                if (fee > 0) {
                    showAlert(
                        `You returned "${bookTitle}" late.\n\nA fee of $${fee} has been charged to your account.`, 
                        "Late Return Fee", 
                        "error"     // Red header for fee notification
                    );
                } else {
                    showAlert(`"${bookTitle}" returned successfully!`, "Success", "success");
                    // No fee case
                }
                onAction(); // Trigger global refresh
            } catch (error) {
                showAlert("Could not return book. Please try again.", "Error", "error");
                // Show error notification via modal
            }
        });
    };

    return (
        <div className="sims-panel" style={{ borderTopColor: '#8CC63E' }}> 
            <h2 style={{ color: '#2a6e00' }}>My Borrowed Books</h2>
            {/* Display count of active loans */}
            {transactions.length === 0 ? (
                <p style={{ fontStyle: 'italic', color: '#999', textAlign:'center' }}>
                    You have no active loans.
                </p>
            ) : (
                <ul className="sims-list">
                    {transactions.map((txn) => (
                        <li key={txn.id} className="sims-list-item">
                            <div>
                                <strong>{txn.book_title}</strong>
                                <br/>
                                <small style={{color: '#666'}}>Due: {txn.expected_return_date}</small>
                            </div>
                            <button 
                                className="sims-btn"
                                style={{
                                    fontSize:'12px', 
                                    padding:'8px 15px', 
                                    backgroundColor:'#ff9900' // Orange for Return action
                                }}
                                onClick={() => handleReturn(txn.id, txn.book_title)}
                            >
                                Return
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default UserDashboard;