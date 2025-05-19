<!-- src/components/SubscribeForm.vue with improved error handling -->

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
      <p v-if="debugInfo" class="debug-info">{{ debugInfo }}</p>
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
    const debugInfo = ref('')

    const submitForm = async () => {
      message.value = ''
      debugInfo.value = ''
      loading.value = true
      
      try {
        const requestData = {
          email: email.value,
          city: city.value,
          frequency: forecastType.value,
        }
        
        debugInfo.value = `Sending request to: https://weather-api-production-4236.up.railway.app/api/subscribe`
        
        const response = await fetch(
          'https://weather-api-production-4236.up.railway.app/api/subscribe',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(requestData),
          },
        )

        // Try to parse response body for better debugging
        let responseBody = null
        try {
          responseBody = await response.text()
          debugInfo.value += `\nResponse status: ${response.status}\nResponse body: ${responseBody}`
        } catch (e) {
          debugInfo.value += `\nCouldn't parse response body: ${e}`
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
        debugInfo.value += `\nNetwork error: ${err}`
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
      debugInfo,
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

.debug-info {
  margin-top: 1rem;
  font-size: 0.8rem;
  color: #666;
  font-family: monospace;
  white-space: pre-wrap;
  background: #f8f8f8;
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ddd;
}

/* Hide debug info in production */
@media not all and (min-resolution:.001dpcm) {
  .debug-info {
    display: none;
  }
}
</style>