<script lang="ts" setup>
  import {reactive} from "vue"

  interface Question {
    number: number
    question: string
    options: string[]
    correctAnswer: number
  }

  const quiz = reactive({
    questions: [
      {
        number: 1,
        question: `¿Pregunta 1?`,
        options: [
          "Opcion 1.",
          "Opcion 2.",
          "Opcion 3.",
          "Opcion 4."
        ],
        correctAnswer: 1
      },
      {
        number: 2,
        question: `¿Pregunta 2.`,
        options: [
          "Opcion 1.",
          "Opcion 2.",
          "Opcion 3.",
          "Opcion 4."
        ],
        correctAnswer: 4
      },
    ] as Question[],
    currentQuestion: null as Question | null,
    userAnswer: null as number | null,
    setCurrentQuestion: function(answerPos: number): void {
      if (typeof answerPos == "number") {
        this.currentQuestion = this.questions[answerPos]
      }
    },
    checkAnswer: function():void {
      if (this.userAnswer) {
        if (this.userAnswer == this.currentQuestion?.correctAnswer) {
          alert("Correcto")
        } else {
          alert("Incorrecto")
        }
      } else {
        alert("Por favor seleccione una alternativa.")
      }
    }
  })
  quiz.setCurrentQuestion(0)
  
</script>

<template>
  <div class="container my-5">
    <div class="quiz" v-if="quiz.currentQuestion">
      <div class="d-flex justify-content-end">{{ quiz.currentQuestion.number }} / {{ quiz.questions.length }}</div>
      <h1 class="quiz__pregunta">{{ quiz.currentQuestion.number }}. {{ quiz.currentQuestion.question }}</h1>
      <ul class="quiz__opciones list-unstyled mt-4">
        <li v-for="(answer,i) in quiz.currentQuestion.options">
         <input v-model="quiz.userAnswer" :value="`${i + 1}`" type="radio" name="answer" :id="`answer${i}`"> 
         <label :for="`answer${i}`"><strong>{{ i + 1 }}.</strong>  {{ answer }}</label>
        </li>
      </ul>
      <div class="d-flex justify-content-end">
        <button class="btn btn-primary me-2" @click="quiz.checkAnswer">Verificar Respuesta</button>
        <button class="btn btn-primary" @click="quiz.setCurrentQuestion(1)">Siguiente pregunta</button>
      </div>
    </div>
  </div>
</template>

<style lang="scss">


  .quiz {
    background: white;
    padding: 2em;
    border-radius: 8px;
    max-width: 900px;
    margin: auto;

    &__pregunta {
      font-weight: 700;
      font-size: 1.4em;
    }

    &__opciones {
      
      li {
        display: flex;
        align-items: center;
        padding: 0 0.5em;
        
        label,input {
          padding: 1em;
          display: block;
          cursor: pointer;
        }

        label {
          width: 100%;
        }

        input {
          width: 20px;
          height: 20px;
      
        }
        
        &:hover {
          background-color: #faf8f8;
        }
      }
    }
  }
</style>