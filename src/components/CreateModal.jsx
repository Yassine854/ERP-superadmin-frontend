import React from 'react';

export default function Modal({ isOpen, onClose, onSubmit, title, children, footer }) {
    const handleClose = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto flex justify-center items-center bg-black bg-opacity-50">
            <div className="relative w-full max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-800 focus:outline-none"
                        aria-label="Close modal"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <form className="mb-6" onSubmit={onSubmit}>
                            {children}
                            <div className="flex items-center justify-end pt-4 md:pt-5">
                                {footer}
                            </div>
                        </form>

            </div>
        </div>
    );
}
