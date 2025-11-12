import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function useProfileImage() {
    const [userImage, setUserImage] = useState(null);

    useEffect(() => {
        const fetchImage = async () => {
            try {
                const image = await AsyncStorage.getItem('userImage');
                setUserImage(image);
            } catch (error) {
                console.error("Error al leer userImage de AsyncStorage:", error);
                setUserImage(null);
            }
        };
        fetchImage();
        
    }, []);

    return userImage;
}