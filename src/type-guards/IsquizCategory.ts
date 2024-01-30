import type {Category} from "@/types/quiz"

export function isQuizCategory(object: any): object is Category {
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