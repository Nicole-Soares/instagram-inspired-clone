import { useLocalSearchParams, router } from 'expo-router';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

export default function CommentsModal() {
  const { postId } = useLocalSearchParams();

  return (
    <Pressable style={{ flex:1 }} onPress={() => router.back()}>
      <Pressable style={styles.sheet} onPress={(e)=>e.stopPropagation()}>
        <View style={styles.handle} />
        <View style={styles.header}>
          <Text style={{ fontWeight:'700' }}>Comentarios del post #{postId}</Text>
        </View>

        <ScrollView contentContainerStyle={{ padding:16 }}>
          {Array.from({ length: 10 }).map((_, i) => (
            <Text key={i} style={{ marginBottom:12 }}>
              <Text style={{ fontWeight:'700' }}>Usuario</Text> Comentario de ejemplo
            </Text>
          ))}
        </ScrollView>

        <KeyboardAvoidingView behavior={Platform.select({ ios:'padding', android:undefined })} keyboardVerticalOffset={12}>
          <View style={styles.inputRow}>
            <TextInput placeholder="Agrega un comentario" style={styles.input} />
            <Pressable style={styles.button}><Text style={{ color:'#fff' }}>Publicar</Text></Pressable>
          </View>
        </KeyboardAvoidingView>
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  sheet:{ position:'absolute', left:0,right:0,bottom:0, height:'80%', backgroundColor:'#fff', borderTopLeftRadius:24, borderTopRightRadius:24, overflow:'hidden' },
  handle:{ alignSelf:'center', width:44, height:5, borderRadius:3, backgroundColor:'#ddd', marginTop:10, marginBottom:8 },
  header:{ paddingHorizontal:16, paddingBottom:8, borderBottomWidth:StyleSheet.hairlineWidth, borderColor:'#e5e5e5' },
  inputRow:{ flexDirection:'row', gap:8, padding:12, borderTopWidth:StyleSheet.hairlineWidth, borderColor:'#e5e5e5', backgroundColor:'#fff' },
  input:{ flex:1, borderWidth:1, borderColor:'#ddd', borderRadius:10, paddingHorizontal:12, paddingVertical:8 },
  button:{ backgroundColor:'#111', paddingHorizontal:14, paddingVertical:10, borderRadius:10 },
});
