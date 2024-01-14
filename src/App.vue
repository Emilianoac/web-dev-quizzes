<script setup lang="ts">
  import Layout from "./layout/Layout.vue"
</script>

<template>
  <Layout>
    <router-view> </router-view>
  </Layout>
</template>

<style lang="scss">
  body {
    font-size: 16px;
    background: var(--color-primario);
  }
</style>
