import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', //  Fondo oscuro
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
  menuIcon: {
    // Estilos para el icono de menú (ajusta según necesites)
    padding: 8,
  },
  userIcon: {
    // Estilos para el icono de usuario (ajusta según necesites)
    padding: 8,
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
    // Estilos para la lista de opciones (si los necesitas)
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
});

export default styles;