export interface Category {
  id: string;
  category: string,
  displayName: string;
  description: string;
  icon: string;
  quizzes: {
    basico: Quiz | null,
    intermedio: Quiz | null;
    avanzado: Quiz | null
  }
}

export interface Quiz {
  name: string;
  level: "basico" | "intermedio" | "avanzado";
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


