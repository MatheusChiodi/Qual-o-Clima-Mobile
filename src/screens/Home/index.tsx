import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import Sun from '../../assets/01d.svg';
import Sun02d from '../../assets/02d.svg';
import Header from '../../components/Header';
import Info from '../../components/Info';

export function Home() {
  // Função para definir as cores do gradiente com base no horário do dia
  function getGradientColors() {
    const date = new Date();
    const hours = date.getHours();
    if (hours >= 6 && hours < 18) {
      return ['#292A4E', '#6272a4', '#ffb86c'];
    } else {
      return ['#04060E', '#293250', '#1F4068'];
    }
  }

  return (
    <LinearGradient colors={getGradientColors()} style={styles.container}>
      <View style={styles.content}>
        <Header />
        <Info />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: { paddingHorizontal: 40 },
});
