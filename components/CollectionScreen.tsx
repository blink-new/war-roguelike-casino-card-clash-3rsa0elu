import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useState } from 'react';

interface CollectionScreenProps {
  onNavigate: (screen: string) => void;
}

interface CollectionCard {
  id: string;
  name: string;
  type: 'standard' | 'special' | 'joker';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  icon: string;
  description: string;
  effect?: string;
  owned: boolean;
  count?: number;
}

const collectionCards: CollectionCard[] = [
  // Standard Cards
  { id: 'ace_spades', name: 'Ace of Spades', type: 'standard', rarity: 'common', icon: '🂡', description: 'The highest card in War', owned: true, count: 4 },
  { id: 'king_hearts', name: 'King of Hearts', type: 'standard', rarity: 'common', icon: '🂾', description: 'Royal power', owned: true, count: 4 },
  { id: 'queen_diamonds', name: 'Queen of Diamonds', type: 'standard', rarity: 'common', icon: '🃍', description: 'Elegant nobility', owned: true, count: 4 },
  { id: 'jack_clubs', name: 'Jack of Clubs', type: 'standard', rarity: 'common', icon: '🃛', description: 'The royal servant', owned: true, count: 4 },
  
  // Special Cards
  { id: 'golden_ace', name: 'Golden Ace', type: 'special', rarity: 'legendary', icon: '👑', description: 'Always wins, even against other Aces', effect: 'Unbeatable card', owned: false },
  { id: 'mirror_card', name: 'Mirror Card', type: 'special', rarity: 'epic', icon: '🪞', description: 'Copies opponent\'s card +1', effect: 'Copy + 1', owned: false },
  { id: 'wild_seven', name: 'Wild Seven', type: 'special', rarity: 'rare', icon: '🍀', description: 'Can become any value you choose', effect: 'Choose value', owned: false },
  
  // Jokers
  { id: 'double_draw', name: 'Double Draw', type: 'joker', rarity: 'rare', icon: '🎭', description: 'Draw 2 cards, play the higher one', effect: 'Draw 2, play higher', owned: false },
  { id: 'tie_breaker', name: 'Tie Breaker', type: 'joker', rarity: 'rare', icon: '⚖️', description: 'All ties go to you', effect: 'Win all ties', owned: false },
  { id: 'ace_supremacy', name: 'Ace Supremacy', type: 'joker', rarity: 'epic', icon: '👑', description: 'All your Aces beat any card', effect: 'Aces always win', owned: false },
  { id: 'lucky_streak', name: 'Lucky Streak', type: 'joker', rarity: 'legendary', icon: '🌟', description: 'Win 3 rounds in a row to activate', effect: '3 wins → guaranteed next win', owned: false },
];

