import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
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
    color: '#FFFFFF',
  },
  searchTabs: {
    flexDirection: 'row',
    justifyContent: 'center', // 🔁 Centra horizontalmente los botones
    alignItems: 'center',
    marginBottom: 24,
    gap: 12, // Opcional para espacio entre botones si usás RN 0.71+
  },
  activeTab: {
    backgroundColor: '#292929',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 6, // Alternativa si no tenés gap
  },
  activeTabText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  tab: {
    backgroundColor: 'transparent',
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 6,
  },
  tabText: {
    color: '#888888',
  },
  searchOptionsList: {
    alignItems: 'center', // 🔁 Centra todos los items hijos horizontalmente
  },
  searchOptionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
    width: '100%', // Asegura que se alinee al centro pero mantenga proporción
    maxWidth: 320, // Opcional: límite para mejor presentación
  },
  optionImagePlaceholder: {
    width: 40,
    height: 40,
    backgroundColor: '#555555',
    marginRight: 12,
    borderRadius: 6,
  },
  optionText: {
    color: '#FFFFFF',
    flex: 1,
    fontSize: 16,
  },
  arrow: {
    color: '#888888',
    fontSize: 18,
  },
  menuIcon: {
    padding: 8,
  },
  
  userIcon: {
    padding: 8,
  },
  
});

export default styles;
