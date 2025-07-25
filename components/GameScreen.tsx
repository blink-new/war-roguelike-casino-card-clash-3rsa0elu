import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  FadeInDown, 
  FadeInUp, 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withSequence,
  withDelay
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

interface Card {
  suit: '♠' | '♥' | '♦' | '♣';
  value: number;
  display: string;
}

const suits = ['♠', '♥', '♦', '♣'] as const;
const values = [
  { value: 2, display: '2' },
  { value: 3, display: '3' },
  { value: 4, display: '4' },
  { value: 5, display: '5' },
  { value: 6, display: '6' },
  { value: 7, display: '7' },
  { value: 8, display: '8' },
  { value: 9, display: '9' },
  { value: 10, display: '10' },
  { value: 11, display: 'J' },
  { value: 12, display: 'Q' },
  { value: 13, display: 'K' },
  { value: 14, display: 'A' },
];

const dealers = [
  {
    name: 'Rookie Rick',
    avatar: '🤠',
    difficulty: 1,
    specialRule: 'Standard War rules',
    winReward: 25,
  },
  {
    name: 'Lady Luck',
    avatar: '💃',
    difficulty: 2,
    specialRule: 'Ties go to dealer',
    winReward: 40,
  },
  {
    name: 'High Roller',
    avatar: '🎩',
    difficulty: 3,
    specialRule: 'Only face cards',
    winReward: 60,
  },
];

export function GameScreen({ onNavigate, chips, setChips }: GameScreenProps) {
  const [gameState, setGameState] = useState<GameState>('ready');
  const [currentDealer] = useState(dealers[0]);
  const [playerCard, setPlayerCard] = useState<Card | null>(null);
  const [dealerCard, setDealerCard] = useState<Card | null>(null);
  const [playerWins, setPlayerWins] = useState(0);
  const [dealerWins, setDealerWins] = useState(0);
  const [round, setRound] = useState(1);
  const [lastResult, setLastResult] = useState<'win' | 'lose' | 'tie' | null>(null);
  const [bet] = useState(10);

  const cardScale = useSharedValue(1);
  const resultOpacity = useSharedValue(0);

  const generateCard = (): Card => {
    const suit = suits[Math.floor(Math.random() * suits.length)];
    const valueData = values[Math.floor(Math.random() * values.length)];
    return {
      suit,
      value: valueData.value,
      display: valueData.display,
    };
  };

  const playRound = () => {
    if (gameState !== 'ready') return;
    
    setGameState('dealing');
    cardScale.value = withSpring(1.1);
    
    setTimeout(() => {
      const pCard = generateCard();
      const dCard = generateCard();
      
      setPlayerCard(pCard);
      setDealerCard(dCard);
      setGameState('revealing');
      
      setTimeout(() => {
        let result: 'win' | 'lose' | 'tie';
        
        if (pCard.value > dCard.value) {
          result = 'win';
          setPlayerWins(prev => prev + 1);
        } else if (pCard.value < dCard.value) {
          result = 'lose';
          setDealerWins(prev => prev + 1);
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
            // Player wins the match
            setChips(prev => prev + currentDealer.winReward);
            setGameState('gameOver');
          } else if (dealerWins + (result === 'lose' ? 1 : 0) >= 3) {
            // Dealer wins the match
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
    setDealerWins(0);
    setRound(1);
    setPlayerCard(null);
    setDealerCard(null);
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
        
        <View style={styles.chipContainer}>
          <Text style={styles.chipIcon}>🪙</Text>
          <Text style={styles.chipText}>{chips}</Text>
        </View>
      </Animated.View>

      {/* Dealer Section */}
      <Animated.View 
        style={styles.dealerSection}
        entering={FadeInDown.duration(600).delay(100)}
      >
        <DealerPortrait dealer={currentDealer} />
        <Text style={styles.dealerRule}>{currentDealer.specialRule}</Text>
      </Animated.View>

      {/* Score Tracker */}
      <Animated.View 
        style={styles.scoreContainer}
        entering={FadeInDown.duration(600).delay(200)}
      >
        <View style={styles.scoreBox}>
          <Text style={styles.scoreLabel}>DEALER</Text>
          <Text style={styles.scoreValue}>{dealerWins}</Text>
        </View>
        <View style={styles.roundIndicator}>
          <Text style={styles.roundText}>ROUND {round}</Text>
          <Text style={styles.bestOfText}>Best of 5</Text>
        </View>
        <View style={styles.scoreBox}>
          <Text style={styles.scoreLabel}>YOU</Text>
          <Text style={styles.scoreValue}>{playerWins}</Text>
        </View>
      </Animated.View>

      {/* Cards Area */}
      <Animated.View 
        style={[styles.cardsContainer, cardAnimatedStyle]}
        entering={FadeInDown.duration(600).delay(300)}
      >
        <View style={styles.cardRow}>
          <View style={styles.cardSlot}>
            <Text style={styles.cardLabel}>DEALER</Text>
            {dealerCard && (
              <PlayingCard 
                card={dealerCard} 
                faceDown={gameState === 'dealing'} 
              />
            )}
          </View>
          
          <View style={styles.vsContainer}>
            <Text style={styles.vsText}>VS</Text>
          </View>
          
          <View style={styles.cardSlot}>
            <Text style={styles.cardLabel}>YOU</Text>
            {playerCard && (
              <PlayingCard 
                card={playerCard} 
                faceDown={gameState === 'dealing'} 
              />
            )}
          </View>
        </View>
      </Animated.View>

      {/* Result Display */}
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
            {lastResult === 'win' && 'YOU WIN!'}
            {lastResult === 'lose' && 'DEALER WINS'}
            {lastResult === 'tie' && 'TIE!'}
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
              {playerWins > dealerWins ? 'VICTORY!' : 'DEFEAT'}
            </Text>
            <Text style={styles.rewardText}>
              {playerWins > dealerWins 
                ? `+${currentDealer.winReward} chips` 
                : `-${bet} chips`
              }
            </Text>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={resetGame}
            >
              <Text style={styles.actionButtonText}>PLAY AGAIN</Text>
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
              {gameState === 'ready' ? 'DRAW CARDS' : 'DEALING...'}
            </Text>
          </TouchableOpacity>
        )}
      </Animated.View>
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
  dealerSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  dealerRule: {
    color: '#CCCCCC',
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 8,
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
    color: '#888888',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  scoreValue: {
    color: '#FFD700',
    fontSize: 24,
    fontWeight: '900',
  },
  roundIndicator: {
    alignItems: 'center',
  },
  roundText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  bestOfText: {
    color: '#888888',
    fontSize: 12,
    marginTop: 2,
  },
  cardsContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardSlot: {
    alignItems: 'center',
    flex: 1,
  },
  cardLabel: {
    color: '#888888',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 12,
  },
  vsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
  },
  vsText: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 2,
  },
  resultContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  resultText: {
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 2,
  },
  winText: {
    color: '#00FF00',
  },
  loseText: {
    color: '#FF4444',
  },
  tieText: {
    color: '#FFD700',
  },
  actionContainer: {
    paddingHorizontal: 40,
    paddingBottom: 40,
  },
  actionButton: {
    backgroundColor: '#8B0000',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  disabledButton: {
    opacity: 0.5,
  },
  actionButtonText: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1,
  },
  gameOverContainer: {
    alignItems: 'center',
  },
  gameOverText: {
    color: '#FFD700',
    fontSize: 28,
    fontWeight: '900',
    marginBottom: 8,
  },
  rewardText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 20,
  },
});