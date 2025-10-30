<template>
  <div class="network-interfaces container-fluid ">
    <!-- 🟣 Page Title -->
    <h4 class="">
      <FontAwesomeIcon :icon="['fas', 'network-wired']"  />
      Network Interfaces
    </h4>
    <hr>

    <!-- 🔹 Distribution Bar -->
    <div class="distribution-bar glass-card d-flex justify-content-center align-items-center p-3 mb-4">
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
     <!-- Dropdown -->
      <div class="dropdown mb-2">
        <button class="btn btn-type dropdown-toggle" type="button" id="typeMenu" data-bs-toggle="dropdown">
          <font-awesome-icon :icon="['fas', 'layer-group']" class="me-2" /> {{ selectedType }}
        </button>
        <ul class="dropdown-menu dropdown-glass" aria-labelledby="typeMenu">
          <li v-for="(type, i) in types" :key="i" @click="selectedType = type.label" :class="{ active: selectedType === type.label }">
            <font-awesome-icon :icon="type.icon" class="me-2" /> {{ type.label }}
          </li>
        </ul>
      </div>

    <!-- 🔹 Filter Bar -->
    <div class="glass-bar d-flex flex-wrap align-items-center justify-content-between p-3 mb-4">


      <!-- Tabs -->
      <div class="d-flex flex-wrap align-items-center gap-3">
        <button
          v-for="filter in filters"
          :key="filter.value"
          class="btn-tab"
          :class="{ active: activeFilter === filter.value }"
          @click="activeFilter = filter.value"
        >
          <font-awesome-icon :icon="filter.icon" class="me-2" /> {{ filter.label }}
        </button>
      </div>

      <!-- Counters -->
      <div class="d-flex align-items-center gap-3">
        <span class="badge-count">Total: {{ filteredInterfaces.length }}</span>
        <span class="badge-count ">Up: {{ upCount }}</span>
        <span class="badge-count ">Down: {{ downCount }}</span>
      </div>
    </div>

    <!-- 🔹 Table -->
    <transition name="fade" mode="out-in">
      <div :key="activeDist" class="glass-card p-4">
        <div class="d-flex justify-content-between align-items-center flex-wrap mb-3">
          <h4 class="fw-bold mb-2 mb-md-0">
            <font-awesome-icon :icon="['fas', 'tachometer-alt']" class="me-2" />
            All Active Network Interfaces (Real-time)
          </h4>
          <div class="d-flex gap-3">
            <button class="btn btn-type ">
              <font-awesome-icon :icon="['fas', 'rotate']" class="me-2" /> Refresh
            </button>
            <button class="btn btn-type ">

              <font-awesome-icon :icon="['fas', 'toggle-on']" class="me-2" /> Show All Interfaces
            </button>
          </div>
        </div>

        <div class="table-responsive">
          <table class="table align-middle mb-0">
            <thead>
              <tr class="row-color">
                <th>#</th>
                <th>Interface</th>
                <th>Status</th>
                <th>RX Rate</th>
                <th>TX Rate</th>
                <th>Total Traffic</th>
                <th>Activity</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(iface, index) in filteredInterfaces"
                :key="index"
                class="align-middle"
              >
                <td>{{ index + 1 }}</td>
                <td>
                  <font-awesome-icon :icon="['fas', 'ethernet']" class="me-2 " />
                  {{ iface.name }}

                </td>
                <td>
                  <span class="status-dot" :class="iface.status === 'Up' ? 'bg-success' : 'bg-danger'"></span>
                  {{ iface.status }}
                </td>
                <td class="text-success">{{ iface.rxRate }}</td>
                <td class="text-primary">{{ iface.txRate }}</td>
                <td>{{ iface.totalTraffic }}</td>
                <td style="width: 180px">
                  <div class="progress activity-bar">
                    <div class="progress-bar" :style="{ width: iface.activity + '%' }"></div>
                  </div>
                  <small class="text-light-50">{{ iface.activity }}%</small>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </transition>
        <!-- 🟢 Network Interface Cards Below Table -->
    <div class="row g-4 mt-4">
      <div
        v-for="(iface, index) in filteredInterfaces"
        :key="'card-' + index"
        class="col-12 col-md-6 col-lg-4"
      >
        <div class="glass-card p-4 h-100">
          <!-- Header -->
          <div class="d-flex align-items-center mb-2">
            <FontAwesomeIcon :icon="['fas', 'ethernet']" class="me-2 text-info" />
            <h6 class="fw-bold mb-0">{{ iface.name }}</h6>
            <span
              class="status-dot ms-2"
              :class="iface.status === 'Up' ? 'bg-success' : 'bg-danger'"
            ></span>
            <small class="ms-2">{{ iface.status }}</small>
          </div>

          <div class="small text-light-50">Type:</div>
          <div class="fw-semibold mb-2">Ethernet</div>

          <div class="detail-row small">
            <span class="text-light-50">MAC:</span>
            <span class="fw-semibold">{{ iface.mac }}</span>
          </div>
          <div class="detail-row small">
            <span class="text-light-50">RX Rate:</span>
            <span class="text-success fw-semibold">{{ iface.rxRate }}</span>
          </div>
          <div class="detail-row small">
            <span class="text-light-50">TX Rate:</span>
            <span class="text-primary fw-semibold">{{ iface.txRate }}</span>
          </div>
          <div class="detail-row small">
            <span class="text-light-50">RX Total:</span>
            <span class="text-success fw-semibold">{{ iface.rxTotal }}</span>
          </div>
          <div class="detail-row small mb-3">
            <span class="text-light-50">TX Total:</span>
            <span class="text-primary fw-semibold">{{ iface.txTotal }}</span>
          </div>

          <!-- Chart Placeholder -->
          <div class="chart-box">
            <div class="chart-title">Traffic Rate (KB/s)</div>
            <div class="chart-canvas"></div>
          </div>

          <div class="d-flex justify-content-between mt-3">
            <button class="btn btn-sm btn-light-glass">
              <FontAwesomeIcon :icon="['fas', 'info-circle']" /> Details
            </button>
            <button class="btn btn-sm btn-pink" @click="openChartModal(iface)">
              <FontAwesomeIcon :icon="['fas', 'chart-line']" /> Chart 3D
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div
      class="modal fade"
      id="chartModal"
      tabindex="-1"
      aria-hidden="true"
      ref="chartModal"
    >
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content glass-card p-4">
          <div class="modal-header border-0">
            <h5 class="modal-title">
              <FontAwesomeIcon :icon="['fas', 'ethernet']" class="me-2" />
              {{ selectedIface?.name }}
            </h5>
            <button
              type="button"
              class="btn-close btn-close-white"
              data-bs-dismiss="modal"
            ></button>
          </div>
          <div class="modal-body">
            <div class="chart-placeholder-lg">Live Traffic Chart (Placeholder)</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faLayerGroup,
  faNetworkWired,
  faEthernet,
  faRotate,
  faToggleOn,
  faList,
  faCircleCheck,
  faCircleXmark,
  faWifi,
  faSitemap,
  faTachometerAlt,
  faTag,
  faBolt,
  faInfoCircle,
  faChartLine,
} from "@fortawesome/free-solid-svg-icons";

