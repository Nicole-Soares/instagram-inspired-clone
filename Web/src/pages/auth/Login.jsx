import { useState, useEffect } from "react";
import loginPhoto from '../../assets/instagram-login-photo.png'
import textLogo from '../../assets/instagram-text-logo.svg'
import '../../style/Login.css'
import { userLogin } from "../../service/authService.js";
import { Link, useNavigate } from "react-router";
import LoginForm from "./components/LoginForm.jsx";
import Storage from "../../service/storage.js";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

  const handleLogin = (e) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Completa todos los campos.");
      return;
    }

    setLoading(true);

    userLogin(email, password)
      .then(() => {
        
        navigate(`/`); 
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="login-container">
      <div className="photo-container">
        <img src = {loginPhoto} alt="Login" className="login-photo"/>
      </div>
      <div className="form-container">
        <img src={textLogo} alt="textLogo" className="text-logo" />

        <LoginForm
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          handleLogin={handleLogin}
          loading={loading}
          error={error}
        />

        <hr className="divider" />
        <p>
          {" "}
          ¿No tienes una cuenta? <Link to="/register">Regístrate</Link>{" "}
        </p>
      </div>
    </div>
  );
}

export default Login;
