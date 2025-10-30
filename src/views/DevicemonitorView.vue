<template>
  <div class="container-fluid device-monitoring">
    <div class="row">
      <div class="col-1">
        <Menu />
      </div>
      <div class="col-11">
        <div class="">
          <!-- 🔹 Page Header -->
          <div class="page-header">
            <div class="header-left">
              <h1 class="title">
                <font-awesome-icon :icon="['fas', 'server']" class="server-icon" />
                Device Monitoring
              </h1>
              <p class="subtitle">Monitor and manage all network devices in real-time</p>
            </div>

            <div class="header-right">
              <button class="small-btn">
                <font-awesome-icon :icon="['fas', 'expand']" /> Fullscreen
              </button>
              <button class="small-btn">
                <font-awesome-icon :icon="['fas', 'info-circle']" /> Site Info
              </button>
            </div>
          </div>

          <!-- 🔹 Main Glass Card -->
          <div class="main-card">
            <!-- Tabs + Controls -->
            <div class="top-row">
              <div class="tabs">
                <button
                  v-for="tab in tabs"
                  :key="tab.value"
                  :class="['tab-btn', { active: activeTab === tab.value }]"
                  @click="activeTab = tab.value"
                >
                  <font-awesome-icon :icon="tab.icon" class="tab-icon" />
                  {{ tab.label }}
                </button>
              </div>

              <div class="meta-controls">
                <div class="meta-pill">
                  <font-awesome-icon :icon="['fas', 'sync']" /> Seamless: OFF
                </div>
                <div>No Device is selected</div>
                <div class="meta-pill">
                  <font-awesome-icon :icon="['fas', 'clock']" /> Refresh:
                  <span class="meta-strong">33</span> s
                </div>
                <div class="meta-pill">
                  <font-awesome-icon :icon="['fas', 'heartbeat']" /> Status Check:
                  <span class="meta-strong">12</span> s
                </div>
                <div class="meta-text">
                  Total: <span class="meta-strong">29</span> &nbsp; Online:
                  <span class="meta-strong">29</span> &nbsp; Offline:
                  <span class="meta-strong">0</span>
                </div>
              </div>
            </div>

            <!-- 🔹 Devices Table -->
            <div class="table-wrapper">
              <table class="devices-table">
                <thead>
                  <tr>
                    <th>DEVICE</th>
                    <th>PARENT SERVER</th>
                    <th>SYSTEM</th>
                    <th>IP ADDRESS</th>
                    <th>SITE</th>
                    <th>STATUS</th>
                    <th>ROUTEROS</th>
                    <th>GATEWAY</th>
                    <th>RESPONSE TIME</th>
                    <th>LAST CHECK</th>
                    <th>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(device, i) in filteredDevices" :key="i">
                    <td class="device-col">
                      <div class="device-icon">
                        <font-awesome-icon
                          :icon="getDeviceIcon(device.sub)"
                          class="inner-icon"
                        />
                      </div>
                      <div class="device-info">
                        <div class="device-name">{{ device.name }}</div>
                        <div class="device-sub">
                          {{ device.sub || "Network Device" }}
                        </div>
                      </div>
                    </td>

                    <td>{{ device.parent }}</td>
                    <td>
                      <span class="system-pill">{{ device.sub }}</span>
                    </td>
                    <td>{{ device.ip }}</td>
                    <td>
                      <span class="site-badge">{{ device.site }}</span>
                    </td>
                    <td>
                      <span
                        :class="['status-pill', device.status === 'Online' ? 'online' : 'offline']"
                      >
                        {{ device.status }}
                      </span>
                    </td>
                    <td>{{ device.version }}</td>
                    <td>
                      {{ device.gateway }}
                      <br />
                      <small class="text-success"
                        >• online ({{ device.latency }}ms)</small
                      >
                    </td>
                    <!-- 🔹 New Data Columns -->
                    <td class="text-success fw-semibold">{{ device.response }}</td>
                    <td>
                      {{ device.lastCheck.date }},
                      <br />
                      <small>{{ device.lastCheck.time }}</small>
                    </td>
                    <td class="actions">
                      <button class="action-btn">
                        <font-awesome-icon :icon="['fas', 'sync']" />
                      </button>
                      <button class="action-btn">
                        <font-awesome-icon :icon="['fas', 'share-nodes']" />
                      </button>
                      <button class="action-btn purple">
                        <font-awesome-icon :icon="['fas', 'pen-to-square']" />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <!-- end main card -->
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Menu from '@/components/Menu.vue';
import { defineComponent } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faServer,
  faNetworkWired,
  faMicrochip,
  faWifi,
  faGlobe,
  faSync,
  faExpand,
  faInfoCircle,
  faClock,
  faHeartbeat,
} from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";

