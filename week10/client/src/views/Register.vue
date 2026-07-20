<template>
  <div class="auth-page">
    <div class="auth-card">
      <router-link to="/" class="back-link">← Back to home</router-link>

      <div class="auth-logo">
        <img src="/logo.png" alt="MaterialsVerify logo" class="logo-img" />
        <span class="logo-text">MaterialsVerify</span>
      </div>

      <h1>Create an account</h1>
      <p class="auth-sub">Join Kenya's trusted materials marketplace</p>

      <button class="btn-google" type="button" @click="handleGoogleSignup">
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

      <div class="divider"><span>or register with email</span></div>

      <form class="auth-form" @submit.prevent="handleRegister">
        <div class="form-row">
          <div class="form-group">
            <label for="firstName">First name</label>
            <input
              id="firstName"
              v-model="form.firstName"
              type="text"
              placeholder="First name"
              required
            />
          </div>
          <div class="form-group">
            <label for="lastName">Last name</label>
            <input
              id="lastName"
              v-model="form.lastName"
              type="text"
              placeholder="Last name"
              required
            />
          </div>
        </div>

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
          <label for="county">County</label>
          <select id="county" v-model="form.county" required>
            <option value="" disabled>Select your county</option>
            <option v-for="c in counties" :key="c" :value="c">{{ c }}</option>
          </select>
        </div>

        <div class="form-group">
          <label for="role">Role</label>
          <select id="role" v-model="form.role" required>
            <option value="" disabled>Select your role</option>
            <option value="buyer">Buyer / Contractor</option>
            <option value="supplier">Supplier / Manufacturer</option>
            <option value="inspector">Quality Inspector</option>
          </select>
        </div>

        <div class="form-group">
          <label for="password">Enter your password</label>
          <div class="pw-wrap">
            <input
              id="password"
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Min 8 characters"
              required
            />
            <button type="button" class="pw-toggle" @click="showPassword = !showPassword" :aria-label="showPassword ? 'Hide password' : 'Show password'">
              <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
            </button>
          </div>
        </div>
        <password-strength :password="form.password" />
        <span v-if="errors.password" class="field-error">{{ errors.password }}</span>

        <div class="form-group">
          <label for="confirmPassword">Confirm password</label>
          <div class="pw-wrap">
            <input
              id="confirmPassword"
              v-model="form.confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              placeholder="Re-enter your password"
              required
            />
            <button type="button" class="pw-toggle" @click="showConfirmPassword = !showConfirmPassword" :aria-label="showConfirmPassword ? 'Hide password' : 'Show password'">
              <svg v-if="!showConfirmPassword" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
            </button>
          </div>
          <span v-if="passwordMismatch" class="field-error">Passwords do not match</span>
        </div>

        <p v-if="error" class="form-error">{{ error }}</p>
        <p v-if="success" class="form-success">{{ success }}</p>

        <button
          type="submit"
          class="btn-submit"
          :disabled="loading || passwordMismatch"
        >
          {{ loading ? "Creating account…" : "Sign Up" }}
        </button>
      </form>

      <p class="auth-switch">
        Already have an account?
        <router-link to="/login">Sign in</router-link>
      </p>
    </div>
  </div>

</template>

