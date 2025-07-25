import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useState } from 'react';
import { GameScreen } from '@/components/GameScreen';
import { MapScreen } from '@/components/MapScreen';
import { ShopScreen } from '@/components/ShopScreen';
import { CollectionScreen } from '@/components/CollectionScreen';

type Screen = 'menu' | 'map' | 'battle' | 'shop' | 'collection';

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('menu');
  const [chips, setChips] = useState(100);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'map':
        return <MapScreen onNavigate={setCurrentScreen} />;
      case 'battle':
        return <GameScreen onNavigate={setCurrentScreen} chips={chips} setChips={setChips} />;
      case 'shop':
        return <ShopScreen onNavigate={setCurrentScreen} chips={chips} setChips={setChips} />;
      case 'collection':
        return <CollectionScreen onNavigate={setCurrentScreen} />;
      default:
        return <MainMenu onNavigate={setCurrentScreen} chips={chips} />;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      {renderScreen()}
    </View>
  );
}

function MainMenu({ onNavigate, chips }: { onNavigate: (screen: Screen) => void; chips: number }) {
  return (
    <LinearGradient
      colors={['#000000', '#0F0F0F', '#1A0000']}
      style={styles.container}
    >
      <Animated.View 
        style={styles.header}
        entering={FadeInUp.duration(800)}
      >
        <Text style={styles.title}>WAR</Text>
        <Text style={styles.subtitle}>CASINO CARD CLASH</Text>
        <View style={styles.chipContainer}>
          <Text style={styles.chipIcon}>🪙</Text>
          <Text style={styles.chipText}>{chips}</Text>
        </View>
      </Animated.View>

      <Animated.View 
        style={styles.menuContainer}
        entering={FadeInDown.duration(800).delay(200)}
      >
        <MenuButton 
          title="START GAME" 
          subtitle="Face the dealers"
          onPress={() => onNavigate('map')}
          primary
        />
        <MenuButton 
          title="SHOP" 
          subtitle="Buy cards & upgrades"
          onPress={() => onNavigate('shop')}
        />
        <MenuButton 
          title="COLLECTION" 
          subtitle="View your deck"
          onPress={() => onNavigate('collection')}
        />
      </Animated.View>

      <Animated.View 
        style={styles.footer}
        entering={FadeInDown.duration(800).delay(400)}
      >
        <Text style={styles.footerText}>Tap to begin your casino journey</Text>
      </Animated.View>
    </LinearGradient>
  );
}

function MenuButton({ 
  title, 
  subtitle, 
  onPress, 
  primary = false 
}: { 
  title: string; 
  subtitle: string; 
  onPress: () => void; 
  primary?: boolean;
}) {
  return (
    <TouchableOpacity onPress={onPress}>
      <LinearGradient
        colors={primary ? ['#8B0000', '#B22222'] : ['#1A1A1A', '#2A2A2A']}
        style={[styles.menuButton, primary && styles.primaryButton]}
      >
        <Text style={[styles.buttonTitle, primary && styles.primaryButtonTitle]}>{title}</Text>
        <Text style={[styles.buttonSubtitle, primary && styles.primaryButtonSubtitle]}>{subtitle}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  title: {
    fontSize: 48,
    fontWeight: '900',
    color: '#FFD700',
    textAlign: 'center',
    letterSpacing: 4,
    textShadowColor: '#8B0000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 8,
    letterSpacing: 2,
    opacity: 0.9,
  },
  chipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  chipIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  chipText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFD700',
  },
  menuContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 16,
  },
  menuButton: {
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  primaryButton: {
    borderColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 1,
  },
  primaryButtonTitle: {
    color: '#FFD700',
  },
  buttonSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#CCCCCC',
    textAlign: 'center',
    marginTop: 4,
    opacity: 0.8,
  },
  primaryButtonSubtitle: {
    color: '#FFFFFF',
    opacity: 1,
  },
  footer: {
    paddingBottom: 40,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#888888',
    fontStyle: 'italic',
  },
});