import { defineStore } from "pinia"
import db from "@/firebase/index"
import { collection, getDocs, getDoc, doc} from "firebase/firestore" 
import {isQuiz} from "@/type-guards/IsquizCategory"
import type {Quiz} from "@/types/quiz"

export const useQuizStore = defineStore("quiz", {
  state: () => {
    return { 
      quizCategories: [] as Quiz[],
      currentCategory: {} as Quiz
    }
  },
  actions: {
    async getQuizCategories() {
      try {
        const querySnapshot = await getDocs(collection(db, "quizzes"))
        querySnapshot.forEach((doc) => {
          let data = {... doc.data(), id: doc.id} 
          if (isQuiz(data)) {
            this.quizCategories.push(data)
          } else {
            throw new Error("Falló la verificación de datos")
          }
        })
      } catch(err) {
        console.log(err)
      }
    },

    async getSingleCategory(id: string) {
      try {
        const docRef = doc(db, "quizzes", id)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists() && isQuiz(docSnap.data())) {
          const docData = docSnap.data() as Quiz
          this.currentCategory = docData
        } else {
          throw new Error("Falló la verificación de datos")
        }
      } catch(err) {
        console.log(err)
      }
    }
  }
})