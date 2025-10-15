import React from 'react';
import '../style/DeleteConfirmationModal.css';

function DeleteConfirmationModal({ onClose, onConfirm }) {
    return (
    
        <div className="modalDeleteOverlay">
            <div className="modalDeleteContent" onClick={(e) => e.stopPropagation()}>
            <div className="modalDeleteBody">
          <h2>Eliminar Posteo</h2>
          <p>¿Estás seguro de que quieres eliminar el post?</p>
        </div>
                <div className="modalDeleteActions">
                    <button 
                        className="button-cancel" 
                        onClick={onClose} 
                    >
                        Cancelar
                    </button>

                    <button 
                        className="button-confirm" 
                        onClick={onConfirm} 
                    >
                        Borrar
                    </button>
                </div>
            </div>
            
        </div> 
    );
}

export default DeleteConfirmationModal;