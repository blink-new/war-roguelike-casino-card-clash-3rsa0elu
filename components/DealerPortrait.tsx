import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface Dealer {
  name: string;
  avatar: string;
  difficulty: number;
  specialRule: string;
  winReward: number;
}

interface DealerPortraitProps {
  dealer: Dealer;
}

export function DealerPortrait({ dealer }: DealerPortraitProps) {
  const getDifficultyColor = (difficulty: number) => {
    switch (difficulty) {
      case 1: return '#00FF00';
      case 2: return '#FFD700';
      case 3: return '#FF4444';
      default: return '#FFFFFF';
    }
  };

  const getDifficultyStars = (difficulty: number) => {
    return '★'.repeat(difficulty) + '☆'.repeat(3 - difficulty);
  };

  return (
    <Animated.View 
      style={styles.container}
      entering={FadeInDown.duration(600)}
    >
      <LinearGradient
        colors={['rgba(255, 215, 0, 0.1)', 'rgba(139, 0, 0, 0.1)']}
        style={styles.portraitContainer}
      >
        <View style={styles.avatarContainer}>
          <Text style={styles.avatar}>{dealer.avatar}</Text>
        </View>
        
        <View style={styles.infoContainer}>
          <Text style={styles.dealerName}>{dealer.name}</Text>
          
          <View style={styles.difficultyContainer}>
            <Text style={[styles.difficultyStars, { color: getDifficultyColor(dealer.difficulty) }]}>
              {getDifficultyStars(dealer.difficulty)}
            </Text>
          </View>
          
          <View style={styles.rewardContainer}>
            <Text style={styles.rewardLabel}>WIN REWARD:</Text>
            <View style={styles.chipReward}>
              <Text style={styles.chipIcon}>🪙</Text>
              <Text style={styles.rewardAmount}>{dealer.winReward}</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  portraitContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    minWidth: 280,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFD700',
    marginRight: 16,
  },
  avatar: {
    fontSize: 32,
  },
  infoContainer: {
    flex: 1,
  },
  dealerName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  difficultyContainer: {
    marginBottom: 8,
  },
  difficultyStars: {
    fontSize: 16,
    fontWeight: '600',
  },
  rewardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rewardLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#888888',
  },
  chipReward: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  chipIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  rewardAmount: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFD700',
  },
});