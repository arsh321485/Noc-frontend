<template>
    <div class="web-monitoring">
    <div class="dashboard container-fluid">
      <div class="row me-0">
        <div class="col-1">
          <Menu />
        </div>

        <!-- 🧩 Main Dashboard Section -->
        <div class="col-11 main-content">
            <!-- Website Monitoring Header -->
          <div class="web-monitoring-header mb-1">
            <div class="web-monitoring-icon">
            <i class="fas fa-globe"></i>
            </div>
            <div class="web-monitoring-text">
            <h1>Website Monitoring</h1>
            <p>Monitor website availability and performance using curl commands</p>
            </div>
          </div>

          <!-- Action Buttons -->
        <div class="web-monitoring-actions">
          <button class="web-monitoring-btn-check" @click="checkAllWebsites">
            <i class="fas fa-sync-alt me-2"></i> Check All Websites
          </button>
          <button class="web-monitoring-btn-export" @click="exportWebsiteData">
            <i class="fas fa-download me-2"></i> Export Data
          </button>
        </div>

        <!-- Floating Alert -->
        <div v-if="alertMessage" class="web-monitoring-alert" :class="alertType">
          <i :class="alertIcon"></i>
          <span>{{ alertMessage }}</span>
          <button class="web-monitoring-close-btn" @click="closeAlert">×</button>
        </div>

        <div class="web-monitoring-card p-4 mt-4">
          <div class="web-monitoring-title mb-3">
            <h4><i class="fas fa-chart-bar me-2"></i> Monitoring Overview</h4>
          </div>
          <!-- Cards Row -->
          <div class="row g-4 web-monitoring-overview">
            <!-- Total Websites -->
            <div class="col-12 col-sm-6 col-lg-3">
              <div class="overview-box total">
                <h2>1</h2>
                <p>Total Websites</p>
                <div class="overview-footer">
                  <i class="fas fa-globe"></i> Being Monitored
                </div>
              </div>
            </div>

            <!-- Online -->
            <div class="col-12 col-sm-6 col-lg-3">
              <div class="overview-box online">
                <h2>0</h2>
                <p>Online</p>
                <div class="overview-footer">
                  <i class="fas fa-arrow-up"></i> 0.0%
                </div>
              </div>
            </div>

            <!-- Offline -->
            <div class="col-12 col-sm-6 col-lg-3">
              <div class="overview-box offline">
                <h2>1</h2>
                <p>Offline</p>
                <div class="overview-footer">
                  <i class="fas fa-arrow-down"></i> 100.0%
                </div>
              </div>
            </div>

            <!-- Avg Response Time -->
            <div class="col-12 col-sm-6 col-lg-3">
              <div class="overview-box response">
                <h2>10521</h2>
                <p>Avg Response Time</p>
                <div class="overview-footer">
                  <i class="fas fa-clock"></i> Milliseconds
                </div>
              </div>
            </div>
          </div>

          <!-- Website Status Distribution Graph -->
          <div class="web-monitoring-title mt-4 mb-3">
            <h4><i class="fas fa-chart-pie me-2"></i> Website Status Distribution</h4>
          </div>
          <div class="row g-4 web-monitoring-charts pb-4">
            <!-- Donut Chart -->
            <div class="col-12 col-lg-6 d-flex justify-content-center">
              <div class="chart-container">
                <!-- <h6 class="text-center">Website Status</h6> -->
                <canvas id="statusChart"></canvas>
              </div>
            </div>

            <!-- Line Chart -->
            <div class="col-12 col-lg-6 d-flex justify-content-center">
              <div class="chart-container">
                <canvas id="responseChart"></canvas>
              </div>
            </div>
          </div>
        </div>

        <div class="web-monitoring-card p-4 mt-4">
          <div class="web-monitoring-title mb-3">
            <h4><i class="fas fa-plus-circle me-2"></i> Add Website to Monitor</h4>
          </div>
          <div class="web-monitoring-container">
          <div class="web-monitoring-form-card p-4">
          <form class="web-monitoring-form">
        <div class="row g-3">

          <!-- Website Name -->
          <div class="col-md-6">
            <label>Website Name</label>
            <input
              type="text"
              v-model="website.name"
              placeholder="My Website"
              class="form-control"
            />
          </div>

          <!-- Website URL -->
          <div class="col-md-6">
            <label>Website URL</label>
            <input
              type="url"
              v-model="website.url"
              placeholder="https://example.com"
              class="form-control"
            />
          </div>

          <!-- Check Interval -->
          <div class="col-md-4">
            <label>Check Interval (seconds)</label>
            <input
              type="number"
              v-model="website.interval"
              placeholder="60"
              class="form-control"
            />
          </div>

          <!-- Timeout -->
          <div class="col-md-4">
            <label>Timeout (seconds)</label>
            <input
              type="number"
              v-model="website.timeout"
              placeholder="10"
              class="form-control"
            />
          </div>

          <!-- Expected Status Code -->
          <div class="col-md-4">
            <label>Expected Status Code</label>
            <input
              type="number"
              v-model="website.statusCode"
              placeholder="200"
              class="form-control"
            />
          </div>

          <!-- Description -->
          <div class="col-12">
            <label>Description</label>
            <textarea
              v-model="website.description"
              placeholder="Optional description..."
              class="form-control"
              rows="3"
            ></textarea>
          </div>
        </div>
        <!-- Buttons -->
        <div class="d-flex justify-content-center gap-3 mt-4">
          <button type="button" class="test-btn" @click="testConnection">
            <i class="fas fa-flask me-2"></i> Test Connection
          </button>
          <button type="submit" class="add-btn" @click.prevent="addWebsite">
            <i class="fas fa-plus me-2"></i> Add Website
          </button>
        </div>
      </form>
          </div>
          </div>
        </div>

        <div class="web-monitoring-card p-4 mt-4">
          <div class="web-monitoring-title d-flex align-items-center justify-content-between mb-4">
            <h4><i class="fas fa-list me-2"></i> Monitored Websites</h4>

            <div class="d-flex gap-2">
              <button class="refresh-all-btn" @click="refreshAll">
                <i class="fas fa-sync-alt me-2"></i> Refresh All
              </button>
              <button class="clear-all-btn" @click="confirmClearAll">
                <i class="fas fa-trash-alt me-2"></i> Clear All
              </button>
            </div>
          </div>
          <!-- Website Cards -->
          <div v-if="websitesData.length" class="row g-4">
            <div
              v-for="(site, index) in websitesData"
              :key="index"
              class="col-lg-4 col-md-6 col-12"
            >
              <div class="web-card">
            <div class="web-card-header d-flex justify-content-between align-items-center">
              <div class="d-flex align-items-center gap-2">
                <i class="fas fa-globe"></i>
                <strong>{{ site.name }}</strong>
              </div>
              <div class="d-flex align-items-center gap-1">
                <span class="status-dot" :class="site.status.toLowerCase()"></span>
                <span class="status-text">{{ site.status }}</span>
              </div>
            </div>

            <div class="web-card-body mt-3">
              <div class="row text-center">
                <div class="col-6">
                  <h5>{{ site.responseTime }}ms</h5>
                  <p>Response Time</p>
                </div>
                <div class="col-6">
                  <h5>{{ site.uptime }}</h5>
                  <p>Uptime</p>
                </div>
              </div>
              <div class="row text-center">
                <div class="col-6">
                  <h5>{{ site.totalChecks }}</h5>
                  <p>Total Checks</p>
                </div>
                <div class="col-6">
                  <h5>{{ site.lastCheck }}</h5>
                  <p>Last Check</p>
                </div>
              </div>

              <p class="description mt-2">{{ site.description }}</p>

              <div class="action-icons mt-3 text-end">
                <i class="fas fa-play play" @click="viewSite(site)"></i>
                <i class="fas fa-edit edit" @click="editSite(site)"></i>
                <i class="fas fa-trash delete" @click="deleteSite(index)"></i>
              </div>
            </div>
            </div>
            </div>
          </div>
          <!-- No Data -->
          <div v-else class="no-data">
            <i class="fas fa-globe"></i>
            <h5>No Websites Monitored</h5>
            <p>Add your first website to start monitoring</p>
          </div>
          <!-- Alert -->
          <div v-if="alert.visible" :class="['web-alert', alert.type]">
            <i :class="alert.icon"></i>
            <span>{{ alert.message }}</span>
            <button class="close-btn" @click="closeAlert">&times;</button>
          </div>
        </div>

        <div class="web-monitoring-card p-4 mt-4">
          <div class="web-monitoring-title mb-3">
            <h4><i class="fas fa-history me-2"></i> Recent Monitoring History</h4>
          </div>
          <!-- History list -->
          <div class="web-monitoring-history">
            <div
              v-for="(record, index) in historyData"
              :key="index"
              class="history-item d-flex justify-content-between align-items-center"
            >
              <div>
                <strong>{{ record.name }}</strong>
                <span class="timestamp">{{ record.time }}</span>
              </div>

              <div class="status d-flex align-items-center gap-2">
                <span
                  class="status-badge"
                  :class="record.status.toLowerCase()"
                >
                  <i
                    v-if="record.status === 'Down'"
                    class="fas fa-times"
                  ></i>
                  <i
                    v-else
                    class="fas fa-check"
                  ></i>
                  {{ record.status }}
                </span>
                <span class="response-time">{{ record.responseTime }}ms</span>
              </div>
            </div>

            <!-- No history -->
            <div v-if="!historyData.length" class="no-data text-center py-5">
              <i class="fas fa-clock"></i>
              <h5>No Monitoring History</h5>
              <p>Monitoring records will appear here</p>
            </div>
          </div>
        </div>

        </div>

      </div>
    </div>
    </div>
