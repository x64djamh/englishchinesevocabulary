import React, { useState, useEffect } from 'react';
import { Volume2, RotateCcw, Award, Target, Settings } from 'lucide-react';
import { GameState, Vocabulary } from '../types';
import { getRandomWord, generateOptions } from '../data/vocabulary';
import { getDifficultyConfig } from '../data/difficultyConfig';
import DifficultySelector from './DifficultySelector';

const VocabularyGame: React.FC = () => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [showDifficultySelector, setShowDifficultySelector] = useState(true);
  const [gameState, setGameState] = useState<GameState>({
    currentWord: getRandomWord('beginner'),
    options: [],
    score: 0,
    total: 0,
    isAnswered: false,
    selectedAnswer: null,
    feedback: null,
    difficulty: 'beginner'
  });

  const [isLoading, setIsLoading] = useState(false);

  // Generate options when currentWord or difficulty changes
  useEffect(() => {
    const difficultyConfig = getDifficultyConfig(selectedDifficulty);
    const options = generateOptions(gameState.currentWord.chinese, selectedDifficulty, difficultyConfig.optionsCount);
    setGameState(prev => ({ ...prev, options, difficulty: selectedDifficulty }));
  }, [gameState.currentWord, selectedDifficulty]);

  const speakWord = (word: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      utterance.volume = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const handleDifficultyChange = (difficulty: 'beginner' | 'intermediate' | 'advanced') => {
    setSelectedDifficulty(difficulty);
    const newWord = getRandomWord(difficulty);
    setGameState(prev => ({
      ...prev,
      currentWord: newWord,
      difficulty,
      isAnswered: false,
      selectedAnswer: null,
      feedback: null
    }));
    setShowDifficultySelector(false);
  };

  const handleAnswerSelect = (selectedAnswer: string) => {
    if (gameState.isAnswered) return;

    const isCorrect = selectedAnswer === gameState.currentWord.chinese;
    
    setGameState(prev => ({
      ...prev,
      isAnswered: true,
      selectedAnswer,
      feedback: isCorrect ? 'correct' : 'incorrect',
      score: isCorrect ? prev.score + 1 : prev.score,
      total: prev.total + 1
    }));
  };

  const nextWord = () => {
    setIsLoading(true);
    
    // Add a small delay for better UX
    setTimeout(() => {
      const newWord = getRandomWord(selectedDifficulty);
      setGameState(prev => ({
        ...prev,
        currentWord: newWord,
        isAnswered: false,
        selectedAnswer: null,
        feedback: null
      }));
      setIsLoading(false);
    }, 300);
  };

  const resetGame = () => {
    const newWord = getRandomWord(selectedDifficulty);
    setGameState({
      currentWord: newWord,
      options: [],
      score: 0,
      total: 0,
      isAnswered: false,
      selectedAnswer: null,
      feedback: null,
      difficulty: selectedDifficulty
    });
  };

  const getScorePercentage = () => {
    return gameState.total > 0 ? Math.round((gameState.score / gameState.total) * 100) : 0;
  };

  const getButtonStyle = (option: string) => {
    if (!gameState.isAnswered) {
      return "bg-white hover:bg-blue-50 border-2 border-gray-200 hover:border-blue-300 text-gray-800 transition-all duration-200 transform hover:scale-105";
    }
    
    if (option === gameState.currentWord.chinese) {
      return "bg-green-500 border-2 border-green-500 text-white";
    }
    
    if (option === gameState.selectedAnswer && gameState.feedback === 'incorrect') {
      return "bg-red-500 border-2 border-red-500 text-white";
    }
    
    return "bg-gray-100 border-2 border-gray-200 text-gray-500";
  };

  const getDifficultyColor = () => {
    switch (selectedDifficulty) {
      case 'beginner':
        return 'text-green-600';
      case 'intermediate':
        return 'text-blue-600';
      case 'advanced':
        return 'text-purple-600';
      default:
        return 'text-gray-600';
    }
  };

  const getDifficultyName = () => {
    const config = getDifficultyConfig(selectedDifficulty);
    return config.name;
  };

  if (showDifficultySelector) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              English-Chinese Vocabulary
            </h1>
            <p className="text-gray-600">Test your knowledge of Chinese translations</p>
          </div>
          <DifficultySelector
            selectedDifficulty={selectedDifficulty}
            onDifficultyChange={handleDifficultyChange}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            English-Chinese Vocabulary
          </h1>
          <div className="flex items-center justify-center space-x-4">
            <p className="text-gray-600">Test your knowledge of Chinese translations</p>
            <button
              onClick={() => setShowDifficultySelector(true)}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-200 flex items-center space-x-2"
            >
              <Settings className="h-4 w-4" />
              <span>Change Difficulty</span>
            </button>
          </div>
          <div className={`mt-2 text-lg font-semibold ${getDifficultyColor()}`}>
            Current Level: {getDifficultyName()}
          </div>
        </div>

        {/* Score Display */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-center space-x-8">
            <div className="flex items-center space-x-2">
              <Award className="h-6 w-6 text-yellow-500" />
              <span className="text-xl font-semibold text-gray-800">
                Score: {gameState.score}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Target className="h-6 w-6 text-blue-500" />
              <span className="text-xl font-semibold text-gray-800">
                Total: {gameState.total}
              </span>
            </div>
            {gameState.total > 0 && (
              <div className="flex items-center space-x-2">
                <div className="text-xl font-semibold text-gray-800">
                  Accuracy: {getScorePercentage()}%
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Game Area */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          {/* English Word Display */}
          <div className="text-center mb-8">
            <div className="mb-4">
              <h2 className="text-6xl font-bold text-gray-800 mb-4 tracking-wide break-words">
                {gameState.currentWord.english}
              </h2>
              <button
                onClick={() => speakWord(gameState.currentWord.english)}
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-4 transition-all duration-200 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-200"
                aria-label="Pronounce word"
              >
                <Volume2 className="h-6 w-6" />
              </button>
            </div>
            <p className="text-gray-600 text-lg">
              Choose the correct Chinese translation:
            </p>
          </div>

          {/* Answer Options */}
          <div className={`grid gap-4 mb-8 ${
            gameState.options.length <= 4 
              ? 'grid-cols-1 md:grid-cols-2' 
              : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
          }`}>
            {gameState.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(option)}
                disabled={gameState.isAnswered}
                className={`p-6 rounded-xl text-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-200 ${getButtonStyle(option)}`}
              >
                {option}
              </button>
            ))}
          </div>

          {/* Feedback and Next Button */}
          {gameState.isAnswered && (
            <div className="text-center">
              <div className={`mb-6 p-4 rounded-xl ${
                gameState.feedback === 'correct' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                <p className="text-xl font-semibold">
                  {gameState.feedback === 'correct' ? '🎉 Correct!' : '❌ Incorrect'}
                </p>
                <p className="text-lg mt-2">
                  The correct answer is: <span className="font-bold">{gameState.currentWord.chinese}</span>
                </p>
              </div>
              
              <button
                onClick={nextWord}
                disabled={isLoading}
                className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-xl text-lg font-semibold transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:opacity-50"
              >
                {isLoading ? 'Loading...' : 'Next Word →'}
              </button>
            </div>
          )}
        </div>

        {/* Reset Button */}
        <div className="text-center">
          <button
            onClick={resetGame}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-200 flex items-center space-x-2 mx-auto"
          >
            <RotateCcw className="h-5 w-5" />
            <span>Reset Game</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VocabularyGame;