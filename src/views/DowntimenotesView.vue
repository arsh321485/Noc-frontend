<template>
  <main>
    <div class="downtime-notes">
      <div class="container-fluid">
        <div class="row me-0">
          <div class="col-1 app">
            <Menu />
          </div>

          <div class="col-11 main-content">

            <div class="page-header">
              <h1><i class="fas fa-sticky-note"></i> Downtime Notes</h1>
              <p class="text-light">Track and manage system downtime incidents and maintenance records</p>


              <router-link to="/system" class="btn-backtodevice pe-5 px-2">
                <i class="fas fa-arrow-left"></i> Back to Device Management
              </router-link>

            </div>

            <div class="glass-card">
              <div class="notes-header">
                <div class="header-left">
                  <button @click="openModal('create')" class="create-note-btn">
                    <i class="fas fa-plus"></i> Create Note
                  </button>
                  <button @click="exportToCSV" class="btn-secondary ms-2">
                    <i class="fas fa-download"></i> Export CSV
                  </button>
                </div>

                <div class="header-right d-flex align-items-center gap-2 flex-wrap">
                  <div class="search-container me-2 px-1">
                    <i class="fas fa-search"></i>
                    <input v-model="searchTerm" type="text" placeholder="Search notes..." />
                  </div>
                  <select v-model="filterCategory" class="form-select form-select-sm me-2" style="width: 160px;">
                    <option value="">All Categories</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="failure">Failure</option>
                    <option value="upgrade">Upgrade</option>
                    <option value="network">Network</option>
                    <option value="power">Power</option>
                    <option value="other">Other</option>
                  </select>
                  <select v-model="filterSeverity" class="form-select form-select-sm" style="width: 140px;">
                    <option value="">All Severities</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <!-- Notes Grid -->
              <div v-if="filteredNotes.length" class="notes-container">
                <div v-for="note in filteredNotes" :key="note.id" class="note-item">
                  <div class="note-header">
                    <div class="note-title">
                      <i class="fas fa-sticky-note me-2"></i>
                      {{ note.title || 'Untitled Note' }}
                      <span :class="['note-severity', 'severity-' + note.severity]">
                        {{ note.severity.toUpperCase() }}
                      </span>
                      <span class="note-category">#{{ note.category }}</span>
                    </div>
                    <div class="note-meta">{{ formatTime(note.createdAt) }}</div>
                  </div>

                  <div v-if="note.deviceName" class="note-device mb-1">
                    <strong>Device:</strong> {{ note.deviceName }}
                  </div>
                  <div v-if="note.duration" class="note-duration mb-1">
                    <strong>Estimated Duration:</strong> {{ note.duration }}
                  </div>

                  <div class="note-content">{{ note.content }}</div>

                  <div v-if="note.tags" class="note-tags mt-2">
                    <strong>Tags:</strong>
                    <span v-for="(tag, i) in note.tags.split(',')" :key="i" class="note-tag">#{{ tag.trim() }}</span>
                  </div>

                  <div class="note-actions mt-3">
                    <button class="action-btn edit-btn" @click="openModal('edit', note)">
                      <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="action-btn delete-btn" @click="deleteNote(note.id)">
                      <i class="fas fa-trash"></i> Delete
                    </button>
                  </div>
                </div>
              </div>

              <div v-else class="empty-state">
                <i class="fas fa-sticky-note"></i>
                <h3>No Downtime Notes</h3>
                <p>Click “Create Note” to get started!</p>
              </div>
            </div>



          </div>
        </div>

        <!-- 🔹 Modal -->
        <div v-if="showModal" class="note-modal">
          <div class="modal-content">
            <div class="modal-header">
              <h3>
                <i :class="modalMode === 'create' ? 'fas fa-plus' : 'fas fa-edit'"></i>
                {{ modalMode === 'create' ? 'Create Downtime Note' : 'Edit Downtime Note' }}
              </h3>
              <button class="close-btn" @click="closeModal">&times;</button>
            </div>

            <div class="modal-body">
              <form @submit.prevent="saveNote">
                <div class="form-group">
                  <label>Title *</label>
                  <input v-model="form.title" type="text" placeholder="Enter title..." required />
                </div>

                <div class="form-group">
                  <label>Content *</label>
                  <textarea v-model="form.content" rows="3" placeholder="Describe the downtime incident..."
                    required></textarea>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label>Device Name</label>
                    <input v-model="form.deviceName" type="text" placeholder="e.g., Router-01" />
                  </div>
                  <div class="form-group">
                    <label>Or Select from Devices</label>
                    <select v-model="form.selectedDevice">
                      <option value="">Select Device...</option>
                      <option v-for="d in devices" :key="d" :value="d">{{ d }}</option>
                    </select>
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label>Severity</label>
                    <select v-model="form.severity" required>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label>Category</label>
                    <select v-model="form.category" required>
                      <option value="maintenance">Maintenance</option>
                      <option value="failure">Failure</option>
                      <option value="upgrade">Upgrade</option>
                      <option value="network">Network</option>
                      <option value="power">Power</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div class="form-group">
                  <label>Estimated Duration</label>
                  <select v-model="form.duration">
                    <option value="">Select Duration...</option>
                    <option value="15m">15 minutes</option>
                    <option value="30m">30 minutes</option>
                    <option value="1h">1 hour</option>
                    <option value="2h">2 hours</option>
                    <option value="4h">4 hours</option>
                    <option value="8h">8 hours</option>
                    <option value="12h">12 hours</option>
                    <option value="1d">1 day</option>
                    <option value="2d">2 days</option>
                  </select>
                </div>

                <div class="form-group">
                  <label>Tags (comma-separated)</label>
                  <input v-model="form.tags" type="text" placeholder="e.g., router, network, critical" />
                </div>

                <div class="modal-footer">
                  <button type="button" class="btn-secondary" @click="closeModal">Cancel</button>
                  <button type="submit" class="btn-primary">
                    {{ modalMode === 'create' ? 'Save Note' : 'Update Note' }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>



        <!-- 🔔 Toast Notifications -->
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



      </div>
    </div>
  </main>
</template>
<script>
import '../assets/main.css'
import Menu from '@/components/Menu.vue';
import { ref, computed, onMounted } from "vue";
import Swal from 'sweetalert2'; // ✅ Import SweetAlert2

export default {
  name: "DowntimenotesView",
  components: { Menu },

  setup() {
    const notes = ref([]);
    const showModal = ref(false);
    const modalMode = ref("create");
    const searchTerm = ref("");
    const filterCategory = ref("");
    const filterSeverity = ref("");
    const toasts = ref([]);

    const devices = ref(["Router-01", "Switch-02", "Firewall-03", "Server-DB01", "AccessPoint-05"]);

    const form = ref({
      id: null,
      title: "",
      content: "",
      deviceName: "",
      selectedDevice: "",
      category: "maintenance",
      severity: "medium",
      duration: "",
      tags: "",
      createdAt: "",
    });

    const showToast = (message, type = "info") => {
      toasts.value.push({ message, type });
      setTimeout(() => toasts.value.shift(), 4000);
    };

    const removeToast = (i) => toasts.value.splice(i, 1);

    onMounted(() => {
      const stored = localStorage.getItem("downtime_notes");
      if (stored) notes.value = JSON.parse(stored);
    });

    const saveToLocal = () => localStorage.setItem("downtime_notes", JSON.stringify(notes.value));

    const openModal = (mode, note = null) => {
      modalMode.value = mode;
      form.value = note
        ? { ...note }
        : {
          id: null,
          title: "",
          content: "",
          deviceName: "",
          selectedDevice: "",
          category: "maintenance",
          severity: "medium",
          duration: "",
          tags: "",
          createdAt: "",
        };
      showModal.value = true;
    };

    const closeModal = () => (showModal.value = false);

    const saveNote = () => {
      if (!form.value.title || !form.value.content) {
        showToast("Please fill all required fields!", "warning");
        return;
      }

      if (!form.value.deviceName && form.value.selectedDevice)
        form.value.deviceName = form.value.selectedDevice;

      if (modalMode.value === "create") {


        notes.value.unshift({
          ...form.value,
          id: form.value.id || Date.now(), // ✅ unique id only once
          createdAt: form.value.createdAt || new Date().toISOString(),
        });

        showToast("Note created successfully!", "info");
      } else {
        const index = notes.value.findIndex((n) => n.id === form.value.id);
        if (index !== -1) notes.value[index] = { ...form.value };
        showToast("Note updated successfully!", "info");
      }
      saveToLocal();
      closeModal();
    };

    // ✅ Updated deleteNote function with SweetAlert2 + top-right toast

    const deleteNote = async (id) => {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "This note will be permanently deleted.",
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
        notes.value = notes.value.filter((n) => n.id !== id);
        saveToLocal();

        // ✅ Red accent toast
        showToast("Note deleted successfully!", "error");
      }
    };



    const exportToCSV = () => {
      const headers = ["Title", "Content", "Device", "Category", "Severity", "Duration", "Tags", "Created At"];
      const rows = notes.value.map((n) => [
        n.title,
        n.content,
        n.deviceName || "-",
        n.category,
        n.severity,
        n.duration || "-",
        n.tags || "-",
        new Date(n.createdAt).toLocaleString(),
      ]);
      const csv = [headers, ...rows].map((r) => r.map((x) => `"${x}"`).join(",")).join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "downtime-notes.csv";
      link.click();
      showToast("Notes exported as CSV!", "info");
    };

    const formatTime = (t) => (t ? new Date(t).toLocaleString() : "—");

    const filteredNotes = computed(() => {
      const term = searchTerm.value.toLowerCase();
      return notes.value.filter(
        (n) =>
          (!filterCategory.value || n.category === filterCategory.value) &&
          (!filterSeverity.value || n.severity === filterSeverity.value) &&
          (n.title.toLowerCase().includes(term) || n.content.toLowerCase().includes(term))
      );
    });

    return {
      notes,
      showModal,
      modalMode,
      form,
      devices,
      searchTerm,
      filterCategory,
      filterSeverity,
      filteredNotes,
      openModal,
      closeModal,
      saveNote,
      deleteNote,
      exportToCSV,
      formatTime,
      toasts,
      showToast,
      removeToast,
    };
  },
};
</script>


