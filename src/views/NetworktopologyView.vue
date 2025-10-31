<template>
  <div class="container-fluid network-topology">
    <!-- ✅ Add row wrapper so Bootstrap columns work -->
    <div class="row">
      <!-- Keep col-1 for future sidebar or content -->
      <div class="col-1">
        <Menu />
      </div>

      <!-- Main content -->
      <div class="col-11 main-content">
        <div class=" py-4">
          <!-- 🔹 Header -->
          <div class="d-flex justify-content-between align-items-center flex-wrap mb-4">
            <h4 class="fw-bold mb-0 d-flex align-items-center">
              <FontAwesomeIcon :icon="['fas', 'project-diagram']" class="me-2 text-primary" />
              Network Topology
            </h4>

            <div class="d-flex align-items-center gap-3">
              <span class="badge-connected">
                <FontAwesomeIcon :icon="['fas', 'check-circle']" class="me-1" />
                Connected
              </span>
              <small class="text-light opacity-75">Last updated: {{ currentTime }}</small>
            </div>
          </div>

          <!-- 🔹 Topology Glass Card -->
          <div class="glass-card p-4 position-relative">
            <!-- Toolbar -->
            <div class="toolbar d-flex flex-wrap align-items-center justify-content-end gap-2 mb-3">
              <button class="btn-toolbar" @click="refresh">
                <FontAwesomeIcon :icon="['fas', 'sync']" class="me-1" /> Refresh
              </button>
              <button class="btn-toolbar">
                <FontAwesomeIcon :icon="['fas', 'expand']" class="me-1" /> Fullscreen
              </button>
              <button class="btn-toolbar">
                <FontAwesomeIcon :icon="['fas', 'project-diagram']" class="me-1" /> Layout
              </button>
              <button class="btn-toolbar">
                <FontAwesomeIcon :icon="['fas', 'download']" class="me-1" /> Export
              </button>
              <button class="btn-toolbar">
                <FontAwesomeIcon :icon="['fas', 'unlock']" class="me-1" /> Unlock
              </button>
              <button class="btn-toolbar">
                <FontAwesomeIcon :icon="['fas', 'pause']" class="me-1" /> Animations
              </button>
            </div>

            <!-- Topology Canvas Area -->
            <div class="topology-area d-flex justify-content-center align-items-center">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/BSD_daemon_logo.svg/256px-BSD_daemon_logo.svg.png"
                alt="Topology Placeholder"
                class="placeholder-img"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import '../assets/main.css'
import Menu from '@/components/Menu.vue';
import { defineComponent, ref, onMounted } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faProjectDiagram,
  faSync,
  faExpand,
  faDownload,
  faUnlock,
  faPause,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";

library.add(
  faProjectDiagram,
  faSync,
  faExpand,
  faDownload,
  faUnlock,
  faPause,
  faCheckCircle
);

export default defineComponent({
  name: "NetworkTopology",
  components: { FontAwesomeIcon,
    Menu
   },
  setup() {
    const currentTime = ref("");

    const updateTime = () => {
      const now = new Date();
      currentTime.value = now.toLocaleTimeString();
    };

    const refresh = () => {
      updateTime();
      alert("Topology refreshed!");
    };

    onMounted(() => {
      updateTime();
      setInterval(updateTime, 1000);
    });

    return { currentTime, refresh };
  },
});
</script>

<style scoped>
/* === PAGE === */
.network-topology {
  padding: 30px;
}

/* === HEADER === */
h4 {
  font-size: 1.7rem;
  color: #b9a7ff;
}
.badge-connected {
  background: #00cfff;
  color: #000;
  font-weight: 600;
  padding: 6px 16px;
  border-radius: 25px;
  box-shadow: 0 0 8px rgba(0, 207, 255, 0.4);
}

/* === GLASS CARD === */
.glass-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  backdrop-filter: blur(12px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
  min-height: 550px;
  position: relative;
  overflow: hidden;
}

/* === TOOLBAR BUTTONS === */
.btn-toolbar {
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 10px;
  font-size: 0.9rem;
  padding: 8px 16px;
  font-weight: 500;
  transition: 0.3s;
}
.btn-toolbar:hover {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: #fff;
  box-shadow: 0 0 10px rgba(118, 75, 162, 0.4);
}

/* === TOPOLOGY AREA === */
.topology-area {
  width: 100%;
  height: 100%;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.03);
  min-height: 450px;
}
.placeholder-img {
  opacity: 0.9;
  max-width: 200px;
  filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.2));
}

/* === RESPONSIVE === */
@media (max-width: 992px) {
  h4 {
    font-size: 1.4rem;
  }
  .toolbar {
    justify-content: center;
  }
  .btn-toolbar {
    font-size: 0.85rem;
    padding: 6px 12px;
  }
}
</style>
