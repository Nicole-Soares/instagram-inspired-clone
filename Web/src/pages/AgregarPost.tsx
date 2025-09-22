import React, { useState } from "react";
//import { FontAwesome6 } from "@react-native-vector-icons/fontawesome6";
import './AgregarPost.css'


const AgregarPost = () => {

    const [imagen, setImagen] = useState<any>(false);
    const [url, setUrl] = useState<any>(null);
    const [descripcion, setDescripcion] = useState<any>(null);

    return(
    <div className="agregarPostPantalla">
        <div>
            <h1>Preview</h1>
        </div>
        <div>
            <div>
            {imagen ? (
                <img src={imagen} alt="Logo" />
            ) : (
                <div>
                   
                    <h2>Agregar imagen</h2>
                </div>
            )}
            </div>
            <div>
                <label htmlFor="myInput">Enter text:</label>
                    
                   

                    <label htmlFor="myInput">Enter text:</label>
                   


                    <label htmlFor="myInput">Enter text:</label>
                   
            </div>
        </div>
    </div>
    )
};

export default AgregarPost; 