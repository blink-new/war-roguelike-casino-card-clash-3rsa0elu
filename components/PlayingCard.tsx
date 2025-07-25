import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  interpolate,
  useEffect
} from 'react-native-reanimated';

interface Card {
  suit: '♠' | '♥' | '♦' | '♣';
  value: number;
  display: string;
}

interface PlayingCardProps {
  card: Card;
  faceDown?: boolean;
}

export function PlayingCard({ card, faceDown = false }: PlayingCardProps) {
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

  const isRed = card.suit === '♥' || card.suit === '♦';

  return (
    <View style={styles.cardContainer}>
      {/* Card Back */}
      <Animated.View style={[styles.card, styles.cardBack, backAnimatedStyle]}>
        <LinearGradient
          colors={['#8B0000', '#B22222', '#8B0000']}
          style={styles.cardBackGradient}
        >
          <Text style={styles.cardBackPattern}>♠♥♦♣</Text>
          <Text style={styles.cardBackPattern}>♣♦♥♠</Text>
          <Text style={styles.cardBackPattern}>♠♥♦♣</Text>
        </LinearGradient>
      </Animated.View>

      {/* Card Front */}
      <Animated.View style={[styles.card, styles.cardFront, frontAnimatedStyle]}>
        <LinearGradient
          colors={['#FFFFFF', '#F8F8F8']}
          style={styles.cardFrontGradient}
        >
          {/* Top Left */}
          <View style={styles.topLeft}>
            <Text style={[styles.cardValue, isRed && styles.redText]}>
              {card.display}
            </Text>
            <Text style={[styles.cardSuit, isRed && styles.redText]}>
              {card.suit}
            </Text>
          </View>

          {/* Center */}
          <View style={styles.center}>
            <Text style={[styles.centerSuit, isRed && styles.redText]}>
              {card.suit}
            </Text>
          </View>

          {/* Bottom Right (rotated) */}
          <View style={styles.bottomRight}>
            <Text style={[styles.cardValue, styles.rotated, isRed && styles.redText]}>
              {card.display}
            </Text>
            <Text style={[styles.cardSuit, styles.rotated, isRed && styles.redText]}>
              {card.suit}
            </Text>
          </View>
        </LinearGradient>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: 80,
    height: 112,
    position: 'relative',
  },
  card: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CCCCCC',
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
    borderRadius: 7,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 8,
  },
  cardBackPattern: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 2,
    opacity: 0.8,
  },
  cardFrontGradient: {
    flex: 1,
    borderRadius: 7,
    position: 'relative',
  },
  topLeft: {
    position: 'absolute',
    top: 6,
    left: 6,
    alignItems: 'center',
  },
  bottomRight: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    alignItems: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000000',
    lineHeight: 16,
  },
  cardSuit: {
    fontSize: 12,
    color: '#000000',
    lineHeight: 14,
  },
  centerSuit: {
    fontSize: 32,
    color: '#000000',
  },
  redText: {
    color: '#DC143C',
  },
  rotated: {
    transform: [{ rotate: '180deg' }],
  },
});