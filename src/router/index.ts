import { createRouter, createWebHashHistory } from "vue-router"
import Home from "../views/Home.vue"

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
    },
    {
      path: "/quiz/:quizname",
      name: "quiz",
      props: true,
      component: () => import("../views/Quiz.vue")
    }
  ]
})

export default router
