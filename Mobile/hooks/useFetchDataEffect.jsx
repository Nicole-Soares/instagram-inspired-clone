import { useEffect, useState } from "react";

const useFetchDataEffect = (fetchData, initialize, dependencies = [], handlerError = () => {}) => {
  const [isLoading, setIsLoading] = useState(true); // cargando
  const [isError, setIsError] = useState(false); //error
  const [refreshing, setRefreshing] = useState(false);
  const [dataState, setDataState] = useState(initialize); //respuesta

  //pedir los datos sin tener que desmontar el componente
  const reloadScreen = () => setRefreshing(prev => !prev);

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      try {
        setIsLoading(true);
        setIsError(false);

        const response = await fetchData();

        // Si axios devuelve { data }, lo usamos; si no, el valor directo
        const result = response?.data ?? response;

        if (mounted) {
          setDataState(result);
        }
      } catch (err) {
        console.error("useFetchDataEffect error:", err);
        handlerError(err);
        if (mounted) setIsError(true);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    loadData();

    return () => {
      mounted = false; // cleanup: evita setState si el componente se desmonta
    };
  }, [...dependencies, refreshing]);

  return { isLoading, isError, reloadScreen, dataState };
};

export default useFetchDataEffect;
