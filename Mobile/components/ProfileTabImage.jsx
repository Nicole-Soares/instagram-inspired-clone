import { Image, StyleSheet } from 'react-native';

export default function ProfileTabImage({ focused, userImage }) {
    return (
        <Image
            source={{ uri: userImage }}
            style={[
                styles.profileTabImage,
                { borderColor: focused ? 'black' : '#9e9e9e' } 
            ]}
        />
    );
}

const styles = StyleSheet.create({
    profileTabImage: {
        width: 28,  
        height: 28,
        borderRadius: 14, 
        borderWidth: 1.5,
    }
});