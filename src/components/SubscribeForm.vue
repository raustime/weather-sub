<!-- src/components/SubscribeForm.vue with local API endpoint -->

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

      <button type="submit" :disabled="loading">
        {{ loading ? 'Submitting...' : 'Subscribe' }}
      </button>

      <p v-if="message" :class="['message', messageType]">{{ message }}</p>
    </form>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'

export default {
  setup() {
    const email = ref('')
    const city = ref('')
    const forecastType = ref('daily')
    const message = ref('')
    const messageType = ref('success')
    const loading = ref(false)

    const submitForm = async () => {
      message.value = ''
      loading.value = true

      try {
        const requestData = {
          email: email.value,
          city: city.value,
          frequency: forecastType.value,
        }

        const response = await fetch('/api/subscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        })

        let responseData = {}
        const contentType = response.headers.get('Content-Type') || ''

        if (contentType.includes('application/json')) {
          try {
            responseData = await response.json()
          } catch (e) {
            console.warn('Failed to parse JSON:', e)
          }
        }

        if (response.ok) {
          messageType.value = 'success'
          message.value = 'Subscription successful! Check your email.'
          email.value = ''
          city.value = ''
          forecastType.value = 'daily'
        } else if (response.status === 400) {
          messageType.value = 'error'
          message.value = 'Invalid input. Please check the form.'
        } else if (response.status === 409) {
          messageType.value = 'error'
          message.value = 'This email is already subscribed.'
        } else {
          messageType.value = 'error'
          message.value = `Error ${response.status}: Subscription failed.`
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
      email,
      city,
      forecastType,
      message,
      messageType,
      loading,
      submitForm,
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
</style>