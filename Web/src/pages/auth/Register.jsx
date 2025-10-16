import { useState, useEffect } from "react";
import textLogo from '../../assets/instagram-text-logo.svg'
import { userRegister } from "../../service/auth/authService.js";
import { Link, useNavigate } from "react-router";
import '../../style/Register.css'
import RegisterForm from "./components/RegisterForm.jsx";
import Storage from "../../service/storage.js";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
        const token = Storage.getToken();
        if (token && !Storage.isTokenExpired()) {
           navigate('/');  
        }else{
          Storage.clearToken();
        }
      }, [navigate]);

  const handleRegister = (e) => {
  e.preventDefault();
  setError(null);

  if(!email || !password || !name || !image) {
    setError("Completa todos los campos.");
    return;
  }
  
  setLoading(true);
  
  userRegister(name, email, password, image)
    .then(() => {
      console.log("pase")
      navigate('/');
    })
    .catch((err) => {
      setError(err.message);
    })
    .finally(() => {
      setLoading(false);
    });
};

  return (
      <div className="register-form-container">
        
        <img src = {textLogo} alt="textLogo" className="register-text-logo"/>

        <h2>Regístrate para ver fotos y videos de tus amigos.</h2>
        
        <RegisterForm
          name={name}
          setName={setName}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          image={image}
          setImage={setImage}
          handleRegister={handleRegister}
          loading={loading}
          error={error}
        />
        <hr className="register-divider" />
        <p> ¿Tienes una cuenta? <Link to="/login">Inicia sesión</Link> </p>       
      </div>
  );
}

export default Register;