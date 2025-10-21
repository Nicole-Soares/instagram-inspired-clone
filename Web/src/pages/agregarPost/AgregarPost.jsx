import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import "../../style/agregarPost/AgregarPost.css";
import ImagenPreview from "./components/ImagenPreview";
import FormularioPost from "./components/FormularioPost";
import { crearPost } from "../../service/agregarPost/agregarPostService";
import { toast } from "react-toastify";
import UnauthorizedModal from "../../GeneralComponents/modals/UnauthorizedModal";
import Storage from "../../service/storage";
import SideBar from "../../generalComponents/SideBar";

const AgregarPost = () => {
  const [url, setUrl] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [isUnauthorized, setIsUnauthorized] = useState(false);
 
  const navigate = useNavigate();
  const token = Storage.getToken();

  const handleUrlChange = (e) => {
    const newUrl = e.target.value;
    setUrl(newUrl);
  };

  useEffect(() => {
    if (!token || Storage.isTokenExpired() ) {
      setIsUnauthorized(true);
      return;
    }
  }, [token]);

  const handleSubmit = async () => {
     if (!url.trim()) {
          toast.warn("Necesita una imagen para crear un post.");
          return;
        }
    try {
      const nuevoPost = await crearPost(url, descripcion);
      toast.success("Post creado con éxito 🎉");
      navigate(`/post/${nuevoPost.id}`);
      setUrl("");
      setDescripcion("");
    } catch (error) {
      const status = error.response?.status || error.status;
      if (status === 401) {
        setIsUnauthorized(true);
      } else {
        toast.error("Error al crear la publicacion: Solo se permiten URLs del tipo http o https.");
        console.error(error);
      }
    }
  };

  if (isUnauthorized) return <UnauthorizedModal />;
  return (
    <div className="paginaAgregarPost">
      <SideBar/>
      <div className="paginaAgregarPostContenido">
      <div className="contenedorTituloAgregarPost">
        <h1 className="tituloAgregarPost">Preview</h1>
      </div>
      <div className="contenedorImagenYImputs">
        <ImagenPreview
          imagen={url}
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
    </div>
  );
};

export default AgregarPost;
