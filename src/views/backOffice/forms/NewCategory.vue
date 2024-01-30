<script lang="ts" setup>
  import { reactive } from "vue"
  import type { Category } from "@/types/quiz"
  import db from "@/firebase/index"
  import { getStorage, ref as firebaseRef, uploadBytes, getDownloadURL } from "firebase/storage"
  import { setDoc, doc } from "firebase/firestore"

  const category = reactive<Category>({
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
      const storageRef = firebaseRef(storage, "dan")
      const categoryRef = firebaseRef(storageRef, `${ category.id}`)

      await uploadBytes(categoryRef, iconBlob )
      let url = await getDownloadURL(categoryRef)
      category.icon = url

      await setDoc(doc(db, "quizzes", category.id), category)
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
        <input type="text" class="form-control" v-model="category.displayName">
      </div>
      <div class="mb-3">
        <label class="form-label">ID</label>
        <input type="text" class="form-control" v-model="category.id">
      </div>
      <!-- CODIGO EJEMPLO-->
      <div class="mb-3">
        <label class="form-label">Descripción</label>
        <textarea class="form-control" rows="3" v-model="category.description"></textarea>
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
</style>@/types/quiz