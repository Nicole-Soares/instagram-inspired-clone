import { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Index() {
  const [loading, setLoading] = useState(true);
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    (async () => {
      const t = await AsyncStorage.getItem('token'); 
      setHasToken(!!t); //guarda un booleano
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        {/* <InstagramSpinner size="large" /> */}
      </SafeAreaView>
    );
  }
  return <Redirect href={hasToken ? '/home' : '/login'} />;
}
