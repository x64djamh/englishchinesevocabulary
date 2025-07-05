import { DifficultyConfig } from '../types';

export const difficultyConfigs: DifficultyConfig[] = [
  {
    level: 'beginner',
    name: '初级 Beginner',
    description: '基础日常词汇，4个选项',
    color: 'green',
    optionsCount: 4
  },
  {
    level: 'intermediate', 
    name: '中级 Intermediate',
    description: '常用词汇和短语，4个选项',
    color: 'blue',
    optionsCount: 4
  },
  {
    level: 'advanced',
    name: '高级 Advanced', 
    description: '大学学术词汇，6个选项',
    color: 'purple',
    optionsCount: 6
  }
];

export function getDifficultyConfig(level: 'beginner' | 'intermediate' | 'advanced'): DifficultyConfig {
  return difficultyConfigs.find(config => config.level === level) || difficultyConfigs[0];
}