<script setup lang="ts">
  import { useQuizStore } from "@/stores/quiz"
  
  const quizStore = useQuizStore()
  const quizzes = quizStore.quizzes

  async function getData() {
    if(!quizStore.quizzes.length) {
      await quizStore.getQuizzes()
    }
  }
  getData()
</script>

<template>
  <div class="container my-5" v-if="quizzes.length">
    <div class="row">
      <h1 class="mb-5 fw-bold">Categorias</h1>
      <div class="col-lg-4 mb-4" v-for="category in quizzes">
        <div class="card p-4">
          <img style="max-width: 30px;" class="img-fluid me-3" :src="(category.icon)" />
          <h4 class="fw-bold mt-3">{{ category.displayName }}</h4>
          <div class="d-flex align-items-center mt-4 justify-content-end">
            <button class="btn btn-secondary btn-sm me-2">Eliminar</button>
            <RouterLink class="btn btn-primary btn-sm" :to="{ name: 'editar quiz', params: { id: category.id }}">Editar</RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style></style>