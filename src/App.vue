<template>
  <div class="page-wrapper">
    <WeatherRequestForm />
    <SubscribeForm />
  </div>
</template>

<script lang="ts">
import WeatherRequestForm from './components/WeatherRequestForm.vue'
import SubscribeForm from './components/SubscribeForm.vue'

export default {
  components: {
    WeatherRequestForm,
    SubscribeForm,
  },
}
</script>

<style scoped>
.page-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  padding: 2rem;
  background: #f0f4f8;
  min-height: 100vh;
}
</style>