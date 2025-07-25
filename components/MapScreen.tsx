import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

interface MapScreenProps {
  onNavigate: (screen: string) => void;
}

const admirals = [
  {
    id: 1,
    name: 'Admiral Rookie',
    avatar: '👨‍✈️',
    difficulty: 1,
    specialRule: 'Standard naval engagement',
    winReward: 25,
    fleet: 'Patrol Fleet',
    unlocked: true,
    sector: 'Alpha Sector',
  },
  {
    id: 2,
    name: 'Captain Storm',
    avatar: '🧑‍✈️',
    difficulty: 2,
    specialRule: 'Ties favor the enemy',
    winReward: 40,
    fleet: 'Strike Force',
    unlocked: false,
    sector: 'Beta Sector',
  },
  {
    id: 3,
    name: 'Fleet Admiral',
    avatar: '👩‍✈️',
    difficulty: 3,
    specialRule: 'Capital ships only',
    winReward: 60,
    fleet: 'Battle Group',
    unlocked: false,
    sector: 'Gamma Sector',
  },
];

export function MapScreen({ onNavigate }: MapScreenProps) {
  return (
    <LinearGradient
      colors={['#020617', '#0F172A', '#1E293B']}
      style={styles.container}
    >
      <View style={styles.crtBorder}>
        {/* Header */}
        <Animated.View 
          style={styles.header}
          entering={FadeInUp.duration(600)}
        >
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => onNavigate('menu')}
          >
            <Text style={styles.backButtonText}>◄ COMMAND</Text>
          </TouchableOpacity>
          
          <Text style={styles.title}>TACTICAL MAP</Text>
          
          <View style={styles.placeholder} />
        </Animated.View>

        {/* Map Content */}
        <ScrollView style={styles.mapContainer} showsVerticalScrollIndicator={false}>
          <Animated.View 
            style={styles.mapHeader}
            entering={FadeInDown.duration(600).delay(100)}
          >
            <Text style={styles.mapTitle}>NAVAL OPERATIONS</Text>
            <Text style={styles.mapSubtitle}>Select your target</Text>
          </Animated.View>

          {/* Admiral Nodes */}
          <View style={styles.admiralsContainer}>
            {admirals.map((admiral, index) => (
              <Animated.View
                key={admiral.id}
                entering={FadeInDown.duration(600).delay(200 + index * 100)}
              >
                <AdmiralNode 
                  admiral={admiral} 
                  onSelect={() => admiral.unlocked && onNavigate('battle')}
                />
              </Animated.View>
            ))}
          </View>

          {/* Map Legend */}
          <Animated.View 
            style={styles.legend}
            entering={FadeInDown.duration(600).delay(500)}
          >
            <Text style={styles.legendTitle}>LEGEND:</Text>
            <View style={styles.legendItem}>
              <Text style={styles.legendIcon}>★</Text>
              <Text style={styles.legendText}>Threat Level</Text>
            </View>
            <View style={styles.legendItem}>
              <Text style={styles.legendIcon}>⚓</Text>
              <Text style={styles.legendText}>Credits Reward</Text>
            </View>
            <View style={styles.legendItem}>
              <Text style={styles.legendIcon}>🔒</Text>
              <Text style={styles.legendText}>Locked Sector</Text>
            </View>
          </Animated.View>
        </ScrollView>
      </View>
    </LinearGradient>
  );
}

