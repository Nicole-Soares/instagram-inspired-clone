import { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from '@react-native-async-storage/async-storage';
import InstagramSpinner from '../components/InstagramSpinner';

export default function Index() {
  const [loading, setLoading] = useState(true);
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    (async () => {
      const t = await AsyncStorage.getItem('token'); 
      setHasToken(!!t);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <InstagramSpinner />
      </SafeAreaView>
    );
  }
  return <Redirect href={hasToken ? '/home' : '/login'} />;
}
