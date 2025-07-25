import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
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
      colors={['#020617', '#0F172A', '#1E293B']}
      style={styles.container}
    >
      {/* CRT Screen Effect Border */}
      <View style={styles.crtBorder}>
        <Animated.View 
          style={styles.header}
          entering={FadeInUp.duration(800)}
        >
          <Text style={styles.title}>WARLATRO</Text>
          <Text style={styles.subtitle}>NAVAL CARD WARFARE</Text>
          <View style={styles.chipContainer}>
            <Text style={styles.chipIcon}>⚓</Text>
            <Text style={styles.chipText}>{chips}</Text>
            <Text style={styles.chipLabel}>CREDITS</Text>
          </View>
        </Animated.View>

        <Animated.View 
          style={styles.menuContainer}
          entering={FadeInDown.duration(800).delay(200)}
        >
          <MenuButton 
            title="► START MISSION" 
            subtitle="Deploy your fleet"
            onPress={() => onNavigate('map')}
            primary
          />
          <MenuButton 
            title="► ARMORY" 
            subtitle="Upgrade your ships"
            onPress={() => onNavigate('shop')}
          />
          <MenuButton 
            title="► FLEET STATUS" 
            subtitle="View your vessels"
            onPress={() => onNavigate('collection')}
          />
        </Animated.View>

        <Animated.View 
          style={styles.footer}
          entering={FadeInDown.duration(800).delay(400)}
        >
          <Text style={styles.footerText}>PRESS ANY BUTTON TO CONTINUE</Text>
          <View style={styles.scanlines} />
        </Animated.View>
      </View>
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
      <View style={[styles.menuButton, primary && styles.primaryButton]}>
        <Text style={[styles.buttonTitle, primary && styles.primaryButtonTitle]}>{title}</Text>
        <Text style={[styles.buttonSubtitle, primary && styles.primaryButtonSubtitle]}>{subtitle}</Text>
        {primary && <View style={styles.buttonGlow} />}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  crtBorder: {
    flex: 1,
    margin: 8,
    borderWidth: 4,
    borderColor: '#1E3A8A',
    borderRadius: 12,
    backgroundColor: 'rgba(30, 58, 138, 0.1)',
    position: 'relative',
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  title: {
    fontSize: 42,
    fontFamily: 'Courier New',
    fontWeight: '900',
    color: '#FBBF24',
    textAlign: 'center',
    letterSpacing: 4,
    textShadowColor: '#1E3A8A',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 0,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Courier New',
    fontWeight: '600',
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 8,
    letterSpacing: 2,
  },
  chipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 2,
    borderColor: '#FBBF24',
    borderStyle: 'solid',
  },
  chipIcon: {
    fontSize: 18,
    marginRight: 8,
    color: '#FBBF24',
  },
  chipText: {
    fontSize: 18,
    fontFamily: 'Courier New',
    fontWeight: '700',
    color: '#FBBF24',
    marginRight: 8,
  },
  chipLabel: {
    fontSize: 12,
    fontFamily: 'Courier New',
    color: '#94A3B8',
  },
  menuContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 16,
  },
  menuButton: {
    borderWidth: 2,
    borderColor: '#475569',
    backgroundColor: 'rgba(71, 85, 105, 0.2)',
    padding: 20,
    position: 'relative',
  },
  primaryButton: {
    borderColor: '#FBBF24',
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
  },
  buttonGlow: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderWidth: 1,
    borderColor: '#FBBF24',
    opacity: 0.5,
  },
  buttonTitle: {
    fontSize: 16,
    fontFamily: 'Courier New',
    fontWeight: '700',
    color: '#E2E8F0',
    letterSpacing: 1,
  },
  primaryButtonTitle: {
    color: '#FBBF24',
  },
  buttonSubtitle: {
    fontSize: 12,
    fontFamily: 'Courier New',
    color: '#94A3B8',
    marginTop: 4,
  },
  primaryButtonSubtitle: {
    color: '#E2E8F0',
  },
  footer: {
    paddingBottom: 40,
    alignItems: 'center',
    position: 'relative',
  },
  footerText: {
    fontSize: 12,
    fontFamily: 'Courier New',
    color: '#64748B',
    letterSpacing: 1,
  },
  scanlines: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    opacity: 0.1,
  },
});