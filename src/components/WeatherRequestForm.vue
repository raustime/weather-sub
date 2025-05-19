<template>
  <div class="form-wrapper">
    <form @submit.prevent="fetchWeather" class="weather-form">
      <h2>Get Current Weather</h2>

      <label>
        City:
        <input type="text" v-model="city" required />
      </label>

      <button type="submit" :disabled="loading">
        {{ loading ? 'Loading...' : 'Get Weather' }}
      </button>

      <p v-if="message" :class="['message', messageType]">{{ message }}</p>

      <div v-if="weatherData" class="weather-result">
        <h3>Weather in {{ weatherData.city }}</h3>
        <p>Temperature: {{ weatherData.temperature }}°C</p>
        <p>Condition: {{ weatherData.condition }}</p>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'

export default {
  setup() {
    const city = ref('')
    const message = ref('')
    const messageType = ref('success')
    const loading = ref(false)
    const weatherData = ref<any>(null)

    const fetchWeather = async () => {
      message.value = ''
      weatherData.value = null
      loading.value = true

      try {
        const response = await fetch(`/api/weather?city=${encodeURIComponent(city.value)}`)

        const contentType = response.headers.get('Content-Type') || ''

        if (contentType.includes('application/json')) {
          const data = await response.json()

          if (response.ok) {
            messageType.value = 'success'
            message.value = 'Weather data received!'
            weatherData.value = data
          } else {
            messageType.value = 'error'
            message.value = data.error || `Error ${response.status}: Failed to fetch weather`
          }
        } else {
          messageType.value = 'error'
          message.value = `Unexpected response format: ${contentType}`
        }
      } catch (err) {
        console.error('Fetch error:', err)
        messageType.value = 'error'
        message.value = 'Network error. Please try again later.'
      } finally {
        loading.value = false
      }
    }

    return {
      city,
      message,
      messageType,
      loading,
      weatherData,
      fetchWeather,
    }
  },
}
</script>

<style scoped>
.weather-result {
  margin-top: 1rem;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}
</style>