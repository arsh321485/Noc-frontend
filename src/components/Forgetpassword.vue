<template>
  <div class="forgot-page d-flex justify-content-center align-items-center">
    <div class="forgot-card p-4 p-md-5 shadow-lg">
      <h2 class="text-center mb-4">
        <i class="fas fa-lock me-2"></i> Forgot Password
      </h2>

      <p class="text-center text-muted mb-4">
        Enter your registered email address and we’ll send you a password reset link.
      </p>

      <form @submit.prevent="handleForgotPassword">
        <!-- Email -->
        <div class="mb-3">
          <label class="form-label">Email Address</label>
          <input
            v-model="email"
            type="email"
            class="form-control"
            placeholder="Enter your email"
            required
          />
        </div>

        <!-- Submit Button -->
        <div class="text-center mt-4">
          <button type="submit" class="btn-forgot px-5 py-2">
            <i class="fas fa-paper-plane me-2"></i> Send Reset Link
          </button>
        </div>
      </form>

      <!-- Back to Login -->
      <p class="text-center mt-4">
        Remember your password?
        <a href="/login" class="text-gradient fw-bold">Back to Login</a>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "ForgotPassword",
  data() {
    return {
      email: "",
    };
  },
  methods: {
    handleForgotPassword() {
      if (!this.email) {
        alert("Please enter your email address.");
        return;
      }
      console.log("Password reset requested for:", this.email);
      alert(`Password reset link sent to ${this.email}`);
    },
  },
});
</script>

<style scoped>
/* === Background === */
.forgot-page {
  background-color: #1e1633; /* Same as signup page */
  min-height: 100vh;
  padding: 2rem;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* === Card === */
.forgot-card {
  width: 100%;
  max-width: 500px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  color: #fff;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.6);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.forgot-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.7);
}

/* === Heading === */
h2 {
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 0.5px;
}

/* === Paragraph === */
.text-muted {
  color: rgba(255, 255, 255, 0.75) !important;
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
.btn-forgot {
  background: linear-gradient(135deg, #7a5af8 0%, #9b5de5 100%);
  color: #fff;
  border: none;
  border-radius: 50px;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(155, 93, 229, 0.3);
  min-width: 200px;
}

.btn-forgot:hover {
  background: linear-gradient(135deg, #9b5de5 0%, #7a5af8 100%);
  box-shadow: 0 6px 25px rgba(155, 93, 229, 0.45);
  transform: translateY(-2px);
}

/* === Gradient Link === */
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
  .forgot-card {
    padding: 2rem;
  }
  h2 {
    font-size: 1.6rem;
  }
  .btn-forgot {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .forgot-card {
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
