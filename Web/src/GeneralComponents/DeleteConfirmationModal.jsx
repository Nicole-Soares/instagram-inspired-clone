import React from 'react';
import '../style/DeleteConfirmationModal.css';

function DeleteConfirmationModal({ onClose, onConfirm }) {
    return (
    
        <div className="modalOverlay">
            
            <div className="modalContent" onClick={(e) => e.stopPropagation()}>
                <h2>Confirmar Eliminación</h2>
                <p>¿Estás seguro de que deseas eliminar este post?</p>
                <div className="modalActions">
                    <button 
                        className="button-confirm" 
                        onClick={onConfirm} 
                    >
                        Sí, Eliminar
                    </button>
                    <button 
                        className="button-cancel" 
                        onClick={onClose} 
                    >
                        Cancelar
                    </button>
                </div>
            </div>
            
        </div> 
    );
}

export default DeleteConfirmationModal;