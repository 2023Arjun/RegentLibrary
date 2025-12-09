import React, { createContext, useState, useContext } from 'react';

const ModalContext = createContext();

export const useModal = () => useContext(ModalContext);

export const ModalProvider = ({ children }) => {
    const [modal, setModal] = useState({
        isOpen: false,
        message: '',
        title: 'Notification',
        type: 'alert', // 'alert' or 'confirm'
        variant: 'success', // 'success', 'error', 'info'
        onConfirm: null
    });

    // Function to show a simple Alert
    const showAlert = (message, title="Notification", variant="success") => {
        setModal({
            isOpen: true,
            message,
            title,
            type: 'alert',
            variant,
            onConfirm: null
        });
    };

    // Function to show a Confirmation Dialog (Yes/No)
    const showConfirm = (message, onConfirmAction) => {
        setModal({
            isOpen: true,
            message,
            title: "Confirm Action",
            type: 'confirm',
            variant: 'info',
            onConfirm: onConfirmAction
        });
    };

    const closeModal = () => {
        setModal({ ...modal, isOpen: false });
    };

    return (
        <ModalContext.Provider value={{ modal, showAlert, showConfirm, closeModal }}>
            {children}
            {/* Render the Modal Component directly here */}
            {modal.isOpen && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <div className={`modal-header ${modal.variant}`}>
                            {modal.title}
                        </div>
                        <div className="modal-content">
                            {modal.message}
                        </div>
                        <div className="modal-actions">
                            {modal.type === 'confirm' ? (
                                <>
                                    <button className="sims-btn" onClick={() => {
                                        modal.onConfirm();
                                        closeModal();
                                    }}>Yes</button>
                                    <button className="sims-btn sims-btn-delete" onClick={closeModal}>No</button>
                                </>
                            ) : (
                                <button className="sims-btn" onClick={closeModal}>OK</button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </ModalContext.Provider>
    );
};