export function CollectionScreen({ onNavigate }: CollectionScreenProps) {
  const [selectedTab, setSelectedTab] = useState<'all' | 'standard' | 'special' | 'joker'>('all');

  const filteredCards = collectionCards.filter(card => 
    selectedTab === 'all' || card.type === selectedTab
  );

  const ownedCount = collectionCards.filter(card => card.owned).length;
  const totalCount = collectionCards.length;

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return '#FFFFFF';
      case 'rare': return '#4A90E2';
      case 'epic': return '#9B59B6';
      case 'legendary': return '#FFD700';
      default: return '#FFFFFF';
    }
  };

  const getRarityGradient = (rarity: string) => {
    switch (rarity) {
      case 'common': return ['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)'];
      case 'rare': return ['rgba(74, 144, 226, 0.2)', 'rgba(74, 144, 226, 0.1)'];
      case 'epic': return ['rgba(155, 89, 182, 0.2)', 'rgba(155, 89, 182, 0.1)'];
      case 'legendary': return ['rgba(255, 215, 0, 0.2)', 'rgba(255, 215, 0, 0.1)'];
      default: return ['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)'];
    }
  };

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
          <Text style={styles.backButtonText}>← BACK</Text>
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>COLLECTION</Text>
        
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>{ownedCount}/{totalCount}</Text>
        </View>
      </Animated.View>

      {/* Collection Progress */}
      <Animated.View 
        style={styles.progressBarContainer}
        entering={FadeInDown.duration(600).delay(100)}
      >
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${(ownedCount / totalCount) * 100}%` }
            ]} 
          />
        </View>
        <Text style={styles.progressLabel}>
          Collection Progress: {Math.round((ownedCount / totalCount) * 100)}%
        </Text>
      </Animated.View>

      {/* Filter Tabs */}
      <Animated.View 
        style={styles.tabContainer}
        entering={FadeInDown.duration(600).delay(200)}
      >
        {(['all', 'standard', 'special', 'joker'] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tab,
              selectedTab === tab && styles.activeTab
            ]}
            onPress={() => setSelectedTab(tab)}
          >
            <Text style={[
              styles.tabText,
              selectedTab === tab && styles.activeTabText
            ]}>
              {tab.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </Animated.View>

      {/* Cards Grid */}
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Animated.View 
          style={styles.cardsGrid}
          entering={FadeInDown.duration(600).delay(300)}
        >
          {filteredCards.map((card, index) => (
            <View
              key={card.id}
              style={[
                styles.cardItem,
                !card.owned && styles.unownedCard
              ]}
            >
              <LinearGradient
                colors={card.owned ? getRarityGradient(card.rarity) : ['rgba(50, 50, 50, 0.3)', 'rgba(30, 30, 30, 0.3)']}
                style={styles.cardGradient}
              >
                <View style={styles.cardHeader}>
                  <Text style={[
                    styles.cardIcon,
                    !card.owned && styles.unownedIcon
                  ]}>
                    {card.owned ? card.icon : '❓'}
                  </Text>
                  
                  {card.count && card.owned && (
                    <View style={styles.countBadge}>
                      <Text style={styles.countText}>x{card.count}</Text>
                    </View>
                  )}
                </View>
                
                <Text style={[
                  styles.cardName,
                  card.owned && { color: getRarityColor(card.rarity) },
                  !card.owned && styles.unownedText
                ]}>
                  {card.owned ? card.name : '???'}
                </Text>
                
                <Text style={[
                  styles.cardType,
                  !card.owned && styles.unownedText
                ]}>
                  {card.type.toUpperCase()}
                </Text>
                
                {card.owned && (
                  <>
                    <Text style={styles.cardDescription}>
                      {card.description}
                    </Text>
                    
                    {card.effect && (
                      <View style={styles.effectContainer}>
                        <Text style={styles.effectText}>{card.effect}</Text>
                      </View>
                    )}
                  </>
                )}
                
                {!card.owned && (
                  <View style={styles.lockedOverlay}>
                    <Text style={styles.lockIcon}>🔒</Text>
                    <Text style={styles.lockedText}>Not Owned</Text>
                  </View>
                )}
                
                <View style={[
                  styles.rarityBadge,
                  { backgroundColor: getRarityColor(card.rarity) }
                ]}>
                  <Text style={styles.rarityText}>
                    {card.rarity.toUpperCase()}
                  </Text>
                </View>
              </LinearGradient>
            </View>
          ))}
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
  progressContainer: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  progressText: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '700',
  },
  progressBarContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFD700',
    borderRadius: 3,
  },
  progressLabel: {
    color: '#CCCCCC',
    fontSize: 12,
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginHorizontal: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  activeTab: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderColor: '#FFD700',
  },
  tabText: {
    color: '#888888',
    fontSize: 12,
    fontWeight: '600',
  },
  activeTabText: {
    color: '#FFD700',
  },
  scrollContainer: {
    flex: 1,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  cardItem: {
    width: '48%',
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  unownedCard: {
    opacity: 0.6,
  },
  cardGradient: {
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    minHeight: 160,
    position: 'relative',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  cardIcon: {
    fontSize: 32,
  },
  unownedIcon: {
    opacity: 0.5,
  },
  countBadge: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  countText: {
    color: '#FFD700',
    fontSize: 10,
    fontWeight: '700',
  },
  cardName: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
    lineHeight: 16,
  },
  cardType: {
    fontSize: 10,
    color: '#888888',
    fontWeight: '600',
    marginBottom: 6,
  },
  unownedText: {
    color: '#555555',
  },
  cardDescription: {
    fontSize: 11,
    color: '#CCCCCC',
    lineHeight: 14,
    marginBottom: 6,
  },
  effectContainer: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 8,
  },
  effectText: {
    fontSize: 10,
    color: '#FFD700',
    fontWeight: '600',
    textAlign: 'center',
  },
  lockedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 12,
  },
  lockIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  lockedText: {
    color: '#888888',
    fontSize: 12,
    fontWeight: '600',
  },
  rarityBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  rarityText: {
    color: '#000000',
    fontSize: 8,
    fontWeight: '700',
  },
  bottomSpacing: {
    height: 40,
  },
});