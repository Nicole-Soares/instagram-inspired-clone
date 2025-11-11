import { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Alert, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login } from '../../service/Api';

export default function Login() {
  const { returnTo } = useLocalSearchParams();
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [checking, setChecking] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      const t = await AsyncStorage.getItem('token');
      if (t) return router.replace('/home');
      setChecking(false);
    })();
  }, []);

  const onSubmit = async () => {
    if (!email.trim() || !pass.trim()) return Alert.alert('Completa email y contraseña');
    try {
      setSubmitting(true);
      const loginData = await login(email, pass); 
      
      if (loginData?.id) {
          await AsyncStorage.setItem('userId', loginData.id); 
      } else {
          console.warn('Advertencia: El ID de usuario no se pudo guardar.');
      }
      const target = typeof returnTo === 'string' && returnTo.startsWith('/') ? returnTo : '/home';
      router.replace(target);
    } catch (e) {
      const msg = e?.response?.data?.message || e?.message || 'No se pudo iniciar sesión';
      Alert.alert('Error de login', msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (checking) return <ActivityIndicator style={{ marginTop: 40 }} />;

  return (
    <View style={{ flex:1, justifyContent:'center', padding:20, gap:12 }}>
      <Text style={{ fontSize:36, textAlign:'center', marginBottom:8 }}>Instagram</Text>
      <TextInput placeholder="Correo" autoCapitalize="none" keyboardType="email-address"
        value={email} onChangeText={setEmail}
        style={{ borderWidth:1, borderColor:'#ddd', padding:10, borderRadius:8 }} />
      <TextInput placeholder="Contraseña" secureTextEntry
        value={pass} onChangeText={setPass}
        style={{ borderWidth:1, borderColor:'#ddd', padding:10, borderRadius:8 }} />
      {submitting ? <ActivityIndicator/> : <Button title="Iniciar sesión" onPress={onSubmit} />}
      <Text style={{ textAlign:'center', marginTop:10, color:'#4f6cf0' }} onPress={() => router.replace('/register')}>
        ¿No tenés cuenta? Registrate
      </Text>
    </View>
  );
}
