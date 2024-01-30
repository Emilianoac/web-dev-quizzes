<script lang="ts" setup>
  import {reactive, watch, computed} from "vue"
  import {useQuizStore} from "@/stores/quiz"
  import { onBeforeRouteLeave, useRoute } from "vue-router"
  import type {Question} from "@/types/quiz"
  import { HighCode } from "vue-highlight-code"
  import "vue-highlight-code/dist/style.css"

  type Level = 0 | "basico" | "intermedio" | "avanzado"

  const route = useRoute()
  const quizStore = useQuizStore()

  const quizCategory = computed(() => quizStore.currentCategory) 
  const currentQuiz = reactive({
    level: 0 as Level,
    isActive: false,
    questions: [] as Question[],
    currentQuestion: 0,
    answer: {
      userAnswer: null as number | null ,
      correctAnswer: null as number | null,
      userAnswerIsCorrect: false,
      history: [] as number[]
    },
    progressPercentage: 0,
    checkAnswer: function() {
      if (this.answer.userAnswer) {
        this.answer.history.push(this.answer.userAnswer)
        this.answer.correctAnswer = this.questions[this.currentQuestion].correctAnswer.number

        if (this.answer.userAnswer == this.answer.correctAnswer) {
          this.answer.userAnswerIsCorrect = true
        } else {
          this.answer.userAnswerIsCorrect = false
        }

        setTimeout(() => {
          this.setCurrentQuestion()
          this.answer.userAnswer = null
          this.answer.correctAnswer = null
          this.answer.userAnswerIsCorrect = false
        }, 1000)

      } else {
        alert("Por favor seleccione una alternativa.")
      }
    },
    setCurrentQuestion: function() {
      if (this.answer.userAnswer) {
        if (this.currentQuestion < this.questions.length - 1) {
          this.currentQuestion ++
          this.progressPercentage = this.currentQuestion / (this.questions.length -1) * 100
        } else {
          this.progressPercentage = (this.questions.length -1) / (this.questions.length -1) * 100
          this.isActive = false
        }
      } else {
        alert("Debe responder la pregunta para continuar")
      }
    }
  })  

  async function getData() {
    await quizStore.getSingleCategory(route.params.id as string )
  }
  getData()

  function handleBeforeUnload(event: BeforeUnloadEvent) {
    const message = "Si sales de esta página, perderás tu progreso. ¿Estás seguro de que quieres salir?"
    event.preventDefault()
    event.returnValue = message
    return message
  }

  onBeforeRouteLeave((_to , _from, next) => {
    if (currentQuiz.isActive) {
      const answer = window.confirm("Si sales de esta página, perderás tu progreso. ¿Estás seguro de que quieres salir?")
      if (answer) {
        next(true)
      } else {
        next(false)
      }
    } else {
      next(true)
    }
  })

  watch(() => currentQuiz.isActive, (newV) => {
    if (newV) {
      window.addEventListener("beforeunload", handleBeforeUnload)
    } else {
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  })

  function setLevel(level: Level ) {
    if(typeof(level) != "number") {
      let selectedLevel = quizCategory.value.quizzes[level]
      if(selectedLevel) {
        currentQuiz.questions = selectedLevel.questions
        currentQuiz.isActive = true
      }
    }
  }
</script>

<template>
  <Debug :data="currentQuiz"/> 
  <main class="main-quiz p-3 p-md-5" v-if="quizCategory">
    <div class="container">
      <!--BIENVENIDA QUIZ-->
      <div v-if="!currentQuiz.isActive && !currentQuiz.answer.history.length">
        <div class="quiz quiz_bienvenida">
          <img class="quiz-icono img-fluid" :src="quizCategory.icon"/>
          <h1 class="mt-4 fw-bold">{{ quizCategory.displayName }}</h1>
          <p>Bienvenido al Desafío de Conocimientos sobre {{ quizCategory.displayName }}. Este quiz está pensado para evaluar 
            tu comprensión de los conceptos clave en el desarrollo con {{ quizCategory.displayName }}
          </p>   
          <div class="d-flex justify-content-center">
          </div>
        </div>
        <div class="row">
          <div class="mb-3 mt-3">
            <label for="" class="form-label d-block text-center">
              <strong>Selecciona un nivel de dificutad</strong>
            </label>
            <select 
              class="form-select" 
              v-model="currentQuiz.level"
              style="max-width: 400px; margin: auto;">
                <option value="0" selected disabled>Selecciona un nivel</option>
                <option :value="name" v-for="(_levelData, name) in quizCategory.quizzes">
                  <strong>{{ name }}</strong>
                </option>
            </select>
          </div>
        </div>
        <div class="d-flex">
          <button  class="btn btn-dark mx-auto px-5" @click="setLevel(currentQuiz.level)">Comenzar</button>
        </div>
      </div>
      <!--QUIZ-->
      <template  v-if="currentQuiz.isActive">
        <div class="d-flex justify-content-center mb-3">
          <p class="mb-0"> 
            <template  v-if="currentQuiz.answer.correctAnswer && currentQuiz.answer.userAnswerIsCorrect">
              <strong>Correcto </strong> 😀
            </template>
            <template v-else-if="currentQuiz.answer.correctAnswer && !currentQuiz.answer.userAnswerIsCorrect">
              <strong>Incorrecto</strong> 😔
            </template>
          </p>
        </div>
        <div class="quiz quiz_pregunta">
          <!-- PROGRESO -->
          <div class="d-flex justify-content-between align-items-center mb-3">
            <img class="quiz-icono img-fluid" :src="quizCategory.icon"/>
            <p class="mb-0">{{ currentQuiz.questions[currentQuiz.currentQuestion].number }} / {{ currentQuiz.questions.length }}</p>
          </div>
          <div class="quiz__barra-progreso">
            <span :style="`width: ${currentQuiz.progressPercentage}%`"></span>
          </div>
          <!-- PREGUNTA-->
          <div class="quiz__pregunta mt-4 d-flex">
            <strong class="me-3">{{ currentQuiz.questions[currentQuiz.currentQuestion].number }}.</strong>
            <h1 >{{ currentQuiz.questions[currentQuiz.currentQuestion].question }}
            </h1>
          </div>
          <!-- ALTERNATIVAS -->
          <ul class="quiz__opciones list-unstyled mt-4">
            <li v-for="(option, i) in currentQuiz.questions[currentQuiz.currentQuestion].options">
              <input 
                v-model.number="currentQuiz.answer.userAnswer"
                :disabled="currentQuiz.answer.correctAnswer ? true : false"
                :value="option.number" 
                type="radio" 
                name="answer" 
                :id="`answer${i}`"
              /> 
              <label :for="`answer${i}`">
                <div 
                  class="custom-input-icon"
                  :class="{
                    'respuesta-correcta' : currentQuiz.answer.correctAnswer && option.number  == currentQuiz.answer.correctAnswer,
                    'respuesta-incorrecta' : currentQuiz.answer.correctAnswer && option.number == currentQuiz.answer.userAnswer && option.number  != currentQuiz.answer.correctAnswer
                  }"
                >
                </div>
                {{ option.data }}
              </label>
            </li>
          </ul>
          <!-- BOTONES -->
          <div class="d-flex justify-content-end">
            <button 
              :disabled="currentQuiz.answer.correctAnswer ? true : false"
              class="btn btn-primary" 
              @click="currentQuiz.checkAnswer">
                Siguiente Pregunta <i class="fas fa-arrow-right"></i>
            </button>
            <button class="btn btn-primary d-none" @click="currentQuiz.setCurrentQuestion()">Siguiente pregunta</button>
          </div>
        </div>
      </template>
      <!-- RESULTADOS -->
      <div class="quiz quiz_resultados" v-if="!currentQuiz.isActive && currentQuiz.answer.history.length">
        <h2 class="fw-bold mb-4 text-center">Resultados</h2>
        <ul class="resultados__preguntas list-unstyled">
          <template v-for="(question, i) in currentQuiz.questions">
            <li>
              <div class="d-flex mb-4"> <strong class="me-2">{{ question.number }}.</strong>  <h5> {{ question.question }}</h5> </div>
              <ul class="list-unstyled">
                <li 
                  v-for="(option) in question.options"
                  class="d-flex justify-content-between border border-2 rounded p-2 mt-2 mb-0"
                  :class="{
                    'border-danger' : option.number == currentQuiz.answer.history[i] && option.number != question.correctAnswer.number,
                    'border-success': option.number == question.correctAnswer.number 
                  }">
                  {{ option.data }}
                  <strong 
                    class="text-success  text-end small" 
                    v-if="option.number == question.correctAnswer.number">
                      {{option.number == currentQuiz.answer.history[i] ? "Tu respuesta" : "Respuesta correcta" }}
                  </strong>
                  <strong 
                    class="text-danger text-end small" 
                    v-if="option.number == currentQuiz.answer.history[i] && option.number != question.correctAnswer.number">
                      Tu respuesta
                  </strong>
                </li>
                <div class="">
                  <p class="mt-3 mb-0">{{ question.correctAnswer.explanation }}</p>
                  <HighCode 
                    v-if="question.correctAnswer.codeExample" 
                    :textEditor="true"  
                    width="100%"  
                    class="code mt-4" 
                    :codeValue="question.correctAnswer.codeExample" 
                    theme="dark">
                  </HighCode>
                </div>
              </ul>
            </li>
            <hr class="my-5">
          </template>
        </ul>
      </div>
    </div>
  </main>
