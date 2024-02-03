import type {Quiz} from "@/types/quiz"

export function isQuiz(object: any): object is Quiz{
  return (
    typeof object === "object" &&
    "category" in object &&
    "displayName" in object &&
    "icon" in object &&
    "description" in object &&
    "quizzes" in object &&
    "id" in object
  );
}