import InputField from "./InputField";
import SubmitButton from "./SubmitButton";
import '../../../style/Register/RegisterForm.css'

export default function RegisterForm({name, setName, email, setEmail, password, setPassword,image, setImage, handleRegister, loading, error }) {
  return (
    <form className="register-form" onSubmit={handleRegister} noValidate>
      <InputField
        type="text"
        placeholder="Nombre"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <InputField
        type="email"
        placeholder="Correo electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <InputField
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <InputField
        type="url"
        placeholder="Imagen"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <SubmitButton type="submit" loading={loading}>
        Registrar
      </SubmitButton>
      {error && <p className="error">{error}</p>}
      <p>Al registrarte, aceptas nuestras <a href="">Condiciones</a>, la <a href="">Politica de privacidad</a> y la <a href="">Politica de cookies</a>.</p>
    </form>
  );
}
