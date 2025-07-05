export interface Vocabulary {
  english: string;
  chinese: string;
  pronunciation?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface GameState {
  currentWord: Vocabulary;
  options: string[];
  score: number;
  total: number;
  isAnswered: boolean;
  selectedAnswer: string | null;
  feedback: 'correct' | 'incorrect' | null;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface DifficultyConfig {
  level: 'beginner' | 'intermediate' | 'advanced';
  name: string;
  description: string;
  color: string;
  optionsCount: number;
  timeLimit?: number;
}