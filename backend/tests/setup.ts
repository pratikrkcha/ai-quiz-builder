import { vi } from 'vitest';

// Forcefully mock the real LLM HTTP calls so CI never hits external networks
vi.mock('../src/services/llmService', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../src/services/llmService')>();
  
  const mockQuestions = [
    { text: 'Mock Q1', options: ['A','B','C','D'], correctIndex: 0 },
    { text: 'Mock Q2', options: ['A','B','C','D'], correctIndex: 1 },
    { text: 'Mock Q3', options: ['A','B','C','D'], correctIndex: 2 },
    { text: 'Mock Q4', options: ['A','B','C','D'], correctIndex: 3 },
    { text: 'Mock Q5', options: ['A','B','C','D'], correctIndex: 0 }
  ];

  return {
    ...actual,
    generateQuestionsRaw: vi.fn().mockResolvedValue(mockQuestions),
    generateQuestions: vi.fn().mockResolvedValue(mockQuestions)
  };
});
