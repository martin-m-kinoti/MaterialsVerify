<template>
  <div class="auth-page">
    <div class="auth-card">
      <router-link to="/login" class="back-link">← Back to login</router-link>

      <div class="auth-logo">
        <img src="/logo.png" alt="MaterialsVerify logo" class="logo-img" />
        <span class="logo-text">MaterialsVerify</span>
      </div>

      <!-- Sent state -->
      <div v-if="sent" class="sent-state">
        <div class="sent-icon">✉</div>
        <h1>Check your email</h1>
        <p class="auth-sub">
          If <strong>{{ submittedEmail }}</strong> is registered, you'll receive a
          reset link shortly. It expires in 1 hour.
        </p>
        <p class="auth-sub hint">Didn't get it? Check your spam folder or
          <button class="link-btn" @click="reset">try again</button>.
        </p>
        <router-link to="/login" class="btn-submit btn-back">Back to Login</router-link>
      </div>

      <!-- Form state -->
      <template v-else>
        <h1>Forgot your password?</h1>
        <p class="auth-sub">Enter your email and we'll send you a reset link.</p>

        <p v-if="error" class="msg-error">{{ error }}</p>

        <form class="auth-form" @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="email">Email address</label>
            <input
              id="email"
              v-model="email"
              type="email"
              placeholder="Enter your registered email"
              required
              :disabled="loading"
            />
          </div>

          <button type="submit" class="btn-submit" :disabled="loading">
            {{ loading ? "Sending…" : "Send Reset Link" }}
          </button>
        </form>
      </template>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ForgotPassword',
  data() {
    return {
      email: '',
      submittedEmail: '',
      loading: false,
      error: '',
      sent: false,
    };
  },
  methods: {
    async handleSubmit() {
      this.error = '';
      this.loading = true;
      this.submittedEmail = this.email.trim();
      try {
        await axios.post('http://localhost:9000/api/auth/forgot-password', {
          email: this.submittedEmail,
        });
        this.sent = true;
      } catch (err) {
        this.error =
          (err.response && err.response.data && (err.response.data.error || err.response.data.message)) ||
          'Something went wrong. Please try again.';
      } finally {
        this.loading = false;
      }
    },
    reset() {
      this.sent = false;
      this.email = '';
      this.submittedEmail = '';
      this.error = '';
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&family=DM+Sans:wght@400;500&display=swap");

* { box-sizing: border-box; margin: 0; padding: 0; }

.auth-page {
  min-height: 100vh;
  background: #0a1610;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  font-family: "DM Sans", sans-serif;
}

.auth-card {
  background: #fff;
  border: 1px solid #e0f0e8;
  border-radius: 24px;
  padding: 48px 44px;
  width: 100%;
  max-width: 440px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.4);
}

.back-link {
  font-size: 0.82rem;
  color: #0f7a55;
  text-decoration: none;
  font-weight: 500;
  display: inline-block;
  margin-bottom: 28px;
  transition: color 0.2s;
}
.back-link:hover { color: #0a5e40; }

.auth-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 28px;
}
.logo-img { height: 30px; width: auto; }
.logo-text {
  font-family: "Sora", sans-serif;
  font-weight: 700;
  font-size: 1rem;
  color: #0f2419;
  letter-spacing: -0.3px;
}

h1 {
  font-family: "Sora", sans-serif;
  font-size: 1.75rem;
  font-weight: 700;
  color: #0f2419;
  letter-spacing: -0.5px;
  margin-bottom: 6px;
}

.auth-sub {
  font-size: 0.875rem;
  color: #888;
  margin-bottom: 28px;
  line-height: 1.5;
}
.auth-sub.hint { margin-bottom: 28px; }

.auth-form { display: flex; flex-direction: column; gap: 20px; }

.form-group { display: flex; flex-direction: column; gap: 8px; }
.form-group label {
  font-size: 0.82rem;
  font-weight: 500;
  color: #555;
  letter-spacing: 0.5px;
}

input {
  padding: 13px 16px;
  background: #f8fdfb;
  border: 1.5px solid #d8eee5;
  border-radius: 12px;
  font-size: 0.9rem;
  font-family: "DM Sans", sans-serif;
  color: #1a1a1a;
  outline: none;
  transition: border-color 0.2s, background 0.2s;
}
input:focus { border-color: #0f7a55; background: #f0faf5; }
input::placeholder { color: #bbb; }
input:disabled { opacity: 0.6; cursor: not-allowed; }

.btn-submit {
  display: block;
  text-align: center;
  text-decoration: none;
  padding: 14px;
  background: #0f7a55;
  color: #fff;
  border: none;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 600;
  font-family: "Sora", sans-serif;
  cursor: pointer;
  transition: background 0.2s, box-shadow 0.2s;
  letter-spacing: 0.2px;
}
.btn-submit:hover:not(:disabled) {
  background: #0a5e40;
  box-shadow: 0 4px 16px rgba(15, 122, 85, 0.25);
}
.btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-back { margin-top: 4px; }

.msg-error {
  background: #fff0f0;
  border: 1px solid #f5c6c6;
  color: #c0392b;
  border-radius: 10px;
  padding: 10px 14px;
  font-size: 0.85rem;
  margin-bottom: 16px;
}

/* Sent state */
.sent-state { text-align: center; }
.sent-icon {
  font-size: 2.5rem;
  margin-bottom: 16px;
  display: block;
}
.sent-state h1 { margin-bottom: 12px; }
.sent-state .auth-sub { margin-bottom: 12px; }

.link-btn {
  background: none;
  border: none;
  color: #0f7a55;
  font-size: inherit;
  font-family: inherit;
  cursor: pointer;
  padding: 0;
  text-decoration: underline;
}
.link-btn:hover { color: #0a5e40; }

@media (max-width: 480px) {
  .auth-card { padding: 36px 22px; }
}
</style>