<style scoped>
.downtime-notes {
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



.page-header h1 {
  color: #8ab6ff;
  font-size: 2rem;
  margin-top: 2rem;
}

/* ✅ Fix overlap and align properly under heading & buttons */
/* .main-content {
  padding-left: 2rem;
  padding-right: 2rem;
} */

/* ✅ Glass card styling */
.glass-card {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  padding: 1.5rem;
  backdrop-filter: blur(10px);
  margin-top: 2rem;
  width: 100%;
  box-sizing: border-box;

}

/* ✅ Large desktops (≥1200px) */
@media (min-width: 1200px) {
  /* .main-content {
    padding-left: 3rem;
    padding-right: 3rem;
  } */
}

/* ✅ Tablets (768px–1024px) */
@media (max-width: 1024px) and (min-width: 768px) {
  /* .main-content {
    padding-left: 3.5rem;
  
    padding-right: 1.5rem;
  } */

  .glass-card {
    padding: 1.3rem;
    border-radius: 12px;
  }
}

/* ✅ Mobile (≤767px) */
@media (max-width: 767px) {
  /* .main-content {
    padding-left: 1rem;
    padding-right: 1rem;
  } */

  .glass-card {
    padding: 1.1rem;
    border-radius: 10px;
  }
}

/* ✅ Extra small (≤480px) */
@media (max-width: 480px) {
  /* .main-content {
    padding-left: 0.8rem;
    padding-right: 0.8rem;
  } */

  .glass-card {
    padding: 0.9rem;
    border-radius: 8px;
  }
}


.notes-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.create-note-btn,
.btn-secondary,
.btn-primary {
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  color: #fff;
  cursor: pointer;
  font-weight: 500;
}

.create-note-btn {
  background: #4caf50;
}

.btn-secondary {
  background: #2196f3;
}

.btn-primary {
  background: #673ab7;
}

.btn-backtodevice {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 6px 8px 6px 30px;
  color: white;
  border: none;
  margin-top: 2rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
}


.search-container {
  position: relative;
}

.search-container i {
  position: absolute;
  left: 10px;
  top: 10px;
  color: #ccc;
}


.search-container input {
  padding: 6px 8px 6px 30px;
  border: none;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
}





.notes-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 1.2rem;
}

