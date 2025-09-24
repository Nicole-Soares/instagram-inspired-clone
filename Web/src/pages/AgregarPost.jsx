import React, { useRef, useState} from "react";
//import { useNavigate } from 'react-router'
import '../style/AgregarPost.css';
import ImagenPreview from '../components/ImagenPreview';
import FormularioPost from '../components/FormularioPost';

const AgregarPost = () => {
 
    //se guarda el valor puesto en el input o mismo si se subio un archivo desde documentos 
  const [url, setUrl] = useState("");
  //se guarda el valor puesto en el input 
  const [descripcion, setDescripcion] = useState("");
  //se guarda el valor puesto en el input o mismo si se subio un archivo desde documentos 
  const fileInputRef = useRef(null);
  //const navigate = useNavigate();
  //cambios en el input de la url, lo que se va escribindo se setea
  const handleUrlChange = (e) => {
    const newUrl = e.target.value;
    setUrl(newUrl);
    
  };

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
      const response = await fetch('http://localhost:7070/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyXzEiLCJpYXQiOjE3NTg2NTA5ODAsImV4cCI6MTc1ODczNzM4MH0.tF4GrER1nw2zHRdVLXZqsL3WwR_VUX_nlYeO5p05pOU',
        },
        body: JSON.stringify({
          image: url,
          descripcion: descripcion,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.error || 'No se pudo crear el post.');
        return;
      }

      await response.json();
      ////navigate(`/Home`);
      //redirecciono al home ??
      console.log("se creó");
   
      setUrl('');
      setDescripcion('');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="paginaAgregarPost">
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
