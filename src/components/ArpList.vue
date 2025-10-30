<template>
  <div class="arp-page container-fluid py-4">
    <!-- 🔹 Title -->
    <h4 class="fw-bold mb-4">
      <FontAwesomeIcon :icon="['fas', 'sitemap']" class="me-2 text-info" />
      ARP List
    </h4>

    <!-- 🔹 Distribution Switch -->
    <div
      class="distribution-bar glass-card d-flex justify-content-center align-items-center p-3 mb-4 flex-wrap"
    >
      <button
        class="btn rounded-pill px-4 py-2 me-3"
        :class="activeDist === 'ipe' ? 'btn-info' : 'btn-secondary'"
        @click="activeDist = 'ipe'"
      >
        Distribution ipe <span class="dot" v-if="activeDist === 'ipe'"></span>
      </button>

      <button
        class="btn rounded-pill px-4 py-2"
        :class="activeDist === 'ipe-core' ? 'btn-info' : 'btn-secondary'"
        @click="activeDist = 'ipe-core'"
      >
        ipe-core <span class="dot-green" v-if="activeDist === 'ipe-core'"></span>
      </button>
    </div>

    <!-- 🔹 Filter Bar -->
    <div
      class="glass-bar d-flex flex-wrap align-items-center justify-content-between p-3 mb-4"
    >
      <div class="d-flex flex-wrap gap-3 align-items-center">
        <button
          class="btn-tab"
          :class="{ active: activeFilter === 'all' }"
          @click="activeFilter = 'all'"
        >
          <FontAwesomeIcon :icon="['fas', 'list']" class="me-2" /> All ARP
        </button>

        <button
          class="btn-tab"
          :class="{ active: activeFilter === 'dynamic' }"
          @click="activeFilter = 'dynamic'"
        >
          <FontAwesomeIcon :icon="['fas', 'sync']" class="me-2" /> Dynamic
        </button>

        <button
          class="btn-tab"
          :class="{ active: activeFilter === 'static' }"
          @click="activeFilter = 'static'"
        >
          <FontAwesomeIcon :icon="['fas', 'thumbtack']" class="me-2" /> Static
        </button>
      </div>

      <div class="d-flex gap-3">
        <span class="badge-count">Total: {{ filteredArp.length }}</span>
        <span class="badge-count">Reachable: {{ reachableCount }}</span>
        <span class="badge-count">Incomplete: {{ incompleteCount }}</span>
      </div>
    </div>

    <!-- 🔹 ARP Table -->
    <div class="glass-card p-4">
      <div class="table-responsive">
        <table class="table align-middle mb-0">
          <thead>
            <tr class="table-header">
              <th>IP ADDRESS</th>
              <th>MAC ADDRESS</th>
              <th>INTERFACE</th>
              <th>TYPE</th>
              <th>STATUS</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(entry, index) in filteredArp" :key="index">
              <td>{{ entry.ip }}</td>
              <td>{{ entry.mac }}</td>
              <td>
                <FontAwesomeIcon
                  :icon="['fas', 'network-wired']"
                  class="me-2 text-info"
                />
                {{ entry.interface }}
              </td>
              <td>
                <span
                  class="badge bg-primary bg-opacity-25 text-info fw-semibold px-3 py-2 rounded-pill"
                >
                  {{ entry.type }}
                </span>
              </td>
              <td>
                <span
                  class="badge fw-semibold px-3 py-2 rounded-pill"
                  :class="
                    entry.status === 'Reachable'
                      ? 'bg-success bg-opacity-25 text-success'
                      : 'bg-warning bg-opacity-25 text-warning'
                  "
                >
                  {{ entry.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

interface ArpEntry {
  ip: string;
  mac: string;
  interface: string;
  type: string;
  status: string;
}

export default defineComponent({
  name: "ArpList",
  components: { FontAwesomeIcon },
  data() {
    return {
      activeDist: "ipe",
      activeFilter: "all",
      arpListIpe: [
        {
          ip: "192.168.202.1",
          mac: "BC:24:11:A9:9A:5C",
          interface: "vlan-202",
          type: "Static",
          status: "Reachable",
        },
        {
          ip: "103.142.214.39",
          mac: "N/A",
          interface: "vlan-10-pub",
          type: "Static",
          status: "Incomplete",
        },
        {
          ip: "103.142.214.42",
          mac: "N/A",
          interface: "vlan-10-pub",
          type: "Static",
          status: "Incomplete",
        },
        {
          ip: "192.168.202.220",
          mac: "26:3E:B4:1B:02:F2",
          interface: "vlan-202",
          type: "Static",
          status: "Reachable",
        },
      ] as ArpEntry[],
      arpListIpeCore: [
        {
          ip: "10.0.0.1",
          mac: "AA:BB:CC:11:22:33",
          interface: "core-sfp1",
          type: "Dynamic",
          status: "Reachable",
        },
        {
          ip: "10.0.0.2",
          mac: "AA:BB:CC:11:22:44",
          interface: "core-ether5",
          type: "Dynamic",
          status: "Incomplete",
        },
      ] as ArpEntry[],
    };
  },
  computed: {
    activeList(): ArpEntry[] {
      return this.activeDist === "ipe" ? this.arpListIpe : this.arpListIpeCore;
    },
    filteredArp(): ArpEntry[] {
      if (this.activeFilter === "dynamic")
        return this.activeList.filter((a) => a.type === "Dynamic");
      if (this.activeFilter === "static")
        return this.activeList.filter((a) => a.type === "Static");
      return this.activeList;
    },
    reachableCount(): number {
      return this.activeList.filter((a) => a.status === "Reachable").length;
    },
    incompleteCount(): number {
      return this.activeList.filter((a) => a.status === "Incomplete").length;
    },
  },
});
</script>

<style scoped>
/* === PAGE === */
.arp-page {
  color: #fff;
}

/* === GLASS CARDS === */
.glass-card {
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
}

/* === TABLE === */
.table {
  --bs-table-bg: none;
  color: #fff !important; /* ✅ Make all text pure white */
  width: 100%;
}
.table-header {
  background: linear-gradient(90deg, #ff7ac6, #667eea);
  color: #fff !important;
}
.table thead th {
  color: #fff !important;
  font-weight: 600;
}
.table td {
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  color: #fff !important;
}
.table tbody tr:hover {
  background-color: rgba(255, 255, 255, 0.08);
}

/* === FILTER BAR === */
.glass-bar {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  backdrop-filter: blur(10px);
}

/* === DISTRIBUTION BAR === */
.distribution-bar {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.12);
}

/* === BUTTONS === */
.btn-info {
  background: #00cfff;
  color: #000;
  font-weight: 500;
  border: none;
  transition: 0.3s;
}
.btn-secondary {
  background: rgba(255, 255, 255, 0.25);
  color: #fff;
}
.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.4);
}

/* Dot indicators */
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
}
.dot-green {
  background: limegreen;
}

/* === TAB BUTTONS === */
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

/* === BADGES === */
.badge-count {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 50px;
  padding: 6px 14px;
  font-weight: 500;
  color: #fff;
}

/* === RESPONSIVE === */
@media (max-width: 992px) {
  .btn-tab {
    font-size: 0.9rem;
    padding: 6px 16px;
  }
  .glass-bar,
  .distribution-bar {
    flex-direction: column;
    gap: 1rem;
  }
  .table {
    font-size: 0.9rem;
  }
}
</style>
