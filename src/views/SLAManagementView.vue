<template>
  <main>
    <div class="container-fluid sla-management">
      <div class="row me-0">
        <!-- Sidebar -->
        <div class="col-1">
          <Menu />
        </div>

        <!-- Main -->
        <div class="col-11 main-content">
          <!-- 🔹 HEADER -->
          <header class="sla-header d-flex justify-content-between align-items-start flex-wrap px-3 pt-4 pb-3">
            <div>
              <h2 class="sla-title">
                <i class="fas fa-chart-line me-2"></i> SLA Management
              </h2>
              <p class="sla-subtitle">
                Monitor and manage Service Level Agreements for your network infrastructure
              </p>
            </div>
            <button class="btn home-btn mt-2 mt-md-0">
              <i class="fas fa-home me-1"></i> Home
            </button>
          </header>

          <!-- 🔹 SLA OVERVIEW -->
          <section class="card glass-card mt-3 p-4">
            <h5 class="section-title">
              <i class="fas fa-globe me-2"></i> SLA Overview
            </h5>

            <div class="row g-3 align-items-center">
              <div class="col-lg-7 col-12">
                <div class="row g-3">
                  <div class="col-6 col-md-3" v-for="m in metrics" :key="m.label">
                    <div class="metric-card text-center">
                      <div class="metric-icon" :class="m.color">
                        <i :class="m.icon"></i>
                      </div>
                      <div class="metric-text">
                        <div class="metric-title">
                          {{ m.loading ? "Loading..." : m.value }}
                        </div>
                        <small>{{ m.label }}</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Donut Chart -->
              <div class="col-lg-5 col-12 text-center">
                <div class="chart-container donut-container">
                  <canvas ref="donutChart"></canvas>
                </div>
                <div class="donut-legend mt-3 small text-white">
                  <span class="legend-dot dot-green me-2" @click="toggleSegment(0)"></span>
                  Compliant
                  <span class="legend-dot dot-yellow me-2" @click="toggleSegment(1)"></span>
                  Warning
                  <span class="legend-dot dot-red me-2" @click="toggleSegment(2)"></span>
                  Critical
                </div>
              </div>
            </div>
          </section>

          <!-- 🔹 SLA CONFIGURATION -->
          <section class="card glass-card mt-4 p-4">
            <h5 class="section-title">
              <i class="fas fa-cogs me-2"></i> SLA Configuration
            </h5>

            <div class="row g-4">
              <div class="col-md-6 col-12">
                <div class="config-card p-3">
                  <h6 class="fw-bold mb-3 text-white">
                    <i class="fas fa-clock text-primary me-2"></i> Uptime Targets
                  </h6>
                  <div v-for="(val, key) in config.uptime" :key="key"
                    class="config-row d-flex justify-content-between align-items-center py-2">
                    <span class="text-capitalize">{{ key }} Priority</span>
                    <div class="d-flex align-items-center">
                      <input type="number" v-model.number="config.uptime[key]"
                        class="config-input form-control form-control-sm text-end" />
                      <span class="unit mx-2">%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-md-6 col-12">
                <div class="config-card p-3">
                  <h6 class="fw-bold mb-3 text-white">
                    <i class="fas fa-tachometer-alt text-primary me-2"></i> Performance Targets
                  </h6>
                  <div v-for="(val, key) in config.performance" :key="key"
                    class="config-row d-flex align-items-center justify-content-between mb-3">
                    <span class="text-capitalize grow me-3 label-text">{{ formatKey(key) }}</span>
                    <div class="d-flex align-items-center input-group-config">
                      <input type="number" v-model.number="config.performance[key]"
                        class="config-input form-control form-control-sm text-end" />
                      <span class="unit ms-2">{{ getUnit(key) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="text-center mt-4">
              <button class="btn btn-primary btn-gradient me-3" @click="saveConfig">
                <i class="fas fa-save me-1"></i> Save Configuration
              </button>
              <button class="btn btn-danger" @click="resetConfig">
                <i class="fas fa-undo me-1"></i> Reset to Default
              </button>
            </div>
          </section>

          <!-- 🔹 ACTIVE SLA VIOLATIONS -->
          <section class="card glass-card mt-4 p-4">
            <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap">
              <h5 class="section-title mb-2 mb-md-0">
                <i class="fas fa-exclamation-triangle me-2"></i> Active SLA Violations
              </h5>

              <div class="d-flex align-items-center flex-wrap gap-2">
                <button class="btn btn-danger d-flex align-items-center" @click="resolveAll">
                  <i class="fas fa-check me-1"></i> Resolve All Violations
                </button>

                <button class="btn btn-gradient d-flex align-items-center" @click="refreshViolations"
                  :disabled="isRefreshing">
                  <i class="fas fa-sync-alt me-1" :class="{ spin: isRefreshing }"></i>
                  {{ isRefreshing ? 'Refreshing...' : 'Refresh' }}
                </button>
              </div>

            </div>

            <div class="add-violation-form mb-4">
              <div class="d-flex flex-wrap gap-2 align-items-center justify-content-between">
                <input v-model="newViolation.device" type="text" class="form-control form-control-sm grow"
                  placeholder="Device" />
                <input v-model="newViolation.service" type="text" class="form-control form-control-sm grow"
                  placeholder="Service" />
                <input v-model="newViolation.category" type="text" class="form-control form-control-sm grow"
                  placeholder="Category" />
                <input v-model="newViolation.type" type="text" class="form-control form-control-sm grow"
                  placeholder="Violation Type" />
                <select v-model="newViolation.severity" class="form-select form-select-sm grow">
                  <option disabled value="">Severity</option>
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                  <option>Critical</option>
                </select>
                <select v-model="newViolation.status" class="form-select form-select-sm grow">
                  <option>Active</option>
                  <option>Resolved</option>
                </select>
                <input v-model="newViolation.duration" type="text" class="form-control form-control-sm grow"
                  placeholder="Duration (e.g. 2m 25s)" />
                <button class="btn btn-success btn-sm grow px-3" @click="addViolation">
                  <i class="fas fa-plus me-1"></i> Add Violation
                </button>
              </div>
            </div>

            <div v-if="loadingViolations" class="text-center py-4 text-muted">
              <div class="spinner-border text-light spinner-border-sm me-2"></div>
              Loading violations...
            </div>

            <div v-else>
              <div class="table-responsive">
                <table class="table table-borderless  align-middle">
                  <thead>
                    <tr>
                      <th class="text-white">Device</th>
                      <th class="text-white">Service</th>
                      <th class="text-white">Category</th>
                      <th class="text-white">Violation Type</th>
                      <th class="text-white">Severity</th>
                      <th class="text-white">Status</th>
                      <th class="text-white">Duration</th>
                      <th class="text-white">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="v in activeViolations" :key="v.id">
                      <td class="text-white">{{ v.device }}</td>
                      <td class="text-white">{{ v.service }}</td>
                      <td class="text-white"><span class="badge bg-warning text-dark">{{ v.category }}</span></td>
                      <td class="text-white">{{ v.type }}</td>
                      <td class="text-white"><span :class="['badge', severityClass(v.severity)]">{{ v.severity }}</span>
                      </td>
                      <td class="text-white">{{ v.status }}</td>
                      <td class="text-white">{{ v.duration }}</td>
                      <td>
                        <button class="btn btn-sm btn-danger" @click="resolveViolation(v.id)">
                          <i class="fas fa-check"></i>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <!-- 🔹 RESOLVED SLA VIOLATIONS -->
          <section class="card glass-card mt-4 p-4">
            <h5 class="section-title mb-4">
              <i class="fas fa-chart-pie me-2"></i> Resolved SLA Violations Analytics
            </h5>

            <div class="row g-3 mb-4">
              <div class="col-6 col-md-3" v-for="a in analytics" :key="a.label">
                <div class="metric-card text-center">
                  <div class="metric-icon" :class="a.color">
                    <i :class="a.icon"></i>
                  </div>
                  <div class="metric-text">
                    <div class="metric-title">{{ a.value }}</div>
                    <small>{{ a.label }}</small>
                  </div>
                </div>
              </div>
            </div>

            <h6 class="fw-bold mb-3 text-white">
              <i class="fas fa-list me-2"></i> Recent Resolved Violations
            </h6>

            <div v-if="loadingResolved" class="text-center py-4 text-muted">
              <div class="spinner-border text-light spinner-border-sm me-2"></div>
              Loading resolved violations...
            </div>

            <div v-else>
              <table class="table table-dark-glass align-middle text-white w-100 static-table">
                <thead>
                  <tr>
                    <th class="text-white">Service</th>
                    <th class="text-white">Violation Type</th>
                    <th class="text-white">Severity</th>
                    <th class="text-white">Duration</th>
                    <th class="text-white">Resolved At</th>
                    <th class="text-white">Resolved By</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="r in resolvedViolations" :key="r.id" class="resolved-row">
                    <td class="text-white">{{ r.service }}</td>
                    <td class="text-white">{{ r.violationType }}</td>
                    <td class="text-white"><span :class="['badge', severityClass(r.severity)]">{{ r.severity }}</span>
                    </td>
                    <td class="text-white">{{ r.duration }}</td>
                    <td class="text-white">{{ r.resolvedAt }}</td>
                    <td class="text-white">{{ r.resolvedBy }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <!-- 🔹 SLA REPORTS -->
          <section class="card glass-card mt-4 p-4 mb-5">
            <h5 class="section-title mb-4">
              <i class="fas fa-file-alt me-2"></i> SLA Reports
            </h5>

            <div class="row g-3">
              <div class="col-12 col-md-4" v-for="report in reports" :key="report.title">
                <div class="report-card p-3 text-center">
                  <h6><i class="fas fa-calendar me-2"></i> {{ report.title }}</h6>
                  <p class="text-muted small">{{ report.desc }}</p>
                  <button class="btn btn-success btn-sm" @click="generateReport(report.type)">
                    <i class="fas fa-download me-1"></i> Generate {{ report.title }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Line Chart -->
            <div class="line-chart-container mt-4">
              <canvas ref="lineChart"></canvas>
            </div>
          </section>
        </div>
      </div>
    </div>

    <!-- 🔔 Notification Toasts -->


    <div class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 9999">
      <div v-for="(toast, index) in toasts" :key="index" class="modern-toast" :class="toast.type">
        <div class="toast-left-bar"></div>
        <div class="toast-content">
          <i v-if="toast.type === 'success'" class="fas fa-check-circle icon"></i>
          <i v-if="toast.type === 'error'" class="fas fa-exclamation-circle icon"></i>
          <i v-if="toast.type === 'info'" class="fas fa-info-circle icon"></i>
          <i v-if="toast.type === 'warning'" class="fas fa-exclamation-triangle icon"></i>
          <span class="toast-message">{{ toast.message }}</span>
        </div>
        <button class="toast-close" @click="removeToast(index)">×</button>
      </div>
    </div>

  </main>
</template>


<script>
import '../assets/main.css'
import Menu from '@/components/Menu.vue';
import Chart from "chart.js/auto";

export default {
  name: "SLAView",
  components: {
    Menu
  },

  data() {
    return {
      donutInstance: null,
      lineInstance: null,
      toasts: [], // ✅ Toast notifications
      isRefreshing: false,


      metrics: [
        { label: "OVERALL COMPLIANCE", icon: "fas fa-check-circle", color: "text-success", value: "99.2%", loading: false },
        { label: "ACTIVE VIOLATIONS", icon: "fas fa-exclamation-triangle", color: "text-warning", value: "2", loading: false },
        { label: "MONITORED SERVICES", icon: "fas fa-server", color: "text-info", value: "12", loading: false },
        { label: "AVG RESPONSE TIME", icon: "fas fa-clock", color: "text-danger", value: "320ms", loading: false },
      ],

      config: {
        uptime: { critical: 99.9, high: 99.5, medium: 98, low: 95 },
        performance: { latency: 100, packetLoss: 1, minBandwidth: 10, jitter: 50 },
      },

      activeViolations: [],
      loadingViolations: true,
      loadingResolved: true,

      analytics: [
        { label: "TOTAL RESOLVED", icon: "fas fa-check-circle", color: "text-success", value: "8", loading: false },
        { label: "AVG RESOLUTION TIME", icon: "fas fa-clock", color: "text-warning", value: "12m", loading: false },
        { label: "RESOLVED TODAY", icon: "fas fa-calendar-day", color: "text-success", value: "3", loading: false },
        { label: "RESOLUTION RATE", icon: "fas fa-trophy", color: "text-danger", value: "92%", loading: false },
      ],

      reports: [
        { title: "Daily Report", desc: "Generate daily SLA compliance report", type: "daily" },
        { title: "Weekly Report", desc: "Generate weekly SLA performance summary", type: "weekly" },
        { title: "Monthly Report", desc: "Generate comprehensive monthly SLA analysis", type: "monthly" },
      ],

      newViolation: {
        device: "",
        service: "",
        category: "",
        type: "",
        severity: "",
        status: "Active",
        duration: "",
      },

      resolvedViolations: [
        { id: 1, service: "Core-ipe → 192.168.249.1 (ethernet)", violationType: "uptime", severity: "Critical", duration: "90 min", resolvedAt: "10/27/2025, 10:34:16 AM", resolvedBy: "user" },
        { id: 2, service: "Core-ipe → 172.16.218.2 (ethernet)", violationType: "uptime", severity: "Critical", duration: "90 min", resolvedAt: "10/27/2025, 10:34:16 AM", resolvedBy: "user" },
        { id: 3, service: "Distri to GW", violationType: "latency", severity: "High", duration: "90 min", resolvedAt: "10/27/2025, 10:34:16 AM", resolvedBy: "user" },
        { id: 4, service: "192.168.249.1 → 103.142.214.250", violationType: "uptime", severity: "Critical", duration: "85 min", resolvedAt: "10/27/2025, 10:34:16 AM", resolvedBy: "user" },
        { id: 5, service: "BIZNETDC-IDBSD-DISTI → 172.16.218.1 (ethernet)", violationType: "uptime", severity: "Critical", duration: "85 min", resolvedAt: "10/27/2025, 10:34:16 AM", resolvedBy: "user" },
      ],
    };
  },

  mounted() {
    this.$nextTick(() => {
      this.renderDonut();
      this.renderLine();
    });

    // Simulate loading effect
    setTimeout(() => (this.loadingViolations = false), 800);
    setTimeout(() => (this.loadingResolved = false), 800);

    // Default active violations
    this.activeViolations = [
      {
        id: 1,
        device: "Unknown Device",
        service: "Distri to GW",
        category: "GENERAL",
        type: "Unknown",
        severity: "High",
        status: "Active",
        duration: "2m 25s",
      },
      {
        id: 2,
        device: "Unknown Device",
        service: "Core-ipe → 172.16.218.2 (ethernet)",
        category: "GENERAL",
        type: "Unknown",
        severity: "Critical",
        status: "Active",
        duration: "2m 25s",
      },
    ];
  },

  methods: {
    /** ✅ Chart.js Donut */
    renderDonut() {
      const ctx = this.$refs.donutChart?.getContext("2d");
      if (!ctx) return;
      if (this.donutInstance) this.donutInstance.destroy();

      this.donutInstance = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: ["Compliant", "Warning", "Critical"],
          datasets: [
            {
              data: [75, 15, 10],
              backgroundColor: ["#2ecc71", "#f1c40f", "#e74c3c"],
              cutout: "70%",
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: { animateRotate: true, animateScale: true },
          plugins: { legend: { display: false } },
        },
      });
    },

    /** ✅ Chart.js Line */
    renderLine() {
      const ctx = this.$refs.lineChart?.getContext("2d");
      if (!ctx) return;
      if (this.lineInstance) this.lineInstance.destroy();

      this.lineInstance = new Chart(ctx, {
        type: "line",
        data: {
          labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          datasets: [
            {
              label: "SLA %",
              data: [98.5, 97.8, 99.1, 98.9, 97.4, 99.0, 98.7],
              borderColor: "#4facfe",
              backgroundColor: "rgba(79,172,254,0.1)",
              pointBackgroundColor: "#4facfe",
              pointBorderColor: "#4facfe",
              pointRadius: 4,
              pointHoverRadius: 6,
              tension: 0.4,
              fill: true,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: { intersect: false, mode: "index" },
          animation: { duration: 1000, easing: "easeOutQuart" },
          scales: {
            x: { ticks: { color: "#ccc" }, grid: { color: "rgba(255,255,255,0.08)" } },
            y: { min: 90, max: 100, ticks: { color: "#ccc" }, grid: { color: "rgba(255,255,255,0.05)" } },
          },
          plugins: {
            legend: { display: false },
            tooltip: { backgroundColor: "rgba(0,0,0,0.7)" },
          },
        },
      });
    },

    /** ✅ Toggle donut segment visibility */
    toggleSegment(i) {
      const meta = this.donutInstance?.getDatasetMeta(0);
      if (!meta) return;
      meta.data[i].hidden = !meta.data[i].hidden;
      this.donutInstance.update();
    },

    /** ✅ Toast notification system */
    showToast(message, type = "info") {
      this.toasts.push({ message, type });
      setTimeout(() => this.toasts.shift(), 4000);
    },
    removeToast(index) {
      this.toasts.splice(index, 1);
    },

    /** ✅ Core functions */
    addViolation() {
      if (!this.newViolation.device || !this.newViolation.service) {
        this.showToast("Please fill required fields!", "warning");
        return;
      }
      this.activeViolations.push({
        id: Date.now(),
        ...this.newViolation,
        category: this.newViolation.category || "GENERAL",
        type: this.newViolation.type || "Unknown",
        severity: this.newViolation.severity || "Low",
        status: this.newViolation.status || "Active",
        duration: this.newViolation.duration || "0m 0s",
      });
      this.showToast("New violation added!", "success");
      this.newViolation = { device: "", service: "", category: "", type: "", severity: "", status: "Active", duration: "" };
    },

    saveConfig() {
      this.showToast("Configuration saved successfully!", "success");
    },
    resetConfig() {
      this.config = { uptime: { critical: 99.9, high: 99.5, medium: 98, low: 95 }, performance: { latency: 100, packetLoss: 1, minBandwidth: 10, jitter: 50 } };
      this.showToast("Configuration reset to default!", "info");
    },
    refreshViolations() {
      if (this.isRefreshing) return; // prevent multiple clicks
      this.isRefreshing = true;

      this.showToast("🔄 Refreshing SLA data...", "info");

      setTimeout(() => {
        // simulate data reloading or re-fetching
        this.loadingViolations = true;

        setTimeout(() => {
          this.loadingViolations = false;
          this.isRefreshing = false;
          this.showToast("✅ Refreshed successfully!", "success");
        }, 1000);
      }, 400);
    },

    resolveAll() {
      this.activeViolations = [];
      this.showToast("All violations resolved!", "success");
    },
    resolveViolation(id) {
      this.activeViolations = this.activeViolations.filter((v) => v.id !== id);
      this.showToast("Violation resolved!", "success");
    },
    generateReport(type) {
      this.showToast(`Generating ${type} report...`, "info");
    },

    /** Helpers */
    formatKey(k) {
      return k.replace(/([A-Z])/g, " $1");
    },
    getUnit(k) {
      if (k === "latency" || k === "jitter") return "ms";
      if (k === "packetLoss") return "%";
      if (k === "minBandwidth") return "Mbps";
      return "";
    },
    severityClass(s) {
      if (s === "High") return "bg-danger";
      if (s === "Medium") return "bg-warning text-dark";
      return "bg-success";
    },
  },
};
</script>





<style scoped>
.sla-management {
  padding: 30px;
}

/* 🌙 Modern Dark Toast Style */
.modern-toast {
  display: flex;
  align-items: center;
  position: relative;
  background: #1e1e2f;
  color: #fff;
  border-radius: 10px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
  overflow: hidden;
  min-width: 380px;
  max-width: 400px;
  margin-bottom: 12px;
  padding: 10px 14px;
  font-size: 0.95rem;
  animation: slideInRight 0.4s ease forwards;
}

/* 🔵 Colored left bar */
.toast-left-bar {
  position: absolute;
  left: 0;
  top: 0;
  width: 6px;
  height: 100%;
  border-radius: 8px 0 0 8px;
}

.modern-toast.success .toast-left-bar {
  background-color: #4caf50;
}

.modern-toast.error .toast-left-bar {
  background-color: #f44336;
}

.modern-toast.info .toast-left-bar {
  background-color: #2196f3;
}

.modern-toast.warning .toast-left-bar {
  background-color: #ff9800;
}

/* Toast content area */
.toast-content {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-left: 14px;
}

/* Icons */
.icon {
  font-size: 1rem;
  opacity: 0.9;
}

/* Message */
.toast-message {
  flex: 1;
  font-weight: 500;
  color: #fff;
}

/* Close button */
.toast-close {
  background: none;
  border: none;
  color: #ccc;
  font-size: 1.2rem;
  margin-left: 8px;
  cursor: pointer;
  transition: color 0.2s ease;
}

.toast-close:hover {
  color: #fff;
}

/* Slide-in animation */
@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(100%);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}





.table {
  background-color: rgba(221, 203, 203, 0.04);
  --bs-table-bg: none;



}

.text-capitalize {
  color: aliceblue;
}

.home-btn {
  background-color: white;
  margin-right: 50px;
}


.sla-title {
  color: rgb(103, 117, 219);
  font-weight: 700;
}

.sla-subtitle {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.95rem;
}

.glass-card {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.07);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
  margin-right: 50px;
}

.section-title {
  font-weight: 600;
  margin-bottom: 1rem;
  color: #fff;
}

.metric-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 14px;
  color: #fff;
}

.metric-icon {
  font-size: 1.6rem;
  margin-bottom: 6px;
}

.chart-container {
  width: 100%;
  max-width: 550px;
  height: 220px;
  margin: 0 auto;
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: inline-block;
  cursor: pointer;
}

.dot-green {
  background: #2ecc71;
}

.dot-yellow {
  background: #f1c40f;
}

.dot-red {
  background: #e74c3c;
}

.report-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  color: #fff;
}

.btn-gradient {
  background: linear-gradient(90deg, #5b7fff, #4facfe);
  border: none;
  color: #fff;
}

.unit,
.text-muted {
  color: rgba(255, 255, 255, 0.6);
}

@media (max-width: 768px) {
  .sla-title {
    font-size: 1.4rem;
  }

  .chart-container {
    height: 180px;
  }
}

/* 🔹 Full-width responsive chart container for SLA Reports */
.line-chart-container {
  width: 100%;
  height: 320px;
  margin-top: 1rem;
  margin-bottom: 1rem;
  background: transparent;
  position: relative;
}

/* Make chart fill the entire card */
.line-chart-container canvas {
  width: 100% !important;
  height: 100% !important;
}

/* Subtle glow for data points */
.line-chart-container canvas:hover {
  transition: 0.3s;
  filter: brightness(1.1);
}

/* Responsive adjustment */
@media (max-width: 768px) {
  .line-chart-container {
    height: 240px;
  }
}



/* 🔹 Compact single-line form styling */
.add-violation-form {
  background: rgba(255, 255, 255, 0.04);
  border-radius: 10px;
  padding: 12px 15px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.add-violation-form input,
.add-violation-form select {
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #fff;
  min-width: 140px;
  flex: 1 1 10%;
}

.add-violation-form input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.add-violation-form select option {
  background: #1a1a2e;
  color: #fff;
}

.add-violation-form button {
  background: linear-gradient(90deg, #00c853, #009624);
  border: none;
  transition: 0.3s;
  white-space: nowrap;
}

.add-violation-form button:hover {
  filter: brightness(1.1);
}

/* Responsive tweak */
@media (max-width: 992px) {
  .add-violation-form .d-flex {
    flex-wrap: wrap;
  }

  .add-violation-form input,
  .add-violation-form select,
  .add-violation-form button {
    flex: 1 1 45%;
  }
}

@media (max-width: 576px) {

  .add-violation-form input,
  .add-violation-form select,
  .add-violation-form button {
    flex: 1 1 100%;
  }
}



/* Resolved Violations Table Styling */
.table-dark-glass {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 10px;
  border-collapse: separate;
  border-spacing: 0 6px;
  width: 100%;
  box-shadow: inset 0 0 10px rgba(255, 255, 255, 0.05);
}

.table-dark-glass thead th {
  color: #a7b1ff;
  text-transform: uppercase;
  font-size: 0.85rem;
  letter-spacing: 0.6px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.table-dark-glass tbody tr {
  transition: 0.3s ease;
  background: rgba(255, 255, 255, 0.04);
}

.table-dark-glass tbody tr:hover {
  background: rgba(91, 127, 255, 0.12);
  transform: scale(1.01);
  box-shadow: 0 4px 20px rgba(91, 127, 255, 0.15);
}

.table-dark-glass td,
.table-dark-glass th {
  padding: 10px 12px;
  vertical-align: middle;
}

.resolved-row {
  border-radius: 8px;
  animation: fadeIn 0.6s ease-in-out;
}

/* Fade animation for new rows */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Static full-width table (no scroll) */
.static-table {
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
}

/* Adjust table styling */
.table-dark-glass {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 10px;
  border-collapse: collapse;
  width: 100%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.table-dark-glass thead th {
  color: #a7b1ff;
  text-transform: uppercase;
  font-size: 0.85rem;
  letter-spacing: 0.6px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 12px 14px;
}

.table-dark-glass tbody tr {
  transition: 0.3s ease;
  background: rgba(255, 255, 255, 0.04);
}

.table-dark-glass tbody tr:hover {
  background: rgba(91, 127, 255, 0.12);
  transform: scale(1.005);
  box-shadow: 0 4px 20px rgba(91, 127, 255, 0.15);
}

.table-dark-glass td {
  padding: 10px 14px;
  word-wrap: break-word;
}



/* Add smooth fade animation for table rows */
.resolved-row {
  animation: fadeIn 0.6s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(6px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}


/* 🔹 Align Performance Targets inputs properly */
.config-card {
  background: rgba(255, 255, 255, 0.04);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.25);
}

.config-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.label-text {
  flex: 1 1 50%;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
  font-size: 0.95rem;
}

/* Input group box alignment */
.input-group-config {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex: 0 0 120px;
}

/* Input styling */
.config-input {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #fff;
  border-radius: 6px;
  width: 80px;
  text-align: right;
  transition: 0.3s;
}

.config-input:focus {
  border-color: #4facfe;
  box-shadow: 0 0 6px rgba(79, 172, 254, 0.4);
}

/* Unit alignment */
.unit {
  min-width: 40px;
  color: rgba(255, 255, 255, 0.7);
  text-align: left;
  font-size: 0.85rem;
}

/* Responsive fix for smaller screens */
@media (max-width: 768px) {
  .config-row {
    flex-direction: column;
    align-items: flex-start;
  }

  .input-group-config {
    width: 100%;
    justify-content: space-between;
  }

  .config-input {
    width: 100%;
  }
}
</style>
