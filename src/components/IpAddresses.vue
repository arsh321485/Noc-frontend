<template>
  <div class="ip-addresses container-fluid py-3">
    <!-- 🔹 Distribution Buttons -->
    <div class="d-flex justify-content-center align-items-center flex-wrap glass-card mb-4 p-3 gap-3">
      <button
        class="btn rounded-pill px-4 py-2"
        :class="activeDist === 'ipe' ? 'btn-active' : 'btn-inactive'"
        @click="activeDist = 'ipe'"
      >
        Distribution ipe
        <span class="dot" v-if="activeDist === 'ipe'"></span>
      </button>

      <button
        class="btn rounded-pill px-4 py-2"
        :class="activeDist === 'ipe-core' ? 'btn-active' : 'btn-inactive'"
        @click="activeDist = 'ipe-core'"
      >
        ipe-core
        <span class="dot-green" v-if="activeDist === 'ipe-core'"></span>
      </button>
    </div>

    <!-- 🔹 Filter Bar -->
    <div class="glass-bar d-flex flex-wrap align-items-center justify-content-between p-3 mb-4">
      <div class="d-flex flex-wrap gap-3 align-items-center">
        <button
          class="btn-tab"
          :class="{ active: activeFilter === 'all' }"
          @click="activeFilter = 'all'"
        >
          <FontAwesomeIcon :icon="['fas', 'list']" class="me-2" /> All IPs
        </button>

        <button
          class="btn-tab"
          :class="{ active: activeFilter === 'enabled' }"
          @click="activeFilter = 'enabled'"
        >
          <FontAwesomeIcon :icon="['fas', 'sync']" class="me-2" /> Enabled
        </button>

        <button
          class="btn-tab"
          :class="{ active: activeFilter === 'disabled' }"
          @click="activeFilter = 'disabled'"
        >
          <FontAwesomeIcon :icon="['fas', 'thumbtack']" class="me-2" /> Disabled
        </button>
      </div>

      <div class="d-flex gap-3">
        <span class="badge-count">Total: {{ filteredIPs.length }}</span>
        <span class="badge-count">Enabled: {{ enabledCount }}</span>
        <span class="badge-count">Disabled: {{ disabledCount }}</span>
      </div>
    </div>

    <!-- 🔹 IP Table -->
    <div class="glass-card p-0 overflow-hidden">
      <div class="table-responsive">
        <table class="table align-middle mb-0">
          <thead>
            <tr>
              <th>IP ADDRESS</th>
              <th>INTERFACE</th>
              <th>NETWORK</th>
              <th>STATUS</th>
              <th>TYPE</th>
              <th>COMMENT</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(ip, index) in filteredIPs" :key="index">
              <td>{{ ip.address }}</td>
              <td>
                <FontAwesomeIcon :icon="['fas', 'network-wired']" class="text-primary me-2" />
                {{ ip.interface }}
              </td>
              <td>{{ ip.network }}</td>
              <td>
                <span class="badge" :class="ip.status === 'Enabled' ? 'bg-success' : 'bg-danger'">
                  {{ ip.status }}
                </span>
              </td>
              <td><span class="badge bg-info">Static</span></td>
              <td><em>No comment</em></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faNetworkWired, faList, faThumbtack, faSync } from "@fortawesome/free-solid-svg-icons";
library.add(faNetworkWired, faList, faThumbtack, faSync);

interface IPEntry {
  address: string;
  interface: string;
  network: string;
  status: string;
}

