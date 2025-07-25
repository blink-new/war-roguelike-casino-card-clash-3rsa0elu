import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useState } from 'react';

interface CollectionScreenProps {
  onNavigate: (screen: string) => void;
}

interface Vessel {
  id: string;
  name: string;
  type: 'destroyer' | 'cruiser' | 'battleship' | 'carrier';
  value: number;
  display: string;
  symbol: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  description: string;
  unlocked: boolean;
}

const vesselCollection: Vessel[] = [
  // Destroyers (Common)
  { id: 'd1', name: 'DD-2 Swift', type: 'destroyer', value: 2, display: '2', symbol: '🚢', rarity: 'common', description: 'Fast patrol vessel', unlocked: true },
  { id: 'd2', name: 'DD-3 Hunter', type: 'destroyer', value: 3, display: '3', symbol: '🚢', rarity: 'common', description: 'Anti-submarine destroyer', unlocked: true },
  
  // Cruisers (Rare)
  { id: 'c1', name: 'CL-4 Aurora', type: 'cruiser', value: 4, display: '4', symbol: '⛵', rarity: 'rare', description: 'Light cruiser with advanced radar', unlocked: true },
  { id: 'c2', name: 'CL-5 Neptune', type: 'cruiser', value: 5, display: '5', symbol: '⛵', rarity: 'rare', description: 'Heavy cruiser with torpedo tubes', unlocked: false },
  { id: 'c3', name: 'CL-6 Poseidon', type: 'cruiser', value: 6, display: '6', symbol: '⛵', rarity: 'rare', description: 'Command cruiser', unlocked: false },
  { id: 'c4', name: 'CL-7 Triton', type: 'cruiser', value: 7, display: '7', symbol: '⛵', rarity: 'rare', description: 'Missile cruiser', unlocked: false },
  
  // Battleships (Epic)
  { id: 'b1', name: 'BB-8 Leviathan', type: 'battleship', value: 8, display: '8', symbol: '🛳️', rarity: 'epic', description: 'Heavy battleship with 16-inch guns', unlocked: false },
  { id: 'b2', name: 'BB-9 Kraken', type: 'battleship', value: 9, display: '9', symbol: '🛳️', rarity: 'epic', description: 'Super battleship', unlocked: false },
  { id: 'b3', name: 'BB-10 Titan', type: 'battleship', value: 10, display: '10', symbol: '🛳️', rarity: 'epic', description: 'Dreadnought class', unlocked: false },
  { id: 'b4', name: 'BB-J Sovereign', type: 'battleship', value: 11, display: 'J', symbol: '🛳️', rarity: 'epic', description: 'Royal battleship', unlocked: false },
  { id: 'b5', name: 'BB-Q Empress', type: 'battleship', value: 12, display: 'Q', symbol: '🛳️', rarity: 'epic', description: 'Imperial battleship', unlocked: false },
  { id: 'b6', name: 'BB-K Monarch', type: 'battleship', value: 13, display: 'K', symbol: '🛳️', rarity: 'epic', description: 'Flagship battleship', unlocked: false },
  
  // Carriers (Legendary)
  { id: 'cv1', name: 'CV-A Valkyrie', type: 'carrier', value: 14, display: 'A', symbol: '🚁', rarity: 'legendary', description: 'Nuclear aircraft carrier', unlocked: false },
];