.note-item {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  padding: 1.2rem;
  color: #fff;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  transition: 0.3s;
}

.note-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.3);
}

.note-title {
  font-weight: 600;
  font-size: 1.1rem;
  color: #fff;
}

.note-severity {
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-left: 0.5rem;
  text-transform: uppercase;
}

.severity-low {
  background: rgba(76, 175, 80, 0.2);
  color: #4caf50;
}

.severity-medium {
  background: rgba(255, 193, 7, 0.2);
  color: #ffc107;
}

.severity-high {
  background: rgba(244, 67, 54, 0.2);
  color: #f44336;
}

.note-category {
  margin-left: 0.5rem;
  background: rgba(79, 172, 254, 0.2);
  color: #4facfe;
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
  font-size: 0.75rem;
}

.note-meta {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
  text-align: right;
}

.note-content {
  margin-top: 0.6rem;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.5;
}

.note-tags {
  margin-top: 0.5rem;
}

.note-tag {
  display: inline-block;
  background: rgba(79, 172, 254, 0.2);
  color: #4facfe;
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
  margin-right: 0.4rem;
  font-size: 0.75rem;
}

.note-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.action-btn {
  padding: 0.4rem 0.8rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.edit-btn {
  background: rgba(79, 172, 254, 0.2);
  color: #4facfe;
  border: 1px solid rgba(79, 172, 254, 0.3);
}

.delete-btn {
  background: rgba(244, 67, 54, 0.2);
  color: #f44336;
  border: 1px solid rgba(244, 67, 54, 0.3);
}

.edit-btn:hover {
  background: rgba(79, 172, 254, 0.4);
}

.delete-btn:hover {
  background: rgba(244, 67, 54, 0.4);
}

.note-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.8rem;
}

