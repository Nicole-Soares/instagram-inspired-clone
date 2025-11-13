export const formateoFecha = (isoString) => {
    const fecha = new Date(isoString);
    const año = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const día = String(fecha.getDate()).padStart(2, '0');
    const hora = String(fecha.getHours()).padStart(2, '0');
    const minutos = String(fecha.getMinutes()).padStart(2, '0');
    return `${año}/${mes}/${día} - ${hora}:${minutos}`;
};

