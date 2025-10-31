<template>
    <div class="notification">
    <div class="dashboard container-fluid">
      <div class="row me-0">
        <div class="col-1">
          <Menu />
        </div>

        <!-- 🧩 Main Dashboard Section -->
        <div class="col-11 main-content">
            <!-- Notification Header -->
          <div class="notification-header mb-4">
            <div class="notification-icon">
            <i class="fas fa-bell"></i>
            </div>
            <div class="notification-text">
            <h1>Notification Center</h1>
            <p>Real-time network device status monitoring and alerts</p>
            </div>
          </div>

          <div class="notification-card p-4 mt-4">
            <div class="notification-title mb-3">
                <h4><i class="fas fa-filter me-2"></i> Notification Filters</h4>
            </div>

            <div class="filter-container d-flex flex-wrap align-items-center gap-3">
                <button
                v-for="(filter, index) in filters"
                :key="index"
                :class="['filter-btn', { active: activeFilter === filter.label }]"
                @click="setFilter(filter.label)"
                >
                <i :class="filter.icon"></i>
                {{ filter.label }}
                </button>

                <button class="mark-read-btn">
                <i class="fas fa-check-double me-2"></i> Mark All Read
                </button>
            </div>
          </div>

          <div class="notification-card p-4 mt-4">
            <div class="notification-title mb-3">
                <h4><i class="fas fa-chart-bar me-2"></i> System Statistics</h4>
            </div>

            <!-- System Stats Section -->
            <div class="system-stats-container row g-3">
              <div
                class="col-12 col-sm-6 col-lg-2"
                v-for="(item, index) in stats"
                :key="index"
              >
                <div
                  class="system-stat-box h-100 d-flex flex-column justify-content-center align-items-center"
                >
                  <h2>{{ item.value }}</h2>
                  <p>{{ item.label }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="notification-card p-4 mt-4">
      <!-- Heading -->
      <div class="notification-title d-flex align-items-center justify-content-between mb-3">
        <h4><i class="fas fa-table me-2"></i> Network Status Notifications</h4>

        <div class="d-flex align-items-center gap-2">
          <button class="export-btn" @click="exportToExcel">
            <i class="fas fa-download"></i> Export
          </button>
          <button class="clear-btn" @click="confirmClearHistory">
            <i class="fas fa-trash-alt"></i> Clear History
          </button>
        </div>
      </div>

      <!-- Connection Status -->
      <div class="connection-status d-flex justify-content-between align-items-center mb-3">
        <div class="status-text">
          <span class="status-dot"></span>
          Real-time Connection: Connected
        </div>
        <div class="refresh-time">Last refresh: {{ lastRefresh }}</div>
      </div>

      <!-- Table -->
      <div class="table-responsive">
        <table class="notification-table w-100">
          <thead>
            <tr>
              <th><i class="fas fa-exclamation-circle me-1"></i>Priority</th>
              <th><i class="fas fa-server me-1"></i>Device Name & IP</th>
              <th><i class="fas fa-map-marker-alt me-1"></i>Site</th>
              <th><i class="fas fa-info-circle me-1"></i>Status</th>
              <th><i class="fas fa-comment me-1"></i>Message</th>
              <th><i class="fas fa-clock me-1"></i>Time</th>
              <th><i class="fas fa-cogs me-1"></i>Actions</th>
            </tr>
          </thead>
          <tbody v-if="filteredNotifications.length">
  <tr v-for="(notification, index) in filteredNotifications" :key="index">
    <td>
      <span class="priority-badge" :class="notification.priority.toLowerCase()">
        {{ notification.priority }}
      </span>
    </td>
    <td>
      <div>{{ notification.device }}</div>
      <small>{{ notification.ip }}</small>
    </td>
    <td>{{ notification.site }}</td>
    <td>
      <span class="status-badge" :class="notification.status.toLowerCase()">
        {{ notification.status }}
      </span>
    </td>
    <td>{{ notification.message }}</td>
    <td>{{ notification.time }}</td>
    <td>
      <button class="action-btn view" @click="viewDetails(notification)">
        <i class="fas fa-eye"></i>
      </button>
    </td>
  </tr>
</tbody>

<!-- Empty state -->
<tbody v-else>
  <tr>
    <td colspan="7">
      <div class="no-notification">
        <i class="fas fa-bell-slash"></i>
        <p>No notifications found</p>
      </div>
    </td>
  </tr>
</tbody>

        </table>
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

export default {
  name: "NotificationCenterView",
  components: {
    Menu
  },
  data() {
    return {
      lastRefresh: "",  
      activeFilter: "All Notifications",
      filters: [
        { label: "All Notifications", icon: "fas fa-globe" },
        { label: "Unread", icon: "fas fa-circle" },
        { label: "Online", icon: "fas fa-check-circle" },
        { label: "Offline", icon: "fas fa-times-circle" },
        { label: "Warning", icon: "fas fa-exclamation-triangle" },
        { label: "Topology", icon: "fas fa-project-diagram" },
        { label: "SLA", icon: "fas fa-chart-line" },
        { label: "Website", icon: "fas fa-globe" },
        { label: "MikroTik", icon: "fas fa-router" },
        { label: "Sound", icon: "fas fa-volume-up" },
      ],
      stats: [
        { label: "Online Devices", value: 5 },
        { label: "Offline Devices", value: 1 },
        { label: "Warning Devices", value: 1 },
        { label: "Website Alerts", value: 0 },
        { label: "Active Topology", value: 2 },
        { label: "Total Notifications", value: 5 },
        { label: "Unread Notifications", value: 0 },
      ],
      notifications: [
        {
          priority: "Normal",
          device: "Distribution Ipe",
          ip: "172.16.27.2",
          site: "Rumah",
          status: "Online",
          message: "Device responding normally (107.000ms)",
          time: "Just now",
        },
        {
          priority: "Normal",
          device: "ipe-core",
          ip: "172.16.27.1",
          site: "Rumah",
          status: "Online",
          message: "Device responding normally (102.000ms)",
          time: "Just now",
        },
        {
          priority: "Normal",
          device: "Distribution Ipe",
          ip: "172.16.27.26",
          site: "Rumah",
          status: "Offline",
          message: "Device responding normally (107.098ms)",
          time: "Just now",
        },
        {
          priority: "Normal",
          device: "ipe-core",
          ip: "172.12.7.1",
          site: "Rumah",
          status: "Pending",
          message: "Device responding normally (102.005ms)",
          time: "Just now",
        },
      ],
    };
  },
  computed: {
  filteredNotifications() {
    if (this.activeFilter === "All Notifications") {
      return this.notifications;
    }

    const filter = this.activeFilter.toLowerCase();

    if (filter === "unread" || filter === "warning") {
      return this.notifications.filter(
        (n) => n.status.toLowerCase() === "pending"
      );
    }

    return this.notifications.filter(
      (n) => n.status.toLowerCase() === filter
    );
  },
},
  methods: {
    setFilter(filter) {
      this.activeFilter = filter;
    },
    updateRefreshTime() {
      const now = new Date();
      this.lastRefresh = now.toLocaleTimeString();
    },
    exportToExcel() {
      const worksheet = XLSX.utils.json_to_sheet(this.notifications);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Notifications");
      XLSX.writeFile(workbook, "Network_Notifications.xlsx");
    },
    confirmClearHistory() {
      alert("⚠️ Are you sure you want to delete notification history?");
    },
    viewDetails(notification) {
      alert(
        `Device: ${notification.device}\nIP: ${notification.ip}\nStatus: ${notification.status}\nMessage: ${notification.message}\nTime: ${notification.time}`
      );
    },
  },
  mounted() {
    this.updateRefreshTime();
    setInterval(this.updateRefreshTime, 60000);
  },
}
</script>

<style scoped>
.notification {
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

/* ===== Main Container ===== */


.notification .dashboard {
  background: var(--bg-main);
  color: var(--text-primary);
  font-family: "Poppins", sans-serif;
  min-height: 100vh;
  padding: 30px;
}

.notification-header {
  display: flex;
  align-items: flex-start;
  margin-bottom: 30px;
  position: relative;
}

.notification-icon {
  margin-right: 12px;
  position: relative;
  top: 4px; 
}

.notification-icon i {
  font-size: 42px;
  background: #8b9cff;
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 15px rgba(118, 75, 162, 0.4);
}

.notification-text {
  display: flex;
  flex-direction: column;
}

.notification-text h1 {
  font-size: 34px;
  font-weight: 700;
  margin: 0;
  color: #8b9cff;
  letter-spacing: 0.5px;
  line-height: 1.2;
}

.notification-text p {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.8);
  margin-top: -2px; 
  padding-left: 2px;
  font-weight: 400;
}

.notification .notification-card {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  color: #fff;
  backdrop-filter: blur(8px);
}

.notification .notification-title h4 {
  font-size: 24px;
  color: var(--text-primary);
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.notification .filter-container {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.notification .filter-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: rgba(255, 255, 255, 0.8);
  padding: 10px 20px;
  border-radius: 30px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  cursor: pointer;
}

.notification .filter-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.notification .filter-btn.active {
  background: #4facfe;
  border: none;
  color: #fff;
  box-shadow: 0 4px 15px rgba(118, 75, 162, 0.4);
}

.notification .mark-read-btn {
  display: flex;
  align-items: center;
  background: #4caf50;
  border: none;
  color: #fff;
  padding: 10px 22px;
  border-radius: 30px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  cursor: pointer;
}

.notification .mark-read-btn:hover {
  background: #45a049;
}

.notification .system-stat-box {
  width: 100%;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  padding: 20px;
  border-radius: 15px;
  text-align: center;
  transition: all 0.3s ease;
  box-shadow: var(--glass-shadow);
}

.notification .system-stat-box:hover {
  transform: translateY(-6px);
  background: rgba(255, 255, 255, 0.12);
  box-shadow: var(--glass-shadow-hover);
}

.notification .system-stat-box h2 {
  font-size: 30px;
  font-weight: 700;
  color: #4facfe;
  margin-bottom: 10px;
}

.notification .system-stat-box p {
  font-size: 15px;
  color: var(--text-muted);
}

.notification .export-btn {
  background: var(--glass-bg);
  color: #fff;
  border: 1px solid #8b9cff;
  border-radius: 8px;
  padding: 6px 12px;
  font-size: 14px;
  cursor: pointer;
  transition: 0.3s;
}

.notification .clear-btn {
  background: rgba(244, 67, 54, 0.2);
  color: #f44336;
  border: 1px solid rgba(244, 67, 54, 0.3);
  border-radius: 8px;
  padding: 6px 12px;
  font-size: 14px;
  cursor: pointer;
  transition: 0.3s;
}

.notification .connection-status {
  background: rgba(79, 172, 254, 0.1);
  border-radius: 10px;
  padding: 10px 18px;
  border: 1px solid rgba(79, 172, 254, 0.2);
  font-size: 14px;
}

.notification .status-text {
  display: flex;
  align-items: center;
  gap: 8px;
}

.notification .status-dot {
  width: 10px;
  height: 10px;
  background-color: #4caf50;
  border-radius: 50%;
}

.notification .refresh-time {
  font-size: 14px;
  color: #ccc;
}

.notification-table {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  color: var(--text-secondary);
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  overflow: hidden;
}

.notification .notification-table thead {
  background: rgba(255, 255, 255, 0.08);
  color: var(--text-primary);
  text-align: left;
}

.notification-table th {
  text-align: left;
  padding: 14px 18px;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 600;
  font-size: 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.notification-table td {
  padding: 14px 18px;
  vertical-align: middle;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 14px;
}

.priority-badge {
  border-radius: 14px;
  padding: 4px 12px;
  font-size: 12px;
  font-weight: 600;
  color: #fff;
}

.priority-badge.normal {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
}

.status-badge {
  border-radius: 14px;
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 600;
  color: #fff;
}

.status-badge.online {
  background: #4caf50;
}

.status-badge.offline {
  background: #6c757d;
}

.status-badge.pending {
  background:#dc3545
}

.action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  width: 32px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.8);
  transition: 0.3s;
  cursor: pointer;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: scale(1.05);
}

.no-notification {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  color: rgba(255, 255, 255, 0.6);
  text-align: center;
  font-size: 14px;
}

.no-notification i {
  font-size: 36px;
  margin-bottom: 8px;
  color: rgba(255, 255, 255, 0.4);
}

@media (max-width: 992px) {
  .notification .notification-card {
    padding: 20px;
  }

  .notification .filter-btn,
  .notification .mark-read-btn {
    font-size: 13px;
    padding: 8px 16px;
  }

  .notification .filter-container {
    gap: 10px;
  }
}

@media (max-width: 768px) {
  .notification .filter-container {
    justify-content: center;
  }
}

</style>