<script setup lang="ts">

</script>

<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary">
    <div class="container">
      <RouterLink class="navbar-brand fw-bold" to="/">Web Dev Quizzes</RouterLink>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <a 
              class="nav-link active" 
              title="Repositorio GitHub" 
              target="_blank" 
              href="https://github.com/Emilianoac/web-dev-quizzes">
              <i class="fab fa-github"></i>
            </a>
          </li>
          <li class="nav-item dropdown">
            <a 
              class="nav-link dropdown-toggle" 
              href="#" 
              role="button" 
              data-bs-toggle="dropdown" 
              aria-expanded="false">
              Admin
            </a>
            <ul class="dropdown-menu dropdown-menu-end">
              <li><RouterLink class="dropdown-item" :to="{name: 'nuevo quiz'}">Nuevo Quizz</RouterLink></li>
              <li><hr class="dropdown-divider"></li>
              <li><RouterLink class="dropdown-item" :to="{name: 'quizzes'}">Ver Quizzes</RouterLink></li>
              <li><hr class="dropdown-divider"></li>
              <li><a class="dropdown-item text-danger" href="#">Salir</a></li>
            </ul>
          </li>
        </ul>
      </div>
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