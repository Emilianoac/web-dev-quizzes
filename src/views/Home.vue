<script setup lang="ts">
  import nodeIcon from "../assets/node-icon.svg"
  import vueIcon from "../assets/vue-icon.svg"
  import reactIcon from "../assets/react-icon.svg"
  import angularIcon from "../assets/angular-icon.svg"

  const quizzes = [
    {
      name: "Vue",
      description: "A description",
      icon: vueIcon,
      slug: "vue"
    },
    {
      name: "React",
      description: "A description",
      icon: reactIcon,
      slug: "react"
    },
    {
      name: "Angular",
      description: "A description",
      icon: angularIcon,
      slug: "angular"
    },
    {
      name: "Node",
      description: "A description",
      icon: nodeIcon,
      slug: "node"
    },
  ]
</script>

<template>
  <main class="main-inicio">
    <div class="container my-4">
      <ul class="inicio__listado-quiz list-unstyled">
        <li v-for="(quiz) in quizzes">
          <RouterLink :to="{ name: 'quiz', params: { quizname: quiz.slug }}">
            <img class="img-fluid mb-4" :src="quiz.icon" />
            <h4>{{ quiz.name }}</h4>
            <p>{{ quiz.description }}</p>
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
      grid-template-columns: 1fr 1fr 1fr;
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


          img {
            max-width: 90px;
          }
          
          h4 {
            font-weight: 700;
          }
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
</style>