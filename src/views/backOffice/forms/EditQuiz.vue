<script lang="ts" setup>
  import { reactive,watch, computed } from "vue"
  import { useRoute} from "vue-router"
  import {useQuizStore} from "@/stores/quiz"
  import type { Question as QuestionType, Option, CorrectAnswer} from "@/types/quiz"
  import db from "@/firebase/index"
  import { doc, updateDoc} from "firebase/firestore"

  type Level = "basico" | "avanzado" | "intermedio"

  const quizStore = useQuizStore()
  const route = useRoute()

  /**
   * Clase que representa una pregunta dentro de un cuestionario.
   * Implementa la interfaz QuestionType.
   */
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

  /**
   * Identificador del quiz obtenido de los parámetros de la ruta.
   */
  const quizId = route.params.id as string 

  /**
   * Objeto reactivo que gestiona el estado actual del cuestionario.
   */
  const quiz = reactive({
    data: computed(() => quizStore.currentQuiz),
    currentLevel: {
      level: "basico" as Level,
      questions: [] as QuestionType[],
    },
  })

  /**
   * Obtiene los datos del cuestionario basado en el identificador del cuestionario.
   * Carga las preguntas del nivel correspondiente o crea una pregunta por defecto si no hay preguntas disponibles.
   */
  async function getData() {
    if(quizId) {
      await quizStore.getSingleQuiz(quizId)
      if (quiz.data.quizzes.basico) {
        quiz.currentLevel.questions = quiz.data.quizzes.basico.questions
      } else {
        quiz.currentLevel.questions.push(new Question(1))
      }
    }
  }
  getData()

  /**
   * Actualiza el cuestionario en la base de datos.
   * Serializa las preguntas antes de guardarlas.
   */
  async function updateQuiz() {
    if(quizId) {
      const docRef = doc(db, "quizzes", quizId)
      const level = `quizzes.${quiz.currentLevel.level}`
      
      try {
        await updateDoc(docRef, { 
          [level] : { 
            questions: quiz.currentLevel.questions.map(q => serializeQuestion(q))
          } 
        })
      } catch (error) {
        console.error("Error al agregar el quiz:", error)
      }
    }
  }

  /**
   * Añade una nueva pregunta al nivel actual del cuestionario.
   * @param {number} number - El número para la nueva pregunta.
   */
  function addNewQuestion(number: number): void {
    quiz.currentLevel.questions.push(new  Question(number))
  }

  /**
   * Serializa una instancia de la clase Question para su almacenamiento.
   */
  function serializeQuestion(question: Question): object {
    return { ...question }
  }

  /**
   * Observador que actualiza las preguntas del cuestionario cuando cambia el nivel actual.
   * Carga preguntas del nivel especificado o crea una pregunta por defecto si no hay preguntas disponibles.
   */
  watch(() => quiz.currentLevel.level,(level) => {
    if(level) {
      const quizData = quiz.data.quizzes[level]
      if(quizData && quizData.questions.length != 0) {
        quiz.currentLevel.questions = quizData.questions
      } else {
        quiz.currentLevel.questions = [new Question(1)]
      }
    }
  })
</script>

<template>
  <div class="container my-4">
    <form style="max-width: 600px; margin: auto;" v-if="quiz.currentLevel.questions.length">
      <!-- NOMBRE QUIZ -->
      <div class="d-flex align-items-center mb-4">
        <h1 class="fw-bold">Editar quiz {{ quiz.data.displayName }}</h1>
        <img class="img-fluid ms-2" style="max-width: 40px;" :src="quiz.data.icon"/>
      </div>
      <!-- NIVELES -->
      <div class="mb-3">
        <label for="" class="form-label">Nivel </label>
        <select class="form-select" v-model="quiz.currentLevel.level">
          <option value="" disabled selected>Seleccionar Nivel</option>
          <option value="basico">Basico</option>
          <option value="intermedio">Intermedio</option>
          <option value="avanzado">Avanzado</option>
        </select>
      </div>
      <!-- PREGUNTAS -->
      <div class="mb-3" v-for="(question) in quiz.currentLevel.questions">
        <details>
          <!-- NUMERO PREGUNTA -->
          <summary style="user-select: none;" class="py-4 pb-0"><strong>Pregunta {{ question.number }}</strong></summary>
          <!-- PREGUNTA -->
          <div class="mt-4">
            <label class="form-label">Pregunta <span class="text-danger">*</span></label>
            <input class="form-control" type="text" v-model="question.question"/>
            <span class="text-danger small" v-if="!question.question">Debes completar este campo</span>
          </div>
          <!-- OPCIONES -->
          <div class="mt-4" v-for="(option) in question.options">
            <label class="form-label small" for="">Opción {{ option.number }} <span class="text-danger">*</span></label>
            <input class="form-control" v-model="option.data" type="text">
            <span class="text-danger small" v-if="!option.data">Debes completar este campo</span>
          </div>
          <!-- OPCION CORRECTA-->
          <div class="mt-4">
            <label class="form-label">Seleccionar opción correcta <span class="text-danger">*</span></label>
            <div class="form-check mb-2" v-for="(i) in 4">
              <input 
                class="form-check-input"
                :checked="i == question.correctAnswer.number"
                v-model="question.correctAnswer.number"
                type="radio" 
                :value="i" 
                :name="`correctAnswer_${question.number}`" 
                :id="`correctAnswer_${question.number}_${i}`">
              <label class="form-check-label" :for="`correctAnswer_${question.number}_${i}`">
                Opcion {{ i }} 
              </label>
            </div>
            <span class="text-danger small" v-if="!question.correctAnswer.number">Debes completar este campo</span>
          </div>

          <!-- EXPLICACIÓN OPCION CORRECTA -->
          <div class="mt-4">
            <label class="form-label">Explicación detallada <span class="text-danger">*</span></label>
            <textarea class="form-control" rows="3" v-model="question.correctAnswer.explanation"></textarea>
            <span class="text-danger small" v-if="!question.correctAnswer.explanation">Debes completar este campo</span>
          </div>
          <!-- CODIGO EJEMPLO-->
          <div class="mt-4">
            <label for="" class="form-label">Ejemplo Codigo</label>
            <textarea class="form-control" rows="3" v-model="question.correctAnswer.codeExample"></textarea>
          </div>
        </details>
        <hr class="my-4">
      </div>
      <div class="d-flex justify-content-end mb-4 ">
        <button @click.prevent="addNewQuestion(quiz.currentLevel.questions.length + 1)" class="btn btn-dark">
          Añadir pregunta <i class="fas fa-plus"></i>
        </button>
      </div>
      <div class="d-flex justify-content-end">
        <button @click.prevent="updateQuiz" type="submit" class="btn btn-primary">Guardar Cambios</button>
      </div>
    </form>
  </div>
</template>

<style>
</style>