<template>
    <main>
        <div class="container-fluid mrtg-device">
            <div class="row me-0">
                <!-- Sidebar -->
                <div class="col-1">
                    <Menu />
                </div>

                <!-- Main Content -->
                <div class="col-11 main-content">
                    <!-- HEADER -->
                    <header
                        class="d-flex justify-content-between align-items-center flex-wrap py-3 mb-3 border-bottom border-secondary">
                        <div>
                            <h2 class="fw-bold text-primary">
                                <i class="fas fa-network-wired me-2"></i> SNMP Device Manager
                            </h2>
                            <p class="text-white small mb-0">
                                Monitor and manage network devices with SNMP protocol – Independent from main device
                                management
                            </p>
                        </div>
                    </header>

                    <!-- SYSTEM OVERVIEW -->
                    <section class="glass-card p-4 mb-4">
                        <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap">
                            <h5 class="text-white fw-bold mb-3">
                                <i class="fas fa-chart-line me-2 text-info"></i> System Overview
                            </h5>
                            <button class="btn btn-gradient d-flex align-items-center" @click="refreshPage"
                                :disabled="isRefreshing">
                                <i class="fas fa-sync-alt me-1" :class="{ 'spin': isRefreshing }"></i>
                                {{ isRefreshing ? 'Refreshing...' : 'Refresh' }}
                            </button>
                        </div>

                        <div class="row g-3">
                            <div class="col-lg-3 col-md-6 col-12" v-for="card in overview" :key="card.label">
                                <div class="overview-box d-flex flex-column align-items-start p-3 h-100">
                                    <div class="d-flex align-items-center mb-2">
                                        <i :class="card.icon + ' fs-4 me-2 text-info'"></i>
                                        <h4 class="fw-bold mb-0 text-white">{{ card.value }}</h4>
                                    </div>
                                    <p class="text-white-50 mb-0">{{ card.label }}</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <!-- SNMP DEVICE MANAGEMENT -->
                    <section class="glass-card p-4">
                        <div class="d-flex justify-content-between align-items-center flex-wrap mb-4">
                            <h5 class="text-white fw-bold mb-3 mb-md-0">
                                <i class="fas fa-server me-2 text-info"></i> SNMP Device Management
                            </h5>
                            <div class="d-flex flex-wrap gap-2">
                                <button class="btn btn-gradient d-flex align-items-center" @click="refreshPage"
                                    :disabled="isRefreshing">
                                    <i class="fas fa-sync-alt me-1" :class="{ 'spin': isRefreshing }"></i>
                                    {{ isRefreshing ? 'Refreshing...' : 'Refresh' }}
                                </button>

                                <button class="btn btn-success" @click="openAddModal">
                                    <i class="fas fa-plus me-1"></i> Add SNMP Device
                                </button>
                                <button class="btn btn-warning text-dark">
                                    <i class="fas fa-tasks me-1"></i> Bulk Actions
                                </button>
                            </div>
                        </div>

                        <div class="row g-4">
                            <div class="col-lg-4 col-md-6 col-12" v-for="device in devices" :key="device.id">
                                <div class="device-card p-3">
                                    <div class="d-flex justify-content-between align-items-center mb-2">
                                        <h6 class="fw-bold text-white mb-0">{{ device.name }}</h6>
                                        <span class="badge bg-success bg-opacity-75">Monitoring</span>
                                    </div>
                                    <h6 class="text-info">{{ device.ip }}</h6>
                                    <p class="text-muted small mb-2">
                                        {{ device.active }}/{{ device.total }} Active Interfaces
                                    </p>

                                    <div class="interfaces">
                                        <div v-if="device.interfaces.length" v-for="(iface, index) in device.interfaces"
                                            :key="index"
                                            class="d-flex justify-content-between align-items-center py-1 px-2 interface-item">
                                            <span>{{ iface.name }}</span>
                                            <span
                                                :class="iface.status === 'Active' ? 'text-success small' : 'text-danger small'">
                                                {{ iface.status }}
                                            </span>
                                        </div>
                                        <div v-else class="text-center text-muted small py-2">
                                            No interfaces yet
                                        </div>
                                    </div>

                                    <div class="d-flex justify-content-between align-items-center mt-3 flex-wrap gap-2">
                                        <div class="d-flex gap-2">
                                            <button class="btn btn-sm btn-info text-white px-3">
                                                <i class="fas fa-eye me-1"></i> View
                                            </button>
                                            <button class="btn btn-sm btn-warning text-dark px-3">
                                                <i class="fas fa-edit me-1"></i> Edit
                                            </button>
                                            <button class="btn btn-sm btn-danger px-3" @click="deleteDevice(device.id)">
                                                <i class="fas fa-trash-alt me-1"></i> Delete
                                            </button>
                                            <button class="btn btn-sm btn-gradient px-3"
                                                @click="openInterfaceModal(device)">
                                                <i class="fas fa-plus me-1"></i> Interface
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <!-- SNMP INTERFACE MONITORING SECTION -->
                    <section class="glass-card p-4 mt-4">
                        <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap">
                            <h5 class="text-white fw-bold mb-3">
                                <i class="fas fa-chart-area me-2 text-info"></i> SNMP Interface Monitoring
                            </h5>
                            <div class="d-flex flex-wrap gap-2">
                                <select class="form-select form-select-sm bg-dark text-white border-secondary">
                                    <option>Per Interface Layout</option>
                                </select>
                                <select class="form-select form-select-sm bg-dark text-white border-secondary">
                                    <option>All SNMP Devices</option>
                                </select>
                                <select class="form-select form-select-sm bg-dark text-white border-secondary">
                                    <option>All Priorities</option>
                                </select>
                            </div>
                        </div>

                        <div class="row g-4">
                            <div class="col-12" v-for="graph in graphs" :key="graph.id">
                                <div class="monitor-card p-3">
                                    <div class="d-flex justify-content-between align-items-center mb-2">
                                        <h6 class="fw-bold text-white mb-0">
                                            <i class="fas fa-chart-line text-info me-2"></i> {{ graph.title }}
                                        </h6>
                                        <span class="badge bg-warning text-dark text-capitalize">{{ graph.priority }}</span>
                                    </div>
                                    <div class="text-center">
                                        <img :src="graph.image" class="img-fluid rounded-3" alt="SNMP Graph" />
                                    </div>
                                    <p class="text-muted small mt-2">{{ graph.description }}</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>

        <!-- Add SNMP Device Modal -->
        <div v-if="showAddModal" class="modal-overlay">
            <div class="modal-content glass-card p-4">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h4 class="text-white fw-bold">
                        <i class="fas fa-plus me-2 text-info"></i> Add SNMP Monitoring Device
                    </h4>
                    <button class="btn btn-secondary btn-sm" @click="closeAddModal">
                        <i class="fas fa-times me-1"></i> Cancel
                    </button>
                </div>

                <form @submit.prevent="addDevice">
                    <div class="row g-3">
                        <div class="col-md-6">
                            <label class="form-label text-white">Device Name</label>
                            <input v-model="newDevice.name" class="form-control" placeholder="Device Name" />
                        </div>
                        <div class="col-md-6">
                            <label class="form-label text-white">IP Address</label>
                            <input v-model="newDevice.ip" class="form-control" placeholder="192.168.x.x" />
                        </div>
                        <div class="col-md-6">
                            <label class="form-label text-white">SNMP Community</label>
                            <input v-model="newDevice.community" class="form-control" placeholder="public" />
                        </div>
                        <div class="col-md-6">
                            <label class="form-label text-white">Device Type</label>
                            <select v-model="newDevice.type" class="form-select">
                                <option disabled value="">Select Device Type</option>
                                <option>Mikrotik Router</option>
                                <option>Mikrotik Switch</option>
                                <option>Generic Switch</option>
                                <option>Cisco Switch</option>
                                <option>ZTE Switch/Router</option>
                                <option>Server</option>
                                <option>Access Point (AP)</option>
                            </select>
                        </div>
                        <div class="col-12">
                            <label class="form-label text-white">Description</label>
                            <textarea v-model="newDevice.description" class="form-control" rows="3"></textarea>
                        </div>
                    </div>

                    <div class="d-flex justify-content-start gap-3 mt-4 border-top pt-3">
                        <button type="submit" class="btn btn-gradient px-4">
                            <i class="fas fa-plus me-1"></i> Add Device
                        </button>
                        <button type="button" class="btn btn-secondary px-4" @click="closeAddModal">
                            <i class="fas fa-times me-1"></i> Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Add Interface Modal -->
        <div v-if="showInterfaceModal" class="modal-overlay">
            <div class="modal-content glass-card p-4">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h4 class="text-white fw-bold">
                        <i class="fas fa-plus me-2 text-info"></i> Add Interface
                    </h4>
                    <button class="btn btn-secondary btn-sm" @click="closeInterfaceModal">
                        <i class="fas fa-times me-1"></i> Cancel
                    </button>
                </div>

                <form @submit.prevent="addInterface">
                    <div class="row g-3">
                        <div class="col-md-6">
                            <label class="form-label text-white">Interface Name</label>
                            <input v-model="newInterface.name" class="form-control" placeholder="e.g. ether1" />
                        </div>
                        <div class="col-md-6">
                            <label class="form-label text-white">Status</label>
                            <select v-model="newInterface.status" class="form-select">
                                <option>Active</option>
                                <option>Inactive</option>
                            </select>
                        </div>
                    </div>

                    <div class="d-flex justify-content-start gap-3 mt-4 border-top pt-3">
                        <button type="submit" class="btn btn-gradient px-4">
                            <i class="fas fa-plus me-1"></i> Add Interface
                        </button>
                        <button type="button" class="btn btn-secondary px-4" @click="closeInterfaceModal">
                            <i class="fas fa-times me-1"></i> Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
        <!-- 🔔 Toast Notification Container -->