</template>

<script>
import Menu from '@/components/Menu.vue';
import * as XLSX from "xlsx";
import { Chart, DoughnutController, ArcElement, Tooltip, Legend, LineController, LineElement, PointElement, LinearScale, CategoryScale } from "chart.js";
Chart.register(DoughnutController, ArcElement, Tooltip, Legend, LineController, LineElement, PointElement, LinearScale, CategoryScale);

export default {
  name: "WebsiteMonitoringView",
  components: {
    Menu
  },
  data() {
    return {
      alertMessage: "",
      alertType: "",
      alertIcon: "",
      alertTimeout: null,
      website: {
        name: "",
        url: "",
        interval: "",
        timeout: "",
        statusCode: "",
        description: "",
      },
      websitesData: [],
      alert: {
        visible: false,
        message: "",
        type: "",
        icon: "",
      },
      historyData: [
        {
          name: "GRC department",
          time: "10/28/2025, 2:22:25 PM",
          status: "Down",
          responseTime: 10391,
        },
        {
          name: "GRC department",
          time: "10/28/2025, 2:21:25 PM",
          status: "Down",
          responseTime: 10392,
        },
      ],
    };
  },
  mounted() {
    this.createCharts();
    window.addEventListener("resize", this.handleResize);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.handleResize);
  },
  methods: {
    showAlert(message, type = "info") {
      this.alertMessage = message;
      this.alertType = type;
      this.alertIcon =
        type === "success" ? "fas fa-check-circle" : "fas fa-info-circle";
      clearTimeout(this.alertTimeout);
      this.alertTimeout = setTimeout(() => {
        this.alertMessage = "";
      }, 4000);
    },
    closeAlert() {
      this.alertMessage = "";
      clearTimeout(this.alertTimeout);
    },
    checkAllWebsites() {
      this.showAlert("Refreshing all websites", "info");
    },
    exportWebsiteData() {
      const worksheet = XLSX.utils.json_to_sheet(this.websiteData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Websites");
      XLSX.writeFile(workbook, "Website_Monitoring_Data.xlsx");

      this.showAlert("Monitoring data exported successfully", "success");
    },
    createCharts() {
      // Donut Chart
      const statusCtx = document.getElementById("statusChart").getContext("2d");
      new Chart(statusCtx, {
        type: "doughnut",
        data: {
          labels: ["Online", "Offline", "Unknown"],
          datasets: [
            {
              data: [1, 2, 0],
              backgroundColor: ["#4CAF50", "#F44336", "#FF9800"],
              borderWidth: 2,
            },
          ],
        },
      options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "bottom",
              labels: { color: "#fff" },
            },
            title: {
              display: true,
              text: "Website Status",
              color: "#00bcd4",
              font: { size: 16, weight: "bold" },
            },
          },
        },
      });
      // Line Chart
      const responseCtx = document.getElementById("responseChart").getContext("2d");
      new Chart(responseCtx, {
        type: "line",
        data: {
          labels: ["Check 1", "Check 2", "Check 3", "Check 4"],
          datasets: [
            {
              label: "Response Time (ms)",
              data: [10500, 9800, 11000, 10200],
              borderColor: "#00c6ff",
              backgroundColor: "rgba(0,198,255,0.3)",
              tension: 0.3,
              pointRadius: 5,
              pointBackgroundColor: "#00c6ff",
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: { ticks: { color: "#fff" } },
            y: { ticks: { color: "#fff" } },
          },
          plugins: {
            legend: { labels: { color: "#fff" } },
            title: {
              display: true,
              text: "Response Times",
              color: "#00bcd4",
              font: { size: 16, weight: "bold" },
            },
          },
        },
      });
    },
    handleResize() {
    },
    testConnection() {
      alert("🔍 Testing connection for " + this.website.url);
    },
    addWebsite() {
      if (!this.website.name || !this.website.url) {
        alert("⚠️ Please enter both Website Name and URL!");
        return;
      }

      this.websitesData.push({
        name: this.website.name,
        responseTime: "N/A",
        uptime: "N/A",
        totalChecks: 0,
        lastCheck: "Just now",
        status: "Offline",
        description: this.website.description || "No description available.",
      });

      alert(`✅ Website added successfully: ${this.website.name}`);

      this.website = {
        name: "",
        url: "",
        interval: "",
        timeout: "",
        statusCode: "",
        description: "",
      };
    },
    refreshAll() {
      this.showAlert("Refreshing all websites...", "info", "fas fa-info-circle");
      setTimeout(() => this.closeAlert(), 3000);
    },
    confirmClearAll() {
    if (confirm("⚠️ Are you sure you want to delete all websites?")) {
      this.websitesData = [];
      this.showAlert("All websites deleted successfully", "success", "fas fa-check-circle");
    } else {
      this.showAlert("Operation cancelled", "warning", "fas fa-exclamation-circle");
    }
    setTimeout(() => this.closeAlert(), 3000);
    },
    viewSite(site) {
      alert(`🌐 Viewing: ${site.name}\nStatus: ${site.status}\nResponse: ${site.responseTime}ms`);
    },
    editSite(site) {
      alert(`✏️ Edit details for: ${site.name}`);
    },
    deleteSite(index) {
      const confirmDelete = confirm("🗑️ Are you sure you want to delete this website?");
    if (confirmDelete) {
      this.websitesData.splice(index, 1);
    }
    },
  },
}
</script>