export default defineComponent({
  name: "IPAddresses",
  components: { FontAwesomeIcon },
  data() {
    return {
      activeDist: "ipe",
      activeFilter: "all",
      ipListIpe: [
        { address: "192.168.200.254/24", interface: "bridgeLocal01", network: "192.168.200.0/24", status: "Enabled" },
        { address: "192.168.201.254/24", interface: "bridgeLocal02", network: "192.168.201.0/24", status: "Enabled" },
        { address: "172.16.27.2/28", interface: "ether1", network: "172.16.27.0/28", status: "Enabled" },
        { address: "192.168.98.254/24", interface: "ether6", network: "192.168.98.0/24", status: "Disabled" },
        { address: "192.168.202.254/24", interface: "vlan-202", network: "192.168.202.0/24", status: "Enabled" },
        { address: "192.168.203.254/24", interface: "vlan-203", network: "192.168.203.0/24", status: "Enabled" },
        { address: "192.168.204.254/24", interface: "vlan-204", network: "192.168.204.0/24", status: "Enabled" },
        { address: "103.142.214.33/28", interface: "vlan-10-pub", network: "103.142.214.32/28", status: "Enabled" },
      ] as IPEntry[],
      ipListIpeCore: [
        { address: "10.10.10.1/24", interface: "core-bridge1", network: "10.10.10.0/24", status: "Enabled" },
        { address: "172.30.0.1/24", interface: "core-ether1", network: "172.30.0.0/24", status: "Enabled" },
      ] as IPEntry[],
    };
  },
  computed: {
    activeIPs(): IPEntry[] {
      return this.activeDist === "ipe" ? this.ipListIpe : this.ipListIpeCore;
    },
    filteredIPs(): IPEntry[] {
      if (this.activeFilter === "enabled") return this.activeIPs.filter((i) => i.status === "Enabled");
      if (this.activeFilter === "disabled") return this.activeIPs.filter((i) => i.status === "Disabled");
      return this.activeIPs;
    },
    enabledCount(): number {
      return this.activeIPs.filter((i) => i.status === "Enabled").length;
    },
    disabledCount(): number {
      return this.activeIPs.filter((i) => i.status === "Disabled").length;
    },
  },
});
</script>

<style scoped>
.ip-addresses {
  color: #fff;
}

/* === Glass Card === */
.glass-card {
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 16px;
  backdrop-filter: blur(12px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.35);
}

/* === Table === */
.table {
  --bs-table-bg: none;
  color: #fff;
}
.table thead th {
  background: linear-gradient(135deg, #6a48f7, #8b5cf6);
  color: #fff;
  font-weight: 600;
  font-size: 0.85rem;
  text-transform: uppercase;
  border: none;
}
.table td {
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding: 12px 16px;
  font-size: 0.9rem;
  color: #e5e5ff;
}
.table tbody tr:hover {
  background: rgba(122, 90, 248, 0.08);
}

/* === Distribution Buttons === */
.btn {
  border: none;
  transition: all 0.3s ease;
}
.btn-active {
  background: linear-gradient(135deg, #06b6d4, #3b82f6);
  color: #fff;
  font-weight: 600;
  box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
}
.btn-inactive {
  background: rgba(255, 255, 255, 0.1);
  color: #ccc;
}
.dot,
.dot-green {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
  margin-left: 8px;
}
.dot {
  background: cyan;
  box-shadow: 0 0 6px cyan;
}
.dot-green {
  background: limegreen;
  box-shadow: 0 0 6px limegreen;
}

/* === Tabs + Filter Bar === */
.glass-bar {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  backdrop-filter: blur(10px);
}
.btn-tab {
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.85);
  border: none;
  border-radius: 10px;
  padding: 8px 20px;
  transition: 0.3s;
}
.btn-tab.active,
.btn-tab:hover {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}
.badge-count {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 50px;
  padding: 6px 14px;
  font-weight: 500;
}

/* === Badges === */
.badge {
  border-radius: 10px;
  font-size: 0.8rem;
  padding: 5px 10px;
  text-transform: capitalize;
  font-weight: 600;
}
.bg-success {
  background-color: rgba(34, 197, 94, 0.15) !important;
  color: #4ade80 !important;
  border: 1px solid rgba(74, 222, 128, 0.4);
}
.bg-danger {
  background-color: rgba(239, 68, 68, 0.15) !important;
  color: #f87171 !important;
  border: 1px solid rgba(248, 113, 113, 0.4);
}
.bg-info {
  background-color: rgba(59, 130, 246, 0.2) !important;
  color: #93c5fd !important;
  border: 1px solid rgba(147, 197, 253, 0.3);
}

/* === Responsive === */
@media (max-width: 992px) {
  .table th,
  .table td {
    font-size: 0.8rem;
  }
  .btn-tab {
    padding: 6px 12px;
    font-size: 0.85rem;
  }
}
@media (max-width: 576px) {
  .table thead {
    display: none;
  }
  .table,
  .table tbody,
  .table tr,
  .table td {
    display: block;
    width: 100%;
  }
  .table tr {
    margin-bottom: 15px;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.03);
    padding: 10px;
  }
  .table td {
    text-align: right;
    position: relative;
    padding-left: 50%;
  }
  .table td::before {
    content: attr(data-label);
    position: absolute;
    left: 10px;
    color: #9ca3af;
    font-weight: 600;
    text-transform: uppercase;
    font-size: 0.75rem;
  }
}
</style>
