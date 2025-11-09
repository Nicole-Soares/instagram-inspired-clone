import { useEffect, useState } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { Image, ScrollView, Text, View, Button, Pressable } from 'react-native';

export default function PostPage() {
  const { id } = useLocalSearchParams();
  const postId = Array.isArray(id) ? id[0] : id;

  const [post, setPost] = useState(null);
  useEffect(() => {
    setPost({
      id: postId,
      image: `https://picsum.photos/1000/800?${postId}`,
      user: { id: 1, name: 'Juan' },
      liked: false,
      isOwner: true,
      createdAt: '2025/09/15 - 16:31',
      description: 'Descripción ejemplo',
      comments: [{ id: 1, user: { id: 2, name: 'Nico' }, text: 'Buen post!' }],
    });
  }, [postId]);

  if (!post) return null;

  return (
    <ScrollView contentContainerStyle={{ padding:16, gap:12 }}>
      <Pressable onPress={() => router.push(`/user/${post.user.id}`)}>
        <Text style={{ fontWeight:'700' }}>{post.user.name}</Text>
        <Text style={{ color:'#666' }}>{post.createdAt}</Text>
      </Pressable>

      <Image source={{ uri: post.image }} style={{ width:'100%', height:400, borderRadius:12 }} />

      <View style={{ flexDirection:'row', gap:10 }}>
        <Button title={post.liked ? '♥ Quitar me gusta' : '♡ Me gusta'} onPress={() => setPost({ ...post, liked: !post.liked })} />
        {post.isOwner && (
          <>
            <Button title="Editar" onPress={() => router.push(`/post/${post.id}/edit`)} />
            <Button title="Eliminar" color="red" onPress={() => { /* modal confirm */ }} />
          </>
        )}
      </View>

      <Text style={{ fontWeight:'700' }}>Descripción</Text>
      <Text>{post.description ?? '—'}</Text>

      <Text style={{ fontWeight:'700', marginTop:12 }}>Comentarios</Text>
      {post.comments.map((c) => (
        <Pressable key={c.id} onPress={() => router.push(`/user/${c.user.id}`)}>
          <Text><Text style={{ fontWeight:'700' }}>{c.user.name}</Text> {c.text}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}
