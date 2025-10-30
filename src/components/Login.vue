<template>
  <div class="signup-page d-flex justify-content-center align-items-center">
    <div class="signup-card p-4 p-md-5 shadow-lg">
      <h2 class="text-center mb-4">
        <i class="fas fa-sign-in-alt me-2"></i> Login to Your Account
      </h2>

      <form @submit.prevent="handleLogin">
        <div class="row g-3">
          <!-- Email -->
          <div class="col-12">
            <label class="form-label">Email</label>
            <input
              v-model="form.email"
              type="email"
              class="form-control"
              placeholder="Enter email address"
              required
            />
          </div>

          <!-- Password -->
          <div class="col-12">
            <label class="form-label">Password</label>
            <input
              v-model="form.password"
              type="password"
              class="form-control"
              placeholder="Enter password"
              required
            />
          </div>

          <!-- Confirm Password -->
          <div class="col-12">
            <label class="form-label">Confirm Password</label>
            <input
              v-model="form.confirmPassword"
              type="password"
              class="form-control"
              placeholder="Confirm password"
              required
            />
          </div>

          <!-- Submit Button -->
          <div class="col-12 text-center mt-4">
            <!-- <button type="submit" class="btn-signup px-5 py-2">
              <i class="fas fa-sign-in-alt me-2"></i> Login
            </button> -->
            <router-link to="/system" class="btn-signup px-5 py-2 text-decoration-none"><i class="fas fa-sign-in-alt me-2"></i> Login</router-link>
          </div>
        </div>
      </form>

      <!-- Signup Redirect -->
      <p class="text-center mt-4">
        Don’t have an account?
        <!-- <a href="/signup" class="text-gradient fw-bold">Create one</a> -->
         <router-link to="/" class="text-gradient fw-bold text-decoration-none">Create one</router-link>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Login",
  data() {
    return {
      form: {
        email: "",
        password: "",
        confirmPassword: "",
      },
    };
  },
  methods: {
    handleLogin() {
      if (!this.form.email || !this.form.password || !this.form.confirmPassword) {
        alert("Please fill in all fields!");
        return;
      }

      if (this.form.password !== this.form.confirmPassword) {
        alert("Passwords do not match!");
        return;
      }

      console.log("Login data:", this.form);
      alert("Login successful!");
    },
  },
});
</script>

<style scoped>
/* === Background === */
.signup-page {
  background-color: #1e1633; /* Deep purple */
  min-height: 100vh;
  padding: 2rem;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* === Card === */
.signup-card {
  width: 100%;
  max-width: 600px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  color: #fff;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.6);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.signup-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.7);
}

/* === Heading === */
h2 {
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 0.5px;
}

/* === Input Fields === */
.form-control {
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.25);
  color: #fff;
  border-radius: 10px;
  padding: 10px 15px;
  transition: all 0.3s ease;
}

.form-control::placeholder {
  color: rgba(255, 255, 255, 0.7);
}

.form-control:focus {
  background: rgba(255, 255, 255, 0.2);
  border-color: #7a5af8;
  box-shadow: 0 0 10px rgba(122, 90, 248, 0.4);
  outline: none;
}

/* === Label === */
.form-label {
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
}

/* === Button === */
.btn-signup {
  background: linear-gradient(135deg, #7a5af8 0%, #9b5de5 100%);
  color: #fff;
  border: none;
  border-radius: 50px;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(155, 93, 229, 0.3);
  min-width: 180px;
}

.btn-signup:hover {
  background: linear-gradient(135deg, #9b5de5 0%, #7a5af8 100%);
  box-shadow: 0 6px 25px rgba(155, 93, 229, 0.45);
  transform: translateY(-2px);
}

/* === Link Text === */
.text-gradient {
  background: linear-gradient(135deg, #7a5af8, #9b5de5);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-decoration: none;
}

.text-gradient:hover {
  opacity: 0.8;
}

/* === Responsive Styles === */
@media (max-width: 768px) {
  .signup-card {
    padding: 2rem;
  }
  h2 {
    font-size: 1.6rem;
  }
  .btn-signup {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .signup-card {
    padding: 1.5rem;
  }
  h2 {
    font-size: 1.4rem;
  }
  .form-control {
    padding: 8px 12px;
  }
}
</style>
