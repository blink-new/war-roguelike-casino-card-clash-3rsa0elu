import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  interpolate,
  useEffect
} from 'react-native-reanimated';

interface Ship {
  type: 'destroyer' | 'cruiser' | 'battleship' | 'carrier';
  value: number;
  display: string;
  symbol: string;
}

interface PlayingCardProps {
  ship: Ship;
  faceDown?: boolean;
}

export function PlayingCard({ ship, faceDown = false }: PlayingCardProps) {
  const flipValue = useSharedValue(faceDown ? 0 : 1);

  useEffect(() => {
    flipValue.value = withSpring(faceDown ? 0 : 1, {
      damping: 15,
      stiffness: 150,
    });
  }, [faceDown]);

  const frontAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(flipValue.value, [0, 1], [90, 0]);
    return {
      transform: [{ rotateY: `${rotateY}deg` }],
      opacity: flipValue.value,
    };
  });

  const backAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(flipValue.value, [0, 1], [0, 90]);
    return {
      transform: [{ rotateY: `${rotateY}deg` }],
      opacity: 1 - flipValue.value,
    };
  });

  const getShipColor = () => {
    switch (ship.type) {
      case 'destroyer': return '#64748B';
      case 'cruiser': return '#3B82F6';
      case 'battleship': return '#8B5CF6';
      case 'carrier': return '#F59E0B';
      default: return '#64748B';
    }
  };

  const getShipRank = () => {
    switch (ship.type) {
      case 'destroyer': return 'DESTROYER';
      case 'cruiser': return 'CRUISER';
      case 'battleship': return 'BATTLESHIP';
      case 'carrier': return 'CARRIER';
      default: return 'VESSEL';
    }
  };

  return (
    <View style={styles.cardContainer}>
      {/* Card Back */}
      <Animated.View style={[styles.card, styles.cardBack, backAnimatedStyle]}>
        <LinearGradient
          colors={['#1E3A8A', '#3B82F6', '#1E3A8A']}
          style={styles.cardBackGradient}
        >
          <View style={styles.radarGrid}>
            <Text style={styles.radarText}>⚓ ⚓ ⚓</Text>
            <Text style={styles.radarText}>⚓ ⚓ ⚓</Text>
            <Text style={styles.radarText}>⚓ ⚓ ⚓</Text>
          </View>
          <Text style={styles.backLabel}>CLASSIFIED</Text>
        </LinearGradient>
      </Animated.View>

      {/* Card Front */}
      <Animated.View style={[styles.card, styles.cardFront, frontAnimatedStyle]}>
        <LinearGradient
          colors={['#0F172A', '#1E293B']}
          style={styles.cardFrontGradient}
        >
          {/* Ship Type Header */}
          <View style={styles.shipHeader}>
            <Text style={[styles.shipType, { color: getShipColor() }]}>
              {getShipRank()}
            </Text>
          </View>

          {/* Ship Value Display */}
          <View style={styles.valueContainer}>
            <Text style={[styles.shipValue, { color: getShipColor() }]}>
              {ship.display}
            </Text>
          </View>

          {/* Ship Symbol */}
          <View style={styles.symbolContainer}>
            <Text style={styles.shipSymbol}>{ship.symbol}</Text>
          </View>

          {/* Power Level Bars */}
          <View style={styles.powerBars}>
            {Array.from({ length: Math.min(ship.value, 14) }, (_, i) => (
              <View 
                key={i} 
                style={[
                  styles.powerBar,
                  { backgroundColor: getShipColor() }
                ]} 
              />
            ))}
          </View>

          {/* Corner Decorations */}
          <View style={styles.cornerTL}>
            <Text style={styles.cornerText}>▲</Text>
          </View>
          <View style={styles.cornerBR}>
            <Text style={styles.cornerText}>▼</Text>
          </View>
        </LinearGradient>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: 90,
    height: 120,
    position: 'relative',
  },
  card: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderWidth: 2,
    borderColor: '#475569',
    backgroundColor: '#1E293B',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
    backfaceVisibility: 'hidden',
  },
  cardBack: {
    zIndex: 1,
  },
  cardFront: {
    zIndex: 2,
  },
  cardBackGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  radarGrid: {
    alignItems: 'center',
    marginBottom: 8,
  },
  radarText: {
    color: '#FBBF24',
    fontSize: 12,
    fontFamily: 'Courier New',
    letterSpacing: 2,
    opacity: 0.8,
  },
  backLabel: {
    color: '#94A3B8',
    fontSize: 10,
    fontFamily: 'Courier New',
    fontWeight: '600',
    letterSpacing: 1,
  },
  cardFrontGradient: {
    flex: 1,
    position: 'relative',
    padding: 8,
  },
  shipHeader: {
    alignItems: 'center',
    marginBottom: 8,
  },
  shipType: {
    fontSize: 8,
    fontFamily: 'Courier New',
    fontWeight: '600',
    letterSpacing: 1,
  },
  valueContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  shipValue: {
    fontSize: 24,
    fontFamily: 'Courier New',
    fontWeight: '900',
  },
  symbolContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  shipSymbol: {
    fontSize: 20,
  },
  powerBars: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 2,
  },
  powerBar: {
    width: 4,
    height: 4,
    backgroundColor: '#64748B',
  },
  cornerTL: {
    position: 'absolute',
    top: 4,
    left: 4,
  },
  cornerBR: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    transform: [{ rotate: '180deg' }],
  },
  cornerText: {
    color: '#475569',
    fontSize: 8,
    fontFamily: 'Courier New',
  },
});