</template>

<style lang="scss">

  .main-quiz {

    .quiz {
      background: white;
      padding: 1em;
      border-radius: 8px;
      border: 1px solid var(--color-borde);
      max-width: 900px;
      margin: auto;
      box-shadow: 2px 4px 4px 2px #0000001a;
      
      .btn {
        background-color: black;
        border-color: black;
      }
    }

    .quiz_bienvenida {
      border: unset;
      background: unset;
      box-shadow: unset;
      max-width: 650px;
      position: relative;
      text-align: center;

      .quiz-icono {
        max-width: 50px;
        margin: auto;
        display: block;
      }
    }

    .quiz.quiz_pregunta {

      .quiz-icono {
        max-width: 40px;
      }
      
      .quiz__barra-progreso {
        height: 20px;
        width: 100%;
        background: var(--color-primario-oscuro);

        span {
          background: var(--color-primario-quizz);
          height: 100%;
          display: block;
          transition: ease-in-out 0.5s ;
        }
      }

      .quiz__pregunta {
        
        h1, strong {
          font-size: 1.4em;
        }
      }
  
      .quiz__opciones {
        
        li {
          display: flex;
          align-items: center;
          padding: 0 0.5em;
          border: 1px solid transparent va;
          border-radius: 8px;
          position: relative;
          margin-bottom: 0.5em;
          
          label,input {
            padding: 1em;
            display: block;
            cursor: pointer;
          }
  
          input {
            width: 20px;
            height: 20px;

            &:checked + label {

              .custom-input-icon {
                border-color: var(--color-borde);
              }
            }
          }


          label {
            width: 100%;

            .custom-input-icon {
              height: 100%;
              width: 100%;
              position: absolute;
              top: 0;
              left: 0;
              border-radius: 8px;
              border:  2px solid transparent;
            }
            
            div.custom-input-icon.respuesta-correcta {
              border-color: green;
            }
  
            div.custom-input-icon.respuesta-incorrecta {
              border-color: red;
            }
          }
          
          &:hover {
            background-color: #faf8f8;
          }
        }

      }
    }

  }


  @media (max-width:575px) {
    
    .main-quiz {

      .quiz.quiz_pregunta {
        
        .quiz__pregunta  {

          h1, strong {
            font-size: 1.1em;
          }
        }
      }

      .quiz.quiz_resultados {
        
        h2 {
          font-size: 1.2em;
        }

        .resultados__preguntas {

          h5 {
            font-size: 0.98em;
          }
        }
      }
    }
  }
</style>