library.add(
  faLayerGroup,
  faNetworkWired,
  faEthernet,
  faRotate,
  faToggleOn,
  faList,
  faCircleCheck,
  faCircleXmark,
  faWifi,
  faSitemap,
  faTachometerAlt,
  faTag,
  faBolt,
  faInfoCircle,
  faChartLine
);

// ✅ Define interface type
interface NetworkInterface {
  name: string;
  status: string;
  rxRate: string;
  txRate: string;
  totalTraffic: string;
  activity: number;
  mac?: string;
  rxTotal?: string;
  txTotal?: string;
}

export default defineComponent({
  name: "NetworkInterfaces",
  components: { FontAwesomeIcon },
  data() {
    return {
      activeDist: "ipe",
      selectedType: "All Types",
      selectedIface: null as NetworkInterface | null, // ✅ added missing field
      types: [
        { label: "All Types", icon: ["fas", "layer-group"] },
        { label: "Ethernet", icon: ["fas", "ethernet"] },
        { label: "Wireless", icon: ["fas", "wifi"] },
        { label: "Bridge", icon: ["fas", "sitemap"] },
        { label: "VLAN", icon: ["fas", "tag"] },
        { label: "L2TP", icon: ["fas", "bolt"] },
      ],
      activeFilter: "all",
      filters: [
        { label: "All Interfaces", value: "all", icon: ["fas", "list"] },
        { label: "Up", value: "up", icon: ["fas", "circle-check"] },
        { label: "Down", value: "down", icon: ["fas", "circle-xmark"] },
      ],
      interfacesIpe: [
        { name: "ether10", status: "Up", rxRate: "0 B/s", txRate: "0 B/s", totalTraffic: "4.21 TB", activity: 100 },
        { name: "ether12", status: "Up", rxRate: "0 B/s", txRate: "0 B/s", totalTraffic: "4.14 TB", activity: 98 },
        { name: "ether11", status: "Down", rxRate: "0 B/s", txRate: "0 B/s", totalTraffic: "—", activity: 0 },
      ] as NetworkInterface[],
      interfacesCore: [
        { name: "sfp1", status: "Up", rxRate: "2.4 MB/s", txRate: "1.5 MB/s", totalTraffic: "3.8 TB", activity: 92 },
        { name: "ether3", status: "Down", rxRate: "0 B/s", txRate: "0 B/s", totalTraffic: "—", activity: 0 },
        { name: "ether7", status: "Up", rxRate: "1.1 MB/s", txRate: "2.0 MB/s", totalTraffic: "2.6 TB", activity: 76 },
      ] as NetworkInterface[],
      cardInterfacesIpe: [
        {
          name: "ether1",
          status: "Up",
          mac: "DC:2C:6E:C3:1B:A8",
          rxRate: "0 B/s",
          txRate: "0 B/s",
          rxTotal: "1.03 TB",
          txTotal: "89.07 GB",
          totalTraffic: "1.12 TB",
          activity: 100,
        },
        {
          name: "ether2",
          status: "Up",
          mac: "DC:2C:6E:C3:1B:A9",
          rxRate: "0 B/s",
          txRate: "0 B/s",
          rxTotal: "1.27 TB",
          txTotal: "1.35 TB",
          totalTraffic: "2.62 TB",
          activity: 96,
        },
        {
          name: "ether4",
          status: "Up",
          mac: "DC:2C:6E:C3:1B:AB",
          rxRate: "0 B/s",
          txRate: "0 B/s",
          rxTotal: "1.02 TB",
          txTotal: "1.19 TB",
          totalTraffic: "2.21 TB",
          activity: 91,
        },
      ] as NetworkInterface[],
    };
  },
  computed: {
    interfaces(): NetworkInterface[] {
      return this.activeDist === "ipe" ? this.interfacesIpe : this.interfacesCore;
    },
    filteredInterfaces(): NetworkInterface[] {
      if (this.activeFilter === "up") return this.interfaces.filter((i) => i.status === "Up");
      if (this.activeFilter === "down") return this.interfaces.filter((i) => i.status === "Down");
      return this.interfaces;
    },
    upCount(): number {
      return this.interfaces.filter((i) => i.status === "Up").length;
    },
    downCount(): number {
      return this.interfaces.filter((i) => i.status === "Down").length;
    },
  },
  methods: {openChartModal(iface: NetworkInterface) {
  this.selectedIface = iface;

  const modalEl = document.getElementById("chartModal");
  if (!modalEl) return;

  // ✅ Create a local interface type for Bootstrap Modal
  interface BootstrapModal {
    show: () => void;
  }

  // ✅ Tell TypeScript what we're accessing
  const bootstrapGlobal = (window as unknown as { bootstrap?: { Modal?: new (el: HTMLElement) => BootstrapModal } });

  const ModalConstructor = bootstrapGlobal.bootstrap?.Modal;
  if (ModalConstructor) {
    const modal = new ModalConstructor(modalEl);
    modal.show();
  }
}
,
  },
});
</script>



