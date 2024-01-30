<script setup lang="ts">
  import { useQuizStore } from "@/stores/quiz"
  
  const quizStore = useQuizStore()
  const categories = quizStore.quizCategories
  
  async function getData() {
    if(!quizStore.quizCategories.length) {
      await quizStore.getQuizCategories()
    }
  }
  getData()
</script>

<template>
  <main class="main-inicio">
    <div class="container my-4">
      <ul class="inicio__listado-quiz list-unstyled">
        <li v-for="(quiz) in categories">
          <RouterLink :to="{ name: 'quiz', params: { id: quiz.id }}">
            <img class="img-fluid mb-4" :src="quiz.icon" />
            <h4>{{ quiz.displayName }}</h4>
            <p class="text-muted small mb-0">{{ quiz.category }}</p>
          </RouterLink>
        </li>
      </ul>
    </div>
  </main>
</template>

<style lang="scss">

  .main-inicio {
    
    .inicio__listado-quiz {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr;
      grid-column-gap: 10px;
      grid-row-gap: 10px;

      li {
        border: 1px solid var(--color-borde);
        border-radius: 8px;
        background: var(--color-primario);
        
        a {
          text-decoration: none;
          color: black;
          padding: 1em;
          display: block;
          text-align: center;

          img {
            max-width: 90px;
          }
          
          h4 {
            font-weight: 700;
            font-size: 1.2em;
          }
        }

        &:hover {
          opacity: 0.8;
        }
      }
    }
  }

  @media(max-width:575px) {

    .main-inicio {

      .inicio__listado-quiz {
        grid-template-columns: 1fr 1fr;

        li {

          a {            

            img {
              max-width: 30px;
            }

            h4 {
              font-size: 1.1em;
            }

            p {
              font-size: 0.9em;
            }
          }
        }
      }
    }
  }
</style>@/type-guards/IsquizCategory@/types/quiz