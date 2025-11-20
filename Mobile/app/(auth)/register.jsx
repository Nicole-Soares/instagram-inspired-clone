import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link, router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import InstagramSpinner from '../../components/InstagramSpinner';
import { login, register } from '../../service/Api';
import styles  from './styles';

export default function Register() {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [image, setImage] = useState('');
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
    if (!name.trim() || !email.trim() || !pass.trim() || !image.trim()) {
      return Alert.alert('Completá todos los campos');
    }

    try {
      setSubmitting(true);

      await register(name, email, pass, image);

      const data = await login(email, pass);

      await AsyncStorage.setItem("token", data.token);
      await AsyncStorage.setItem("userId", String(data.id));

      router.replace('/home');

    } catch (e) {
      const msg =
        e?.response?.data?.error ||
        e?.response?.data?.message ||
        e?.message ||
        "No se pudo registrar";
      Alert.alert("Error", msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (checking) {
    return (
      <SafeAreaView style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: '#fff'
      }}>
        <InstagramSpinner />
        <Text style={{ marginTop: 8, color: "#666" }}>Cargando...</Text>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/InstagramIcon.png')}
        style={styles.logo}
      />

      <Text style={styles.textTitle}>
        Regístrate para ver fotos y videos de tus amigos.
      </Text>

      <View style={styles.formContainer}>
        <TextInput
          placeholder="Nombre"
          placeholderTextColor="#919191ff"
          autoCapitalize="none"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />

        <TextInput
          placeholder="Correo Electrónico"
          placeholderTextColor="#919191ff"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />

        <TextInput
          placeholder="Contraseña"
          placeholderTextColor="#919191ff"
          secureTextEntry
          value={pass}
          onChangeText={setPass}
          style={styles.input}
        />

        <TextInput
          placeholder="Imagen"
          placeholderTextColor="#919191ff"
          autoCapitalize="none"
          value={image}
          onChangeText={setImage}
          style={styles.input}
        />

        <Pressable
          onPress={submitting ? null : onSubmit}
          disabled={submitting}
          style={({ pressed }) => [
            styles.button,
            pressed && !submitting && {
              transform: [{ scale: 0.97 }],
              opacity: 0.8,
            },
            submitting && { opacity: 0.6 },
          ]}
        >
          {submitting ? (
            <InstagramSpinner color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Crear cuenta</Text>
          )}
        </Pressable>

        <Text style={styles.text}>
            Al registrarte, aceptas nuestras{' '}
            <Link href="" style={styles.link}>Condiciones</Link>, la{' '}
            <Link href="" style={styles.link}>Política de privacidad</Link> y la{' '}
            <Link href="" style={styles.link}>Política de cookies</Link>.
        </Text>
        </View>

        <View style={styles.divider} />

        <Text style={styles.text}>
          ¿Tienes una cuenta?{" "}
          <Link href="/login" style={styles.link}>
            Inicia sesión
          </Link>
        </Text>
    </View>
  );
}
