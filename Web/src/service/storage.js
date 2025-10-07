 const setToken = (token) => {localStorage.setItem("token", token);};

 const getToken = () => localStorage.getItem("token");

 const clearToken = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
 };

const setUserId = (userId) => { localStorage.setItem("userId", userId); };

const getUserId = () => localStorage.getItem("userId");

const Storage = { setToken, getToken, clearToken, setUserId, getUserId };

export default Storage;
