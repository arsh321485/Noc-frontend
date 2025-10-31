<template>
  <div class="topology">
    <div class="dashboard container-fluid">
      <div class="row me-0">
        <Menu />

        <!-- 🧩 Main Dashboard Section -->
        <div class="col-md-11 col-12 main-content">
          <!-- Header -->
          <div class="header row align-items-center mb-4">
            <div class="col-auto">
              <div class="icon">
                <i class="fas fa-link"></i>
              </div>
            </div>
            <div class="col">
              <h1>Topology Links Monitor</h1>
              <p>
                Real-time monitoring of network topology connections and link status
              </p>
            </div>
          </div>

          <!-- Filter + Stats Combined Container -->
          <div class="topology-card p-5 mt-4">
            <!-- Filter Buttons -->
            <div class="filter-container row align-items-center g-2 mb-4">
              <div class="col d-flex flex-wrap gap-2">
                <button
                    v-for="(filter, index) in filters"
                    :key="index"
                    :class="['filter-btn', { active: activeFilter === filter }]"
                    @click="setFilter(filter)"
                >
                    <span class="filter-icon" v-if="filter === 'All Links'"><i class="fas fa-globe"></i></span>
                    <span class="filter-icon" v-else-if="filter === 'Online'"><i class="fas fa-check-circle"></i></span>
                    <span class="filter-icon" v-else-if="filter === 'Offline'"><i class="fas fa-times-circle"></i></span>
                    <span class="filter-icon" v-else-if="filter === 'Warning'"><i class="fas fa-exclamation-triangle"></i></span>
                    {{ filter }}
                </button>
              </div>

              <div class="col-auto ms-auto">
                <!-- <button class="refresh-btn" @click="refreshData"><i class="fas fa-sync-alt me-1"></i> Refresh</button> -->
                 <button
                    class="refresh-btn"
                    title="Test Connection"
                    @click="showAlert('success', 'Refreshing data...')"
                  >
                    <i class="fas fa-sync-alt me-1"></i> Refresh
                  </button>
              </div>
            </div>

            <!-- Stats Section -->
            <div class="stats-container row g-4">
              <div
                class="col-12 col-sm-6 col-lg-3"
                v-for="(item, index) in stats"
                :key="index"
              >
                <div
                  class="stat-box h-100 d-flex flex-column justify-content-center align-items-center"
                >
                  <h2>{{ item.value }}</h2>
                  <p>{{ item.label }}</p>
                </div>
              </div>
            </div>
          </div>

        <!-- Common Table Card -->
        <div class="topology-card p-5 mt-4">
        <div class="table-header d-flex align-items-center justify-content-between mb-4">
            <h3><i class="fas fa-table me-2"></i>Network Links</h3>
        </div>

        <!-- Data Table -->
        <div class="table-responsive">
            <table class="link-table">
            <thead>
                <tr>
                <th>Source IP</th>
                <th>Destination IP</th>
                <th>Connection Type</th>
                <th>Status</th>
                <th>Latency</th>
                <th>Packet Loss</th>
                <th>Uptime</th>
                <th>Last Updated</th>
                <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(link, index) in filteredLinks" :key="index">
                <td>
                    <strong>{{ link.source }}</strong><br />
                    <span class="subtext">{{ link.source_detail }}</span>
                </td>
                <td><strong>{{ link.destination }}</strong></td>
                <td>
                    <span
                    class="badge"
                    :class="{
                        ethernet: link.type === 'ETHERNET',
                        vpn: link.type === 'VPN'
                    }"
                    >{{ link.type }}</span
                    >
                </td>
                <td class="status">{{ link.status }}</td>
                <td class="latency">{{ link.latency }}</td>
                <td class="packet-loss">{{ link.packetLoss }}</td>
                <td>{{ link.uptime }}</td>
                <td>{{ link.lastUpdated }}</td>
                <td class="actions">
  <button
    class="action-btn green"
    title="Test Connection"
    @click="showAlert('success', 'Testing connection...')"
  >
    <i class="fas fa-wifi"></i>
  </button>

  <button
    class="action-btn yellow"
    title="Edit Link"
    @click="showAlert('warning', 'Editing link settings...')"
  >
    <i class="fas fa-edit"></i>
  </button>

  <button
    class="action-btn red"
    title="Delete Link"
    @click="showAlert('error', 'Deleting network link...')"
  >
    <i class="fas fa-trash-alt"></i>
  </button>