<div class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 9999">
  <div
    v-for="(toast, index) in toasts"
    :key="index"
    class="toast align-items-center text-white border-0 show fade"
    :class="{
      'bg-success': toast.type === 'success',
      'bg-danger': toast.type === 'error',
      'bg-warning': toast.type === 'warning',
      'bg-info': toast.type === 'info'
    }"
  >
    <div class="d-flex">
      <div class="toast-body">
        <i v-if="toast.type === 'success'" class="fas fa-check-circle me-2"></i>
        <i v-if="toast.type === 'error'" class="fas fa-exclamation-circle me-2"></i>
        <i v-if="toast.type === 'info'" class="fas fa-info-circle me-2"></i>
        <i v-if="toast.type === 'warning'" class="fas fa-exclamation-triangle me-2"></i>
        {{ toast.message }}
      </div>
      <button
        type="button"
        class="btn-close btn-close-white me-2 m-auto"
        @click="removeToast(index)"
      ></button>
    </div>
  </div>
</div>

    </main>
</template>

<script>
import '../assets/main.css'
import Menu from '@/components/Menu.vue';

export default {
    components: {
    Menu
  },
    data() {
        

        return {
            overview: [
                { label: "Total Devices", value: 8, icon: "fas fa-hdd" },
                { label: "Active Interfaces", value: 40, icon: "fas fa-network-wired" },
                { label: "High Priority", value: 14, icon: "fas fa-exclamation-triangle text-danger" },
                { label: "Last Update", value: "14:11:26", icon: "fas fa-clock text-success" },
            ],
            devices: [
                {
                    id: 1,
                    name: "10g-sw-biz-techno.indobsd.id",
                    ip: "103.142.215.250",
                    active: 8,
                    total: 10,
                    interfaces: [
                        { name: "br0", status: "Active" },
                        { name: "ether1", status: "Active" },
                        { name: "ether2", status: "Active" },
                    ],
                },
            ],
            graphs: [
                {
                    id: 1,
                    title: "10g-sw-biz-techno.indobsd.id - br0 (Main Bridge Interface)",
                    image: new URL('@/assets/images/graph1.png', import.meta.url).href,
                    description: "Main Bridge Interface",
                    priority: "medium",
                },
                {
                    id: 2,
                    title: "10g-sw-biz-techno.indobsd.id - ether1 (Management Ethernet Port)",
                    image: new URL('@/assets/images/graph2.png', import.meta.url).href,
                    description: "Management Ethernet Port",
                    priority: "medium",
                },
            ],
            isRefreshing: false,
            showAddModal: false,
            newDevice: { name: "", ip: "", community: "public", type: "", description: "" },
            showInterfaceModal: false,
            selectedDevice: null,
            newInterface: { name: "", status: "Active" },
            toasts: [],
        };
    },

    methods: {
        showToast(message, type = "info") {
  this.toasts.push({ message, type });
  setTimeout(() => this.toasts.shift(), 4000);
},
removeToast(index) {
  this.toasts.splice(index, 1);
},

        refreshPage() {
            this.isRefreshing = true;
            setTimeout(() => {
                location.reload();
            }, 800);
        },

        openAddModal() {
            this.showAddModal = true;
        },
        closeAddModal() {
            this.showAddModal = false;
            this.resetForm();
        },
        resetForm() {
            this.newDevice = { name: "", ip: "", community: "public", type: "", description: "" };
        },
        addDevice() {
            if (!this.newDevice.name || !this.newDevice.ip || !this.newDevice.type) {
               this.showToast("⚠️ Please fill all required fields!", "warning");
                return;
            }
            this.devices.push({
                id: Date.now(),
                ...this.newDevice,
                active: 0,
                total: 0,
                interfaces: [],
            });
           this.showToast("✅ Device Added Successfully!", "success");
            this.closeAddModal();
        },
        // deleteDevice(id) {
        //     if (confirm("Are you sure you want to delete this device?")) {
        //         this.devices = this.devices.filter((d) => d.id !== id);
        //     }
        // },

        deleteDevice(id) {
  this.devices = this.devices.filter((d) => d.id !== id);
  this.showToast("🗑️ Device deleted successfully!", "error");
},

        openInterfaceModal(device) {
            this.selectedDevice = device;
            this.showInterfaceModal = true;
        },
        closeInterfaceModal() {
            this.showInterfaceModal = false;
            this.newInterface = { name: "", status: "Active" };
        },
        addInterface() {
            if (!this.newInterface.name) {
                this.showToast("⚠️ Please enter an interface name!", "warning");
                return;
            }
            this.selectedDevice.interfaces.push({ ...this.newInterface });
            this.selectedDevice.total = this.selectedDevice.interfaces.length;
            this.selectedDevice.active = this.selectedDevice.interfaces.filter((i) => i.status === "Active").length;
            this.showToast("✅ Interface Added Successfully!", "success");
            this.closeInterfaceModal();
        },
    },
};
</script>

