<script lang="ts" setup>
  import {reactive, watch} from "vue"
  import { onBeforeRouteLeave } from "vue-router"
  import { HighCode } from "vue-highlight-code"
  import "vue-highlight-code/dist/style.css"
  import type {Quiz} from "../types/types"

  import vueIcon from "../assets/vue-icon.svg"

  const quiz = reactive<Quiz>({
    isActive: false,
    questions: [
      {
        number: 1,
        question: `¿Pregunta 1?`,
        options: [
          {
            number: 1,
            data: "Opcion 1.",
          },
          {
            number: 2,
            data: "Opcion 2.",
          },
          {
            number: 3,
            data: "Opcion 3.",
          },
          {
            number: 4,
            data: "Opcion 3.",
          },
        ],
        correctAnswer: {
          number: 1,
          explanation:`Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus dignissimos veniam consequuntur perspiciatis, 
          iusto saepe ipsum cumque ad, sunt asperiores repudiandae illum cupiditate, optio molestias 
          sapiente possimus odio ut rem autem? Ducimus ipsam nesciunt numquam recusandae quisquam at obcaecati officia?`,
        },
        codeExample: null
      },
      {
        number: 2,
        question: `¿Qué función de Vue 3 se utiliza para ejecutar automáticamente un efecto secundario en respuesta a los cambios reactivos sin necesidad de especificar propiedades concretas?`,
        options: [
          {
            number: 1,
            data: "watchEffect",
          },
          {
            number: 2,
            data: "reactive",
          },
          {
            number: 3,
            data: "computed",
          },
          {
            number: 4,
            data: "watch",
          }
        ],
        correctAnswer: {
          number: 1,
          explanation: `
          watchEffect' se utiliza para ejecutar un efecto secundario automáticamente cada vez 
          que una de sus dependencias reactivas cambia. A diferencia de 'watch', no necesita especificar explícitamente 
          qué propiedades está observando, lo que lo hace útil para reacciones generales a cambios en el estado.
          `
        },
        codeExample: `
import { reactive, watchEffect } from 'vue';

const state = reactive({ count: 0 });

watchEffect(() => console.log(\`The count is \${state.count}\`));

// Cada vez que 'state.count' cambie, la función dentro de watchEffect se ejecutará automáticamente.
        `
      },
      {
        number: 3,
        question: `¿Pregunta 3?`,
        options: [
          {
            number: 1,
            data: "Opcion 1.",
          },
          {
            number: 2,
            data: "Opcion 2.",
          },
          {
            number: 3,
            data: "Opcion 3.",
          },
          {
            number: 4,
            data: "Opcion 3.",
          },
        ],
        correctAnswer: {
          number: 1,
          explanation: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus dignissimos veniam consequuntur perspiciatis, 
          iusto saepe ipsum cumque ad, sunt asperiores repudiandae illum cupiditate, optio molestias 
          sapiente possimus odio ut rem autem? Ducimus ipsam nesciunt numquam recusandae quisquam at obcaecati officia?`,
        },
        codeExample: null
      },
    ],
    currentQuestion: 0,
    answer: {
      userAnswer: null ,
      correctAnswer: null,
      userAnswerIsCorrect: false,
      history: []
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

  function handleBeforeUnload(event: BeforeUnloadEvent) {
    const message = "Si sales de esta página, perderás tu progreso. ¿Estás seguro de que quieres salir?"
    event.preventDefault()
    event.returnValue = message
    return message
  }

  watch(() => quiz.isActive, (newV) => {
    if (newV) {
      window.addEventListener("beforeunload", handleBeforeUnload)
    } else {
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  })

  onBeforeRouteLeave((_to , _from, next) => {
    if (quiz.isActive) {
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
</script>

<template>
  <!--  <Debug :data="quiz"/> -->  
  <main class="main-quiz p-3 p-md-5">
    <div class="container">
      <!--BIENVENIDA QUIZ-->
      <div class="quiz quiz_bienvenida" v-if="!quiz.isActive && !quiz.answer.history.length">
        <img class="quiz-icono img-fluid" :src="vueIcon"/>
        <h1 class="mt-4 fw-bold">Vue 3</h1>
        <p>Bienvenido al Desafío de Conocimientos sobre vue 3. Este quiz está pensado para evaluar 
          tu comprensión de los conceptos clave en el desarrollo con Vue 3.
        </p>   
        <div class="d-flex justify-content-center">
          <button class="btn btn-primary" @click="quiz.isActive = true">Comenzar</button>
        </div>
      </div>
      <!--QUIZ-->
      <div class="quiz quiz_pregunta" v-if="quiz.isActive">
        <div class="d-flex justify-content-end mb-3">
          <p class="mb-0" v-if="quiz.answer.correctAnswer && quiz.answer.userAnswerIsCorrect"> 
            <strong class="small">Correcto </strong> 😀
          </p>
          <p class="mb-0" v-else-if="quiz.answer.correctAnswer && !quiz.answer.userAnswerIsCorrect"> 
            <strong class="small">Incorrecto</strong> 😔
          </p>
        </div>
        <!-- PROGRESO -->
        <div class="d-flex justify-content-between align-items-center mb-3">
          <img class="quiz-icono img-fluid" :src="vueIcon"/>
          <p class="mb-0">{{ quiz.questions[quiz.currentQuestion].number }} / {{ quiz.questions.length }}</p>
        </div>
        <div class="quiz__barra-progreso">
          <span :style="`width: ${quiz.progressPercentage}%`"></span>
        </div>
        <!-- PREGUNTA-->
        <div class="quiz__pregunta mt-4 d-flex">
          <strong class="me-3">{{ quiz.questions[quiz.currentQuestion].number }}.</strong>
          <h1 >{{ quiz.questions[quiz.currentQuestion].question }}
          </h1>
        </div>
        <!-- ALTERNATIVAS -->
        <ul class="quiz__opciones list-unstyled mt-4">
          <li 
            v-for="(option, i) in quiz.questions[quiz.currentQuestion].options">
            <input 
              v-model.number="quiz.answer.userAnswer"
              :disabled="quiz.answer.correctAnswer ? true : false"
              :value="option.number" 
              type="radio" 
              name="answer" 
              :id="`answer${i}`"
            /> 
            <label :for="`answer${i}`">
              <div 
                class="custom-input-icon"
                :class="{
                  'respuesta-correcta' : quiz.answer.correctAnswer && option.number  == quiz.answer.correctAnswer,
                  'respuesta-incorrecta' : quiz.answer.correctAnswer && option.number == quiz.answer.userAnswer && option.number  != quiz.answer.correctAnswer
                }"
              >
              </div>
              {{ option.number }}
              {{ option.data }}
          </label>
          </li>
        </ul>
        <!-- BOTONES -->
        <div class="d-flex justify-content-end">
          <button 
            :disabled="quiz.answer.correctAnswer ? true : false"
            class="btn btn-primary" 
            @click="quiz.checkAnswer">
              Siguiente Pregunta <i class="fas fa-arrow-right"></i>
          </button>
          <button class="btn btn-primary d-none" @click="quiz.setCurrentQuestion()">Siguiente pregunta</button>
        </div>
      </div>
      <!-- RESULTADOS -->
      <div class="quiz quiz_resultados" v-if="!quiz.isActive && quiz.answer.history.length">
        <h2 class="fw-bold mb-4">Resultados</h2>
        <ul class="resultados__preguntas list-unstyled">
          <template v-for="(question, i) in quiz.questions">
            <li>
              <div class="d-flex mb-4"> <strong class="me-2">{{ question.number }}.</strong>  <h5> {{ question.question }}</h5> </div>
              <ul class="list-unstyled">
                <li 
                  v-for="(option) in question.options"
                  class="d-flex justify-content-between border border-2 rounded p-2 mt-2 mb-0"
                  :class="{
                    'border-danger' : option.number == quiz.answer.history[i] && option.number != question.correctAnswer.number,
                    'border-success': option.number == question.correctAnswer.number 
                  }">
                  {{ option.data }}
                  <strong 
                    class="text-success  text-end small" 
                    v-if="option.number == question.correctAnswer.number">
                      {{option.number == quiz.answer.history[i] ? "Tu respuesta" : "Respuesta correcta" }}
                  </strong>
                  <strong 
                    class="text-danger text-end small" 
                    v-if="option.number == quiz.answer.history[i] && option.number != question.correctAnswer.number">
                      Tu respuesta
                  </strong>
                </li>
                <div class="">
                  <p class="mt-3 mb-0">{{ question.correctAnswer.explanation }}</p>
                  <HighCode 
                    v-if="question.codeExample" 
                    :textEditor="true"  
                    width="100%"  
                    class="code mt-4" 
                    :codeValue="question.codeExample" 
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

    .quiz.quiz_bienvenida {
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
          border: 1px solid transparent;
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