import React, { useEffect, useRef } from "react";
import { FlatList } from "react-native";
import Comment from "./Comment.jsx";

export default function CommentList({ todosLosComentarios, handleNavigateToUser }) {
  const flatListRef = useRef(null);

  useEffect(() => {
    if (flatListRef.current && todosLosComentarios.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [todosLosComentarios]);

  return (
    <FlatList
      ref={flatListRef}
      data={todosLosComentarios}
      keyExtractor={(item, index) => item.id?.toString() || index.toString()}
      renderItem={({ item }) => (
        <Comment comment={item} handleNavigateToUser={handleNavigateToUser} />
      )}
      contentContainerStyle={{
        paddingBottom: 8,
      }}
      showsVerticalScrollIndicator={false}
    />
  );
}
