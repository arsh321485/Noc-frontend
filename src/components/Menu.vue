<template>
  <div class="col-md-1 d-none d-md-flex justify-content-center">
    <div class="sidebar">
      <ul class="sidebar-icons">
        <li
          v-for="(icon, index) in icons"
          :key="index"
          :class="['icon-item', { active: activeIndex === index }]"
          @click="setActive(index)"
          @mouseenter="showTooltip(index)"
          @mouseleave="hideTooltip"
        >
          <i :class="icon"></i>
          <span
            v-if="tooltipIndex === index"
            class="tooltip-text"
          >
            {{ tooltips[index] }}
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Swal from "sweetalert2";

export default {
  name: "Menu",
  data() {
    return {
      activeIndex: 0,
      tooltipIndex: null,
      icons: [
        "fas fa-network-wired",
        "fas fa-tachometer-alt",
        "fas fa-desktop",
        "fas fa-project-diagram",
        "fas fa-chart-line",
        "fas fa-link",
        "fas fa-bell",
        "fas fa-globe",
        "fas fa-sticky-note",
        "fas fa-cog",
        "fas fa-clock",
        "fas fa-server",
        "fas fa-user",
        "fas fa-info-circle",
        "fas fa-sign-out-alt",
      ],
      tooltips: [
        "NOC Dashboard",
        "Dashboard",
        "Device Monitoring",
        "Network Topology",
        "RRD Integration",
        "Topology Links",
        "Notification Center",
        "Website Monitoring",
        "Downtime Notes",
        "Device Management",
        "SLA Management",
        "MRTG Device Manager",
        "User Profile",
        "About NOC Dashboard",
        "Logout",
      ],
      routes: [
        "/system", // NOC Dashboard
        null, // Dashboard
        "device-monitor", // Device Monitoring
        "/network-topology", // Network Topology
        "/rrd-integration",
        "/topology-links",
        "/notification-center",
        "website-monitoring",
        "/downtime-notes",
        null, // Device Management
        "/sla-management", // SLA Management
        "/mrtg-device", // MRTG Device Manager
        "/user-profile",
        "/about-noc", // About NOC Dashboard
        null, // Logout
      ],
    };
  },
  methods: {
    // setActive(index) {
    //   this.activeIndex = index;
    //   const targetRoute = this.routes[index];
      
    //   if (this.tooltips[index] === "About NOC Dashboard") {
    //     this.$root.$refs.aboutModal.openModal();
    //     return;
    //   }

    //   if (targetRoute) {
    //     this.$router.push(targetRoute);
    //   } else {
    //     alert(`${this.tooltips[index]} is not available yet.`);
    //   } 
    // },
    async setActive(index) {
      this.activeIndex = index;
      const targetRoute = this.routes[index];

      // ✅ Handle "About NOC Dashboard"
      if (this.tooltips[index] === "About NOC Dashboard") {
        this.$root.$refs.aboutModal.openModal();
        return;
      }

      // ✅ Handle "Logout"
      if (this.tooltips[index] === "Logout") {
        const result = await Swal.fire({
          title: "Are you sure you want to logout?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#667eea",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, Logout",
          cancelButtonText: "No, Cancel",
          background: "rgba(28,27,48,0.95)",
          color: "#fff",
          backdrop: `rgba(0,0,0,0.7)`,
        });

        if (result.isConfirmed) {
          await Swal.fire({
            icon: "success",
            title: "Logged out successfully",
            timer: 1500,
            showConfirmButton: false,
            background: "rgba(28,27,48,0.95)",
            color: "#fff",
          });
          this.$router.push("/login");
        }
        return; 
      }

      // ✅ Normal route navigation
      if (targetRoute) {
        this.$router.push(targetRoute);
      } else {
        Swal.fire({
          icon: "info",
          title: `${this.tooltips[index]} is not available yet.`,
          timer: 1500,
          showConfirmButton: false,
          background: "rgba(28,27,48,0.95)",
          color: "#fff",
        });
      }
    },
    showTooltip(index) {
      this.tooltipIndex = index;
    },
    hideTooltip() {
      this.tooltipIndex = null;
    },
  },
  mounted() {
    const currentPath = this.$route.path;
    const foundIndex = this.routes.findIndex((route) => route === currentPath);
    if (foundIndex !== -1) {
      this.activeIndex = foundIndex;
    }
  },
};
</script>

<style scoped>
.sidebar {
  position: fixed;
  top: 20px;
  left: 20px;
  height: calc(100vh - 40px);
  width: 70px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  padding: 20px 0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.sidebar-icons {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
}

.icon-item {
  width: 36px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.7);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.icon-item:hover {
  color: #8b9cff;
  background: rgba(255, 255, 255, 0.08);
  transform: scale(1.05);
}

.icon-item.active {
  color: #fff;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 15px rgba(118, 75, 162, 0.5);
}

.icon-item i {
  font-size: 16px;
}

.tooltip-text {
  position: absolute;
  left: 60px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  padding: 6px 10px;
  border-radius: 8px;
  font-size: 13px;
  white-space: nowrap;
  backdrop-filter: blur(6px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 10;
  animation: fadeIn 0.2s ease forwards;
  pointer-events: none;
}

.tooltip-text::before {
  content: "";
  position: absolute;
  left: -12px;
  top: 50%;
  transform: translateY(-50%);
  border-width: 5px;
  border-style: solid;
  border-color: transparent rgba(255, 255, 255, 0.2) transparent transparent;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@media (max-width: 992px) {
  .tooltip-text {
    left: 60px;
    font-size: 12px;
    padding: 5px 8px;
  }
}

@media (min-width: 768px) and (max-width: 1180px) {
  .sidebar {
    left: 15px;
    top: 15px;
    width: 80px; 
    height: calc(100vh - 30px);
    border-radius: 18px;
    padding: 25px 0;
  }

  .sidebar-icons {
    gap: 14px;
  }

  .icon-item {
    width: 42px;
    height: 32px;
  }

  .icon-item i {
    font-size: 18px; 
  }
}

@media (max-width: 767px) {
  .sidebar {
    display: none;
  }
}

</style>