</td>

                </tr>
            </tbody>
            </table>
        </div>
        </div>
        </div>

        <!-- Floating Alert -->
        <div
        v-if="alert.show"
        :class="['alert-box', alert.type]"
        >
        <i
            v-if="alert.type === 'success'"
            class="fas fa-check-circle"
        ></i>
        <i
            v-else-if="alert.type === 'warning'"
            class="fas fa-exclamation-triangle"
        ></i>
        <i
            v-else
            class="fas fa-times-circle"
        ></i>
        <span>{{ alert.message }}</span>
        </div>

        <!-- End of Dashboard -->
      </div>
    </div>
  </div>
</template>

<script>
import '../assets/main.css'
import Menu from '@/components/Menu.vue';

export default {
  name: "TopologyLinksView",
  components: {
    Menu
  },
  data() {
    return {
      filters: ["All Links", "Online", "Offline", "Warning"],
      activeFilter: "All Links",
      stats: [
        { label: "Total Links", value: 4 },
        { label: "Online", value: 2 },
        { label: "Offline", value: 1 },
        { label: "Warning", value: 1 },
      ],
      links: [
      {
        source: "192.168.249.1",
        source_detail: "192.168.249.1 → 103.142.214.250",
        destination: "103.142.214.250",
        type: "ETHERNET",
        status: "ACTIVE",
        latency: "17.93ms",
        packetLoss: "0.00%",
        uptime: "1316h 32m",
        lastUpdated: "Never",
      },
      {
        source: "103.142.215.250",
        source_detail: "BIZNETDC-DISTI → 172.16.218.1",
        destination: "172.16.218.1",
        type: "ETHERNET",
        status: "INACTIVE",
        latency: "17.68ms",
        packetLoss: "0.00%",
        uptime: "1316h 8m",
        lastUpdated: "Never",
      },
      {
        source: "172.16.218.2",
        source_detail: "172.16.218.2 → 172.16.218.1",
        destination: "172.16.218.1",
        type: "VPN",
        status: "ACTIVE",
        latency: "17.51ms",
        packetLoss: "0.00%",
        uptime: "1316h 5m",
        lastUpdated: "Never",
      },
      {
        source: "192.168.249.1",
        source_detail: "192.168.249.1 → 103.142.214.250",
        destination: "103.142.214.250",
        type: "ETHERNET",
        status: "PENDING",
        latency: "17.93ms",
        packetLoss: "0.00%",
        uptime: "1316h 32m",
        lastUpdated: "Never",
      },
      ],
      alert: {
      show: false,
      type: "",
      message: "",
    },
    };
  },
  computed: {
  filteredLinks() {
    if (this.activeFilter === "All Links") return this.links;
    if (this.activeFilter === "Online")
      return this.links.filter((l) => l.status === "ACTIVE");
    if (this.activeFilter === "Offline")
      return this.links.filter((l) => l.status === "INACTIVE");
    if (this.activeFilter === "Warning")
      return this.links.filter((l) => l.status === "PENDING");
    return [];
  },
},
  methods: {
    setFilter(filter) {
      this.activeFilter = filter;
    },
    showAlert(type, message) {
    this.alert.show = true;
    this.alert.type = type;
    this.alert.message = message;
    setTimeout(() => {
      this.alert.show = false;
    }, 3000);
  },
  },
};
</script>

<style scoped>
/* .topology {
  --glass-bg: rgba(255, 255, 255, 0.08);
  --glass-border: rgba(255, 255, 255, 0.15);
  --glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  --glass-shadow-hover: 0 12px 40px rgba(0, 0, 0, 0.4);
  --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --text-primary: #ffffff;
  --text-secondary: rgba(255, 255, 255, 0.8);
  --text-muted: rgba(255, 255, 255, 0.6);
  --bg-main: linear-gradient(180deg, #1a1333, #23193d);
} */

/* ===== Main Container ===== */
.topology .main-content {
  margin-left: 90px;
  overflow-y: auto;
}

.topology .dashboard {
  background: var(--bg-main);
  color: var(--text-primary);
  font-family: "Poppins", sans-serif;
  min-height: 100vh;
  padding: 30px;
}

.topology .header {
  display: flex;
  align-items: center;
  margin-bottom: 25px;
}

.topology .header h1 {
  font-size: 35px;
  font-weight: 700;
  background: var(--primary-gradient);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
  margin: 0;
  line-height: 1.2;
}

.topology .icon {
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
}

.topology .icon i {
  font-size: 45px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
}

.topology .header p {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-top: 4px;
}

.topology .topology-card {
  background: rgba(255, 255, 255, 0.14);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  padding: 40px;
  margin-top: 50px;
  transition: all 0.3s ease;
}

