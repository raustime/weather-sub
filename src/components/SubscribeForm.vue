<!-- src/components/SubscribeForm.vue -->
<template>
  <div class="form-wrapper">
    <form @submit.prevent="submitForm" class="subscribe-form">
      <h2>Subscribe to Weather Forecast</h2>

      <label>
        Email:
        <input type="email" v-model="email" required />
      </label>

      <label>
        City:
        <input type="text" v-model="city" required />
      </label>

      <label>
        Forecast Type:
        <select v-model="forecastType" required>
          <option value="daily">Daily</option>
          <option value="hourly">Hourly</option>
        </select>
      </label>

      <button type="submit">Subscribe</button>

      <p v-if="message" class="message">{{ message }}</p>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import axios from 'axios'

export default defineComponent({
  name: 'SubscribeForm',
  setup() {
    const email = ref('')
    const city = ref('')
    const forecastType = ref('daily')
    const message = ref('')

    const submitForm = async () => {
      try {
        await axios.post('/api/subscribe', {
          email: email.value,
          city: city.value,
          forecast_type: forecastType.value,
        })
        message.value = 'Subscription successful! Check your email.'
      } catch (err) {
        message.value = 'Subscription failed. Please try again.'
      }
    }

    return {
      email,
      city,
      forecastType,
      message,
      submitForm,
    }
  },
})
</script>

<style scoped>
.form-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
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

.subscribe-form button:hover {
  background-color: #2980b9;
}

.message {
  margin-top: 1rem;
  text-align: center;
  color: green;
}
</style>
