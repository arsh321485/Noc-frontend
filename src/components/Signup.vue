<template>
  <div class="signup-page d-flex justify-content-center align-items-center">
    <div class="signup-card p-4 p-md-5 shadow-lg">
      <h2 class="text-center mb-4">
        <i class="fas fa-user-plus me-2"></i> Create Your Account
      </h2>

      <form @submit.prevent="handleSignup">
        <div class="row g-3">
          <!-- First Name -->
          <div class="col-md-6">
            <label class="form-label">First Name</label>
            <input
              v-model="form.firstname"
              type="text"
              class="form-control"
              placeholder="Enter first name"
              
            />
          </div>

          <!-- Last Name -->
          <div class="col-md-6">
            <label class="form-label">Last Name</label>
            <input
              v-model="form.lastname"
              type="text"
              class="form-control"
              placeholder="Enter last name"
              
            />
          </div>

          <!-- Email -->
          <div class="col-12">
            <label class="form-label">Email</label>
            <input
              v-model="form.email"
              type="email"
              class="form-control"
              placeholder="Enter email address"
              
            />
          </div>

          <!-- Username -->
          <div class="col-12">
            <label class="form-label">Username</label>
            <input
              v-model="form.username"
              type="text"
              class="form-control"
              placeholder="Enter username"
              
            />
          </div>

          <!-- Role -->
          <div class="col-12">
            <label class="form-label">Role</label>
            <select v-model="form.role" class="form-select" >
              <option value="" disabled>Select role</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
              <option value="manager">Manager</option>
            </select>
          </div>

          <!-- Password -->
          <div class="col-md-6">
            <label class="form-label">Password</label>
            <input
              v-model="form.password"
              type="password"
              class="form-control"
              placeholder="Enter password"
              
            />
          </div>

          <!-- Confirm Password -->
          <div class="col-md-6">
            <label class="form-label">Confirm Password</label>
            <input
              v-model="form.confirmPassword"
              type="password"
              class="form-control"
              placeholder="Confirm password"
              
            />
          </div>

          <!-- Submit Button -->
          <div class="col-12 text-center mt-4">
            <button type="submit" class="btn-signup px-5 py-2">
              <i class="fas fa-user-check me-2"></i> Sign Up
            </button>
          </div>
        </div>
      </form>

      <!-- Login Redirect -->
      <p class="text-center mt-4">
        Already have an account?
        <!-- <a href="/login" class="text-gradient fw-bold">Login here</a> -->
        <router-link to="/system" class="text-gradient fw-bold text-decoration-none">Login here</router-link>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "SignupPage",
  data() {
    return {
      form: {
        firstname: "",
        lastname: "",
        email: "",
        username: "",
        role: "",
        password: "",
        confirmPassword: "",
      },
    };
  },
  methods: {
    handleSignup() {
      if (this.form.password !== this.form.confirmPassword) {
        alert("Passwords do not match!");
        return;
      }
      console.log("Signup data:", this.form);
      alert("Signup successful!");
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
.form-control,
.form-select {
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.25);
  color: #fff;
  border-radius: 10px;
  padding: 10px 15px;
  transition: all 0.3s ease;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
}

.form-control::placeholder,
.form-select {
  color: rgba(255, 255, 255, 0.7);
}

.form-control:focus,
.form-select:focus {
  background: rgba(255, 255, 255, 0.2);
  border-color: #7a5af8;
  box-shadow: 0 0 10px rgba(122, 90, 248, 0.4);
  outline: none;
}

/* === Dropdown options (dark) === */
.form-select option {
  background-color: #2b2145;
  color: #fff;
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
  .form-control,
  .form-select {
    padding: 8px 12px;
  }
}
</style>
