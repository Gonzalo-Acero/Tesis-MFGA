import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Image,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
//import MapView, { Marker, MapPressEvent } from 'react-native-maps';


const AgregarActividadScreen = () => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [provincia, setProvincia] = useState('');
  const [imagen, setImagen] = useState<string | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

  const seleccionarImagen = async () => {
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: true,
    });

    if (!resultado.canceled) {
      setImagen(resultado.assets[0].uri);
    }
  };

  const obtenerUbicacion = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'No se pudo obtener la ubicación');
      return;
    }

    const ubicacion = await Location.getCurrentPositionAsync({});
    setLocation({
      lat: ubicacion.coords.latitude,
      lng: ubicacion.coords.longitude,
    });

    Alert.alert('Ubicación obtenida ✅');
  };

  const handleGuardar = async () => {
    if (!nombre || !descripcion || !provincia) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }

    const nuevaActividad = {
      id: Date.now().toString(),
      nombre,
      descripcion,
      provincia,
      imagen,
      ubicacion: location, // ← guarda lat/lng
    };

    try {
      const data = await AsyncStorage.getItem('actividades');
      const actividades = data ? JSON.parse(data) : [];
      actividades.push(nuevaActividad);

      await AsyncStorage.setItem('actividades', JSON.stringify(actividades));

      Alert.alert('Éxito', 'Actividad guardada correctamente');

      setNombre('');
      setDescripcion('');
      setProvincia('');
      setImagen(null);
      setLocation(null);
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar la actividad');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agregar Actividad</Text>

      <TouchableOpacity style={styles.imageSelector} onPress={seleccionarImagen}>
        {imagen ? (
          <Image source={{ uri: imagen }} style={styles.image} />
        ) : (
          <Text style={styles.imagePlaceholder}>Seleccionar Imagen</Text>
        )}
      </TouchableOpacity>

      <Button title="Obtener ubicación actual" onPress={obtenerUbicacion} />

      {location && (
        <Text style={styles.detail}>
          Ubicación: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
        </Text>
      )}

      <TextInput
        style={styles.input}
        placeholder="Nombre del lugar"
        placeholderTextColor="#aaa"
        value={nombre}
        onChangeText={setNombre}
      />

      <TextInput
        style={styles.input}
        placeholder="Descripción"
        placeholderTextColor="#aaa"
        value={descripcion}
        onChangeText={setDescripcion}
      />

      <TextInput
        style={styles.input}
        placeholder="Provincia"
        placeholderTextColor="#aaa"
        value={provincia}
        onChangeText={setProvincia}
      />

      <Button title="Guardar" onPress={handleGuardar} />
    </View>
  );
};

export default AgregarActividadScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
  },
  title: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#1e1e1e',
    color: '#fff',
    padding: 10,
    marginBottom: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#333',
  },
  imageSelector: {
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 12,
  },
  imagePlaceholder: {
    color: '#aaa',
    padding: 40,
    backgroundColor: '#1e1e1e',
    borderRadius: 8,
    textAlign: 'center',
  },
  detail: {
    color: '#ccc',
    marginTop: 10,
    marginBottom: 10,
  },
});
