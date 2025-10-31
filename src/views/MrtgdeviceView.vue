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


                            <button class="btn btn-gradient d-flex align-items-center" @click="refreshOverview"
                                :disabled="isRefreshingOverview">
                                <i class="fas fa-sync-alt me-1" :class="{ 'spin': isRefreshingOverview }"></i>
                                {{ isRefreshingOverview ? 'Refreshing...' : 'Refresh' }}
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

                                <button class="btn btn-gradient d-flex align-items-center" @click="refreshDevices"
                                    :disabled="isRefreshingDevices">
                                    <i class="fas fa-sync-alt me-1" :class="{ 'spin': isRefreshingDevices }"></i>
                                    {{ isRefreshingDevices ? 'Refreshing...' : 'Refresh' }}
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
                                    <p class="text-white small mb-2">
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
                                            

                                            <button class="btn btn-sm btn-warning text-dark px-3"
                                                @click="openEditModal(device)">
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
                                        <span class="badge bg-warning text-dark text-capitalize">{{ graph.priority
                                            }}</span>
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

        <!-- ✅ Edit SNMP Device Modal -->
        <div v-if="showEditModal" class="modal-overlay">
            <div class="modal-content glass-card p-4">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h4 class="text-white fw-bold">
                        <i class="fas fa-edit me-2 text-info"></i> Edit SNMP Device
                    </h4>
                    <button class="btn btn-secondary btn-sm" @click="closeEditModal">
                        <i class="fas fa-times me-1"></i> Cancel
                    </button>
                </div>

                <form @submit.prevent="updateDevice">
                    <div class="row g-3">
                        <div class="col-md-6">
                            <label class="form-label text-white">Device Name</label>
                            <input v-model="editDevice.name" class="form-control" placeholder="Device Name" />
                        </div>
                        <div class="col-md-6">
                            <label class="form-label text-white">IP Address</label>
                            <input v-model="editDevice.ip" class="form-control" placeholder="192.168.x.x" />
                        </div>
                        <div class="col-md-6">
                            <label class="form-label text-white">SNMP Community</label>
                            <input v-model="editDevice.community" class="form-control" placeholder="public" />
                        </div>
                        <div class="col-md-6">
                            <label class="form-label text-white">Device Type</label>
                            <select v-model="editDevice.type" class="form-select">
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
                            <textarea v-model="editDevice.description" class="form-control" rows="3"></textarea>
                        </div>
                    </div>

                    <div class="d-flex justify-content-start gap-3 mt-4 border-top pt-3">
                        <button type="submit" class="btn btn-gradient px-4">
                            <i class="fas fa-save me-1"></i> Save Changes
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
      <div v-for="(toast, index) in toasts" :key="index" class="modern-toast" :class="toast.type">
        <div class="toast-left-bar"></div>
        <div class="toast-content">
          <i v-if="toast.type === 'success'" class="fas fa-check-circle icon"></i>
          <i v-if="toast.type === 'error'" class="fas fa-exclamation-circle icon"></i>
          <i v-if="toast.type === 'info'" class="fas fa-info-circle icon"></i>
          <i v-if="toast.type === 'warning'" class="fas fa-exclamation-triangle icon"></i>
          <span class="toast-message">{{ toast.message }}</span>
        </div>
        <button class="toast-close" @click="removeToast(index)">×</button>
      </div>
    </div>

    </main>
</template>

<script>
import Swal from 'sweetalert2'
import '../assets/main.css'
import Menu from '@/components/Menu.vue';

