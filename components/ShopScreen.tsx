import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useState } from 'react';

interface ShopScreenProps {
  onNavigate: (screen: string) => void;
  chips: number;
  setChips: (chips: number) => void;
}

interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  type: 'card' | 'joker' | 'upgrade';
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  effect: string;
}

const shopItems: ShopItem[] = [
  {
    id: 'double_draw',
    name: 'Double Draw',
    description: 'Draw 2 cards, play the higher one',
    price: 50,
    type: 'joker',
    icon: '🎭',
    rarity: 'rare',
    effect: 'Next War: Draw 2, play higher',
  },
  {
    id: 'ace_high',
    name: 'Ace Supremacy',
    description: 'All your Aces beat any card',
    price: 75,
    type: 'joker',
    icon: '👑',
    rarity: 'epic',
    effect: 'Aces always win',
  },
  {
    id: 'tie_breaker',
    name: 'Tie Breaker',
    description: 'All ties go to you',
    price: 40,
    type: 'joker',
    icon: '⚖️',
    rarity: 'rare',
    effect: 'Win all ties',
  },
  {
    id: 'lucky_seven',
    name: 'Lucky Seven',
    description: 'All 7s become Aces',
    price: 30,
    type: 'card',
    icon: '🍀',
    rarity: 'common',
    effect: '7s → Aces',
  },
  {
    id: 'mirror_card',
    name: 'Mirror Card',
    description: 'Copy opponent\'s card value +1',
    price: 100,
    type: 'joker',
    icon: '🪞',
    rarity: 'legendary',
    effect: 'Copy + 1',
  },
  {
    id: 'chip_multiplier',
    name: 'Chip Multiplier',
    description: 'Double all chip rewards',
    price: 80,
    type: 'upgrade',
    icon: '💰',
    rarity: 'epic',
    effect: '2x chip rewards',
  },
];

export function ShopScreen({ onNavigate, chips, setChips }: ShopScreenProps) {
  const [purchasedItems, setPurchasedItems] = useState<string[]>([]);

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

  const handlePurchase = (item: ShopItem) => {
    if (chips < item.price) {
      Alert.alert('Insufficient Chips', `You need ${item.price} chips to buy this item.`);
      return;
    }

    if (purchasedItems.includes(item.id)) {
      Alert.alert('Already Owned', 'You already own this item.');
      return;
    }

    Alert.alert(
      'Confirm Purchase',
      `Buy ${item.name} for ${item.price} chips?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Buy',
          onPress: () => {
            setChips(chips - item.price);
            setPurchasedItems(prev => [...prev, item.id]);
          },
        },
      ]
    );
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
        
        <Text style={styles.headerTitle}>CASINO SHOP</Text>
        
        <View style={styles.chipContainer}>
          <Text style={styles.chipIcon}>🪙</Text>
          <Text style={styles.chipText}>{chips}</Text>
        </View>
      </Animated.View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Shop Description */}
        <Animated.View 
          style={styles.descriptionContainer}
          entering={FadeInDown.duration(600).delay(100)}
        >
          <Text style={styles.descriptionText}>
            Enhance your deck with powerful cards, game-changing jokers, and permanent upgrades
          </Text>
        </Animated.View>

        {/* Shop Items */}
        <Animated.View 
          style={styles.itemsContainer}
          entering={FadeInDown.duration(600).delay(200)}
        >
          {shopItems.map((item, index) => {
            const isOwned = purchasedItems.includes(item.id);
            const canAfford = chips >= item.price;

            return (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.shopItem,
                  isOwned && styles.ownedItem,
                  !canAfford && !isOwned && styles.unaffordableItem,
                ]}
                onPress={() => !isOwned && handlePurchase(item)}
                disabled={isOwned}
              >
                <LinearGradient
                  colors={getRarityGradient(item.rarity)}
                  style={styles.itemGradient}
                >
                  <View style={styles.itemHeader}>
                    <View style={styles.itemIconContainer}>
                      <Text style={styles.itemIcon}>{item.icon}</Text>
                    </View>
                    
                    <View style={styles.itemInfo}>
                      <Text style={[
                        styles.itemName,
                        { color: getRarityColor(item.rarity) }
                      ]}>
                        {item.name}
                      </Text>
                      <Text style={styles.itemType}>
                        {item.type.toUpperCase()} • {item.rarity.toUpperCase()}
                      </Text>
                    </View>
                    
                    <View style={styles.priceContainer}>
                      {isOwned ? (
                        <View style={styles.ownedBadge}>
                          <Text style={styles.ownedText}>OWNED</Text>
                        </View>
                      ) : (
                        <View style={[
                          styles.priceChip,
                          !canAfford && styles.unaffordablePrice
                        ]}>
                          <Text style={styles.chipIcon}>🪙</Text>
                          <Text style={[
                            styles.priceText,
                            !canAfford && styles.unaffordablePriceText
                          ]}>
                            {item.price}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                  
                  <Text style={styles.itemDescription}>{item.description}</Text>
                  
                  <View style={styles.effectContainer}>
                    <Text style={styles.effectLabel}>EFFECT:</Text>
                    <Text style={styles.effectText}>{item.effect}</Text>
                  </View>
                  
                  {isOwned && (
                    <View style={styles.ownedOverlay}>
                      <Text style={styles.ownedIcon}>✓</Text>
                    </View>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            );
          })}
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
  chipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  chipIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  chipText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFD700',
  },
  scrollContainer: {
    flex: 1,
  },
  descriptionContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  descriptionText: {
    color: '#CCCCCC',
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  itemsContainer: {
    paddingHorizontal: 20,
  },
  shopItem: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  ownedItem: {
    opacity: 0.7,
  },
  unaffordableItem: {
    opacity: 0.5,
  },
  itemGradient: {
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    position: 'relative',
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemIcon: {
    fontSize: 24,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  itemType: {
    fontSize: 12,
    color: '#888888',
    fontWeight: '600',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  priceChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  unaffordablePrice: {
    backgroundColor: 'rgba(255, 68, 68, 0.1)',
    borderColor: '#FF4444',
  },
  priceText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFD700',
  },
  unaffordablePriceText: {
    color: '#FF4444',
  },
  ownedBadge: {
    backgroundColor: 'rgba(0, 255, 0, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#00FF00',
  },
  ownedText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#00FF00',
  },
  itemDescription: {
    color: '#CCCCCC',
    fontSize: 14,
    lineHeight: 18,
    marginBottom: 8,
  },
  effectContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  effectLabel: {
    color: '#888888',
    fontSize: 12,
    fontWeight: '600',
    marginRight: 8,
  },
  effectText: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
  ownedOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#00FF00',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ownedIcon: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  bottomSpacing: {
    height: 40,
  },
});