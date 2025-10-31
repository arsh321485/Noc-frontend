<template>
    <div class="rrd-integration">
    <div class="dashboard container-fluid">
      <div class="row me-0">
        <div class="col-1">
          <Menu />
        </div>

        <!-- 🧩 Main Dashboard Section -->
        <div class=" col-11 main-content">
          <div class="rrd-integration-header mb-4 d-flex justify-content-between flex-wrap align-items-start">
            <!-- Left Side -->
            <div class="rrd-header-left">
                <div class="d-flex align-items-center mb-1">
                <div class="rrd-integration-icon me-2">
                    <i class="fas fa-network-wired"></i>
                </div>
                <h2 class="mb-0">NOC Interface Monitoring</h2>
                </div>
                <p class="rrd-subtitle mb-0">
                Custom interface monitoring with configuration-based selection
                </p>
            </div>

            <!-- Right Side -->
            <div class="rrd-right-actions text-end">
                <div class="d-flex justify-content-end gap-2">
                <router-link to="/system" class="rrd-btn home-btn text-decoration-none">
                    <i class="fas fa-home me-1"></i> Home
                </router-link>
                <button class="rrd-btn vlan-btn" @click="toggleDashboard">
                    <i class="fas fa-project-diagram me-1"></i> {{ isVlan ? "VLAN & Bridge Dashboard" : "Interface Dashboard" }}
                </button>
                </div>

                <!-- ✅ Last updated below buttons -->
                <div class="last-updated d-flex align-items-center justify-content-end mt-2">
                <i class="fas fa-clock me-2"></i>
                <span>Last updated: {{ lastUpdated }}</span>
                </div>
            </div>
          </div>

          <div v-if="isVlan">
          <div class="rrd-integration-stats mt-4">
            <div class="row g-4">
                <div
                class="col-lg-3 col-md-6 col-12"
                v-for="(card, index) in statsCards"
                :key="index"
                >
                <div class="rrd-stat-card text-center">
                    <div class="icon-value">
                    <i :class="card.icon"></i>
                    <h3>{{ card.value }}</h3>
                    </div>
                    <p>{{ card.label }}</p>
                </div>
                </div>
            </div>
          </div>

          <div class="rrd-interface-cards mt-4">
            <div class="row g-4">
                <div
                class="col-lg-4 col-md-6 col-12"
                v-for="(device, index) in devices"
                :key="index"
                >
                <div class="rrd-device-card h-100">
                    <div class="rrd-card-header">
                    <div class="icon-box"></div>
                    <div>
                        <h5 class="device-name">{{ device.name }}</h5>
                        <p class="device-info">
                        <i class="fas fa-globe me-2"></i>{{ device.ip }}<br />
                        <i class="fas fa-network-wired me-2"></i>{{ device.interfaces }}
                        </p>
                    </div>
                    </div>

                    <!-- Inner Graph Card -->
                    <div class="rrd-inner-card mt-3">
                    <div class="d-flex justify-content-between align-items-center mb-1">
                        <strong>{{ device.port }}</strong>
                        <span :class="['priority', device.priority.toLowerCase()]">
                        {{ device.priority }}
                        </span>
                    </div>
                    <p class="mb-2">{{ device.portInfo }}</p>
                    <img
                        :src="getImagePath(device.graph)"
                        alt="Graph"
                        class="graph-img"
                        />
                    </div>
                </div>
                </div>
            </div>
          </div>
          </div>

          <div v-else>
          <div class="rrd-integration-stats mt-4">
            <div class="row g-4">
                <div
                class="col-lg-3 col-md-6 col-12"
                v-for="(card, index) in statsCards2"
                :key="index"
                >
                <div class="rrd-stat-card text-center">
                    <div class="icon-value">
                    <i :class="card.icon"></i>
                    <h3>{{ card.value }}</h3>
                    </div>
                    <p>{{ card.label }}</p>
                </div>
                </div>
            </div>
          </div>

          <div class="rrd-interface-cards mt-4">
            <div class="row g-4">
                <div
                class="col-lg-4 col-md-6 col-12"
                v-for="(device, index) in devices"
                :key="index"
                >
                <div class="rrd-device-card h-100">
                    <div class="rrd-card-header">
                    <div class="icon-box"></div>
                    <div>
                        <h5 class="device-name">{{ device.name }}</h5>
                        <p class="device-info">
                        <i class="fas fa-globe me-2"></i>{{ device.ip }}<br />
                        <i class="fas fa-network-wired me-2"></i>{{ device.interfaces }}
                        </p>
                    </div>
                    </div>

                    <!-- Inner Graph Card -->
                    <div class="rrd-inner-card mt-3">
                    <div class="d-flex justify-content-between align-items-center mb-1">
                        <strong>{{ device.port }}</strong>
                        <span :class="['priority', device.priority.toLowerCase()]">
                        {{ device.priority }}
                        </span>
                    </div>
                    <p class="mb-2">{{ device.portInfo }}</p>
                    <img
                        :src="getImagePath(device.graph)"
                        alt="Graph"
                        class="graph-img"
                        />
                    </div>
                </div>
                </div>
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

