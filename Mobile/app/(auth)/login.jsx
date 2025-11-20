import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link, router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import InstagramSpinner from '../../components/InstagramSpinner';
import { login } from '../../service/Api';
import styles from './styles';

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
        if (loginData?.image) {
          await AsyncStorage.setItem('userImage', loginData.image);
        } 
      } else {
        console.warn('Advertencia: El ID de usuario no se pudo guardar.');
      }
      const target = typeof returnTo === 'string' && returnTo.startsWith('/') ? returnTo : '/home';
      router.replace(target);
    } catch (e) {
      const errorData = e?.response?.data;
      const msg = errorData?.error || errorData?.message || e?.message || 'No se pudo iniciar sesión';
      Alert.alert('Error de login', msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (checking)  return (
        <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: '#fff' }}>
          <InstagramSpinner />
          <Text style={{ marginTop: 8, color: "#666" }}>Cargando...</Text>
        </SafeAreaView>
      );

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/InstagramIcon.png')}
        style={styles.logo}
      />

    <View style={styles.formContainer}>
      <TextInput
        placeholder="Correo Electrónico"
        placeholderTextColor= "#919191ff"
        autoCapitalize="none"
        keyboardType="email-address"   
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />

      <TextInput
        placeholder="Contraseña"
        placeholderTextColor= "#919191ff"
        secureTextEntry
        value={pass}
        onChangeText={setPass}
        style={styles.input}
      />
  
        <Pressable
          onPress={submitting ? null : onSubmit} // Deshabilita si está cargando
          disabled={submitting} // Agrega disabled
          style={({ pressed }) => [
            styles.button,
            pressed && !submitting && { transform: [{ scale: 0.97 }], opacity: 0.8 },
            submitting && { opacity: 0.6 } // Opacidad cuando está cargando
          ]}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" /> // Color del spinner
          ) : (
            <Text style={styles.buttonText}>Iniciar sesión</Text>
          )}
        </Pressable>
      </View>

      <View style={styles.divider} />

      <Text style={styles.text}>
        ¿No tienes una cuenta?{' '}
        <Link href="/register" style={styles.link}>
          Regístrate
        </Link>
      </Text>
    </View>
  );
}
