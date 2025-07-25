import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

interface MapScreenProps {
  onNavigate: (screen: string) => void;
}

const dealers = [
  {
    id: 1,
    name: 'Rookie Rick',
    avatar: '🤠',
    difficulty: 1,
    specialRule: 'Standard War rules',
    winReward: 25,
    unlocked: true,
  },
  {
    id: 2,
    name: 'Lady Luck',
    avatar: '💃',
    difficulty: 2,
    specialRule: 'Ties go to dealer',
    winReward: 40,
    unlocked: false,
  },
  {
    id: 3,
    name: 'High Roller',
    avatar: '🎩',
    difficulty: 3,
    specialRule: 'Only face cards',
    winReward: 60,
    unlocked: false,
  },
  {
    id: 4,
    name: 'The Shark',
    avatar: '🦈',
    difficulty: 4,
    specialRule: 'Double or nothing',
    winReward: 100,
    unlocked: false,
  },
  {
    id: 5,
    name: 'Casino Boss',
    avatar: '👑',
    difficulty: 5,
    specialRule: 'All aces wild',
    winReward: 200,
    unlocked: false,
  },
];

const events = [
  {
    id: 'shop1',
    type: 'shop',
    name: 'Card Shop',
    icon: '🛒',
    description: 'Buy new cards',
  },
  {
    id: 'event1',
    type: 'event',
    name: 'Lucky Draw',
    icon: '🎰',
    description: 'Risk chips for rewards',
  },
  {
    id: 'shop2',
    type: 'shop',
    name: 'Joker Shop',
    icon: '🃏',
    description: 'Buy modifiers',
  },
];

export function MapScreen({ onNavigate }: MapScreenProps) {
  return (
    <LinearGradient
      colors={['#000000', '#0F0F0F', '#1A0000']}
      style={styles.container}
    >
      {/* Header */}
      <Animated.View 
        style={styles.header}
        entering={FadeInUp.duration(600)}
      >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => onNavigate('menu')}
        >
          <Text style={styles.backButtonText}>← MENU</Text>
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>CASINO MAP</Text>
        
        <TouchableOpacity 
          style={styles.shopButton}
          onPress={() => onNavigate('shop')}
        >
          <Text style={styles.shopButtonText}>SHOP</Text>
        </TouchableOpacity>
      </Animated.View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Progress Path */}
        <Animated.View 
          style={styles.pathContainer}
          entering={FadeInDown.duration(600).delay(100)}
        >
          <Text style={styles.sectionTitle}>DEALER PROGRESSION</Text>
          
          {dealers.map((dealer, index) => (
            <View key={dealer.id} style={styles.nodeContainer}>
              {/* Connection Line */}
              {index > 0 && <View style={styles.connectionLine} />}
              
              {/* Dealer Node */}
              <TouchableOpacity
                style={[
                  styles.dealerNode,
                  dealer.unlocked && styles.unlockedNode,
                  !dealer.unlocked && styles.lockedNode,
                ]}
                onPress={() => dealer.unlocked && onNavigate('battle')}
                disabled={!dealer.unlocked}
              >
                <LinearGradient
                  colors={dealer.unlocked 
                    ? ['#8B0000', '#B22222'] 
                    : ['#333333', '#555555']
                  }
                  style={styles.nodeGradient}
                >
                  <View style={styles.nodeContent}>
                    <Text style={styles.dealerAvatar}>{dealer.avatar}</Text>
                    <Text style={[
                      styles.dealerName,
                      !dealer.unlocked && styles.lockedText
                    ]}>
                      {dealer.name}
                    </Text>
                    <Text style={[
                      styles.dealerRule,
                      !dealer.unlocked && styles.lockedText
                    ]}>
                      {dealer.specialRule}
                    </Text>
                    
                    <View style={styles.rewardRow}>
                      <Text style={styles.difficultyStars}>
                        {'★'.repeat(dealer.difficulty)}{'☆'.repeat(5 - dealer.difficulty)}
                      </Text>
                      <View style={styles.rewardChip}>
                        <Text style={styles.chipIcon}>🪙</Text>
                        <Text style={styles.rewardText}>{dealer.winReward}</Text>
                      </View>
                    </View>
                    
                    {!dealer.unlocked && (
                      <View style={styles.lockOverlay}>
                        <Text style={styles.lockIcon}>🔒</Text>
                      </View>
                    )}
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          ))}
        </Animated.View>

        {/* Events Section */}
        <Animated.View 
          style={styles.eventsContainer}
          entering={FadeInDown.duration(600).delay(200)}
        >
          <Text style={styles.sectionTitle}>SPECIAL EVENTS</Text>
          
          <View style={styles.eventsGrid}>
            {events.map((event) => (
              <TouchableOpacity
                key={event.id}
                style={styles.eventCard}
                onPress={() => {
                  if (event.type === 'shop') {
                    onNavigate('shop');
                  }
                }}
              >
                <LinearGradient
                  colors={['rgba(255, 215, 0, 0.1)', 'rgba(139, 0, 0, 0.1)']}
                  style={styles.eventGradient}
                >
                  <Text style={styles.eventIcon}>{event.icon}</Text>
                  <Text style={styles.eventName}>{event.name}</Text>
                  <Text style={styles.eventDescription}>{event.description}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },
  backButtonText: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1,
  },
  shopButton: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  shopButtonText: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '600',
  },
  scrollContainer: {
    flex: 1,
  },
  pathContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  sectionTitle: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
    letterSpacing: 1,
  },
  nodeContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  connectionLine: {
    width: 2,
    height: 30,
    backgroundColor: '#FFD700',
    marginBottom: 10,
    opacity: 0.5,
  },
  dealerNode: {
    width: '90%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  unlockedNode: {
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  lockedNode: {
    opacity: 0.6,
  },
  nodeGradient: {
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    borderRadius: 16,
  },
  nodeContent: {
    alignItems: 'center',
    position: 'relative',
  },
  dealerAvatar: {
    fontSize: 40,
    marginBottom: 8,
  },
  dealerName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  dealerRule: {
    color: '#CCCCCC',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 12,
    fontStyle: 'italic',
  },
  lockedText: {
    color: '#666666',
  },
  rewardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  difficultyStars: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: '600',
  },
  rewardChip: {
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
  rewardText: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '700',
  },
  lockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 16,
  },
  lockIcon: {
    fontSize: 32,
  },
  eventsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  eventsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  eventCard: {
    width: '48%',
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  eventGradient: {
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.2)',
    borderRadius: 12,
  },
  eventIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  eventName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  eventDescription: {
    color: '#CCCCCC',
    fontSize: 12,
    textAlign: 'center',
  },
  bottomSpacing: {
    height: 40,
  },
});