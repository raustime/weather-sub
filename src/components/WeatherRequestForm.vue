<template>
  <div class="form-wrapper">
    <form @submit.prevent="fetchWeather" class="subscribe-form">
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
        <p><strong>Temperature:</strong> {{ weatherData.temperature }}°C</p>
        <p><strong>Humidity:</strong> {{ weatherData.humidity }}%</p>
        <p><strong>Condition:</strong> {{weatherData.description }}</p>
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
.form-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f0f4f8;
}

.subscribe-form {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.subscribe-form h2 {
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  color: #333;
}

.subscribe-form label {
  display: block;
  margin-bottom: 1rem;
  color: #444;
}

.subscribe-form input,
.subscribe-form select {
  width: 100%;
  padding: 0.6rem;
  margin-top: 0.4rem;
  border: 1px solid #ccc;
  border-radius: 6px;
}

.subscribe-form button {
  width: 100%;
  padding: 0.8rem;
  background-color: #3498db;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 1rem;
  transition: background-color 0.3s;
}

.subscribe-form button:hover:not(:disabled) {
  background-color: #2980b9;
}

.subscribe-form button:disabled {
  background-color: #95a5a6;
  cursor: not-allowed;
}

.message {
  margin-top: 1rem;
  text-align: center;
}

.message.success {
  color: green;
}

.message.error {
  color: red;
}

.weather-result {
  margin-top: 1rem;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: #f9f9f9;
}

.weather-result h3 {
  margin-bottom: 0.6rem;
  color: #333;
}
</style>