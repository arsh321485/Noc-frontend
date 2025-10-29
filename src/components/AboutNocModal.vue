<template>
  <div v-if="showModal" class="overlay">
    <div class="about-modal glass-card animate-fade">
      <!-- Header -->
      <div
        class="modal-header d-flex justify-content-between align-items-center border-bottom border-secondary pb-2 mb-3"
      >
        <h5 class="text-white fw-bold mb-0">
          <i class="fas fa-info-circle me-2 mx-3 text-info mt-4"></i>
          About NOC System Dashboard
        </h5>
        <button class="btn-close btn-close-white me-3" @click="closeModal"></button>
      </div>

      <!-- Body -->
      <div class="modal-body text-center">
        <div class="mb-3">
          <i class="fas fa-network-wired text-primary fs-2"></i>
        </div>

        <h3 class="text-white fw-bold mb-1">NOC System Dashboard</h3>
        <p class="text-secondary small mb-4">
          Network Operations Center Application
        </p>

        <!-- Version & Year -->
        <div class="d-flex justify-content-center gap-3 mb-4 flex-wrap">
          <div class="info-card bg-dark-glass">
            <h5 class="text-success mb-0 fw-bold">v2.3.11</h5>
            <small class="text-white-50">Version</small>
          </div>
          <div class="info-card bg-dark-glass">
            <h5 class="text-warning mb-0 fw-bold">2025</h5>
            <small class="text-white-50">Year</small>
          </div>
        </div>

        <!-- Key Features -->
        <div class="text-start mx-auto" style="max-width: 420px;">
          <h6 class="text-primary fw-bold mb-2">
            <i class="fas fa-star me-2"></i> Key Features
          </h6>
          <ul class="feature-list list-unstyled mb-4">
            <li v-for="(feature, i) in features" :key="i">
              <i class="fas fa-check-circle text-success me-2"></i> {{ feature }}
            </li>
          </ul>

          <!-- Developer -->
          <div class="developer-card text-center">
            <h6 class="text-secondary mb-2">
              <i class="fas fa-code me-2"></i> Developed by
            </h6>
            <h5 class="fw-bold text-warning mb-1">Dionipe</h5>
            <p class="text-secondary small mb-2">Network Operations Specialist</p>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="modal-footer text-center border-top border-secondary pt-3 mt-3">
        <button class="btn btn-secondary px-4 rounded-pill mb-3" @click="closeModal">
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AboutNocModal",
  data() {
    return {
      showModal: false,
      features: [
        "Glassmorphism UI Design",
        "Real-time Network Monitoring",
        "MikroTik Device Management",
        "SLA Compliance Tracking",
        "Data Persistence & Backup System",
        "Automated Backup Management",
        "Disaster Recovery Procedures",
        "Advanced Notification System",
      ],
    };
  },
  methods: {
    openModal() {
      this.showModal = true;
      document.body.style.overflow = "hidden";
    },
    closeModal() {
      this.showModal = false;
      document.body.style.overflow = "auto";
    },
  },
};
</script>

<style scoped>
/* reuse your existing CSS from your modal — exactly as before */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(10, 10, 25, 0.8);
  backdrop-filter: blur(12px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  padding: 1rem;
}
.about-modal {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  width: 100%;
  max-width: 520px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6);
  color: #fff;
}
.about-modal::-webkit-scrollbar {
  width: 6px;
}
.about-modal::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 6px;
}
.feature-list li {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 8px 12px;
  margin-bottom: 6px;
  transition: 0.3s;
}
.feature-list li:hover {
  background: rgba(79, 172, 254, 0.1);
}
.animate-fade {
  animation: fadeInUp 0.4s ease forwards;
}
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
