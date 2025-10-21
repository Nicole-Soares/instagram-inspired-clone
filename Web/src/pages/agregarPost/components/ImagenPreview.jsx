import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";

const ImagenPreview = ({
  imagen
}) => (
  <div className="contenedorImagen">
    {imagen ? (
      <img src={imagen} alt="Preview" />
    ) : (
      <div >
        <AddAPhotoIcon />
        <h2 className="agregarImagen">Agregar imagen</h2>
      </div>
    )}
    
  </div>
);

export default ImagenPreview;
