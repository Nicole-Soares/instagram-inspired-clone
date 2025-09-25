import { useState } from "react";
import loginPhoto from '../../assets/instagram-login-photo.png'
import textLogo from '../../assets/instagram-text-logo.svg'
import '../../style/Login.css'
import { userLogin } from "../../service/api";
import { Link } from "react-router";
import LoginForm from "./components/LoginForm.jsx";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
  e.preventDefault();
  setError(null);

  if(!email || !password) {
    setError("Completa todos los campos.");
    return;
  }
  
  setLoading(true);
  
  userLogin(email, password)
    .then(() => {
      //navigate('/Home');
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
      <img src = {loginPhoto} alt="Login" className="login-photo"/>

      <div className="form-container">
        
        <img src = {textLogo} alt="textLogo" className="text-logo"/>
        
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
        <p> ¿No tienes una cuenta? <Link to="/register">Regístrate</Link> </p>
        </div>
    </div>
  );
}

export default Login;