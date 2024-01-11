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
    <div class="container my-5">
      <h1 class="inicio__titulo mb-4">Web dev quizzes</h1>
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

    .inicio__titulo {
      font-weight: 700;
      text-transform: uppercase;
    }

    .inicio__listado-quiz {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      grid-column-gap: 10px;
      grid-row-gap: 10px;

      li {
        border: 1px solid black;
        border-radius: 8px;
        
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
</style>