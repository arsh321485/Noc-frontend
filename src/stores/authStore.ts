// src/stores/authStore.ts
import { defineStore } from "pinia";
import endpoint from "../sevices/apiServices";
import router from "../router";
import Swal from "sweetalert2";

interface User {
  id: string;
  firstname: string;
  lastname: string;
  full_name: string;
  username: string;
  email: string;
  role: string;
  created_at: string;
}

interface Tokens {
  access: string;
  refresh: string;
}

interface SignupResponse {
  message: string;
  user: User;
  tokens: Tokens;
}

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: JSON.parse(localStorage.getItem("user") || "null") as User | null,
    accessToken: localStorage.getItem("accessToken") || "",
    refreshToken: localStorage.getItem("refreshToken") || "",
  }),

  actions: {
    // ✅ SIGNUP FUNCTION
    async signup(payload: {
      firstname: string;
      lastname: string;
      username: string;
      email: string;
      password: string;
      confirmPassword: string;
      role: string;
    }) {
      try {
        const res = await endpoint.post<SignupResponse>(
          `/api/users/signup/`,
          {
            firstname: payload.firstname,
            lastname: payload.lastname,
            username: payload.username,
            email: payload.email,
            password: payload.password,
            confirm_password: payload.confirmPassword,
            role: payload.role,
          }
        );

        const { user, tokens } = res.data;

        // ✅ Save to localStorage
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("accessToken", tokens.access);
        localStorage.setItem("refreshToken", tokens.refresh);

        // ✅ Sync state
        this.user = user;
        this.accessToken = tokens.access;
        this.refreshToken = tokens.refresh;

        console.log("✅ User saved to localStorage:", user);

        Swal.fire({
          icon: "success",
          title: "Signup Successful!",
          text: "Your account has been created successfully.",
          timer: 2000,
          showConfirmButton: false,
        });

        // Redirect only after storing data
        router.push("/system");
      } catch (error: any) {
        console.error("Signup error:", error);

        Swal.fire({
          icon: "error",
          title: "Signup Failed",
          text:
            error.response?.data?.message ||
            "Something went wrong. Please try again.",
        });
      }
    },

     // ✅ LOGIN FUNCTION
  
async login(payload: { email: string; password: string }) {
  try {
    const res = await endpoint.post(`/api/users/login/`, {
      email: payload.email,
      password: payload.password,
    });

    const { user, tokens } = res.data;

    // ✅ Save user and tokens in localStorage
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("accessToken", tokens.access);
    localStorage.setItem("refreshToken", tokens.refresh);

    // ✅ Sync state
    this.user = user;
    this.accessToken = tokens.access;
    this.refreshToken = tokens.refresh;

    Swal.fire({
      icon: "success",
      title: "Login Successful!",
      text: `Welcome back, ${user.firstname}!`,
      timer: 2000,
      showConfirmButton: false,
    });

    // Redirect only after login success
    router.push("/system");
  } catch (error: any) {
    console.error("Login error:", error);

    let errorMessage = "Invalid email or password.";

    if (error.response?.data) {
      if (typeof error.response.data === "string") {
        errorMessage = error.response.data;
      } else if (error.response.data.message) {
        errorMessage = error.response.data.message;
      } else if (error.response.data.errors) {
        const errors = error.response.data.errors;
        errorMessage = Object.values(errors).flat().join("\n");
      }
    }

    Swal.fire({
      icon: "error",
      title: "Login Failed",
      text: errorMessage,
    });
  }
},



    // ✅ LOGOUT FUNCTION
    async logout() {
      try {
        const refresh = localStorage.getItem("refreshToken");

        if (refresh) {
          await endpoint.post(`/api/users/logout/`, { refresh });
        }

        localStorage.clear();
        this.user = null;
        this.accessToken = "";
        this.refreshToken = "";

        Swal.fire({
          icon: "success",
          title: "Logged out successfully",
          showConfirmButton: false,
          timer: 1500,
        });

        router.push("/login");
      } catch (error) {
        console.error("Logout error:", error);
        localStorage.clear();
        router.push("/login");
      }
    },
  },
});