
const API = "http://localhost:7070";

const searchContent = async (query) => {
  try {
    const res = await fetch(`${API}/search?query=${encodeURIComponent(query)}`, {
      method: "GET",
      headers: { 
        "Content-Type": "application/json"
      },
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Error en la búsqueda");
    }

    return data;
    
  } catch (error) {
    console.error("Error en la búsqueda:", error);
    throw error;
  }
};

export { searchContent };