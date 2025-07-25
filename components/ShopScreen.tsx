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
  type: 'equipment' | 'upgrade' | 'vessel';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  icon: string;
  effect: string;
}

const shopItems: ShopItem[] = [
  {
    id: 'radar_boost',
    name: 'Advanced Radar',
    description: 'Reveals enemy cards 0.5s earlier',
    price: 50,
    type: 'equipment',
    rarity: 'common',
    icon: '📡',
    effect: '+0.5s preview time',
  },
  {
    id: 'armor_plating',
    name: 'Reinforced Hull',
    description: 'Ties now favor your fleet',
    price: 75,
    type: 'upgrade',
    rarity: 'rare',
    icon: '🛡️',
    effect: 'Win all ties',
  },
  {
    id: 'torpedo_tubes',
    name: 'Torpedo Launcher',
    description: 'Low cards (2-6) now beat high cards',
    price: 100,
    type: 'equipment',
    rarity: 'epic',
    icon: '🚀',
    effect: 'Reverse card values',
  },
  {
    id: 'flagship',
    name: 'Command Flagship',
    description: 'Draw 2 cards, choose the better one',
    price: 150,
    type: 'vessel',
    rarity: 'legendary',
    icon: '🚁',
    effect: 'Double draw advantage',
  },
  {
    id: 'sonar_array',
    name: 'Sonar Array',
    description: 'See next 3 enemy cards',
    price: 80,
    type: 'equipment',
    rarity: 'rare',
    icon: '🔊',
    effect: 'Future sight x3',
  },
  {
    id: 'naval_academy',
    name: 'Naval Academy',
    description: 'Permanently +1 to all card values',
    price: 200,
    type: 'upgrade',
    rarity: 'legendary',
    icon: '🎓',
    effect: '+1 to all cards',
  },
];

export function ShopScreen({ onNavigate, chips, setChips }: ShopScreenProps) {
  const [purchasedItems, setPurchasedItems] = useState<string[]>([]);

  const handlePurchase = (item: ShopItem) => {
    if (chips >= item.price && !purchasedItems.includes(item.id)) {
      setChips(chips - item.price);
      setPurchasedItems([...purchasedItems, item.id]);
      Alert.alert(
        'Equipment Acquired!',
        `${item.name} has been added to your fleet.`,
        [{ text: 'Roger that!', style: 'default' }]
      );
    } else if (purchasedItems.includes(item.id)) {
      Alert.alert('Already Owned', 'This equipment is already installed on your fleet.');
    } else {
      Alert.alert('Insufficient Credits', 'You need more credits to purchase this equipment.');
    }
  };

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
          
          <Text style={styles.title}>ARMORY</Text>
          
          <View style={styles.chipContainer}>
            <Text style={styles.chipIcon}>⚓</Text>
            <Text style={styles.chipText}>{chips}</Text>
          </View>
        </Animated.View>

        {/* Shop Content */}
        <ScrollView style={styles.shopContainer} showsVerticalScrollIndicator={false}>
          <Animated.View 
            style={styles.shopHeader}
            entering={FadeInDown.duration(600).delay(100)}
          >
            <Text style={styles.shopTitle}>NAVAL EQUIPMENT</Text>
            <Text style={styles.shopSubtitle}>Upgrade your fleet capabilities</Text>
          </Animated.View>

          {/* Shop Items */}
          <View style={styles.itemsContainer}>
            {shopItems.map((item, index) => (
              <Animated.View
                key={item.id}
                entering={FadeInDown.duration(600).delay(200 + index * 100)}
              >
                <ShopItemCard 
                  item={item} 
                  onPurchase={() => handlePurchase(item)}
                  canAfford={chips >= item.price}
                  isPurchased={purchasedItems.includes(item.id)}
                />
              </Animated.View>
            ))}
          </View>

          {/* Shop Footer */}
          <Animated.View 
            style={styles.shopFooter}
            entering={FadeInDown.duration(600).delay(800)}
          >
            <Text style={styles.footerText}>Equipment effects are permanent upgrades</Text>
            <Text style={styles.footerSubtext}>Win battles to earn more credits</Text>
          </Animated.View>
        </ScrollView>
      </View>
    </LinearGradient>
  );
}

