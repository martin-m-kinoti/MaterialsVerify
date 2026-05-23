<template>
  <div class="auth-page">
    <div class="auth-card">
      <router-link to="/" class="back-link">← Back to home</router-link>

      <div class="auth-logo">
        <img src="/logo.png" alt="MaterialsVerify logo" class="logo-img" />
        <span class="logo-text">MaterialsVerify</span>
      </div>

      <h1>Welcome back</h1>
      <p class="auth-sub">Sign in to your account to continue</p>

      <button class="btn-google">
        <svg class="google-icon" viewBox="0 0 24 24" width="18" height="18">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Continue with Google
      </button>

      <div class="divider"><span>or sign in with email</span></div>

      <form class="auth-form" @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="email">Email address</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            placeholder="Enter your email address"
            required
          />
        </div>

        <div class="form-group">
          <label for="password">
            Password
            <a href="#" class="forgot-link">Forgot password?</a>
          </label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            placeholder="Enter your password"
            required
          />
        </div>

        <button type="submit" class="btn-submit" :disabled="loading">
          {{ loading ? "Signing in…" : "Sign In" }}
        </button>
      </form>

      <p class="auth-switch">
        Don't have an account?
        <router-link to="/register">Create one</router-link>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "LoginPage",
  data() {
    return {
      loading: false,
      form: { email: "", password: "" },
    };
  },
  methods: {
    handleLogin() {
      this.loading = true;
      // TODO: replace with real API call
      const prefix = this.form.email.split("@")[0];
      const name = prefix
        .split(/[._-]/)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
      localStorage.setItem(
        "mv_user",
        JSON.stringify({ name, email: this.form.email, role: "Buyer" })
      );
      this.$router.push("/dashboard");
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&family=DM+Sans:wght@400;500&display=swap");

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

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
.back-link:hover {
  color: #0a5e40;
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
}

/* Google button */
.btn-google {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 12px;
  background: transparent;
  border: 1.5px solid #d8eee5;
  border-radius: 12px;
  color: #333;
  font-size: 0.9rem;
  font-family: "DM Sans", sans-serif;
  font-weight: 500;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
  margin-bottom: 24px;
}
.btn-google:hover {
  border-color: #0f7a55;
  background: #f0faf5;
}

/* Divider */
.divider {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}
.divider::before,
.divider::after {
  content: "";
  flex: 1;
  height: 1px;
  background: #e8e8e8;
}
.divider span {
  font-size: 0.75rem;
  color: #aaa;
  white-space: nowrap;
  font-weight: 500;
  letter-spacing: 0.3px;
}

/* Form */
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 0.82rem;
  font-weight: 500;
  color: #555;
  display: flex;
  justify-content: space-between;
  align-items: center;
  letter-spacing: 0.5px;
}

.forgot-link {
  font-size: 0.78rem;
  color: #0f7a55;
  text-decoration: none;
  font-weight: 400;
  text-transform: none;
  letter-spacing: 0;
}
.forgot-link:hover {
  text-decoration: underline;
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
input:focus {
  border-color: #0f7a55;
  background: #f0faf5;
}
input::placeholder {
  color: #bbb;
}

.btn-submit {
  margin-top: 4px;
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
.btn-submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.auth-switch {
  text-align: center;
  margin-top: 24px;
  font-size: 0.85rem;
  color: #888;
}
.auth-switch a {
  color: #0f7a55;
  font-weight: 600;
  text-decoration: none;
}
.auth-switch a:hover {
  text-decoration: underline;
}

@media (max-width: 480px) {
  .auth-card {
    padding: 36px 22px;
  }
}
</style>
