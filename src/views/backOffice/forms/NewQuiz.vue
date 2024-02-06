<script lang="ts" setup>
  import { reactive, watch, ref } from "vue"
  import type { Quiz } from "@/types/quiz"
  import db from "@/firebase/index"
  import { getStorage, ref as firebaseRef, uploadBytes, getDownloadURL } from "firebase/storage"
  import { setDoc, doc } from "firebase/firestore"

  /**
   * Estado reactivo del objeto 'Quiz'.
   * incluyendo id, categoría, nombre para mostrar, icono y estructura de niveles.
   */
  const quiz = reactive<Quiz>({
    id: "",
    category: "",
    displayName: "",
    icon: "",
    quizzes: {
      basico: null,
      intermedio: null,
      avanzado: null
    }
  });

  /**
   * Variable para mantener un estado booleano que indica si el formulario 
   * contiene errores de validación.
   */
  const formError = ref(false)

  /**
   * Almacena el archivo de imagen seleccionado para el icono del quiz.
   * Este archivo se usa para cargar la imagen en Firebase Storage,
   * y la URL resultante se asigna a 'quiz.icon'.
   */
  let iconFile: File

  /**
   * Objeto para mantener el estado de error de cada campo
   */
  const quizErrors = reactive({
    id: false,
    category: false,
    displayName: false,
    icon: false
  });

  /**
   * Verifica si el valor de un campo de texto está vacío.
   */
  function isFieldEmpty(fieldValue: string): boolean {
    return typeof fieldValue === 'string' && !fieldValue.trim()
  }

  /**
   * Observa cada campo requerido y actualiza el estado de error correspondiente
   */
  for (let field in quiz) {
    if (field !== 'quizzes') { 
      watch(() => quiz[field as keyof Quiz], (newValue) => {
        if (typeof newValue === 'string') {
          quizErrors[field as keyof typeof quizErrors] = isFieldEmpty(newValue)
        }
      })
    }
  }

  /**
   * Maneja la subida de archivos a Firebase Storage y el guardado del quiz en Firebase.
   */
  async function saveQuiz() {

    function isValidQuiz(quiz: Quiz) {
      const requiredFields = ['id', 'category', 'displayName', 'icon']
      return requiredFields.every(field => {
        const value = quiz[field as keyof Quiz]
        return typeof value === 'string' && value.trim() !== ''
      })
    }

    if (isValidQuiz(quiz)) {
      formError.value = false
      try {
        const storage = getStorage()
        const storageRef = firebaseRef(storage, "categories")
        const categoryRef = firebaseRef(storageRef, `${ quiz.id}`)
  
        await uploadBytes(categoryRef, iconFile )
        let url = await getDownloadURL(categoryRef)
        quiz.icon = url 
  
        await setDoc(doc(db, "quizzes", quiz.id), quiz)
      } catch (error) {
        console.error( error)
      }
    } else {
      formError.value = true
    }
  }

  /**
   * Carga una imagen desde un evento de entrada.
   */
  async function loadImage(event: Event) {
    const input = event.target as HTMLInputElement
    if(input.files) {
      iconFile = input.files[0]
      quiz.icon = input.files[0].name
    }
  }
</script>

<template>
  <div class="container my-4">
    <form style="max-width: 600px; margin: auto;">
      <h1 class="fw-bold mb-4">Nueva Categoria</h1>
      <!-- NOMBRE -->
      <div class="mb-3">
        <label class="form-label">Nombre <span class="text-danger">*</span></label>
        <input class="form-control" type="text" v-model="quiz.displayName">
        <small class="text-danger" v-if="!quiz.displayName.trim() && formError">Debes completar este campo.</small>
      </div>
      <!-- ID -->
      <div class="mb-3">
        <label class="form-label">ID <span class="text-danger">*</span></label>
        <input class="form-control" type="text" v-model="quiz.id">
        <small class="text-danger" v-if="!quiz.id.trim() && formError">Debes completar este campo.</small>
      </div>
      <!-- CATEGORIA -->
      <div class="mb-3">
        <label class="form-label">Categoria <span class="text-danger">*</span></label>
        <input class="form-control" type="text" v-model="quiz.category">
        <small class="text-danger" v-if="!quiz.category.trim() && formError">Debes completar este campo.</small>
      </div>
      <!-- ICONO-->
      <div class="mb-3">
        <label for="" class="form-label">Icono <span class="text-danger">*</span></label>
        <input class="form-control" type="file" @input="loadImage($event)"/>
        <small class="text-danger" v-if="!quiz.icon.trim() && formError ">Debes completar este campo.</small>
      </div>
      <!-- GUARDAR-->
      <div class="d-flex justify-content-end">
        <button class="btn  btn-primary" @click.prevent="saveQuiz">Crear Categoria</button>
      </div>
      <small class="d-block text-danger text-end mt-2" v-if="formError">Completa los campos requeridos para continuar.</small>
    </form>
  </div>
</template>

<style>
</style>