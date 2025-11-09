import { useMemo } from 'react';
import { FlatList, Image, Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';

export default function Home() {
  const posts = useMemo(() => ([
    { id:101, user:{ id:1, name:'Juan' }, image:'https://picsum.photos/800/600?1', commentsCount:7, createdAt:'2025/09/15 - 16:31', description:'Texto ejemplo' },
    { id:102, user:{ id:2, name:'Nico' }, image:'https://picsum.photos/800/600?2', commentsCount:3, createdAt:'2025/09/13 - 10:12', description:'Otro post' },
  ]), []);

  return (
    <FlatList
      data={posts}
      keyExtractor={(p) => String(p.id)}
      renderItem={({ item }) => (
        <View style={{ padding:12, gap:8, borderTopWidth:1, borderColor:'#eee' }}>
          <Text style={{ fontWeight:'700' }}>{item.user.name}</Text>
          <Text style={{ color:'#666' }}>{item.createdAt}</Text>

          <Pressable onPress={() => router.push(`/post/${item.id}`)} style={{ marginTop:8 }}>
            <Image source={{ uri: item.image }} style={{ width:'100%', height:300, borderRadius:12 }} />
          </Pressable>

          <Pressable onPress={() => router.push(`/home/comments/${item.id}`)} style={{ paddingVertical:8 }}>
            <Text style={{ color:'#555' }}>💬 Comentarios ({item.commentsCount})</Text>
          </Pressable>
        </View>
      )}
    />
  );
}