library.add(
  faServer,
  faNetworkWired,
  faMicrochip,
  faWifi,
  faGlobe,
  faSync,
  faExpand,
  faInfoCircle,
  faClock,
  faHeartbeat
);

export default defineComponent({
  name: "DeviceMonitoring",
  components: { FontAwesomeIcon,
    Menu
   },
  data() {
    return {
      activeTab: "all",
      tabs: [
        { label: "All Devices", value: "all", icon: ["fas", "server"] },
        { label: "MikroTik", value: "mikrotik", icon: ["fas", "network-wired"] },
        { label: "Other Devices", value: "other", icon: ["fas", "microchip"] },
        { label: "Online", value: "online", icon: ["fas", "wifi"] },
        { label: "Offline", value: "offline", icon: ["fas", "wifi"] },
        { label: "RouterOS 6", value: "r6", icon: ["fas", "globe"] },
        { label: "RouterOS 7", value: "r7", icon: ["fas", "globe"] },
      ],
      devices: [
        {
          name: "store-01",
          sub: "Network Device",
          parent: "-",
          ip: "192.168.200.1",
          site: "Rumah",
          status: "Online",
          version: "7.12.1",
          gateway: "192.168.200.254",
          latency: 12,
          response: "0.559ms",
          lastCheck: { date: "30/10/2025", time: "16:51" },
        },
        {
          name: "Store-03",
          sub: "Server",
          parent: "-",
          ip: "192.168.200.3",
          site: "Rumah",
          status: "Online",
          version: "7.10.5",
          gateway: "192.168.200.254",
          latency: 15,
          response: "0.559ms",
          lastCheck: { date: "30/10/2025", time: "16:51" },
        },
        {
          name: "Store-02",
          sub: "Server",
          parent: "-",
          ip: "192.168.200.2",
          site: "Biznet",
          status: "Online",
          version: "7.10.5",
          gateway: "192.168.200.254",
          latency: 15,
            response: "0.559ms",
          lastCheck: { date: "30/10/2025", time: "16:51" },
        },
        {
          name: "ISP-Biznet",
          sub: "Router",
          parent: "-",
          ip: "192.168.11.1",
          site: "Biznet",
          status: "Online",
          version: "7.8.0",
          gateway: "8.8.8.8",
          latency: 44,
            response: "0.559ms",
          lastCheck: { date: "30/10/2025", time: "16:51" },
        },
      ],
    };
  },
  computed: {
    filteredDevices() {
      if (this.activeTab === "all") return this.devices;
      if (this.activeTab === "online")
        return this.devices.filter((d) => d.status === "Online");
      if (this.activeTab === "offline")
        return this.devices.filter((d) => d.status === "Offline");
      if (this.activeTab === "mikrotik")
        return this.devices.filter((d) => d.version && d.version.startsWith("7"));
      return this.devices;
    },
  },
  methods: {
    getDeviceIcon(sub: string) {
      if (sub.toLowerCase().includes("router")) return ["fas", "wifi"];
      if (sub.toLowerCase().includes("server")) return ["fas", "server"];
      return ["fas", "network-wired"];
    },
  },
});
</script>

<style scoped>
.device-monitoring {
  min-height: 100vh;
  background: linear-gradient(
    120deg,
    #0f0b1a 0%,
    #171025 30%,
    #3f2b42 60%,
    #5b3550 100%
  );
  padding: 48px 4%;
  color: #e9e6f5;
  font-family: "Inter", "Helvetica Neue", Arial, sans-serif;
}

/* Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  margin-bottom: 18px;
  margin-left: 48px;
}
.title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 36px;
  font-weight: 800;
  background: linear-gradient(90deg, #7f86ff 0%, #a56cc7 60%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.server-icon {
  color: #7f86ff;
  background: rgba(127, 134, 255, 0.12);
  border-radius: 8px;
  padding: 6px;
  font-size: 24px;
}
.subtitle {
  margin: 8px 0 0 0;
  color: rgba(233, 230, 245, 0.7);
  font-size: 14px;
}
.header-right {
  display: flex;
  gap: 12px;
  align-items: center;
}
.small-btn {
  background: rgba(255, 255, 255, 0.04);
  color: rgba(233, 230, 245, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.06);
  padding: 8px 12px;
  border-radius: 10px;
  font-size: 13px;
  cursor: pointer;
  display: inline-flex;
  gap: 8px;
  align-items: center;
  transition: 0.18s ease;
}
.small-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 24px rgba(118, 75, 162, 0.18);
  background: rgba(118, 75, 162, 0.12);
}

/* Glass Card */
.main-card {
  /* max-width: 1280px; */
  margin-left: 48px;
  border-radius: 18px;
  padding: 22px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(8px);
}

/* Tabs */
.top-row {
  display: flex;
  gap: 18px;
  align-items: center;
  margin-bottom: 18px;
  flex-wrap: wrap;
}
.tabs {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
.tab-btn {
  border: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(255, 255, 255, 0.03);
  color: rgba(233, 230, 245, 0.9);
  padding: 10px 18px;
  border-radius: 12px;
  font-weight: 600;
  display: inline-flex;
  gap: 8px;
  align-items: center;
  cursor: pointer;
  transition: 0.22s ease;
}
.tab-btn.active {
  background: linear-gradient(90deg, #677aff, #8755aa);
  color: #fff;
  box-shadow: 0 8px 30px rgba(118, 75, 162, 0.28);
}

/* Meta controls */
.meta-controls {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
}
.meta-pill {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.04);
  padding: 8px 12px;
  border-radius: 10px;
  font-size: 13px;
}
.meta-strong {
  color: #fff;
  font-weight: 700;
}
.meta-text {
  color: rgba(233, 230, 245, 0.75);
  font-size: 14px;
}

/* Table */
.table-wrapper {
  background: rgba(255, 255, 255, 0.01);
  border-radius: 12px;
  overflow: hidden;
}
.devices-table {
  width: 100%;
  border-collapse: collapse;
}
.devices-table thead th {
  padding: 14px 18px;
  text-align: left;
  font-size: 13px;
  color: rgba(233, 230, 245, 0.8);
  background: rgba(255, 255, 255, 0.02);
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);
}
.devices-table tbody td {
  padding: 18px;
  font-size: 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.02);
  color: rgba(233, 230, 245, 0.95);
}

/* Device Column */
.device-col {
  display: flex;
  align-items: center;
  gap: 14px;
}
.device-icon {
  width: 54px;
  height: 54px;
  border-radius: 12px;
  background: linear-gradient(140deg, #7f86ff 0%, #9f79d9 60%);
  box-shadow: 0 6px 18px rgba(127, 134, 255, 0.18);
  display: flex;
  justify-content: center;
  align-items: center;
}
.inner-icon {
  font-size: 22px;
  color: white;
  opacity: 0.95;
}
.device-info .device-name {
  font-weight: 700;
  font-size: 15px;
}
.device-sub {
  font-size: 12px;
  color: rgba(233, 230, 245, 0.6);
}

/* Pills */
.system-pill {
  background: rgba(0, 255, 255, 0.2);
  padding: 6px 10px;
  border-radius: 10px;
}
.site-badge {
  background: linear-gradient(90deg, rgba(149, 99, 255, 0.18), rgba(130, 80, 190, 0.12));
  padding: 6px 10px;
  border-radius: 14px;
  font-weight: 700;
  font-size: 13px;
}
.status-pill {
  display: inline-block;
  padding: 6px 10px;
  border-radius: 10px;
  font-weight: 700;
  font-size: 13px;
  color: #fff;
}
.status-pill.online {
  background: linear-gradient(90deg, #2fb764, #1e7f3e);
}
.status-pill.offline {
  background: linear-gradient(90deg, #e24f5f, #c83a3a);
}
</style>