.topology .topology-card:hover {
  box-shadow: 0 12px 45px rgba(0, 0, 0, 0.4);
}

.topology button {
  all: unset;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-family: inherit;
}

.topology .filter-btn {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  color: var(--text-secondary);
  padding: 10px 20px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  box-shadow: var(--glass-shadow);
}

.topology .filter-btn.active {
  background: var(--primary-gradient);
  color: #fff;
  border: none;
}

.topology .filter-btn:not(.active):hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
}

.topology .filter-btn.active:hover {
  transform: translateY(-2px);
}

.topology .refresh-btn {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  color: #fff;
  padding: 8px 16px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.topology .refresh-btn:hover {
  background: rgba(238, 226, 226, 0.2);
  color: #fff;
}

.topology .stat-box {
  width: 100%;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  padding: 35px;
  border-radius: 15px;
  text-align: center;
  transition: all 0.3s ease;
  box-shadow: var(--glass-shadow);
}

.topology .stat-box:hover {
  transform: translateY(-6px);
  background: rgba(255, 255, 255, 0.12);
  box-shadow: var(--glass-shadow-hover);
}

.topology .stat-box h2 {
  font-size: 40px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 10px;
}

.topology .stat-box p {
  font-size: 15px;
  color: var(--text-muted);
}

.topology .table-header h5 {
  font-size: 24px;
  color: var(--text-primary);
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.topology .link-table {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  color: var(--text-secondary);
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  overflow: hidden;
}

.topology .link-table thead {
  background: rgba(255, 255, 255, 0.08);
  color: var(--text-primary);
  text-align: left;
}

.topology .link-table th,
.topology .link-table td {
  padding: 12px 18px;
  font-size: 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  vertical-align: middle;
}

.topology .link-table tr:last-child td {
  border-bottom: none;
}

.topology .link-table td.actions {
  padding-top: 28px;
  padding-bottom: 27px;
}

.topology .subtext {
  font-size: 12px;
  color: var(--text-muted);
}

.topology .badge {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
}

.topology .badge.ethernet {
  background: rgba(102, 126, 234, 0.2);
  color: #a3b0ff;
  border: 1px solid rgba(102, 126, 234, 0.4);
}

.topology .badge.vpn {
  background: rgba(76, 175, 80, 0.2);
  color: #8fffa5;
  border: 1px solid rgba(76, 175, 80, 0.4);
}

.topology .status {
  color: #00ff6a;
  font-weight: 500;
}

.topology .latency {
  color: #40e17b;
}

.topology .packet-loss {
  color: #ff9800;
}

.topology .actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.topology .action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  width: 32px;
  border-radius: 8px;
  transition: all 0.3s ease;
  line-height: 1;
  vertical-align: middle;
  box-sizing: border-box;
}

.topology .action-btn.green {
  color: #4caf50;
  border: 0.5px solid #4caf50;
  background-color: rgba(76, 175, 80, 0.2);
}

.topology .action-btn.yellow {
  color: #ffb300;
  border: 0.5px solid #ffb300;
  background-color: rgba(255, 235, 59, 0.2);
}

.topology .action-btn.red {
  color: #f44336;
  border: 0.5px solid #f44336;
  background-color: rgba(244, 67, 54, 0.2);
}

.topology .action-btn:hover {
  transform: scale(1.1);
}

.topology .alert-box {
  position: fixed;
  top: 20px;
  right: 25px; 
  padding: 12px 18px;
  border-radius: 10px;
  display: flex;
  align-items: center; 
  gap: 10px;
  font-size: 14px;
  font-weight: 500;
  color: #fff;
  z-index: 9999;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(12px);
  animation: fadeIn 0.3s ease forwards;
  width: auto; 
  max-width: 320px; 
  min-width: 220px; 
  justify-content: flex-start;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.topology .alert-box i {
  font-size: 18px;
}

.topology .alert-box.success {
  background: rgba(76, 175, 80, 0.2);
  border: 1px solid #4caf50;
}

.topology .alert-box.warning {
  background: rgba(255, 193, 7, 0.2);
  border: 1px solid #ffb300;
}

.topology .alert-box.error {
  background: rgba(244, 67, 54, 0.2);
  border: 1px solid #f44336;
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

@media (max-width: 992px) {
  .topology .link-table td.actions {
    padding-top: 22px;
    padding-bottom: 21px;
  }

  .topology .link-table th,
  .topology .link-table td {
    padding: 10px;
    font-size: 13px;
  }
}

@media (max-width: 768px) {
  .topology .link-table td.actions {
    padding-top: 24px;
    padding-bottom: 22px;
  }
}

</style>
