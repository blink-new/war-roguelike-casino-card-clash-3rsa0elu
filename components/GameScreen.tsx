import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  FadeInDown, 
  FadeInUp, 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withSequence,
} from 'react-native-reanimated';
import { useState, useEffect } from 'react';
import { PlayingCard } from './PlayingCard';
import { DealerPortrait } from './DealerPortrait';

interface GameScreenProps {
  onNavigate: (screen: string) => void;
  chips: number;
  setChips: (chips: number) => void;
}

type GameState = 'ready' | 'dealing' | 'revealing' | 'result' | 'gameOver';

interface Ship {
  type: 'destroyer' | 'cruiser' | 'battleship' | 'carrier';
  value: number;
  display: string;
  symbol: string;
}

const shipTypes = [
  { type: 'destroyer', value: 2, display: '2', symbol: '🚢' },
  { type: 'destroyer', value: 3, display: '3', symbol: '🚢' },
  { type: 'cruiser', value: 4, display: '4', symbol: '⛵' },
  { type: 'cruiser', value: 5, display: '5', symbol: '⛵' },
  { type: 'cruiser', value: 6, display: '6', symbol: '⛵' },
  { type: 'cruiser', value: 7, display: '7', symbol: '⛵' },
  { type: 'battleship', value: 8, display: '8', symbol: '🛳️' },
  { type: 'battleship', value: 9, display: '9', symbol: '🛳️' },
  { type: 'battleship', value: 10, display: '10', symbol: '🛳️' },
  { type: 'battleship', value: 11, display: 'J', symbol: '🛳️' },
  { type: 'battleship', value: 12, display: 'Q', symbol: '🛳️' },
  { type: 'battleship', value: 13, display: 'K', symbol: '🛳️' },
  { type: 'carrier', value: 14, display: 'A', symbol: '🚁' },
] as const;

const admirals = [
  {
    name: 'Admiral Rookie',
    avatar: '👨‍✈️',
    difficulty: 1,
    specialRule: 'Standard naval engagement',
    winReward: 25,
    fleet: 'Patrol Fleet',
  },
  {
    name: 'Captain Storm',
    avatar: '🧑‍✈️',
    difficulty: 2,
    specialRule: 'Ties favor the enemy',
    winReward: 40,
    fleet: 'Strike Force',
  },
  {
    name: 'Fleet Admiral',
    avatar: '👩‍✈️',
    difficulty: 3,
    specialRule: 'Capital ships only',
    winReward: 60,
    fleet: 'Battle Group',
  },
];