<script>
import axios from 'axios';
import PasswordStrength from '@/components/PasswordStrength.vue';
export default {
  components: {
    PasswordStrength
  },

  name: "RegisterPage",
  data() {
    return {
      loading: false,
      error: '',
      errors: {},
      success: '',
      form: {
        firstName: "",
        lastName: "",
        email: "",
        county: "",
        role: "",
        password: "",
        confirmPassword: "",
      },
      showPassword: false,
      showConfirmPassword: false,
      counties: [
        "Baringo",
        "Bomet",
        "Bungoma",
        "Busia",
        "Elgeyo-Marakwet",
        "Embu",
        "Garissa",
        "Homa Bay",
        "Isiolo",
        "Kajiado",
        "Kakamega",
        "Kericho",
        "Kiambu",
        "Kilifi",
        "Kirinyaga",
        "Kisii",
        "Kisumu",
        "Kitui",
        "Kwale",
        "Laikipia",
        "Lamu",
        "Machakos",
        "Makueni",
        "Mandera",
        "Marsabit",
        "Meru",
        "Migori",
        "Mombasa",
        "Murang'a",
        "Nairobi",
        "Nakuru",
        "Nandi",
        "Narok",
        "Nyamira",
        "Nyandarua",
        "Nyeri",
        "Samburu",
        "Siaya",
        "Taita-Taveta",
        "Tana River",
        "Tharaka-Nithi",
        "Trans Nzoia",
        "Turkana",
        "Uasin Gishu",
        "Vihiga",
        "Wajir",
        "West Pokot",
      ],
    };
  },
  computed: {
    passwordScore() {
      const p = this.form.password;
      let score = 0;
      if (p.length >= 8) score++;
      if (/[A-Z]/.test(p)) score++;
      if (/[0-9]/.test(p)) score++;
      if (/[^A-Za-z0-9]/.test(p)) score++;
      return score;
    },

    passwordMismatch() {
      return (
        this.form.confirmPassword.length > 0 &&
        this.form.password !== this.form.confirmPassword
      );
    },
  },
  methods: {
    handleGoogleSignup() {
      window.location.href = 'http://localhost:9000/api/auth/google';
    },
    validate() {
      const e = {};

      // Component validation
      if (!this.form.firstName.trim()) {
        e.firstName = "First name is required";
      }

      if (!this.form.lastName.trim()) {
        e.lastName = "Last name is required";
      }

      if (!this.form.email.trim()) {
        e.email = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.email)) {
        e.email = "Invalid email format";
      }

      if (!this.form.county.trim()) {
        e.county = "County is required";
      }
      if (!this.form.role.trim()) {
        e.role = "Role is required";
      }

      // Password validation
      if (!this.form.password) {
        e.password = "Password is required";
      } else if (this.form.password.length < 8) {
        e.password = "Password must be at least 8 characters long";
      } else if (this.passwordScore < 3) {
        e.password = "Password is weak - meet at least 3 of the 4 criteria";
      }

      if (!this.form.confirmPassword) {
        e.confirmPassword = "Please confirm your password";
      } else if (this.form.confirmPassword !== this.form.password) {
        e.confirmPassword = "Passwords do not match";
      }

      this.errors = e;
      return Object.keys(e).length === 0;
    },

    async handleRegister() {
      if (!this.validate()) {
        return;
      }
      this.loading = true;
      this.errors = {};
      this.error = '';

      try {
        const res = await axios.post('http://localhost:9000/api/user', {
          firstName: this.form.firstName,
          lastName: this.form.lastName,
          email: this.form.email,
          county: this.form.county,
          role: this.form.role,
          password: this.form.password,
        });

        this.success = res.data.message || "Account created! Redirecting...";
        setTimeout(() => this.$router.push("/login"), 1500);
      } catch (err) {
        this.error = (err.response && err.response.data && (err.response.data.error || err.response.data.message))
          ? (err.response.data.error || err.response.data.message)
          : "Something went wrong. Please try again.";
      } finally {
        this.loading = false;
      }
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
  max-width: 500px;
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
  gap: 18px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
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
  letter-spacing: 0.5px;
}

.pw-wrap {
  position: relative;
  display: flex;
  align-items: center;
}
.pw-wrap input {
  flex: 1;
  padding-right: 46px;
}
.pw-toggle {
  position: absolute;
  right: 14px;
  background: none;
  border: none;
  cursor: pointer;
  color: #999;
  display: flex;
  align-items: center;
  padding: 0;
  transition: color 0.15s;
}
.pw-toggle:hover { color: #0f7a55; }

input,
select {
  padding: 13px 16px;
  background: #f8fdfb;
  border: 1.5px solid #d8eee5;
  border-radius: 12px;
  font-size: 0.9rem;
  font-family: "DM Sans", sans-serif;
  color: #1a1a1a;
  outline: none;
  width: 100%;
  transition: border-color 0.2s, background 0.2s;
  appearance: none;
  -webkit-appearance: none;
}
input:focus,
select:focus {
  border-color: #0f7a55;
  background: #f0faf5;
}
input::placeholder {
  color: #bbb;
}

select {
  cursor: pointer;
}
select option {
  background: #fff;
  color: #1a1a1a;
}

.field-error {
  font-size: 0.78rem;
  color: #dc2626;
  font-weight: 500;
}

.form-error {
  font-size: 0.85rem;
  color: #dc2626;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 10px;
  padding: 10px 14px;
  text-align: center;
}

.form-success {
  font-size: 0.85rem;
  color: #0f7a55;
  background: #f0faf5;
  border: 1px solid #d8eee5;
  border-radius: 10px;
  padding: 10px 14px;
  text-align: center;
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
    padding: 36px 20px;
  }
  .form-row {
    grid-template-columns: 1fr;
  }
}

</style>