export function CollectionScreen({ onNavigate }: CollectionScreenProps) {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'destroyer' | 'cruiser' | 'battleship' | 'carrier'>('all');

  const filteredVessels = vesselCollection.filter(vessel => 
    selectedFilter === 'all' || vessel.type === selectedFilter
  );

  const unlockedCount = vesselCollection.filter(v => v.unlocked).length;
  const totalCount = vesselCollection.length;

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
          
          <Text style={styles.title}>FLEET STATUS</Text>
          
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>{unlockedCount}/{totalCount}</Text>
          </View>
        </Animated.View>

        {/* Collection Content */}
        <ScrollView style={styles.collectionContainer} showsVerticalScrollIndicator={false}>
          <Animated.View 
            style={styles.collectionHeader}
            entering={FadeInDown.duration(600).delay(100)}
          >
            <Text style={styles.collectionTitle}>VESSEL REGISTRY</Text>
            <Text style={styles.collectionSubtitle}>Your naval fleet database</Text>
          </Animated.View>

          {/* Filter Buttons */}
          <Animated.View 
            style={styles.filterContainer}
            entering={FadeInDown.duration(600).delay(200)}
          >
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <FilterButton 
                title="ALL" 
                active={selectedFilter === 'all'} 
                onPress={() => setSelectedFilter('all')} 
              />
              <FilterButton 
                title="DESTROYERS" 
                active={selectedFilter === 'destroyer'} 
                onPress={() => setSelectedFilter('destroyer')} 
              />
              <FilterButton 
                title="CRUISERS" 
                active={selectedFilter === 'cruiser'} 
                onPress={() => setSelectedFilter('cruiser')} 
              />
              <FilterButton 
                title="BATTLESHIPS" 
                active={selectedFilter === 'battleship'} 
                onPress={() => setSelectedFilter('battleship')} 
              />
              <FilterButton 
                title="CARRIERS" 
                active={selectedFilter === 'carrier'} 
                onPress={() => setSelectedFilter('carrier')} 
              />
            </ScrollView>
          </Animated.View>

          {/* Vessel Grid */}
          <View style={styles.vesselGrid}>
            {filteredVessels.map((vessel, index) => (
              <Animated.View
                key={vessel.id}
                entering={FadeInDown.duration(600).delay(300 + index * 50)}
              >
                <VesselCard vessel={vessel} />
              </Animated.View>
            ))}
          </View>

          {/* Collection Stats */}
          <Animated.View 
            style={styles.statsContainer}
            entering={FadeInDown.duration(600).delay(800)}
          >
            <Text style={styles.statsTitle}>FLEET STATISTICS</Text>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Destroyers:</Text>
              <Text style={styles.statValue}>
                {vesselCollection.filter(v => v.type === 'destroyer' && v.unlocked).length}/
                {vesselCollection.filter(v => v.type === 'destroyer').length}
              </Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Cruisers:</Text>
              <Text style={styles.statValue}>
                {vesselCollection.filter(v => v.type === 'cruiser' && v.unlocked).length}/
                {vesselCollection.filter(v => v.type === 'cruiser').length}
              </Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Battleships:</Text>
              <Text style={styles.statValue}>
                {vesselCollection.filter(v => v.type === 'battleship' && v.unlocked).length}/
                {vesselCollection.filter(v => v.type === 'battleship').length}
              </Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Carriers:</Text>
              <Text style={styles.statValue}>
                {vesselCollection.filter(v => v.type === 'carrier' && v.unlocked).length}/
                {vesselCollection.filter(v => v.type === 'carrier').length}
              </Text>
            </View>
          </Animated.View>
        </ScrollView>
      </View>
    </LinearGradient>
  );
}

