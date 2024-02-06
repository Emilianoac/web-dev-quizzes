import { defineStore } from "pinia"
import db from "@/firebase/index"
import { collection, getDocs, getDoc, doc} from "firebase/firestore" 
import {isQuiz} from "@/type-guards/IsquizCategory"
import type {Quiz} from "@/types/quiz"

export const useQuizStore = defineStore("quiz", {
  state: () => {
    return { 
      quizzes: [] as Quiz[],
      currentQuiz: {} as Quiz
    }
  },
  actions: {
    async getQuizzes() {
      try {
        const querySnapshot = await getDocs(collection(db, "quizzes"))
        querySnapshot.forEach((doc) => {
          let data = {... doc.data(), id: doc.id} 
          if (isQuiz(data)) {
            this.quizzes.push(data)
          } else {
            throw new Error("Falló la verificación de datos")
          }
        })
      } catch(err) {
        console.log(err)
      }
    },

    async getSingleQuiz(id: string) {
      try {
        const docRef = doc(db, "quizzes", id)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists() && isQuiz(docSnap.data())) {
          const docData = docSnap.data() as Quiz
          this.currentQuiz = docData
        } else {
          throw new Error("Falló la verificación de datos")
        }
      } catch(err) {
        console.log(err)
      }
    }
  }
})