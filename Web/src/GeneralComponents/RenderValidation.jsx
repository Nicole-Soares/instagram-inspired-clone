// components/generalComponents/RenderValidation.jsx
import UnauthorizedModal from "./modals/UnauthorizedModal";
import NotFoundModal from "./modals/NotFoundModal";
import ForbiddenModal from "./modals/ForbiddenModal";

export default function RenderValidation({ error }) {
const status = typeof error === "number" ? error : error?.status;
  if (!error) return null;

  // si el error tiene .status, mostramos el modal adecuado
  if (status === 401) {
    return <UnauthorizedModal />;
  }

  if (status === 403) {
    return <ForbiddenModal/>;
  }

  if (status === 404) {
    return <NotFoundModal />;
  }

  // para cualquier otro error
  return (
    <div className="error-fallback">
      <h3>Ocurrió un error inesperado</h3>
      <p>{error.message || "Intentá nuevamente más tarde."}</p>
    </div>
  );
}
