export interface Quiz {
  id: string;
  category: string,
  displayName: string;
  description: string;
  icon: string;
  quizzes: {
    basico: Questions | null,
    intermedio: Questions | null;
    avanzado: Questions | null
  }
}

export interface Questions {
  questions: Question[]
}

export interface Question {
  number: number;
  question: string;
  options: Option[];
  correctAnswer: CorrectAnswer;
}

export interface Option {
  number: number;
  data: string
}

export interface CorrectAnswer {
  number: number;
  explanation: string;
  codeExample: string | null
}


