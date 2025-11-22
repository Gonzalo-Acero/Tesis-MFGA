import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useRouter } from "expo-router";
import styles from "./styles";
import { SearchOptionItemProps } from "./types/SearchOptionItemProps";

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
  const router = useRouter();

  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.menuIcon}>
        <Icon name="bars" size={30} color="#FFFFFF" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Buscar Lugar</Text>
      <TouchableOpacity
        style={styles.userIcon}
        onPress={() => router.push("./registro")}
      >
        <Icon name="user-plus" size={26} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
};

const SearchTabs = () => {
  return (
    <View style={styles.searchTabs}>
      <TouchableOpacity style={styles.activeTab}>
        <Text style={styles.activeTabText}>Busqueda Avanzada</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.tab}>
        <Text style={styles.tabText}>Busqueda Rapida</Text>
      </TouchableOpacity>
    </View>
  );
};

const SearchOptionsList: React.FC = () => {
  const router = useRouter();

  return (
    <View style={styles.searchOptionsList}>
      <SearchOptionItem
        title="Registrar Usuario"
        iconName="user-plus"
        onPress={() => router.push("./registro")}
      />
      <SearchOptionItem
        title="Agregar Actividad"
        iconName="plus"
        onPress={() => router.push("./agregar-actividad")}
      />
      <SearchOptionItem
        title="Agregar Paisaje"
        iconName="tree"
        onPress={() => router.push("./agregar-paisaje")}
      />
      <SearchOptionItem
        title="Agregar Provincia"
        iconName="map-marker"
        onPress={() => router.push("./agregar-provincia")}
      />
      <SearchOptionItem
        title="Agregar Municipio"
        iconName="building"
        onPress={() => router.push("./agregar-municipio")}
      />
      <SearchOptionItem
        title="Ver Actividades"
        iconName="list"
        onPress={() => router.push("./ver-actividades")}
      />
    </View>
  );
};

const SearchOptionItem: React.FC<SearchOptionItemProps> = ({
  title,
  iconName,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.searchOptionItem} onPress={onPress}>
      <View style={styles.optionImagePlaceholder}>
        <Icon name={iconName} size={20} color="#fff" />
      </View>
      <Text style={styles.optionText}>{title}</Text>
      <Text style={styles.arrow}>{">"}</Text>
    </TouchableOpacity>
  );
};

export default HomeScreen;
