import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useState } from "react";
import { getUser } from "../service/Api";
import { isTokenExpired } from "../utils/isTokenExpired";

export function useTimeline() {
  const [state, setState] = useState({
    data: null,
    loading: true,
    error: false,
    unauthorized: false,
  });

  const load = useCallback(async () => {
    try {
      setState((s) => ({ ...s, loading: true, error: false }));

      // TOKEN
      const token = await AsyncStorage.getItem("token");
      if (!token || isTokenExpired(token)) {
        await AsyncStorage.removeItem("token");
        return setState({
          data: null,
          loading: false,
          error: false,
          unauthorized: true,
        });
      }

      // LLAMA A /user  ← ACÁ ESTÁ LA CLAVE
      const { data } = await getUser(); 

      setState({
        data,
        loading: false,
        error: false,
        unauthorized: false,
      });

    } catch (e) {
      setState({
        data: null,
        loading: false,
        error: true,
        unauthorized: false,
      });
    }
  }, []);

  return {
    ...state,
    reload: load,
  };
}
