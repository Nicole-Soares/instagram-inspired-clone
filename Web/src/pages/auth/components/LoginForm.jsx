import InputField from "./InputField";
import SubmitButton from "./SubmitButton";
import "../../../style/login/LoginForm.css";

export default function LoginForm({
  email,
  setEmail,
  password,
  setPassword,
  handleLogin,
  loading,
  error,
}) {
  return (
    <form className="login-form" onSubmit={handleLogin} noValidate>
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
      <SubmitButton type="submit" loading={loading}>
        Iniciar sesión
      </SubmitButton>
      {error && <p className="error">{error}</p>}
    </form>
  );
}
