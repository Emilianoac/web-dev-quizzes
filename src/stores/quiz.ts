import { defineStore } from "pinia"
import db from "@/firebase/index"
import { collection, getDocs, getDoc, doc} from "firebase/firestore" 
import {isQuizCategory} from "@/type-guards/IsquizCategory"
import type {Category} from "@/types/quiz"

export const useQuizStore = defineStore("quiz", {
  state: () => {
    return { 
      quizCategories: [] as Category[],
      currentCategory: {} as Category 
    }
  },
  actions: {
    async getQuizCategories() {
      try {
        const querySnapshot = await getDocs(collection(db, "quizzes"))
        querySnapshot.forEach((doc) => {
          let data = {... doc.data(), id: doc.id} 
          if (isQuizCategory(data)) {
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

        if (docSnap.exists() && isQuizCategory(docSnap.data())) {
          const docData = docSnap.data() as Category
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