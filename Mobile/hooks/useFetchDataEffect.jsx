// hooks/useFetchDataEffect.js
import { useEffect, useState } from "react";

/**
 * Hook genérico para manejar fetchs de datos con estados controlados.
 * Ideal para usar con axios o cualquier promesa.
 *
 * @param {Function} fetchData - Función async que obtiene los datos.
 * @param {*} initialize - Valor inicial del estado.
 * @param {Array} dependencies - Dependencias del useEffect.
 * @param {Function} handlerError - Callback opcional para manejar errores específicos (ej: 401).
 */
const useFetchDataEffect = (
  fetchData,
  initialize,
  dependencies = [],
  handlerError = () => {}
) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [dataState, setDataState] = useState(initialize);

  const reloadScreen = () => setRefreshing((prev) => !prev);

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      try {
        setIsLoading(true);
        setIsError(false);
        setIsEmpty(false);

        const response = await fetchData();
        const result = response?.data ?? response;

        // Si viene vacío, lo marcamos como empty
        if (!result || (Array.isArray(result) && result.length === 0)) {
          if (mounted) setIsEmpty(true);
          return;
        }

        if (mounted) setDataState(result);
      } catch (err) {
        console.error("useFetchDataEffect error:", err);
        const status = err?.response?.status || err?.status;

        if (status === 401) {
          handlerError(err, "unauthorized");
        } else if (status === 404) {
          setIsEmpty(true);
        } else {
          setIsError(true);
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    loadData();

    return () => {
      mounted = false;
    };
  }, [...dependencies, refreshing]);

  return { isLoading, isError, isEmpty, reloadScreen, dataState };
};

export default useFetchDataEffect;