.action-btn {
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  cursor: pointer;
}

.edit-btn {
  background: #2196f3;
  color: #fff;
}

.delete-btn {
  background: #f44336;
  color: #fff;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: #ccc;
}

.note-modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  z-index: 9999;
  padding: 1rem;
  /* prevent content from touching edges on small screens */
}

.modal-content {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  /* 🔥 important: restrict modal height */
  display: flex;
  flex-direction: column;
  overflow: hidden;
  /* ensure only body scrolls */
  backdrop-filter: blur(10px);
}

/* header and footer remain visible */
.modal-header,
.modal-footer {
  flex-shrink: 0;
  /* keep them fixed */
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  z-index: 2;
}

/* header */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

/* scrollable body */
.modal-body {
  flex-grow: 1;
  /* take available space */
  overflow-y: auto;
  /* 🔥 enable scrolling */
  padding: 1rem;
  scrollbar-width: thin;
  /* Firefox */
}

/* custom scrollbar style (for Chrome/Edge) */
.modal-body::-webkit-scrollbar {
  width: 6px;
}

.modal-body::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 10px;
}

.modal-body::-webkit-scrollbar-thumb:hover {
  background-color: rgba(255, 255, 255, 0.5);
}

/* footer */
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  padding: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: white;
  cursor: pointer;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.4rem;
  font-weight: 500;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  border: none;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.4);
  color: white;
  padding: 0.6rem;
  backdrop-filter: blur(8px);
}

.form-row {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.site-footer {
  padding: 1rem;
  color: #aaa;
}


/* 🌙 Dark styled select dropdown for modal */
.note-modal select {
  background-color: rgba(0, 0, 0, 0.4) !important;
  /* Match your modal shade */
  color: #fff !important;
  /* White text */
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 0.6rem;
  appearance: none;
  /* Removes default OS dropdown styling */
  -webkit-appearance: none;
  -moz-appearance: none;
  cursor: pointer;
  font-size: 0.95rem;
  backdrop-filter: blur(8px);
}

/* Dropdown arrow customization */
.note-modal select::-ms-expand {
  display: none;
  /* Remove old IE arrow */
}

/* When focused */
.note-modal select:focus {
  outline: none;
  border-color: #8ab6ff;
  box-shadow: 0 0 0 2px rgba(138, 182, 255, 0.3);
}

/* ✅ Dropdown list styling */
.note-modal select option {
  background-color: rgba(30, 20, 40, 0.95);
  /* Dark dropdown panel */
  color: #fff;
  /* White text */
}

/* Hovered option */
.note-modal select option:hover {
  background-color: rgba(100, 80, 120, 0.8);
  color: #fff;
}
</style>
