import React, { useState } from 'react';

const Modal = ({ isOpen, onClose, children }) => {
  const [modalOpen, setModalOpen] = useState(isOpen);

  const closeModal = () => {
    setModalOpen(false);
    onClose();
  };

  return (
    <>
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
          <div className="relative w-auto max-w-lg mx-auto my-6">
            {/* Modal content */}
            <div className="modal-content bg-white rounded-lg shadow-lg relative">
              {/* Header */}
              <div className="modal-header px-4 py-3 border-b border-gray-200">
                <h3 className="text-lg font-semibold">Modal Header</h3>
                <button
                  className="modal-close absolute top-0 right-0 mt-4 mr-4"
                  onClick={closeModal}
                >
                  <svg
                    className="w-6 h-6 text-gray-500 hover:text-gray-700 cursor-pointer"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              {/* Body */}
              <div className="modal-body px-4 py-3">{children}</div>
            </div>
          </div>
          {/* Background overlay */}
          <div
            className="modal-overlay fixed inset-0 bg-black opacity-50"
            onClick={closeModal}
          ></div>
        </div>
      )}
    </>
  );
};

export default Modal;
