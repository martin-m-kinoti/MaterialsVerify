<template>
  <div class="auth-page">
    <div class="auth-card">

      <div class="auth-logo">
        <img src="/logo.png" alt="MaterialsVerify logo" class="logo-img" />
        <span class="logo-text">MaterialsVerify</span>
      </div>

      <!-- Invalid / expired token -->
      <div v-if="tokenInvalid" class="state-center">
        <div class="state-icon error-icon">✕</div>
        <h1>Link expired</h1>
        <p class="auth-sub">This reset link is invalid or has expired. Please request a new one.</p>
        <router-link to="/forgot-password" class="btn-submit">Request New Link</router-link>
      </div>

      <!-- Success state -->
      <div v-else-if="done" class="state-center">
        <div class="state-icon success-icon">✓</div>
        <h1>Password updated!</h1>
        <p class="auth-sub">
          Your password has been changed. Redirecting to login
          <span class="countdown">in {{ countdown }}s</span>…
        </p>
        <router-link to="/login" class="btn-submit">Go to Login</router-link>
      </div>

      <!-- Reset form -->
      <template v-else>
        <h1>Set a new password</h1>
        <p class="auth-sub">Choose a strong password for your account.</p>

        <p v-if="error" class="msg-error">{{ error }}</p>

        <form class="auth-form" @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="password">New password</label>
            <div class="input-wrap">
              <input
                id="password"
                v-model="form.password"
                :type="showPw ? 'text' : 'password'"
                placeholder="Enter new password"
                required
                :disabled="loading"
              />
              <button type="button" class="toggle-pw" @click="showPw = !showPw" tabindex="-1">
                {{ showPw ? 'Hide' : 'Show' }}
              </button>
            </div>
            <PasswordStrength :password="form.password" />
          </div>

          <div class="form-group">
            <label for="confirm">Confirm password</label>
            <input
              id="confirm"
              v-model="form.confirm"
              :type="showPw ? 'text' : 'password'"
              placeholder="Re-enter new password"
              required
              :disabled="loading"
              :class="{ 'input-mismatch': form.confirm && form.password !== form.confirm }"
            />
            <span v-if="form.confirm && form.password !== form.confirm" class="field-error">
              Passwords do not match
            </span>
          </div>

          <button
            type="submit"
            class="btn-submit"
            :disabled="loading || !canSubmit"
          >
            {{ loading ? "Updating…" : "Update Password" }}
          </button>
        </form>
      </template>

    </div>
  </div>
</template>

<script>
import axios from 'axios';
import PasswordStrength from '../components/PasswordStrength.vue';

export default {
  name: 'ResetPassword',
  components: { PasswordStrength },

  data() {
    return {
      form: { password: '', confirm: '' },
      showPw: false,
      loading: false,
      error: '',
      tokenInvalid: false,
      done: false,
      countdown: 5,
    };
  },

  computed: {
    token() {
      return this.$route.params.token;
    },
    canSubmit() {
      return (
        this.form.password.length >= 8 &&
        this.form.password === this.form.confirm
      );
    },
  },

  methods: {
    async handleSubmit() {
      if (!this.canSubmit) return;
      this.error = '';
      this.loading = true;
      try {
        await axios.post(
          `https://backend-materials-verify.vercel.app/api/auth/reset-password/${this.token}`,
          { password: this.form.password }
        );
        this.done = true;
        this.startCountdown();
      } catch (err) {
        const msg =
          err.response && err.response.data &&
          (err.response.data.error || err.response.data.message);
        if (err.response && err.response.status === 400) {
          this.tokenInvalid = true;
        } else {
          this.error = msg || 'Something went wrong. Please try again.';
        }
      } finally {
        this.loading = false;
      }
    },

    startCountdown() {
      const t = setInterval(() => {
        this.countdown -= 1;
        if (this.countdown <= 0) {
          clearInterval(t);
          this.$router.push('/login');
        }
      }, 1000);
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

.auth-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 28px;
}
.logo-img { 
  height: 30px; 
  width: auto; 
  display: block;
  border-radius: 50%;
}
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

.auth-form { display: flex; flex-direction: column; gap: 20px; }

.form-group { display: flex; flex-direction: column; gap: 8px; }
.form-group label {
  font-size: 0.82rem;
  font-weight: 500;
  color: #555;
  letter-spacing: 0.5px;
}

.input-wrap { position: relative; }
.input-wrap input { width: 100%; padding-right: 60px; }

.toggle-pw {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #0f7a55;
  font-size: 0.78rem;
  font-weight: 600;
  font-family: "DM Sans", sans-serif;
  cursor: pointer;
  padding: 0;
}
.toggle-pw:hover { color: #0a5e40; }

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
  width: 100%;
}
input:focus { border-color: #0f7a55; background: #f0faf5; }
input::placeholder { color: #bbb; }
input:disabled { opacity: 0.6; cursor: not-allowed; }
input.input-mismatch { border-color: #e24b4a; background: #fff8f8; }

.field-error {
  font-size: 0.78rem;
  color: #c0392b;
  margin-top: -2px;
}

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

.msg-error {
  background: #fff0f0;
  border: 1px solid #f5c6c6;
  color: #c0392b;
  border-radius: 10px;
  padding: 10px 14px;
  font-size: 0.85rem;
  margin-bottom: 16px;
}

/* State screens (success / invalid) */
.state-center { text-align: center; }
.state-icon {
  font-size: 2.5rem;
  font-weight: 700;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  font-family: "Sora", sans-serif;
}
.success-icon { background: #e6f7f0; color: #0f7a55; }
.error-icon   { background: #fff0f0; color: #c0392b; }
.state-center h1 { margin-bottom: 12px; }
.state-center .auth-sub { margin-bottom: 28px; }

.countdown {
  font-weight: 600;
  color: #0f7a55;
}

@media (max-width: 480px) {
  .auth-card { padding: 36px 22px; }
}
</style>
