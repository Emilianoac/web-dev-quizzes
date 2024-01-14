<script setup lang="ts">

</script>

<template>
  <nav class="navbar sticky-top">
    <div class="container">
      <RouterLink class="navbar-brand fw-bold" to="/">Web Dev Quizzes</RouterLink>
      <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
        <li class="nav-item">
          <a class="nav-link active" title="Repositorio GitHub" target="_blank" href="https://github.com/Emilianoac/web-dev-quizzes"><i class="fab fa-github"></i></a>
        </li>
      </ul>
    </div>
  </nav>
   <slot/>
</template>

<style lang="scss">

  .navbar {
    box-shadow: 2px 4px 6px rgba(0, 0, 0, 0.05);
    background-color: var(--color-primario);
  }
</style>