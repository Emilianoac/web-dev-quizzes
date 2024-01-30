<script lang="ts" setup>
  import { reactive,watch } from "vue"
  import { useRoute} from "vue-router"
  import type { Question as QuestionType, Option, CorrectAnswer, Quiz, Category} from "@/types/quiz"
  import { isQuizCategory } from "@/type-guards/IsquizCategory"
  import db from "@/firebase/index"
  import { doc, updateDoc, getDoc } from "firebase/firestore"

  import { HighCode } from "vue-highlight-code"
  import "vue-highlight-code/dist/style.css"

  const route = useRoute()

  class Question implements QuestionType {
    number: number;
    question: string = "";
    options: Option[] =  [
      { number: 1, data: ""},
      { number: 2, data: ""},
      { number: 3, data: ""},
      { number: 4, data: ""}
    ];
    correctAnswer: CorrectAnswer  = {
      explanation: "",
      number: 0,
      codeExample: null,
    };

    constructor(number: number) {
      this.number = number
    }
  }

  const categoryID = route.params.id as string | undefined
  const categoryData = reactive<Category>({
    displayName: "",
    category: "",
    id: "",
    icon: "",
    description: "",
    quizzes: {
      basico: null ,
      intermedio: null,
      avanzado: null,
    }
  })
  const quiz = reactive<Quiz>({
    name: "",
    level: "basico",
    questions: [] as QuestionType[],
  })

  async function getData() {
    if(categoryID) {
      try {
        const docRef = doc(db, "quizzes", categoryID)
        const docSnap = await getDoc(docRef)
        
        if (docSnap.exists() && isQuizCategory(docSnap.data())) {
          const docData = docSnap.data() as Category
  
          quiz.name = docData.displayName
  
          const quizData = docData.quizzes
          if (quizData) {
            categoryData.quizzes = quizData
  
            if (quizData.basico) {
              quiz.questions = quizData.basico.questions
            } else {
              quiz.questions.push( new Question(1))
            }
          }
        } else {
          throw new Error("Falló la verificación de datos")
        }
      } catch(err) {
      }
    }
  }
  getData()

  async function saveQuiz() {
    const docRef = doc(db, "quizzes", "vue")
    const level = `quizzes.${quiz.level}`
    
    try {
      await updateDoc(docRef, {
        [level] : {
          name: quiz.name,
          level: quiz.level,
          questions: quiz.questions.map(q => serializeQuestion(q))    
        } 
      })
      console.log("Quiz agregado con éxito al array.")
    } catch (error) {
      console.error("Error al agregar el quiz:", error)
    }
  }

  function addNewQuestion(number: number): void {
    quiz.questions.push(new  Question(number))
  }

  function serializeQuestion(question: Question) {
    return { ...question }
  }

  watch(() => quiz.level,(level) => {
    if(level) {
      const quizData = categoryData.quizzes[level]
      if(quizData) {
        quiz.questions = quizData.questions
      }
    }
  })
</script>

<template>
  <div class="container my-4">
    <form style="max-width: 600px; margin: auto;" v-if="quiz.questions.length">
      <h1 class="fw-bold mb-4">Editar quiz {{ quiz.name }}</h1>
      <div class="mb-3">
        <label for="" class="form-label">Nivel </label>
        <select class="form-select" v-model="quiz.level">
          <option value="" disabled selected>Seleccionar Nivel</option>
          <option value="basico">Basico</option>
          <option value="intermedio">Intermedio</option>
          <option value="avanzado">Avanzado</option>
        </select>
      </div>
      <div class="mb-3" v-for="(question) in quiz.questions">
        <details>
          <summary class="py-4"><strong>Pregunta {{ question.number }}</strong></summary>
          <div class="mt-4">
            <label class="form-label">Pregunta</label>
            <input class="form-control"  type="text" v-model="question.question">
          </div>
  
          <div class="mt-4" v-for="(option) in question.options">
            <label class="form-label small" for="">Opción {{ option.number }}</label>
            <input class="form-control" v-model="option.data" type="text">
          </div>
          <!-- OPCION CORRECTA-->
          <div class="mt-4">
            <label class="form-label small">Opción correcta</label>
            <input class="form-control" type="number" v-model="question.correctAnswer.number">
          </div>
          <!-- EXPLICACIÓN OPCION CORRECTA -->
          <div class="mt-4">
            <label for="" class="form-label">Explicación detallada</label>
            <textarea class="form-control" rows="3" v-model="question.correctAnswer.explanation"></textarea>
          </div>
          <!-- CODIGO EJEMPLO-->
          <div class="mt-4">
            <label for="" class="form-label">Ejemplo Codigo</label>
            <textarea class="form-control" rows="3" v-model="question.correctAnswer.codeExample"></textarea>
          </div>
          <HighCode 
            :textEditor="true"  
            width="100%"  
            class="code mt-4" 
            :codeValue="question.correctAnswer.codeExample" 
            theme="dark">
          </HighCode>
        </details>
        <hr class="my-4">
      </div>
      <div class="d-flex justify-content-end mb-4 ">
        <button @click.prevent="addNewQuestion(quiz.questions.length + 1)" class="btn btn-dark">Añadir pregunta <i class="fas fa-plus"></i></button>
      </div>
      <div class="d-flex justify-content-end">
        <button @click.prevent="saveQuiz" type="submit" class="btn btn-primary">GuardarCambios</button>
      </div>
    </form>
  </div>
</template>

<style>
</style>@/type-guards/IsquizCategory@/types/quiz