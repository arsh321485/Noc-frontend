 <template>
  <div class="signup-page d-flex justify-content-center align-items-center">
    <div class="signup-card p-4 p-md-5 shadow-lg">
      <h2 class="text-center mb-4">
        <i class="fas fa-user-plus me-2"></i> Create Your Account
      </h2>

      <form @submit.prevent="handleSignup">
        <div class="row g-3">

          <div class="col-md-6">
            <label class="form-label">First Name</label>
            <input v-model="form.firstname" type="text" class="form-control" placeholder="Enter first name" />
          </div>

          <div class="col-md-6">
            <label class="form-label">Last Name</label>
            <input v-model="form.lastname" type="text" class="form-control" placeholder="Enter last name" />
          </div>

          <div class="col-12">
            <label class="form-label">Email</label>
            <input v-model="form.email" type="email" class="form-control" placeholder="Enter email address" />
          </div>

          <div class="col-12">
            <label class="form-label">Username</label>
            <input v-model="form.username" type="text" class="form-control" placeholder="Enter username" />
          </div>

          <div class="col-12">
            <label class="form-label">Role</label>
            <select v-model="form.role" class="form-select">
              <option value="" disabled>Select role</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
              <option value="manager">Manager</option>
            </select>
          </div>

          <!-- ✅ Password Field with Eye Toggle -->
          <div class="col-md-6 position-relative">
            <label class="form-label">Password</label>
            <div class="password-container">
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                class="form-control"
                placeholder="Enter password"
              />
              <i
                :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"
                class="toggle-password"
                @click="showPassword = !showPassword"
              ></i>
            </div>
          </div>

          <!-- ✅ Confirm Password Field with Eye Toggle -->
          <div class="col-md-6 position-relative">
            <label class="form-label">Confirm Password</label>
            <div class="password-container">
              <input
                v-model="form.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                class="form-control"
                placeholder="Confirm password"
              />
              <i
                :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"
                class="toggle-password"
                @click="showConfirmPassword = !showConfirmPassword"
              ></i>
            </div>
          </div>

          <div class="col-12 text-center mt-4">
            <button type="submit" class="btn-signup px-5 py-2">
              <i class="fas fa-user-check me-2"></i> Sign Up
            </button>
          </div>
        </div>
      </form>

      <p class="text-center mt-4">
        Already have an account?
        <router-link to="/login" class="text-gradient fw-bold text-decoration-none">Login here</router-link>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { useAuthStore } from "../stores/authStore";
import Swal from "sweetalert2";
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
      showPassword: false,
      showConfirmPassword: false,
    };
  },

  methods: {
    async handleSignup() {
      if (this.form.password !== this.form.confirmPassword) {
        Swal.fire({
          icon: "warning",
          title: "Passwords do not match!",
        });
        return;
      }

      const authStore = useAuthStore();

      await authStore.signup({
        firstname: this.form.firstname,
        lastname: this.form.lastname,
        username: this.form.username,
        email: this.form.email,
        password: this.form.password,
        confirmPassword: this.form.confirmPassword,
        role: this.form.role,
      });
    },
  },
});
</script>

<style scoped>
.signup-page {
  background-color: #1e1633;
  min-height: 100vh;
  padding: 2rem;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
}

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

h2 {
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 0.5px;
}

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

.form-select option {
  background-color: #2b2145;
  color: #fff;
}

.form-label {
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
}

/* ✅ Eye icon styling */
.password-container {
  position: relative;
}

.toggle-password {
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);
  cursor: pointer;
  color: #9b5de5; /* Always purple */
  font-size: 1rem;
  transition: transform 0.2s ease;
}

.toggle-password:hover {
  transform: scale(1.1);
}

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

.text-gradient {
  background: linear-gradient(135deg, #7a5af8, #9b5de5);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-decoration: none;
}

.text-gradient:hover {
  opacity: 0.8;
}

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
