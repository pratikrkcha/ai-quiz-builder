import { Request, Response, NextFunction } from 'express';
import { QuizGenerationError } from '../services/llmService';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('[Express Error]', err.stack || err.message);

  // Handle LLM specific errors
  if (err instanceof QuizGenerationError) {
    const status = err.isSecurityIssue ? 400 : 422;
    return res.status(status).json({
      error: err.isSecurityIssue 
        ? 'Invalid topic or prompt injection detected.' 
        : 'Failed to generate quiz content.'
    });
  }

  // Generic fallback: never leak internal stack traces to the client in production
  res.status(500).json({ error: 'Internal Server Error' });
};
