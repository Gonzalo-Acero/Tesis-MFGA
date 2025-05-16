import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from './styles';
import { SearchOptionItemProps } from './types/SearchOptionItemProps';  //  Importa la interfaz


const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Header />
      <SearchTabs />
      <SearchOptionsList />
    </View>
  );
};

const Header = () => {
  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.menuIcon}>
        <Icon name="bars" size={30} color="#FFFFFF" /> 
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Buscar Lugar</Text>
      <TouchableOpacity style={styles.userIcon}>
        {/* Icono de usuario */}
        <Text>👤</Text>
      </TouchableOpacity>
    </View>
  );
};

const SearchTabs = () => {
  return (
    <View style={styles.searchTabs}>
      <TouchableOpacity style={styles.activeTab}>
        <Text style={styles.activeTabText}>Búsqueda Avanzada</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.tab}>
        <Text style={styles.tabText}>Búsqueda Rápida</Text>
      </TouchableOpacity>
    </View>
  );
};

const SearchOptionsList = () => {
  return (
    <View style={styles.searchOptionsList}>
      <SearchOptionItem title="Agregar Actividad" />
      <SearchOptionItem title="Agregar Paisaje" />
      <SearchOptionItem title="Agregar Provincia" />
      <SearchOptionItem title="Agregar Municipio" />
    </View>
  );
};


const SearchOptionItem: React.FC<SearchOptionItemProps> = ({ title }) => {
  return (
    <TouchableOpacity style={styles.searchOptionItem}>
      <View style={styles.optionImagePlaceholder} />
      <Text style={styles.optionText}>{title}</Text>
      <Text style={styles.arrow}></Text>
    </TouchableOpacity>
  );
};

/* const SearchOptionItem = ({ title }) => {
  return (
    <TouchableOpacity style={styles.searchOptionItem}>
      <View style={styles.optionImagePlaceholder} /> {/* Placeholder para la imagen } 
      <Text style={styles.optionText}>{title}</Text>
      <Text style={styles.arrow}></Text>  {/* Flecha }
    </TouchableOpacity>
  );
}; */


/* const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', //  Fondo oscuro (ejemplo)
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF', //  Color del texto
  },
  searchTabs: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  activeTab: {
    backgroundColor: '#292929', //  Tab activo
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  activeTabText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  tab: {
    backgroundColor: 'transparent',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  tabText: {
    color: '#888888',
  },
  searchOptionsList: {
    // Estilos para la lista de opciones
  },
  searchOptionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  optionImagePlaceholder: {
    width: 40,
    height: 40,
    backgroundColor: '#555555',
    marginRight: 12,
  },
  optionText: {
    color: '#FFFFFF',
    flex: 1,
  },
  arrow: {
    color: '#888888',
    fontSize: 18,
  },
}); */

export default HomeScreen;