import React, { useEffect, useRef, useState} from "react";
import { useNavigate } from 'react-router'
import '../../style/AgregarPost.css';
import ImagenPreview from './components/ImagenPreview';
import FormularioPost from './components/FormularioPost';
import { crearPost } from "../../service/agregarPost/agregarPostService";
import { toast, ToastContainer } from 'react-toastify';
import UnauthorizedModal from "../../generalComponents/UnauthorizedModal";
import Storage from "../../service/storage";

const AgregarPost = () => {
 
    //se guarda el valor puesto en el input o mismo si se subio un archivo desde documentos 
  const [url, setUrl] = useState("");
  //se guarda el valor puesto en el input 
  const [descripcion, setDescripcion] = useState("");
  const [isUnauthorized, setIsUnauthorized] = useState(false);
  //se guarda el valor puesto en el input o mismo si se subio un archivo desde documentos 
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const token = Storage.getToken();
  //cambios en el input de la url, lo que se va escribindo se setea
  const handleUrlChange = (e) => {
    const newUrl = e.target.value;
    setUrl(newUrl);
    
  };

  
      useEffect(() => {
          if (!token) {
              setIsUnauthorized(true);
              return;
          }

      }, [token]); // si pasa algun cambio vuelve a ejecutar el useEffect


  const handleAgregarImagenClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
    
      setUrl(imageUrl);
    }
  };

  const handleSubmit = async () => {
    try {
      
      const nuevoPost = await crearPost(url, descripcion);
     
      toast.success('Post creado con éxito 🎉');
     
      navigate(`/post/${nuevoPost.id}`);
      setUrl('');
      setDescripcion('');
    } catch (error){
      toast.error(error.message || 'Error al crear el post 😢');
    }
  };

  if (isUnauthorized) return <UnauthorizedModal />;
  return (
    <div className="paginaAgregarPost">
       <ToastContainer />
      <div className="contenedorTituloAgregarPost">
        <h1 className="tituloAgregarPost">Preview</h1>
      </div>
      <div className="contenedorImagenYImputs">
        <ImagenPreview
          imagen={url}
          onAgregarImagenClick={handleAgregarImagenClick}
          fileInputRef={fileInputRef}
          onFileChange={handleFileChange}
        />
        <FormularioPost
          url={url}
          descripcion={descripcion}
          onUrlChange={handleUrlChange}
          onDescripcionChange={(e) => setDescripcion(e.target.value)}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default AgregarPost;