export function GameScreen({ onNavigate, chips, setChips }: GameScreenProps) {
  const [gameState, setGameState] = useState<GameState>('ready');
  const [currentAdmiral] = useState(admirals[0]);
  const [playerShip, setPlayerShip] = useState<Ship | null>(null);
  const [enemyShip, setEnemyShip] = useState<Ship | null>(null);
  const [playerWins, setPlayerWins] = useState(0);
  const [enemyWins, setEnemyWins] = useState(0);
  const [round, setRound] = useState(1);
  const [lastResult, setLastResult] = useState<'win' | 'lose' | 'tie' | null>(null);
  const [bet] = useState(10);

  const cardScale = useSharedValue(1);
  const resultOpacity = useSharedValue(0);

  const generateShip = (): Ship => {
    const shipData = shipTypes[Math.floor(Math.random() * shipTypes.length)];
    return {
      type: shipData.type,
      value: shipData.value,
      display: shipData.display,
      symbol: shipData.symbol,
    };
  };

  const playRound = () => {
    if (gameState !== 'ready') return;
    
    setGameState('dealing');
    cardScale.value = withSpring(1.1);
    
    setTimeout(() => {
      const pShip = generateShip();
      const eShip = generateShip();
      
      setPlayerShip(pShip);
      setEnemyShip(eShip);
      setGameState('revealing');
      
      setTimeout(() => {
        let result: 'win' | 'lose' | 'tie';
        
        if (pShip.value > eShip.value) {
          result = 'win';
          setPlayerWins(prev => prev + 1);
        } else if (pShip.value < eShip.value) {
          result = 'lose';
          setEnemyWins(prev => prev + 1);
        } else {
          result = 'tie';
        }
        
        setLastResult(result);
        setGameState('result');
        
        resultOpacity.value = withSpring(1);
        cardScale.value = withSequence(
          withSpring(1.2),
          withSpring(1)
        );
        
        setTimeout(() => {
          if (playerWins + (result === 'win' ? 1 : 0) >= 3) {
            // Player wins the battle
            setChips(prev => prev + currentAdmiral.winReward);
            setGameState('gameOver');
          } else if (enemyWins + (result === 'lose' ? 1 : 0) >= 3) {
            // Enemy wins the battle
            setChips(prev => Math.max(0, prev - bet));
            setGameState('gameOver');
          } else {
            setRound(prev => prev + 1);
            setGameState('ready');
            resultOpacity.value = 0;
          }
        }, 2000);
      }, 1000);
    }, 500);
  };

  const resetGame = () => {
    setPlayerWins(0);
    setEnemyWins(0);
    setRound(1);
    setPlayerShip(null);
    setEnemyShip(null);
    setLastResult(null);
    setGameState('ready');
    resultOpacity.value = 0;
    cardScale.value = 1;
  };

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
  }));

  const resultAnimatedStyle = useAnimatedStyle(() => ({
    opacity: resultOpacity.value,
  }));

  return (
    <LinearGradient
      colors={['#020617', '#0F172A', '#1E293B']}
      style={styles.container}
    >
      {/* CRT Border */}
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
            <Text style={styles.backButtonText}>◄ ABORT</Text>
          </TouchableOpacity>
          
          <View style={styles.chipContainer}>
            <Text style={styles.chipIcon}>⚓</Text>
            <Text style={styles.chipText}>{chips}</Text>
          </View>
        </Animated.View>

        {/* Admiral Section */}
        <Animated.View 
          style={styles.admiralSection}
          entering={FadeInDown.duration(600).delay(100)}
        >
          <DealerPortrait dealer={currentAdmiral} />
          <Text style={styles.admiralRule}>{currentAdmiral.specialRule}</Text>
          <Text style={styles.fleetName}>{currentAdmiral.fleet}</Text>
        </Animated.View>

        {/* Battle Status */}
        <Animated.View 
          style={styles.scoreContainer}
          entering={FadeInDown.duration(600).delay(200)}
        >
          <View style={styles.scoreBox}>
            <Text style={styles.scoreLabel}>ENEMY</Text>
            <Text style={styles.scoreValue}>{enemyWins}</Text>
          </View>
          <View style={styles.roundIndicator}>
            <Text style={styles.roundText}>ENGAGEMENT {round}</Text>
            <Text style={styles.bestOfText}>Best of 5</Text>
          </View>
          <View style={styles.scoreBox}>
            <Text style={styles.scoreLabel}>FLEET</Text>
            <Text style={styles.scoreValue}>{playerWins}</Text>
          </View>
        </Animated.View>

        {/* Ships Area */}
        <Animated.View 
          style={[styles.shipsContainer, cardAnimatedStyle]}
          entering={FadeInDown.duration(600).delay(300)}
        >
          <View style={styles.shipRow}>
            <View style={styles.shipSlot}>
              <Text style={styles.shipLabel}>ENEMY VESSEL</Text>
              {enemyShip && (
                <PlayingCard 
                  ship={enemyShip} 
                  faceDown={gameState === 'dealing'} 
                />
              )}
            </View>
            
            <View style={styles.vsContainer}>
              <Text style={styles.vsText}>⚔️</Text>
              <Text style={styles.vsSubtext}>VS</Text>
            </View>
            
            <View style={styles.shipSlot}>
              <Text style={styles.shipLabel}>YOUR VESSEL</Text>
              {playerShip && (
                <PlayingCard 
                  ship={playerShip} 
                  faceDown={gameState === 'dealing'} 
                />
              )}
            </View>
          </View>
        </Animated.View>

        {/* Battle Result */}
        <Animated.View 
          style={[styles.resultContainer, resultAnimatedStyle]}
        >
          {lastResult && (
            <Text style={[
              styles.resultText,
              lastResult === 'win' && styles.winText,
              lastResult === 'lose' && styles.loseText,
              lastResult === 'tie' && styles.tieText,
            ]}>
              {lastResult === 'win' && '>>> VICTORY <<<'}
              {lastResult === 'lose' && '>>> DEFEATED <<<'}
              {lastResult === 'tie' && '>>> STALEMATE <<<'}
            </Text>
          )}
        </Animated.View>

        {/* Action Button */}
        <Animated.View 
          style={styles.actionContainer}
          entering={FadeInDown.duration(600).delay(400)}
        >
          {gameState === 'gameOver' ? (
            <View style={styles.gameOverContainer}>
              <Text style={styles.gameOverText}>
                {playerWins > enemyWins ? '>>> MISSION SUCCESS <<<' : '>>> MISSION FAILED <<<'}
              </Text>
              <Text style={styles.rewardText}>
                {playerWins > enemyWins 
                  ? `+${currentAdmiral.winReward} CREDITS` 
                  : `-${bet} CREDITS`
                }
              </Text>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={resetGame}
              >
                <Text style={styles.actionButtonText}>► RETRY MISSION</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity 
              style={[
                styles.actionButton,
                gameState !== 'ready' && styles.disabledButton
              ]}
              onPress={playRound}
              disabled={gameState !== 'ready'}
            >
              <Text style={styles.actionButtonText}>
                {gameState === 'ready' ? '► ENGAGE ENEMY' : 'DEPLOYING...'}
              </Text>
            </TouchableOpacity>
          )}
        </Animated.View>
      </View>
    </LinearGradient>
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
  admiralSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  admiralRule: {
    color: '#94A3B8',
    fontSize: 12,
    fontFamily: 'Courier New',
    marginTop: 8,
  },
  fleetName: {
    color: '#FBBF24',
    fontSize: 14,
    fontFamily: 'Courier New',
    fontWeight: '600',
    marginTop: 4,
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 20,
  },
  scoreBox: {
    alignItems: 'center',
  },
  scoreLabel: {
    color: '#64748B',
    fontSize: 10,
    fontFamily: 'Courier New',
    fontWeight: '600',
    marginBottom: 4,
  },
  scoreValue: {
    color: '#FBBF24',
    fontSize: 24,
    fontFamily: 'Courier New',
    fontWeight: '900',
  },
  roundIndicator: {
    alignItems: 'center',
  },
  roundText: {
    color: '#E2E8F0',
    fontSize: 14,
    fontFamily: 'Courier New',
    fontWeight: '700',
  },
  bestOfText: {
    color: '#64748B',
    fontSize: 10,
    fontFamily: 'Courier New',
    marginTop: 2,
  },
  shipsContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  shipRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  shipSlot: {
    alignItems: 'center',
    flex: 1,
  },
  shipLabel: {
    color: '#64748B',
    fontSize: 10,
    fontFamily: 'Courier New',
    fontWeight: '600',
    marginBottom: 12,
  },
  vsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
  },
  vsText: {
    fontSize: 24,
  },
  vsSubtext: {
    color: '#FBBF24',
    fontSize: 12,
    fontFamily: 'Courier New',
    fontWeight: '900',
    letterSpacing: 2,
  },
  resultContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  resultText: {
    fontSize: 18,
    fontFamily: 'Courier New',
    fontWeight: '900',
    letterSpacing: 2,
  },
  winText: {
    color: '#22C55E',
  },
  loseText: {
    color: '#EF4444',
  },
  tieText: {
    color: '#FBBF24',
  },
  actionContainer: {
    paddingHorizontal: 40,
    paddingBottom: 40,
  },
  actionButton: {
    backgroundColor: 'rgba(30, 58, 138, 0.3)',
    borderWidth: 2,
    borderColor: '#FBBF24',
    paddingVertical: 16,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  actionButtonText: {
    color: '#FBBF24',
    fontSize: 16,
    fontFamily: 'Courier New',
    fontWeight: '700',
    letterSpacing: 1,
  },
  gameOverContainer: {
    alignItems: 'center',
  },
  gameOverText: {
    color: '#FBBF24',
    fontSize: 20,
    fontFamily: 'Courier New',
    fontWeight: '900',
    marginBottom: 8,
  },
  rewardText: {
    color: '#E2E8F0',
    fontSize: 14,
    fontFamily: 'Courier New',
    marginBottom: 20,
  },
});