function AdmiralNode({ 
  admiral, 
  onSelect 
}: { 
  admiral: typeof admirals[0]; 
  onSelect: () => void; 
}) {
  const getDifficultyStars = () => {
    return '★'.repeat(admiral.difficulty) + '☆'.repeat(3 - admiral.difficulty);
  };

  const getDifficultyColor = () => {
    switch (admiral.difficulty) {
      case 1: return '#22C55E';
      case 2: return '#FBBF24';
      case 3: return '#EF4444';
      default: return '#64748B';
    }
  };

  return (
    <TouchableOpacity 
      onPress={onSelect}
      disabled={!admiral.unlocked}
      style={[styles.admiralNode, !admiral.unlocked && styles.lockedNode]}
    >
      <LinearGradient
        colors={admiral.unlocked 
          ? ['rgba(30, 58, 138, 0.3)', 'rgba(59, 130, 246, 0.1)']
          : ['rgba(71, 85, 105, 0.2)', 'rgba(51, 65, 85, 0.1)']
        }
        style={styles.nodeGradient}
      >
        {/* Sector Header */}
        <View style={styles.sectorHeader}>
          <Text style={[styles.sectorName, !admiral.unlocked && styles.lockedText]}>
            {admiral.sector}
          </Text>
          {!admiral.unlocked && (
            <Text style={styles.lockIcon}>🔒</Text>
          )}
        </View>

        {/* Admiral Info */}
        <View style={styles.admiralInfo}>
          <Text style={[styles.admiralAvatar, !admiral.unlocked && styles.lockedText]}>
            {admiral.unlocked ? admiral.avatar : '❓'}
          </Text>
          
          <View style={styles.admiralDetails}>
            <Text style={[styles.admiralName, !admiral.unlocked && styles.lockedText]}>
              {admiral.unlocked ? admiral.name : 'CLASSIFIED'}
            </Text>
            
            <View style={styles.statsRow}>
              <Text style={[styles.difficultyStars, { color: getDifficultyColor() }]}>
                {admiral.unlocked ? getDifficultyStars() : '???'}
              </Text>
            </View>
            
            <Text style={[styles.fleetName, !admiral.unlocked && styles.lockedText]}>
              {admiral.unlocked ? admiral.fleet : 'Unknown Fleet'}
            </Text>
          </View>
        </View>

        {/* Reward */}
        <View style={styles.rewardSection}>
          <Text style={styles.rewardLabel}>BOUNTY:</Text>
          <Text style={[styles.rewardValue, !admiral.unlocked && styles.lockedText]}>
            {admiral.unlocked ? `${admiral.winReward} CREDITS` : '??? CREDITS'}
          </Text>
        </View>

        {/* Special Rule */}
        <Text style={[styles.specialRule, !admiral.unlocked && styles.lockedText]}>
          {admiral.unlocked ? admiral.specialRule : 'Special tactics unknown'}
        </Text>

        {/* Action Indicator */}
        {admiral.unlocked && (
          <View style={styles.actionIndicator}>
            <Text style={styles.actionText}>► ENGAGE</Text>
          </View>
        )}
      </LinearGradient>
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
    borderWidth: 1,
    borderColor: '#475569',
  },
  backButtonText: {
    color: '#FBBF24',
    fontSize: 14,
    fontFamily: 'Courier New',
    fontWeight: '600',
  },
  title: {
    color: '#E2E8F0',
    fontSize: 18,
    fontFamily: 'Courier New',
    fontWeight: '700',
    letterSpacing: 2,
  },
  placeholder: {
    width: 60,
  },
  mapContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  mapHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  mapTitle: {
    color: '#FBBF24',
    fontSize: 20,
    fontFamily: 'Courier New',
    fontWeight: '900',
    letterSpacing: 2,
  },
  mapSubtitle: {
    color: '#94A3B8',
    fontSize: 12,
    fontFamily: 'Courier New',
    marginTop: 4,
  },
  admiralsContainer: {
    gap: 20,
    marginBottom: 30,
  },
  admiralNode: {
    borderWidth: 2,
    borderColor: '#475569',
    overflow: 'hidden',
  },
  lockedNode: {
    opacity: 0.6,
  },
  nodeGradient: {
    padding: 16,
  },
  sectorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectorName: {
    color: '#FBBF24',
    fontSize: 14,
    fontFamily: 'Courier New',
    fontWeight: '700',
  },
  lockIcon: {
    fontSize: 16,
  },
  admiralInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  admiralAvatar: {
    fontSize: 32,
    marginRight: 16,
  },
  admiralDetails: {
    flex: 1,
  },
  admiralName: {
    color: '#E2E8F0',
    fontSize: 16,
    fontFamily: 'Courier New',
    fontWeight: '700',
    marginBottom: 4,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  difficultyStars: {
    fontSize: 14,
    fontFamily: 'Courier New',
  },
  fleetName: {
    color: '#94A3B8',
    fontSize: 12,
    fontFamily: 'Courier New',
  },
  rewardSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  rewardLabel: {
    color: '#64748B',
    fontSize: 10,
    fontFamily: 'Courier New',
  },
  rewardValue: {
    color: '#FBBF24',
    fontSize: 12,
    fontFamily: 'Courier New',
    fontWeight: '700',
  },
  specialRule: {
    color: '#94A3B8',
    fontSize: 10,
    fontFamily: 'Courier New',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  actionIndicator: {
    alignItems: 'center',
  },
  actionText: {
    color: '#22C55E',
    fontSize: 12,
    fontFamily: 'Courier New',
    fontWeight: '700',
  },
  lockedText: {
    color: '#64748B',
  },
  legend: {
    borderWidth: 1,
    borderColor: '#475569',
    backgroundColor: 'rgba(71, 85, 105, 0.1)',
    padding: 16,
    marginBottom: 20,
  },
  legendTitle: {
    color: '#FBBF24',
    fontSize: 12,
    fontFamily: 'Courier New',
    fontWeight: '700',
    marginBottom: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  legendIcon: {
    fontSize: 12,
    marginRight: 8,
    width: 16,
  },
  legendText: {
    color: '#94A3B8',
    fontSize: 10,
    fontFamily: 'Courier New',
  },
});