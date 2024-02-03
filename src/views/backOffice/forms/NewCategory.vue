<script lang="ts" setup>
  import { reactive } from "vue"
  import type { Quiz } from "@/types/quiz"
  import db from "@/firebase/index"
  import { getStorage, ref as firebaseRef, uploadBytes, getDownloadURL } from "firebase/storage"
  import { setDoc, doc } from "firebase/firestore"

  const quiz = reactive<Quiz>({
    id: "",
    category: "",
    displayName: "",
    description: "",
    icon: "",
    quizzes: {
      basico: null,
      intermedio: null,
      avanzado: null
    }
  })

  let iconBlob: File

  async function saveCateory() {
    try {
      const storage = getStorage()
      const storageRef = firebaseRef(storage, "categories")
      const categoryRef = firebaseRef(storageRef, `${ quiz.id}`)

      await uploadBytes(categoryRef, iconBlob )
      let url = await getDownloadURL(categoryRef)
      quiz.icon = url

      await setDoc(doc(db, "quizzes", quiz.id), quiz)
      console.log("Categoria creada con éxito.")
    } catch (error) {
      console.error( error)
    }
  }

  async function loadImage(event: Event) {
    const input = event.target as HTMLInputElement
    if(input.files) {
      iconBlob = input.files[0]
    }
  }
</script>

<template>
  <div class="container my-4">
    <form style="max-width: 600px; margin: auto;">
      <h1 class="fw-bold mb-4">Nueva Categoria</h1>
      <div class="mb-3">
        <label class="form-label">Nombre</label>
        <input type="text" class="form-control" v-model="quiz.displayName">
      </div>
      <div class="mb-3">
        <label class="form-label">ID</label>
        <input type="text" class="form-control" v-model="quiz.id">
      </div>
      <div class="mb-3">
        <label class="form-label">Categoria</label>
        <input type="text" class="form-control" v-model="quiz.category">
      </div>
      <!-- CODIGO EJEMPLO-->
      <div class="mb-3">
        <label class="form-label">Descripción</label>
        <textarea class="form-control" rows="3" v-model="quiz.description"></textarea>
      </div>
      <!-- ICONO-->
      <div class="mb-3">
        <label for="" class="form-label">Icono</label>
        <input
          @input="loadImage($event)"
          type="file"
          class="form-control"
        />
      </div>
      <div class="d-flex justify-content-end">
        <button class="btn  btn-primary" @click.prevent="saveCateory">Crear Categoria</button>
      </div>
    </form>
  </div>
</template>

<style>
</style>