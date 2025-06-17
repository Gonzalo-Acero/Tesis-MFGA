import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'react-native';
import MapView, { Marker } from 'react-native-maps';


interface Actividad {
  id: string;
  nombre: string;
  descripcion: string;
  provincia: string;
  imagen?: string; // ← esta es la que faltaba
    ubicacion?: {
        lat: number;
        lng: number;
    };
}



const VerActividadesScreen = () => {
  const [actividades, setActividades] = useState<Actividad[]>([]);
    const router = useRouter(); // ✅ esto es lo que faltaba

  useEffect(() => {
    cargarActividades();
  }, []);

  const cargarActividades = async () => {
    try {
      const data = await AsyncStorage.getItem('actividades');
      const parsed = data ? JSON.parse(data) : [];
      setActividades(parsed);
    } catch (error) {
      console.error('Error al cargar actividades:', error);
    }
  };

  const eliminarActividad = async (id: string) => {
    Alert.alert(
      'Eliminar',
      '¿Estás seguro de que querés eliminar esta actividad?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            const nuevasActividades = actividades.filter(item => item.id !== id);
            await AsyncStorage.setItem('actividades', JSON.stringify(nuevasActividades));
            setActividades(nuevasActividades);
          },
        },
      ]
    );
  };

const renderItem = ({ item }: { item: Actividad }) => (
  <TouchableOpacity
    style={styles.item}
    onPress={() =>
      router.push({
        pathname: '/editar-actividad',
        params: { id: item.id },
      })
    }
    onLongPress={() => eliminarActividad(item.id)}
  >
    {item.imagen && (
      <Image
        source={{ uri: item.imagen }}
        style={{ width: '100%', height: 200, borderRadius: 8, marginBottom: 8 }}
      />
    )}

    {item.ubicacion && (
  <Text style={styles.detail}>
    Ubicación: {item.ubicacion.lat.toFixed(4)}, {item.ubicacion.lng.toFixed(4)}
  </Text>
)}

{item.ubicacion && (
  <MapView
    style={{ width: '100%', height: 200, borderRadius: 8, marginBottom: 8 }}
    initialRegion={{
      latitude: item.ubicacion.lat,
      longitude: item.ubicacion.lng,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    }}
    scrollEnabled={false}
    zoomEnabled={false}
  >
    <Marker
      coordinate={{
        latitude: item.ubicacion.lat,
        longitude: item.ubicacion.lng,
      }}
      title={item.nombre}
    />
  </MapView>
)}



    <Text style={styles.title}>{item.nombre}</Text>
    <Text style={styles.detail}>Provincia: {item.provincia}</Text>
    <Text style={styles.detail}>Descripción: {item.descripcion}</Text>
  </TouchableOpacity>
);



  return (
    <View style={styles.container}>
      <Text style={styles.header}>Actividades Guardadas</Text>
      {actividades.length === 0 ? (
        <Text style={styles.empty}>No hay actividades registradas.</Text>
      ) : (
        <FlatList
          data={actividades}
          keyExtractor={item => item.id}
          renderItem={renderItem}
        />
      )}
    </View>
  );
};

export default VerActividadesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 16,
  },
  header: {
    color: '#fff',
    fontSize: 22,
    marginBottom: 12,
  },
  empty: {
    color: '#888',
    fontStyle: 'italic',
  },
  item: {
    backgroundColor: '#1e1e1e',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  detail: {
    color: '#ccc',
    fontSize: 14,
    marginTop: 4,
  },
});
