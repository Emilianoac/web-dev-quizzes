<script setup lang="ts">

  import type {Quiz} from "@/types/types"

  interface Props {
    data: Quiz
  }
  const props = defineProps<Props>()
</script>

<template>
  <div class="debug">
    <pre><code>{{ props.data.answer }}</code></pre>
  </div>
</template>

<style lang="scss">

  .debug {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translate(0, -50%);
    background: black;
    color: rgb(20, 224, 20);
    max-height: 300px;
    max-width: 240px;
    width: 100%;
    overflow: auto;
    box-shadow: 2px 4px 4px 2px rgba(0, 0, 0, 0.258);
    z-index: 99;
  }
</style>