<style scoped>
.mrtg-device {
    padding: 30px;
}
/* Keep your existing CSS as-is */
.overview-box {
    background: rgba(255, 255, 255, 0.08);
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    transition: 0.3s;
}
.overview-box:hover {
    transform: translateY(-4px);
    background: rgba(91, 127, 255, 0.12);
}
/* .app {
    background-color: rgb(73, 43, 77);
    color: #fff;
    min-height: 100vh;
} */
.text-primary {
    color: #6b82f6 !important;
}
.btn-gradient {
    background: linear-gradient(90deg, #5b7fff, #4facfe);
    border: none;
    color: #fff;
    transition: 0.3s;
}
.btn-gradient:hover {
    filter: brightness(1.1);
}
.glass-card {
    background: rgba(255, 255, 255, 0.04);
    border-radius: 14px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
    margin-right: 50px;
}
.device-card {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    transition: 0.3s;
    color: #fff;
}
.border-secondary{
    margin-right: 50px;
}
.device-card:hover {
    transform: scale(1.03);
    background: rgba(79, 172, 254, 0.1);
    box-shadow: 0 8px 25px rgba(79, 172, 254, 0.2);
}
.interfaces {
    background: rgba(0, 0, 0, 0.15);
    border-radius: 8px;
    padding: 6px 0;
    max-height: 120px;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: #5b7fff transparent;
}
.interface-item {
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.8);
}
.interface-item:last-child {
    border-bottom: none;
}
.device-card .btn {
    border: none;
    font-size: 0.85rem;
}
.device-card .btn-info {
    background: #5b7fff;
}
.device-card .btn-warning {
    background: #fcd34d;
}
.device-card .btn-danger {
    background: #ef4444;
}
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(15, 15, 30, 0.9);
    backdrop-filter: blur(10px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
}
.modal-content {
    width: 80%;
    max-width: 900px;
    animation: fadeIn 0.4s ease;
}
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-15px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
.spin {
    animation: spin 1s linear infinite;
}
@keyframes spin {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}
.monitor-card {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
    color: #fff;
    transition: 0.3s;
}
.monitor-card:hover {
    transform: scale(1.02);
    background: rgba(79, 172, 254, 0.1);
}
.monitor-card img {
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
}
.form-select {
    width: auto;
    padding: 0.35rem 1rem;
    font-size: 0.9rem;
    background-color: rgba(16, 41, 63, 0.1);
    color: white;
}
.form-control {
    background-color: rgba(16, 41, 63, 0.1);
}
</style>
