import React, { useRef, useState } from "react";
import '../style/AgregarPost.css'
//import { BsCamera } from "react-icons/bs"; // Importa el icono de cámara

const AgregarPost = () => {

    const [imagen, setImagen] = useState<any>(false);
    const [url, setUrl] = useState<any>('');
    const [descripcion, setDescripcion] = useState<any>('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Función para manejar el cambio en el input de la URL
    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newUrl = e.target.value;
        setUrl(newUrl);
        // Opcional: muestra la imagen en el preview si la URL es válida
        if (newUrl) {
            setImagen(newUrl);
        } else {
            setImagen(false);
        }
    };

    const handleAgregarImagenClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setImagen(imageUrl);
            setUrl(imageUrl); // Esto actualiza el input de URL con la imagen cargada
        }
    }

    const handleSubmit = async () => {
        
        try {
          const response = await fetch('https://localhost:7070/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Specify the content type of your data
                'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyXzEiLCJpYXQiOjE3NTcwMjMxNTcsImV4cCI6MTc1NzEwOTU1N30.qShZk6nf1gtPFIxy2OWoDDTQd-_GPXBTzbagspCuyx0`,
            },
            body: JSON.stringify({
                imagen: url,
                descripcion: descripcion,
            }),
          });
    
          if (!response.ok) {
            console.log("hola");
            throw new Error('Error al crear el post');
            
          }
    
          const data = await response.json();
          //tendria que ir a la pantalla del post ??
          setImagen(false);
          setUrl('');
          setDescripcion('');

        } catch (error) {
          
          console.error('Error:', error);
        }
      };
   
    return(
        <div className="paginaAgregarPost">
            <div className="contenedorTituloAgregarPost">
                <h1 className="tituloAgregarPost">Preview</h1>
            </div>
            <div className="contenedorImagenYImputs">
                <div className="contenedorImagen">
                {imagen ? (
                    <img src={imagen} alt="Preview" />
                ) : (
                    <div onClick={handleAgregarImagenClick}>
                        
                        <h2 className="agregarImagen">Agregar imagen</h2>
                    </div>
                    
                )}
                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                    />
                </div>
                <div className="contenedorImputs">
                
                    <input
                        id="url-input"
                        type="text"
                        placeholder="Url de la imagen"
                        value={url}
                        onChange={handleUrlChange}
                    />

                    <textarea
                        id="descripcion-input"
                        placeholder="Agrega descripcion"
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                    />

                    <button onClick={handleSubmit} className="botonAgregarPost">Publicar</button>
                </div>
            </div>
        </div>
    )
};

export default AgregarPost;