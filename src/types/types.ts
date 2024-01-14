export interface Quiz {
  questions: Question[];
  isActive: boolean;
  currentQuestion: number;
  answer: {
    userAnswer: number | null;
    correctAnswer: number | null;
    userAnswerIsCorrect: boolean;
    history: number[]
  };
  progressPercentage: number;
  checkAnswer: () => void;
  setCurrentQuestion: () => void;
}

export interface Question {
  number: number;
  question: string;
  options: Option[];
  correctAnswer: {
    number: number,
    explanation: string,
  };
  codeExample: string | null;
}

export interface Option {
  number: number,
  data: string
}