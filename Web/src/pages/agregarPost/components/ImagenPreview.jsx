import React from 'react';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';

const ImagenPreview = ({ imagen, onAgregarImagenClick, fileInputRef, onFileChange }) => (
  <div className="contenedorImagen">
    {imagen ? (
      <img src={imagen} alt="Preview" />
    ) : (
      <div onClick={onAgregarImagenClick}>
        <AddAPhotoIcon />
        <h2 className="agregarImagen">Agregar imagen</h2>
      </div>
    )}
    <input
      type="file"
      accept="image/*"
      ref={fileInputRef}
      style={{ display: 'none' }}
      onChange={onFileChange}
    />
  </div>
);

export default ImagenPreview;
