<template>
  <div class="container-fluid dashboard-page py-4">
    <div class="row">
      <div class="col-1">
        <Menu />
      </div>
      <div class=" px-5 col-11 ">
          <!-- Header Section -->
    <div class="d-flex justify-content-between align-items-center flex-wrap mb-4">
      <div class="  mb-3 mb-md-0">
        <h1><FontAwesomeIcon :icon="['fas', 'tachometer-alt']" class="icon" /> NOC Dashboard</h1>
      </div>

      <!-- Connection + Last Update + Logout -->
      <div class="d-flex flex-wrap align-items-center gap-3">
        <button class="btn btn-info rounded-pill px-4 py-2">
          <FontAwesomeIcon :icon="['fas', 'circle']" style="color:#fff;" /> Connected
        </button>
        <span class="text-light small">Last update: {{ lastUpdate }}</span>
        <button class="btn  logoutbtn rounded-pill px-4 py-2">
          <FontAwesomeIcon class="icon" :icon="['fas', 'right-from-bracket']"  /> Logout
        </button>
      </div>
    </div>

    <!-- Tab Navigation -->
    <div class="d-flex flex-wrap gap-3 mb-4">
      <button
        v-for="(tab, index) in tabs"
        :key="index"
        class="btn-tab"
        :class="{ active: currentTab.label === tab.label }"
        @click="switchTab(tab)"
      >
        <FontAwesomeIcon :icon="tab.icon" class="" /> {{ tab.label }}
      </button>
    </div>


    <!-- <hr /> -->

    <!-- Dynamic Component (switches based on tab) -->
    <component :is="currentTab.component" />
      </div>
    </div>

  </div>
</template>

<script lang="ts">
import Menu from '@/components/Menu.vue';
import { defineComponent } from "vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faTachometerAlt,
  faCircle,
  faRightFromBracket,
  faHdd,
  faNetworkWired,
  faGlobe,
  faSitemap,
} from "@fortawesome/free-solid-svg-icons";

// Components
import SystemInfo from "@/components/SystemInfo.vue";
import NetworkInterfaces from "@/components/NetworkInterfaces.vue";
import IpAddresses from "@/components/IpAddresses.vue";
import ArpList from "@/components/ArpList.vue";

// Add icons to library
library.add(
  faTachometerAlt,
  faCircle,
  faRightFromBracket,
  faHdd,
  faNetworkWired,
  faGlobe,
  faSitemap
);

export default defineComponent({
  name: "SystemView",
  components: { FontAwesomeIcon,
    Menu
   },
  data() {
    return {
      lastUpdate: new Date().toLocaleTimeString(),
      tabs: [
        { label: "System Info", icon: ["fas", "hdd"], component: SystemInfo },
        { label: "Network Interfaces", icon: ["fas", "network-wired"], component: NetworkInterfaces },
        { label: "IP Addresses", icon: ["fas", "globe"], component: IpAddresses },
        { label: "ARP List", icon: ["fas", "sitemap"], component: ArpList },
      ],
      currentTab: { label: "System Info", component: SystemInfo },
    };
  },
  methods: {
    switchTab(tab: any) {
      this.currentTab = tab;
    },
  },
});
</script>

<style scoped>
.dashboard-page {
  /* background-color: #1e1633;  */
  color: #ffffff;
  min-height: 100vh;
}

/* Header */
.dashboard-header h1 {
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.icon {
 color:#667eea ;
}


/* Tabs */
.btn-tab {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
  border: none;
  border-radius: 10px;
  padding: 10px 25px;
  font-weight: 500;
  transition: 0.3s;
  backdrop-filter: blur(8px);
}
.btn-tab:hover,
.btn-tab.active {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

/* Buttons */
.btn {
  font-weight: 500;
}

  .logoutbtn {
    padding: 0.4rem 0.8rem;
    background:orangered;
    color: white;
    border: none;
    border-radius: 15px;
    font-size: 0.8rem;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 0.3rem;
    backdrop-filter: blur(10px);
    margin-left: 0.5rem;
}



.text-light {
  opacity: 0.9;
}

/* Responsive */
@media (max-width: 768px) {
  .dashboard-header h1 {
    font-size: 1.5rem;
  }
  .btn-tab {
    padding: 8px 18px;
  }
}
</style>