<style scoped>
.web-monitoring {
  --glass-bg: rgba(255, 255, 255, 0.08);
  --glass-border: rgba(255, 255, 255, 0.15);
  --glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  --glass-shadow-hover: 0 12px 40px rgba(0, 0, 0, 0.4);
  --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --text-primary: #ffffff;
  --text-secondary: rgba(255, 255, 255, 0.8);
  --text-muted: rgba(255, 255, 255, 0.6);
  --bg-main: linear-gradient(180deg, #1a1333, #23193d);
}



.web-monitoring .dashboard {
  background: var(--bg-main);
  color: var(--text-primary);
  font-family: "Poppins", sans-serif;
  min-height: 100vh;
  padding: 30px;
}

.web-monitoring-header {
  display: flex;
  align-items: flex-start;
  margin-bottom: 30px;
  position: relative;
}

.web-monitoring-icon {
  margin-right: 12px;
  position: relative;
  top: 4px; 
}

.web-monitoring-icon i {
  font-size: 42px;
  background: #8b9cff;
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 15px rgba(118, 75, 162, 0.4);
}

.web-monitoring-text {
  display: flex;
  flex-direction: column;
}

.web-monitoring-text h1 {
  font-size: 34px;
  font-weight: 600;
  margin: 0;
  color: #8b9cff;
  letter-spacing: 0.5px;
  line-height: 1.2;
}

.web-monitoring-text p {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.8);
  margin-top: -2px; 
  padding-left: 2px;
  font-weight: 400;
}

