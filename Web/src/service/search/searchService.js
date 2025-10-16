
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const searchContent = async (query) => {
  try {
    const res = await fetch(`${API_BASE_URL}/search?query=${encodeURIComponent(query)}`, {
      method: "GET",
      headers: { 
        "Content-Type": "application/json"
      },
    });

    const data = await res.json();

    return data;
    
  } catch (error) {
    console.error("Error en la búsqueda:", error);
    throw error;
  }
};

export { searchContent };