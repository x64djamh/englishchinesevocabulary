import React from 'react';
import { BookOpen, GraduationCap, Trophy } from 'lucide-react';
import { DifficultyConfig } from '../types';
import { difficultyConfigs } from '../data/difficultyConfig';

interface DifficultySelectorProps {
  selectedDifficulty: 'beginner' | 'intermediate' | 'advanced';
  onDifficultyChange: (difficulty: 'beginner' | 'intermediate' | 'advanced') => void;
}

const DifficultySelector: React.FC<DifficultySelectorProps> = ({
  selectedDifficulty,
  onDifficultyChange
}) => {
  const getIcon = (level: string) => {
    switch (level) {
      case 'beginner':
        return <BookOpen className="h-6 w-6" />;
      case 'intermediate':
        return <GraduationCap className="h-6 w-6" />;
      case 'advanced':
        return <Trophy className="h-6 w-6" />;
      default:
        return <BookOpen className="h-6 w-6" />;
    }
  };

  const getColorClasses = (config: DifficultyConfig, isSelected: boolean) => {
    const baseClasses = "transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4";
    
    if (isSelected) {
      switch (config.color) {
        case 'green':
          return `${baseClasses} bg-green-500 text-white border-2 border-green-500 focus:ring-green-200`;
        case 'blue':
          return `${baseClasses} bg-blue-500 text-white border-2 border-blue-500 focus:ring-blue-200`;
        case 'purple':
          return `${baseClasses} bg-purple-500 text-white border-2 border-purple-500 focus:ring-purple-200`;
        default:
          return `${baseClasses} bg-gray-500 text-white border-2 border-gray-500 focus:ring-gray-200`;
      }
    } else {
      switch (config.color) {
        case 'green':
          return `${baseClasses} bg-white text-green-600 border-2 border-green-200 hover:border-green-300 hover:bg-green-50 focus:ring-green-200`;
        case 'blue':
          return `${baseClasses} bg-white text-blue-600 border-2 border-blue-200 hover:border-blue-300 hover:bg-blue-50 focus:ring-blue-200`;
        case 'purple':
          return `${baseClasses} bg-white text-purple-600 border-2 border-purple-200 hover:border-purple-300 hover:bg-purple-50 focus:ring-purple-200`;
        default:
          return `${baseClasses} bg-white text-gray-600 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 focus:ring-gray-200`;
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
      <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        选择难度 Choose Difficulty
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {difficultyConfigs.map((config) => (
          <button
            key={config.level}
            onClick={() => onDifficultyChange(config.level)}
            className={`p-6 rounded-xl ${getColorClasses(config, selectedDifficulty === config.level)}`}
          >
            <div className="flex flex-col items-center space-y-3">
              {getIcon(config.level)}
              <div className="text-center">
                <h4 className="text-lg font-bold">{config.name}</h4>
                <p className="text-sm opacity-90 mt-1">{config.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DifficultySelector;