<style scoped>
/* === Fade transition === */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* === Glass Distribution Bar === */
.distribution-bar {
  background: linear-gradient(90deg, #292f45, #3b3350, #4c3058);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.12);
}

/* Buttons */
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

/* Dots */
.dot, .dot-green {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
  margin-left: 8px;
}
.dot { background: cyan; }
.dot-green { background: limegreen; }

/* === Glass Filter Bar === */
.glass-bar {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 14px;
  backdrop-filter: blur(10px);
}

/* Dropdown */
.btn-type {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  border-radius: 50px;
  border: none;
  padding: 10px 20px;
  font-weight: 500;
}
.dropdown-glass {
  background: rgba(45, 45, 60, 0.95);
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 8px 0;
}
.dropdown-glass li {
  padding: 10px 20px;
  color: rgba(255, 255, 255, 0.85);
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: 0.3s;
}
.dropdown-glass li:hover, .dropdown-glass li.active {
  background: linear-gradient(90deg, #ff7ac6, #667eea);
  color: white;
  border-radius: 8px;
}

/* Tabs */
.btn-tab {
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.85);
  border: none;
  border-radius: 10px;
  padding: 8px 20px;
  transition: 0.3s;
}
.btn-tab.active, .btn-tab:hover {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

/* Badges */
.badge-count {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 50px;
  padding: 6px 14px;
  font-weight: 500;
}

/* Glass card + table */
.glass-card {
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 16px;
  backdrop-filter: blur(10px);
}
table{
  --bs-table-bg: none;

}

.row-color {
   background: linear-gradient(135deg, #667eea, #764ba2);

}
.table th {

  color: #fff;
  border: none;
}
.table td {

  border-top: 0.5px solid rgba(255, 255, 255, 0.08);
   color: #fff;

}
.activity-bar {
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}
.activity-bar .progress-bar {
  background: linear-gradient(90deg, #00c6ff, #0072ff);
}

/* Status dots */
.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 8px;
}
/* Interface cards */
.chart-box {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 10px;
  text-align: center;
}
.chart-title {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 4px;
}
.chart-canvas {
  background: rgba(255, 255, 255, 0.1);
  height: 120px;
  border-radius: 10px;
}
.btn-pink {
  background: #ff7ac6;
  color: white;
  border: none;
}
.btn-light-glass {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: none;
}

/* Responsive */
@media (max-width: 992px) {
  .glass-bar, .distribution-bar {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
}
</style>