.web-monitoring .web-monitoring-actions {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  padding-bottom: 10px;
}

.web-monitoring .web-monitoring-btn-check,
.web-monitoring .web-monitoring-btn-export {
  border: none;
  border-radius: 10px;
  padding: 12px 28px;
  font-weight: 500;
  font-size: 15px;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.web-monitoring .web-monitoring-btn-check {
  background: linear-gradient(135deg, #6a67ce 0%, #764ba2 100%);
}

.web-monitoring .web-monitoring-btn-export {
  background: linear-gradient(135deg, #00c6ff 0%, #0072ff 100%);
}

.web-monitoring .web-monitoring-btn-check:hover,
.web-monitoring .web-monitoring-btn-export:hover {
  transform: translateY(-2px);
  opacity: 0.95;
}

.web-monitoring .web-monitoring-alert {
  position: fixed;
  top: 20px;
  right: 25px;
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(40, 40, 60, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  padding: 12px 20px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  z-index: 9999;
  animation: slideIn 0.4s ease forwards;
}

.web-monitoring .web-monitoring-alert i {
  font-size: 18px;
}

.web-monitoring .web-monitoring-alert.success {
  border-left: 5px solid #4caf50;
}

.web-monitoring .web-monitoring-alert.info {
  border-left: 5px solid #2196f3;
}

.web-monitoring .web-monitoring-close-btn {
  background: none;
  border: none;
  color: #fff;
  font-size: 18px;
  cursor: pointer;
  margin-left: 10px;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.web-monitoring .web-monitoring-card {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  color: #fff;
  backdrop-filter: blur(8px);
}

.web-monitoring .web-monitoring-title h4 {
  font-size: 24px;
  color: var(--text-primary);
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
}

.web-monitoring .overview-box {
  border-radius: 16px;
  color: #fff;
  padding: 24px;
  height: 100%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
  transition: all 0.3s ease;
}

.web-monitoring .overview-box:hover {
  transform: translateY(-4px);
}

/* === Specific Colors === */
.web-monitoring .overview-box.total {
  background: linear-gradient(135deg, #544a7d 0%, #8d7cd4 100%);
}

.web-monitoring .overview-box.online {
  background: linear-gradient(135deg, #00c6ff 0%, #5c9dec 100%);
}

.web-monitoring .overview-box.offline {
  background: linear-gradient(135deg, #ec6aa9 0%, #f16c6c 100%);
}

.web-monitoring .overview-box.response {
  background: linear-gradient(135deg, #ee7bd1 0%, #e4c748 100%);
}

.web-monitoring .overview-box h2 {
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 8px;
}

.web-monitoring .overview-box p {
  font-size: 15px;
  font-weight: 500;
  margin-bottom: 12px;
}

.web-monitoring .overview-footer {
  font-size: 14px;
  opacity: 0.9;
  display: flex;
  align-items: center;
  gap: 8px;
}

.web-monitoring .chart-container {
  width: 100%;
  max-width: 450px;
  height: 300px;
  position: relative;
}

.web-monitoring .chart-container .text-center{
  color: #22c4f1;
  font-weight: 600;
}

.web-monitoring .web-monitoring-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 0 40px;
  box-sizing: border-box;
}

.web-monitoring .web-monitoring-form-card {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  color: #fff;
  backdrop-filter: blur(8px);
  width: 100%;
  max-width: 700px;
}

.web-monitoring .web-monitoring-form label {
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.85);
  margin-bottom: 6px;
  display: block;
}

.web-monitoring .web-monitoring-form .form-control {
  width: 100%;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  padding: 10px 14px;
  color: #fff;
  font-size: 14px;
  outline: none;
  transition: all 0.3s ease;
}

.web-monitoring .web-monitoring-form .form-control:focus {
  border-color: #667eea;
  box-shadow: 0 0 10px rgba(102, 126, 234, 0.5);
}

.web-monitoring .test-btn,
.web-monitoring .add-btn {
  border: none;
  border-radius: 30px;
  padding: 10px 28px;
  font-size: 15px;
  font-weight: 500;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.web-monitoring .test-btn {
  background: linear-gradient(135deg, #f857a6 0%, #ffeb3b 100%);
}

.web-monitoring .add-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.web-monitoring .test-btn:hover,
.web-monitoring .add-btn:hover {
  transform: translateY(-2px);
  opacity: 0.95;
}

.web-monitoring .refresh-all-btn,
.web-monitoring .clear-all-btn {
  border: none;
  border-radius: 10px;
  padding: 8px 18px;
  font-size: 14px;
  font-weight: 500;
  color: #fff;
  cursor: pointer;
  transition: 0.3s ease;
}

.web-monitoring .clear-all-btn, 
.web-monitoring .refresh-all-btn {
  background: rgba(255, 255, 255, 0.15);
}

.web-monitoring .refresh-all-btn:hover,
.web-monitoring .clear-all-btn:hover {
  transform: translateY(-2px);
  opacity: 0.9;
}

.web-monitoring .web-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
  padding: 18px;
  transition: all 0.3s ease;
  color: #fff;
  border-top: 4px solid rgb(248, 105, 38);
}

.web-monitoring .web-card:hover {
  transform: translateY(-4px);
  background: rgba(255, 255, 255, 0.15);
}

.web-monitoring .status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
  margin-left: 8px;
}
.web-monitoring .status-dot.online {
  background: #4caf50;
}
.web-monitoring .status-dot.offline {
  background: #f44336;
}

.web-monitoring .web-card-body h5 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 3px;
}

.web-monitoring .web-card-body p {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.7);
}

.web-monitoring .action-icons i {
  margin-left: 10px;
  cursor: pointer;
  font-size: 14px;
  transition: 0.3s ease;
}

.web-monitoring .action-icons .play {
  color: #00bcd4;
}
.web-monitoring .action-icons .edit {
  color: #ffb300;
}
.web-monitoring .action-icons .delete {
  color: #f44336;
}

.web-monitoring .action-icons i:hover {
  transform: scale(1.2);
}

/* No Data */
.web-monitoring .no-data {
  text-align: center;
  padding: 20px 0;
  color: rgba(255, 255, 255, 0.7);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.10);
  border-radius: 20px;
  border: 1px solid rgb(107, 106, 106);
}

.web-monitoring .no-data i {
  font-size: 48px;
  background: rgba(255, 255, 255, 0.15);
  color: rgba(255, 255, 255, 0.85);
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
}

.web-monitoring .no-data h5 {
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 6px;
}

.web-monitoring .no-data p {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
}

.web-monitoring .web-alert {
  position: fixed;
  top: 20px;
  right: 25px;
  padding: 14px 22px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: #fff;
  z-index: 9999;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(12px);
  animation: fadeIn 0.3s ease forwards;
}

.web-monitoring .web-alert.info {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.web-monitoring .web-alert.success {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.web-monitoring .web-alert.warning {
  background: linear-gradient(135deg, #f7971e 0%, #ffd200 100%);
}

.web-monitoring .close-btn {
  background: transparent;
  border: none;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.web-monitoring .web-monitoring-history {
  max-height: 250px;
  overflow-y: auto;
  border-radius: 12px;
  padding-right: 8px;
}

/* Each record */
.web-monitoring .history-item {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  padding: 12px 10px;
  margin-bottom: 10px;
  transition: background 0.3s ease;
}

.web-monitoring .history-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

/* Timestamp */
.web-monitoring .timestamp {
  margin-left: 8px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
}

/* Status badge */
.web-monitoring .status-badge {
  padding: 4px 10px;
  border-radius: 6px;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
}

.web-monitoring .status-badge.down {
  background: rgba(244, 67, 54, 0.15);
  color: #f44336;
  border: 1px solid rgba(244, 67, 54, 0.3);
}

.web-monitoring .status-badge.up {
  background: rgba(76, 175, 80, 0.15);
  color: #4caf50;
  border: 1px solid rgba(76, 175, 80, 0.3);
}

/* Response time */
.web-monitoring .response-time {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.8);
}

/* No data */
.web-monitoring .no-data {
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
}

.web-monitoring .no-data i {
  font-size: 36px;
  margin-bottom: 10px;
  display: block;
}

/* Scrollbar style */
.web-monitoring .web-monitoring-history::-webkit-scrollbar {
  width: 6px;
}
.web-monitoring .web-monitoring-history::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
}

/* === Responsive === */
@media (max-width: 992px) {
  .web-monitoring .web-monitoring-actions {
    justify-content: center;
    margin-right: 0;
  }

  .web-monitoring .overview-box h2 {
    font-size: 30px;
  }

  .web-monitoring .overview-box p {
    font-size: 14px;
  }

  .web-monitoring .chart-container {
    max-width: 100%;
    height: 300px;
  }

  .web-monitoring .web-monitoring-container {
    padding: 0 20px;
  }

  .web-monitoring .web-monitoring-form-card {
    max-width: 600px;
  }

  .web-monitoring .web-monitoring-form {
    padding: 10px;
  }
  .web-monitoring .web-monitoring-form label {
    font-size: 13px;
  }
  .web-monitoring .test-btn,
  .web-monitoring .add-btn {
    font-size: 14px;
    padding: 8px 22px;
  }

  .web-monitoring .web-card {
    padding: 14px;
  }
}

@media (max-width: 768px) {
  .web-monitoring .overview-box {
    text-align: center;
  }

  .web-monitoring .overview-footer {
    justify-content: center;
  }

  .web-monitoring .chart-container {
    height: 260px;
  }

  .web-monitoring .web-monitoring-container {
    padding: 0 15px;
  }

  .web-monitoring .web-monitoring-form-card {
    max-width: 100%;
    padding: 1.5rem;
  }

  .web-monitoring .test-btn,
  .web-monitoring .add-btn {
    font-size: 14px;
    padding: 8px 22px;
  }
}

</style>