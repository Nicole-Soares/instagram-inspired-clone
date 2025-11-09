import { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async () => {
    if (!name.trim() || !email.trim() || !pass.trim()) return Alert.alert('Completá todos los campos');
    try {
      setSubmitting(true);
      // TODO: API real
      await new Promise(r => setTimeout(r, 400));
      await AsyncStorage.setItem('token', 'demo-token');
      router.replace('/home');
    } catch (e) {
      Alert.alert('Error', e?.message ?? 'No se pudo registrar');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={{ flex:1, justifyContent:'center', padding:20, gap:12 }}>
      <Text style={{ fontSize:36, textAlign:'center', marginBottom:8 }}>Instagram</Text>
      <TextInput placeholder="Nombre" value={name} onChangeText={setName}
        style={{ borderWidth:1, borderColor:'#ddd', padding:10, borderRadius:8 }} />
      <TextInput placeholder="Correo" autoCapitalize="none" keyboardType="email-address"
        value={email} onChangeText={setEmail}
        style={{ borderWidth:1, borderColor:'#ddd', padding:10, borderRadius:8 }} />
      <TextInput placeholder="Contraseña" secureTextEntry
        value={pass} onChangeText={setPass}
        style={{ borderWidth:1, borderColor:'#ddd', padding:10, borderRadius:8 }} />
      <Button title={submitting ? 'Registrando…' : 'Registrarme'} onPress={onSubmit} disabled={submitting} />
      <Text style={{ textAlign:'center', marginTop:10, color:'#4f6cf0' }} onPress={() => router.replace('/login')}>
        ¿Ya tenés cuenta? Iniciá sesión
      </Text>
    </View>
  );
}
