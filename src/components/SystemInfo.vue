<template>
  <div class="system-info">
    <h4>
      <font-awesome-icon :icon="['fas', 'server']" class="me-2" />
      System Information
    </h4>
    <hr />

    <!-- Distribution Buttons -->
    <div
      class="d-flex justify-content-center align-items-center flex-wrap glass-card mb-4 p-3"
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

    <!-- 🧩 System Status Cards -->
    <div class="row g-4 mt-4">
      <div
        v-for="(card, index) in systemCards"
        :key="index"
        class="col-12 col-md-6 col-lg-3"
      >
        <div class="glass-card d-flex flex-column justify-content-between p-4 h-100">
          <!-- Header -->
          <div class="d-flex align-items-start mb-3">
            <div class="icon-wrapper me-3">
              <font-awesome-icon :icon="card.icon" />
            </div>
            <div class="flex-grow-1">
              <h6 class="fw-bold mb-2">{{ card.title }}</h6>

              <!-- Progress -->
              <div v-if="card.progress !== undefined" class="progress-section">
                <div class="progress progressbars mb-2">
                  <div
                    class="progress-bar"
                    :style="{ width: card.progress + '%', background: card.color }"
                  ></div>
                </div>
                <div class="d-flex justify-content-between small">
                  <span class="text-light-50">
                    <!-- {{ card.details[0].label }} {{ card.progress }}% -->
                      {{ card.details?.[0]?.label || 'N/A' }} {{ card.progress }}%
                  </span>
                  <span class="fw-semibold">{{ card.progress }}%</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Details -->
          <div class="details mt-2">
            <div
              v-for="(info, i) in card.details"
              :key="i"
              class="detail-row small text-light mb-1"
            >
              <span class="text-light-50">{{ info.label }}</span>
              <span class="fw-semibold">{{ info.value }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ⚙ Other Info Cards -->
    <div class="row g-4 mt-4 mb-4">
      <div
        v-for="(card, index) in activeCards"
        :key="index"
        class="col-12 col-md-6 col-lg-3"
      >
        <div class="glass-card d-flex flex-column justify-content-between p-4 h-100">
          <div class="d-flex align-items-center mb-3">
            <div class="icon-wrapper me-3">
              <font-awesome-icon :icon="card.icon" />
            </div>
            <h6 class="fw-bold mb-0">{{ card.title }}</h6>
          </div>

          <div class="details mt-2">
            <div
              v-for="(info, i) in card.details"
              :key="i"
              class="d-flex justify-content-between small text-light mb-1"
            >
              <span class="text-light-50">{{ info.label }}</span>
              <span class="fw-semibold">{{ info.value }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
// 🔹 Font Awesome core
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
// 🔹 Import the specific icons you need
import {
  faServer,
  faMicrochip,
  faMemory,
  faHdd,
  faTemperatureHigh,
  faClock,
  faInfoCircle,
  faTag,
} from "@fortawesome/free-solid-svg-icons";

// 🔹 Add them to the library
library.add(
  faServer,
  faMicrochip,
  faMemory,
  faHdd,
  faTemperatureHigh,
  faClock,
  faInfoCircle,
  faTag
);

export default defineComponent({
  name: "SystemInfo",
  components: { FontAwesomeIcon },
  data() {
    return {
      activeDist: "ipe",
      systemCards: [
        {
          title: "CPU Load",
          icon: ["fas", "microchip"],
          progress: 17,
          color: "linear-gradient(90deg, #34e3ff, #6ad7ff)",
          details: [{ label: "Load Average", value: "0.45" }],
        },
        {
          title: "Memory",
          icon: ["fas", "memory"],
          progress: 23,
          color: "linear-gradient(90deg, #ff7ac6, #ffb3e6)",
          details: [
            { label: "Used", value: "218MB / 4032MB" },
            { label: "Available", value: "3814MB" },
          ],
        },
        {
          title: "Storage",
          icon: ["fas", "hdd"],
          progress: 14,
          color: "linear-gradient(90deg, #f7971e, #ffd200)",
          details: [
            { label: "Available", value: "Not Available" },
            { label: "", value: "--" },
          ],
        },
        {
          title: "Temperature",
          icon: ["fas", "temperature-high"],
          progress: 0,
          color: "linear-gradient(90deg, #ff5858, #f09819)",
          details: [
            { label: "Temperature", value: "-- °C" },
            { label: "Status", value: "N/A" },
          ],
        },
      ],
      cardsIpe: [
        {
          title: "Uptime",
          icon: ["fas", "clock"],
          details: [
            { label: "Uptime", value: "2w 3d 15h" },
            { label: "Boot", value: "Invalid Date" },
          ],
        },
        {
          title: "System Version",
          icon: ["fas", "info-circle"],
          details: [
            { label: "Version", value: "7.12.1 (stable)" },
            { label: "RouterOS", value: "ROUTEROS 7" },
          ],
        },
        {
          title: "Identity",
          icon: ["fas", "tag"],
          details: [
            { label: "Disti", value: "rumah.dioniqe.id" },
            { label: "Model", value: "CCR2004-16G-2S+" },
          ],
        },
        {
          title: "Hardware",
          icon: ["fas", "microchip"],
          details: [
            { label: "Board", value: "CCR2004-16G-2S+" },
            { label: "Architecture", value: "--" },
          ],
        },
      ],
      cardsIpeCore: [
        {
          title: "Uptime",
          icon: ["fas", "clock"],
          details: [
            { label: "Uptime", value: "5d 12h 10m" },
            { label: "Boot", value: "Oct/24/2025" },
          ],
        },
        {
          title: "System Version",
          icon: ["fas", "info-circle"],
          details: [
            { label: "Version", value: "7.13.0 (testing)" },
            { label: "RouterOS", value: "ROUTEROS 7" },
          ],
        },
      ],
    };
  },
  computed: {
    activeCards() {
      return this.activeDist === "ipe" ? this.cardsIpe : this.cardsIpeCore;
    },
  },
});
</script>

<style scoped>
.system-info {
  color: white;
}

/* Glass card base */
.glass-card {
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  color: white;
  transition: 0.3s;
}

/* Icon design */
.icon-wrapper {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #7b5cf0, #5c8eff);
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: white;
}

/* Progress bar styles */
.progressbars {
  height: 8px;
  background-color: rgba(255, 255, 255, 0.12);
  border-radius: 6px;
  overflow: hidden;
  width: 75%;
}
.progress-bar {
  transition: width 0.3s ease;
}

/* Status dots */
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

.text-light-50 {
  color: rgba(255, 255, 255, 0.6);
}
</style>
