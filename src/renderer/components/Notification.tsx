import React, { ReactNode, useEffect } from 'react';
import '../css/App.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

const Notification: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.removeEventListener('keydown', handleKeyDown);
    }

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="modal-dropdown"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
    >
      <div className="modal-content-not">
        <button
          className="modal-close"
          onClick={onClose}
          aria-label="Fechar modal"
        >
          &times;
        </button>

        {title && <h2 className="modal-title">{title}</h2>}

        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
};

export default Notification;