function ShopItemCard({ 
  item, 
  onPurchase, 
  canAfford, 
  isPurchased 
}: { 
  item: ShopItem; 
  onPurchase: () => void; 
  canAfford: boolean;
  isPurchased: boolean;
}) {
  const getRarityColor = () => {
    switch (item.rarity) {
      case 'common': return '#64748B';
      case 'rare': return '#3B82F6';
      case 'epic': return '#8B5CF6';
      case 'legendary': return '#F59E0B';
      default: return '#64748B';
    }
  };

  const getRarityBorder = () => {
    switch (item.rarity) {
      case 'common': return '#475569';
      case 'rare': return '#3B82F6';
      case 'epic': return '#8B5CF6';
      case 'legendary': return '#F59E0B';
      default: return '#475569';
    }
  };

  return (
    <TouchableOpacity 
      onPress={onPurchase}
      disabled={isPurchased || !canAfford}
      style={[
        styles.itemCard,
        { borderColor: getRarityBorder() },
        isPurchased && styles.purchasedCard,
        !canAfford && !isPurchased && styles.unaffordableCard,
      ]}
    >
      <LinearGradient
        colors={isPurchased 
          ? ['rgba(34, 197, 94, 0.1)', 'rgba(22, 163, 74, 0.05)']
          : ['rgba(30, 58, 138, 0.2)', 'rgba(59, 130, 246, 0.1)']
        }
        style={styles.cardGradient}
      >
        {/* Item Header */}
        <View style={styles.itemHeader}>
          <View style={styles.itemIcon}>
            <Text style={styles.iconText}>{item.icon}</Text>
          </View>
          
          <View style={styles.itemInfo}>
            <Text style={[styles.itemName, { color: getRarityColor() }]}>
              {item.name}
            </Text>
            <Text style={styles.itemType}>
              {item.type.toUpperCase()} • {item.rarity.toUpperCase()}
            </Text>
          </View>

          <View style={styles.priceContainer}>
            <Text style={styles.priceValue}>{item.price}</Text>
            <Text style={styles.priceIcon}>⚓</Text>
          </View>
        </View>

        {/* Item Description */}
        <Text style={styles.itemDescription}>{item.description}</Text>

        {/* Item Effect */}
        <View style={styles.effectContainer}>
          <Text style={styles.effectLabel}>EFFECT:</Text>
          <Text style={[styles.effectText, { color: getRarityColor() }]}>
            {item.effect}
          </Text>
        </View>

        {/* Purchase Status */}
        <View style={styles.statusContainer}>
          {isPurchased ? (
            <Text style={styles.purchasedText}>✓ EQUIPPED</Text>
          ) : canAfford ? (
            <Text style={styles.availableText}>► PURCHASE</Text>
          ) : (
            <Text style={styles.unavailableText}>INSUFFICIENT CREDITS</Text>
          )}
        </View>
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
  chipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 2,
    borderColor: '#FBBF24',
  },
  chipIcon: {
    fontSize: 16,
    marginRight: 6,
    color: '#FBBF24',
  },
  chipText: {
    fontSize: 16,
    fontFamily: 'Courier New',
    fontWeight: '700',
    color: '#FBBF24',
  },
  shopContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  shopHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  shopTitle: {
    color: '#FBBF24',
    fontSize: 20,
    fontFamily: 'Courier New',
    fontWeight: '900',
    letterSpacing: 2,
  },
  shopSubtitle: {
    color: '#94A3B8',
    fontSize: 12,
    fontFamily: 'Courier New',
    marginTop: 4,
  },
  itemsContainer: {
    gap: 16,
    marginBottom: 30,
  },
  itemCard: {
    borderWidth: 2,
    overflow: 'hidden',
  },
  purchasedCard: {
    opacity: 0.8,
  },
  unaffordableCard: {
    opacity: 0.5,
  },
  cardGradient: {
    padding: 16,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemIcon: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: '#475569',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 20,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontFamily: 'Courier New',
    fontWeight: '700',
    marginBottom: 2,
  },
  itemType: {
    color: '#64748B',
    fontSize: 10,
    fontFamily: 'Courier New',
  },
  priceContainer: {
    alignItems: 'center',
  },
  priceValue: {
    color: '#FBBF24',
    fontSize: 16,
    fontFamily: 'Courier New',
    fontWeight: '700',
  },
  priceIcon: {
    color: '#FBBF24',
    fontSize: 12,
  },
  itemDescription: {
    color: '#E2E8F0',
    fontSize: 12,
    fontFamily: 'Courier New',
    marginBottom: 8,
    lineHeight: 16,
  },
  effectContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  effectLabel: {
    color: '#64748B',
    fontSize: 10,
    fontFamily: 'Courier New',
    marginRight: 8,
  },
  effectText: {
    fontSize: 10,
    fontFamily: 'Courier New',
    fontWeight: '600',
  },
  statusContainer: {
    alignItems: 'center',
  },
  purchasedText: {
    color: '#22C55E',
    fontSize: 12,
    fontFamily: 'Courier New',
    fontWeight: '700',
  },
  availableText: {
    color: '#FBBF24',
    fontSize: 12,
    fontFamily: 'Courier New',
    fontWeight: '700',
  },
  unavailableText: {
    color: '#EF4444',
    fontSize: 10,
    fontFamily: 'Courier New',
  },
  shopFooter: {
    alignItems: 'center',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#475569',
  },
  footerText: {
    color: '#94A3B8',
    fontSize: 12,
    fontFamily: 'Courier New',
    textAlign: 'center',
  },
  footerSubtext: {
    color: '#64748B',
    fontSize: 10,
    fontFamily: 'Courier New',
    textAlign: 'center',
    marginTop: 4,
  },
});