import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useModal } from '../context/ModalContext';

// Add 'onAction' to props
const LibrarianDashboard = ({ refreshTrigger, onAction }) => {
    const [transactions, setTransactions] = useState([]);
    const { showAlert } = useModal();

    useEffect(() => {
        fetchTransactions();
    }, [refreshTrigger]);

    const fetchTransactions = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/librarian/dashboard/');
            setTransactions(response.data);
        } catch (error) {
            console.error("Error fetching transactions", error);
        }
    };

    const handleReturn = async (txnId) => {
        try {
            const response = await axios.post(`http://localhost:8000/api/return/${txnId}/`);
            const fee = response.data.fee;
            
            if (fee > 0) {
                // Custom Alert for Fees
                showAlert(
                    `LATE RETURN DETECTED!\n\nPlease collect a fee of $${fee} from the user.`, 
                    "Late Fee Alert", 
                    "error" // This makes the header red
                );
            } else {
                showAlert("Book returned successfully. No fees.", "Success", "success");
            }
            onAction(); 
        } catch (error) {
            showAlert("Error processing return.", "Error", "error");        // Show error notification via modal
        }
    };

    return (
        <div className="sims-panel" style={{ borderTopColor: '#0094ff' }}> 
            <h2 style={{ color: '#005a9e' }}>Librarian Dashboard</h2>
            <p style={{ fontSize: '12px', color: '#666', marginBottom: '15px' }}>
                Tracking Active Loans ({transactions.length})
            </p>

            {transactions.length === 0 ? (
                <p style={{ fontStyle: 'italic', color: '#999' }}>No active loans.</p>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '2px solid #eee' }}>
                            {/* UPDATED HEADERS */}
                            <th style={{ padding: '8px' }}>ISBN / Title</th>
                            <th style={{ padding: '8px' }}>Borrowed By</th>
                            <th style={{ padding: '8px' }}>Due Date</th>
                            <th style={{ padding: '8px' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((txn) => (
                            <tr key={txn.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                                {/* UPDATED COLUMNS */}
                                <td style={{ padding: '8px' }}>
                                    <strong>{txn.book_title}</strong><br/>
                                    <span style={{fontSize:'11px', color:'#777'}}>{txn.book_isbn}</span>
                                </td>
                                <td style={{ padding: '8px' }}>
                                    {txn.username}
                                </td>
                                <td style={{ padding: '8px', color: '#d9534f' }}>
                                    {txn.expected_return_date}
                                </td>
                                <td style={{ padding: '8px' }}>
                                    <button 
                                        className="sims-btn"
                                        style={{
                                            fontSize:'11px', 
                                            padding:'5px 10px', 
                                            backgroundColor:'#ff9900'
                                        }}
                                        onClick={() => handleReturn(txn.id)}
                                    >
                                        Return
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default LibrarianDashboard;