export default {
  name: "RrdIntegraionView",
  components: {
    Menu
  },
  data() {
    return {
      lastUpdated: new Date().toLocaleString(),
      statsCards: [
        { icon: "fas fa-server", value: 8, label: "Total Devices" },
        { icon: "fas fa-network-wired", value: 40, label: "Active Interfaces" },
        { icon: "fas fa-exclamation-triangle", value: 14, label: "High Priority" },
        { icon: "fas fa-clock", value: "15.41.38", label: "Last Update" },
      ],
      statsCards2: [
        { icon: "fas fa-server", value: 5, label: "Total Devices" },
        { icon: "fas fa-network-wired", value: 30, label: "Active Interfaces" },
        { icon: "fas fa-exclamation-triangle", value: 12, label: "High Priority" },
        { icon: "fas fa-clock", value: "15.41.38", label: "Last Update" },
      ],
      devices: [
        {
          name: "10g-sw-biz-techno.indobsd.id",
          ip: "103.142.215.250",
          interfaces: "10 interfaces monitored",
          port: "br0",
          portInfo: "Main Bridge Interface",
          priority: "MEDIUM",
          graph: "graph1.png",
        },
        {
          name: "Core-Biznet-IDBSD",
          ip: "103.142.215.254",
          interfaces: "7 interfaces monitored",
          port: "ether1",
          portInfo: "Ethernet Port 1",
          priority: "HIGH",
          graph: "graph2.png",
        },
        {
          name: "Core-ipe",
          ip: "172.16.27.1",
          interfaces: "22 interfaces monitored",
          port: "br0",
          portInfo: "Bridge 0",
          priority: "MEDIUM",
          graph: "graph3.png",
        },
      ],
      isVlan: true,
    };
  },
   mounted() {
    setInterval(() => {
      this.lastUpdated = new Date().toLocaleString();
    }, 1000);
  },
  methods: {
    getImagePath(filename) {
      return new URL(`../assets/images/${filename}`, import.meta.url).href;
    },
    toggleDashboard() {
      this.isVlan = !this.isVlan;
    },
  },
}
</script>

<style scoped>
.rrd-integration .dashboard {
  background: var(--bg-main);
  color: var(--text-primary);
  font-family: "Poppins", sans-serif;
  min-height: 100vh;
  padding: 30px;
}

.rrd-integration-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
}

.rrd-integration-icon i {
  font-size: 42px;
  background: #8b9cff;
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 15px rgba(118, 75, 162, 0.4);
}

.rrd-integration-header h2 {
  font-size: 34px;
  font-weight: 600;
  color:#8b9cff;;
}

.rrd-subtitle {
  font-size: 15px;
  color: var(--text-secondary);
}

.last-updated {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
}

.last-updated i {
  color: rgba(255, 255, 255, 0.6);
  font-size: 13px;
}

.rrd-btn {
  border: none;
  padding: 8px 18px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  color: #fff;
  transition: all 0.3s ease;
}

.home-btn {
  background: linear-gradient(135deg, #ff7eb3, #ff758c);
  box-shadow: 0 0 12px rgba(255, 118, 146, 0.3);
}

.vlan-btn {
  background: linear-gradient(135deg, #667eea, #764ba2);
  box-shadow: 0 0 12px rgba(118, 75, 162, 0.3);
}

.rrd-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.4);
}

.rrd-integration-stats {
  margin-top: 30px;
}

.rrd-stat-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 14px;
  padding: 25px 10px;
  color: #fff;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
  transition: all 0.3s ease;
}

.rrd-stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.35);
}

.rrd-stat-card .icon-value {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 8px;
}

.rrd-stat-card .icon-value i {
  font-size: 26px;
}

.rrd-stat-card .icon-value h3 {
  font-size: 26px;
  font-weight: 600;
  margin: 0;
  color: #fff;
}

.rrd-stat-card p {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
}

.rrd-interface-cards {
  margin-top: 30px;
}

.rrd-device-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  padding: 20px;
  color: #fff;
  transition: all 0.3s ease;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.25);
}

.rrd-device-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 10px 32px rgba(0, 0, 0, 0.35);
}

.rrd-card-header {
  display: flex;
  align-items: flex-start;  
  justify-content: space-between;
  gap: 18px;               
  margin-bottom: 8px;
}

.rrd-card-header .icon-box {
  width: 35px;
  height: 35px;
  border-radius: 10px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  flex-shrink: 0; /* Prevent shrinking */
  box-shadow: 0 2px 8px rgba(118, 75, 162, 0.4);
}

.rrd-card-header .device-name {
  font-size: 16px;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 4px 0;
}

.rrd-card-header .device-info {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.75);
  margin: 0;
}

.rrd-inner-card {
  background: rgba(255, 255, 255, 0.07);
  border-radius: 12px;
  padding: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.rrd-inner-card strong {
  font-size: 14px;
  font-weight: 600;
}

.priority {
  font-size: 12px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 8px;
  text-transform: uppercase;
}

.priority.medium {
  background: rgba(255, 193, 7, 0.3);
  color: #ffc107;
}

.priority.high {
  background: rgba(220, 53, 69, 0.3);
  color: #dc3545;
}

.graph-img {
  width: 100%;
  height: auto;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.15);
}

@media (max-width: 992px) {
  .rrd-stat-card {
    padding: 20px 8px;
  }

  .rrd-stat-card h3 {
    font-size: 22px;
  }

  .rrd-device-card {
    padding: 18px;
  }
}

@media (max-width: 768px) {
  .rrd-integration-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .rrd-right-actions {
    margin-top: 15px;
  }

  .rrd-integration-header h2 {
    font-size: 22px;
  }

  .rrd-subtitle {
    font-size: 14px;
  }

  .rrd-integration-stats .row {
    row-gap: 15px;
  }

  .rrd-stat-card {
    width: 100%;
  }

  .rrd-device-card {
    width: 100%;
  }
}
</style>