export default {
    components: { Menu },
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
            isRefreshingOverview: false,
            isRefreshingDevices: false,
            showAddModal: false,
            showEditModal: false,      // controls edit modal visibility
            editDevice: {},            // holds selected device data for editing
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

        // ✅ Refresh only System Overview
        refreshOverview() {
            this.isRefreshingOverview = true;
            setTimeout(() => {
                // Example: randomize overview values to simulate refresh
                this.overview = this.overview.map((item) => ({
                    ...item,
                    value:
                        item.label === "Last Update"
                            ? new Date().toLocaleTimeString()
                            : Math.floor(Math.random() * 100),
                }));
                this.isRefreshingOverview = false;
                this.showToast("🔄 System Overview Refreshed!", "info");
            }, 1000);
        },

        // ✅ Refresh only SNMP Devices
        refreshDevices() {
            this.isRefreshingDevices = true;
            setTimeout(() => {
                // Example simulation: toggle "active interfaces" values
                this.devices = this.devices.map((d) => ({
                    ...d,
                    active: Math.floor(Math.random() * d.total),
                }));
                this.isRefreshingDevices = false;
                this.showToast("🔄 SNMP Devices Refreshed!", "info");
            }, 1000);
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

        // ✅ Open Edit Modal with Selected Device Data
        openEditModal(device) {
            this.editDevice = { ...device };  // clone to avoid instant change
            this.showEditModal = true;
        },

        // ✅ Close Edit Modal
        closeEditModal() {
            this.showEditModal = false;
            this.editDevice = {};
        },

        // ✅ Update Device Details
        updateDevice() {
            const index = this.devices.findIndex((d) => d.id === this.editDevice.id);
            if (index !== -1) {
                this.devices[index] = { ...this.editDevice };
                this.showToast("✅ Device Updated Successfully!", "success");
            }
            this.closeEditModal();
        },


        // async deleteDevice(id) {
        //     const result = await Swal.fire({
        //         title: 'Are you sure?',
        //         text: "This device will be permanently deleted.",
        //         icon: 'warning',
        //         showCancelButton: true,
        //         confirmButtonColor: '#3085d6',
        //         cancelButtonColor: '#d33',
        //         confirmButtonText: 'Yes, delete it!',
        //         background: '#1e1e2f',
        //         color: '#fff',
        //     });

        //     if (result.isConfirmed) {
        //         this.devices = this.devices.filter((d) => d.id !== id);
        //         Swal.fire({
        //             toast: true,
        //             position: 'top-end',
        //             icon: 'success',
        //             title: '🗑️ Device deleted successfully!',
        //             showConfirmButton: false,
        //             timer: 2500,
        //             background: '#1e1e2f',
        //             color: '#fff',
        //         });
        //     }
        // },


        async deleteDevice(id) {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: "This device will be permanently deleted.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel',
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    background: '#1e1e2f',
    color: '#fff',
  });

  if (result.isConfirmed) {
    // ✅ Remove the selected device only
    this.devices = this.devices.filter((d) => d.id !== id);

    // ✅ Show custom toast (same as your notes UI)
    this.showToast("🗑️ Device deleted successfully!", "error");
  }
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


/* 🌙 Modern Dark Toast Style */
.modern-toast {
  display: flex;
  align-items: center;
  position: relative;
  background: #1e1e2f;
  color: #fff;
  border-radius: 10px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
  overflow: hidden;
  min-width: 380px;
  max-width: 400px;
  margin-bottom: 12px;
  padding: 10px 14px;
  font-size: 0.95rem;
  animation: slideInRight 0.4s ease forwards;
}

/* 🔵 Colored left bar */
.toast-left-bar {
  position: absolute;
  left: 0;
  top: 0;
  width: 6px;
  height: 100%;
  border-radius: 8px 0 0 8px;
}

.modern-toast.success .toast-left-bar {
  background-color: #4caf50;
}

.modern-toast.error .toast-left-bar {
  background-color: #f44336;
}

.modern-toast.info .toast-left-bar {
  background-color: #2196f3;
}

.modern-toast.warning .toast-left-bar {
  background-color: #ff9800;
}

/* Toast content area */
.toast-content {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-left: 14px;
}

/* Icons */
.icon {
  font-size: 1rem;
  opacity: 0.9;
}

/* Message */
.toast-message {
  flex: 1;
  font-weight: 500;
  color: #fff;
}

/* Close button */
.toast-close {
  background: none;
  border: none;
  color: #ccc;
  font-size: 1.2rem;
  margin-left: 8px;
  cursor: pointer;
  transition: color 0.2s ease;
}

.toast-close:hover {
  color: #fff;
}

/* Slide-in animation */
@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(100%);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
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

.border-secondary {
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

/* 🔧 Fix dropdown background inside modal */
.modal-content select.form-select {
    background-color: rgba(30, 30, 50, 0.8) !important;
    /* dark background to match modal */
    color: #fff !important;
    border: 1px solid rgba(255, 255, 255, 0.15);
}

.modal-content select.form-select option {
    background-color: rgba(25, 25, 40, 0.95) !important;
    /* dropdown items dark */
    color: #fff !important;
}

/* 🔧 Fix SNMP Community field visibility */
.modal-content input.form-control {
    background-color: rgba(25, 25, 40, 0.8) !important;
    color: #fff !important;
}

.modal-content input.form-control::placeholder {
    color: rgba(255, 255, 255, 0.7) !important;
    /* visible placeholder */
}

/* 🔧 Make focus state consistent */
.modal-content input.form-control:focus,
.modal-content select.form-select:focus,
.modal-content textarea.form-control:focus {
    border-color: #5b7fff !important;
    box-shadow: 0 0 8px rgba(91, 127, 255, 0.4);
    outline: none;
}
</style>
