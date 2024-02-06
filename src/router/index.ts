import { createRouter, createWebHashHistory, RouteRecordRaw} from "vue-router"
import Home from "../views/Home.vue"

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: Home,
  },
  {
    path: "/quiz/:id",
    name: "quiz",
    props: true,
    component: () => import("@/views/Quiz.vue")
  },

  //BACKOFFICE
  {
    path: "/backoffice/nuevo-quiz",
    name: "nuevo quiz",
    component: () => import("@/views/backOffice/forms/NewQuiz.vue")
  },
  {
    path: "/backoffice/quizzes",
    name: "quizzes",
    component: () => import("@/views/backOffice/Quizzes.vue")
  },
  {
    path: "/backoffice/editar-quizz/:id",
    name: "editar quiz",
    component: () => import("@/views/backOffice/forms/EditQuiz.vue")
  }
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: routes
})


export default router