function FilterButton({ 
  title, 
  active, 
  onPress 
}: { 
  title: string; 
  active: boolean; 
  onPress: () => void; 
}) {
  return (
    <TouchableOpacity 
      onPress={onPress}
      style={[styles.filterButton, active && styles.activeFilterButton]}
    >
      <Text style={[styles.filterButtonText, active && styles.activeFilterButtonText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

function VesselCard({ vessel }: { vessel: Vessel }) {
  const getRarityColor = () => {
    switch (vessel.rarity) {
      case 'common': return '#64748B';
      case 'rare': return '#3B82F6';
      case 'epic': return '#8B5CF6';
      case 'legendary': return '#F59E0B';
      default: return '#64748B';
    }
  };

  const getRarityBorder = () => {
    switch (vessel.rarity) {
      case 'common': return '#475569';
      case 'rare': return '#3B82F6';
      case 'epic': return '#8B5CF6';
      case 'legendary': return '#F59E0B';
      default: return '#475569';
    }
  };

  return (
    <View 
      style={[
        styles.vesselCard,
        { borderColor: getRarityBorder() },
        !vessel.unlocked && styles.lockedCard,
      ]}
    >
      <LinearGradient
        colors={vessel.unlocked 
          ? ['rgba(30, 58, 138, 0.2)', 'rgba(59, 130, 246, 0.1)']
          : ['rgba(71, 85, 105, 0.1)', 'rgba(51, 65, 85, 0.05)']
        }
        style={styles.cardGradient}
      >
        {/* Vessel Symbol */}
        <View style={styles.vesselSymbol}>
          <Text style={styles.symbolText}>
            {vessel.unlocked ? vessel.symbol : '❓'}
          </Text>
        </View>

        {/* Vessel Info */}
        <View style={styles.vesselInfo}>
          <Text style={[styles.vesselName, !vessel.unlocked && styles.lockedText]}>
            {vessel.unlocked ? vessel.name : 'CLASSIFIED'}
          </Text>
          
          <Text style={[styles.vesselValue, { color: getRarityColor() }]}>
            {vessel.unlocked ? vessel.display : '?'}
          </Text>
          
          <Text style={[styles.vesselType, !vessel.unlocked && styles.lockedText]}>
            {vessel.unlocked ? vessel.type.toUpperCase() : 'UNKNOWN'}
          </Text>
          
          <Text style={[styles.vesselRarity, { color: getRarityColor() }]}>
            {vessel.unlocked ? vessel.rarity.toUpperCase() : '???'}
          </Text>
        </View>

        {/* Description */}
        <Text style={[styles.vesselDescription, !vessel.unlocked && styles.lockedText]}>
          {vessel.unlocked ? vessel.description : 'Data encrypted'}
        </Text>

        {/* Lock Indicator */}
        {!vessel.unlocked && (
          <View style={styles.lockIndicator}>
            <Text style={styles.lockIcon}>🔒</Text>
          </View>
        )}
      </LinearGradient>
    </View>
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
  progressContainer: {
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 2,
    borderColor: '#FBBF24',
  },
  progressText: {
    color: '#FBBF24',
    fontSize: 14,
    fontFamily: 'Courier New',
    fontWeight: '700',
  },
  collectionContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  collectionHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  collectionTitle: {
    color: '#FBBF24',
    fontSize: 20,
    fontFamily: 'Courier New',
    fontWeight: '900',
    letterSpacing: 2,
  },
  collectionSubtitle: {
    color: '#94A3B8',
    fontSize: 12,
    fontFamily: 'Courier New',
    marginTop: 4,
  },
  filterContainer: {
    marginBottom: 20,
  },
  filterButton: {
    backgroundColor: 'rgba(71, 85, 105, 0.2)',
    borderWidth: 1,
    borderColor: '#475569',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
  },
  activeFilterButton: {
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
    borderColor: '#FBBF24',
  },
  filterButtonText: {
    color: '#94A3B8',
    fontSize: 10,
    fontFamily: 'Courier New',
    fontWeight: '600',
  },
  activeFilterButtonText: {
    color: '#FBBF24',
  },
  vesselGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 30,
  },
  vesselCard: {
    width: '48%',
    borderWidth: 2,
    overflow: 'hidden',
  },
  lockedCard: {
    opacity: 0.6,
  },
  cardGradient: {
    padding: 12,
    minHeight: 140,
  },
  vesselSymbol: {
    alignItems: 'center',
    marginBottom: 8,
  },
  symbolText: {
    fontSize: 24,
  },
  vesselInfo: {
    alignItems: 'center',
    marginBottom: 8,
  },
  vesselName: {
    color: '#E2E8F0',
    fontSize: 12,
    fontFamily: 'Courier New',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
  },
  vesselValue: {
    fontSize: 18,
    fontFamily: 'Courier New',
    fontWeight: '900',
    marginBottom: 2,
  },
  vesselType: {
    color: '#94A3B8',
    fontSize: 8,
    fontFamily: 'Courier New',
    marginBottom: 2,
  },
  vesselRarity: {
    fontSize: 8,
    fontFamily: 'Courier New',
    fontWeight: '600',
  },
  vesselDescription: {
    color: '#94A3B8',
    fontSize: 8,
    fontFamily: 'Courier New',
    textAlign: 'center',
    lineHeight: 10,
  },
  lockIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  lockIcon: {
    fontSize: 12,
  },
  lockedText: {
    color: '#64748B',
  },
  statsContainer: {
    borderWidth: 1,
    borderColor: '#475569',
    backgroundColor: 'rgba(71, 85, 105, 0.1)',
    padding: 16,
    marginBottom: 20,
  },
  statsTitle: {
    color: '#FBBF24',
    fontSize: 14,
    fontFamily: 'Courier New',
    fontWeight: '700',
    marginBottom: 12,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  statLabel: {
    color: '#94A3B8',
    fontSize: 12,
    fontFamily: 'Courier New',
  },
  statValue: {
    color: '#E2E8F0',
    fontSize: 12,
    fontFamily: 'Courier New',
    fontWeight: '600',
  },
});