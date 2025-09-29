 const setToken = (token) => {localStorage.setItem("token", token);};

 const getToken = () => localStorage.getItem("token");

 const clearToken = () => {localStorage.removeItem("token");};

const Storage = { setToken, getToken, clearToken };

export default Storage;
