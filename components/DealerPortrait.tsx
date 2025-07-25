import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface Admiral {
  name: string;
  avatar: string;
  difficulty: number;
  specialRule: string;
  winReward: number;
  fleet?: string;
}

interface DealerPortraitProps {
  dealer: Admiral;
}

export function DealerPortrait({ dealer }: DealerPortraitProps) {
  const getDifficultyStars = () => {
    return '★'.repeat(dealer.difficulty) + '☆'.repeat(3 - dealer.difficulty);
  };

  const getDifficultyColor = () => {
    switch (dealer.difficulty) {
      case 1: return '#22C55E';
      case 2: return '#FBBF24';
      case 3: return '#EF4444';
      default: return '#64748B';
    }
  };

  return (
    <Animated.View 
      style={styles.container}
      entering={FadeInDown.duration(600)}
    >
      <LinearGradient
        colors={['rgba(30, 58, 138, 0.2)', 'rgba(59, 130, 246, 0.1)']}
        style={styles.portraitFrame}
      >
        {/* Admiral Avatar */}
        <View style={styles.avatarContainer}>
          <Text style={styles.avatar}>{dealer.avatar}</Text>
          <View style={styles.rankBadge}>
            <Text style={styles.rankText}>ADM</Text>
          </View>
        </View>

        {/* Admiral Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{dealer.name}</Text>
          
          {/* Difficulty Rating */}
          <View style={styles.difficultyContainer}>
            <Text style={[styles.difficultyStars, { color: getDifficultyColor() }]}>
              {getDifficultyStars()}
            </Text>
            <Text style={styles.difficultyLabel}>THREAT LEVEL</Text>
          </View>

          {/* Fleet Info */}
          {dealer.fleet && (
            <View style={styles.fleetContainer}>
              <Text style={styles.fleetLabel}>COMMANDING:</Text>
              <Text style={styles.fleetName}>{dealer.fleet}</Text>
            </View>
          )}

          {/* Reward */}
          <View style={styles.rewardContainer}>
            <Text style={styles.rewardLabel}>BOUNTY:</Text>
            <Text style={styles.rewardValue}>{dealer.winReward} CREDITS</Text>
          </View>
        </View>

        {/* Decorative Elements */}
        <View style={styles.decorativeFrame}>
          <Text style={styles.cornerDecor}>▲</Text>
          <Text style={styles.cornerDecor}>▲</Text>
          <Text style={styles.cornerDecor}>▲</Text>
          <Text style={styles.cornerDecor}>▲</Text>
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  portraitFrame: {
    borderWidth: 2,
    borderColor: '#1E3A8A',
    padding: 16,
    alignItems: 'center',
    position: 'relative',
    minWidth: 200,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    fontSize: 48,
    textAlign: 'center',
  },
  rankBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: '#1E3A8A',
    borderWidth: 1,
    borderColor: '#FBBF24',
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  rankText: {
    color: '#FBBF24',
    fontSize: 8,
    fontFamily: 'Courier New',
    fontWeight: '600',
  },
  infoContainer: {
    alignItems: 'center',
    gap: 8,
  },
  name: {
    color: '#E2E8F0',
    fontSize: 16,
    fontFamily: 'Courier New',
    fontWeight: '700',
    letterSpacing: 1,
    textAlign: 'center',
  },
  difficultyContainer: {
    alignItems: 'center',
  },
  difficultyStars: {
    fontSize: 16,
    fontFamily: 'Courier New',
    letterSpacing: 2,
  },
  difficultyLabel: {
    color: '#64748B',
    fontSize: 8,
    fontFamily: 'Courier New',
    marginTop: 2,
  },
  fleetContainer: {
    alignItems: 'center',
  },
  fleetLabel: {
    color: '#64748B',
    fontSize: 8,
    fontFamily: 'Courier New',
  },
  fleetName: {
    color: '#94A3B8',
    fontSize: 10,
    fontFamily: 'Courier New',
    fontWeight: '600',
  },
  rewardContainer: {
    alignItems: 'center',
    marginTop: 4,
  },
  rewardLabel: {
    color: '#64748B',
    fontSize: 8,
    fontFamily: 'Courier New',
  },
  rewardValue: {
    color: '#FBBF24',
    fontSize: 12,
    fontFamily: 'Courier New',
    fontWeight: '700',
  },
  decorativeFrame: {
    position: 'absolute',
    top: 4,
    left: 4,
    right: 4,
    bottom: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    pointerEvents: 'none',
  },
  cornerDecor: {
    color: '#475569',
    fontSize: 6,
    fontFamily: 'Courier New',
    position: 'absolute',
  },
});