import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EditarActividadScreen = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [provincia, setProvincia] = useState('');

  useEffect(() => {
    cargarActividad();
  }, []);

  const cargarActividad = async () => {
    try {
      const data = await AsyncStorage.getItem('actividades');
      const actividades = data ? JSON.parse(data) : [];
      const actividad = actividades.find((a: any) => a.id === id);

      if (actividad) {
        setNombre(actividad.nombre);
        setDescripcion(actividad.descripcion);
        setProvincia(actividad.provincia);
      }
    } catch (error) {
      console.error('Error al cargar la actividad:', error);
    }
  };

  const guardarCambios = async () => {
    if (!nombre || !descripcion || !provincia) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }

    try {
      const data = await AsyncStorage.getItem('actividades');
      const actividades = data ? JSON.parse(data) : [];

      const nuevasActividades = actividades.map((a: any) =>
        a.id === id ? { ...a, nombre, descripcion, provincia } : a
      );

      await AsyncStorage.setItem('actividades', JSON.stringify(nuevasActividades));
      Alert.alert('Éxito', 'Cambios guardados');
      router.back();
    } catch (error) {
      console.error('Error al guardar:', error);
      Alert.alert('Error', 'No se pudo guardar');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Actividad</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre"
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

      <Button title="Guardar cambios" onPress={guardarCambios} />
    </View>
  );
};

export default EditarActividadScreen;

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
});
