import { useEffect, useRef, useCallback } from 'react';
import './Modal.css';

const Modal = ({ isOpen, onClose, children }) => {
    const modalContentRef = useRef(null);
    const handleClickOutside = useCallback((event) => {
        if (modalContentRef.current && !modalContentRef.current.contains(event.target)) {
            onClose();
        }
    }, [onClose]);

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, handleClickOutside]);

    if (!isOpen) {
        return null;
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content" ref={modalContentRef}>
                {children}
            </div>
        </div>
    );
};

export default Modal;