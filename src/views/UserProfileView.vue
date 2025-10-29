<template>
    <div class="user-profile">
    <div class="dashboard container-fluid">
      <div class="row me-0">
        <Menu />

        <!-- 🧩 Main Dashboard Section -->
        <div class="col-md-11 col-12 main-content">
            <div class="user-profile-header mb-1">
            <div class="user-profile-icon">
            <i class="fas fa-user-circle"></i>
            </div>
            <div class="user-profile-text">
            <h1>User Profile</h1>
            <p>Manage your account settings and preferences</p>
            </div>
            </div>
            <hr class="user-profile-divider" />

            <div class="row g-4 mt-3">
                <!-- Left: Personal Information -->
                <div class="col-lg-6 col-12">
                    <div class="user-card glass-card h-100">
                    <h5 class="user-card-title">
                        <i class="fas fa-user-edit me-2"></i> Personal Information
                    </h5>

                    <div class="info-group">
                        <label>Full Name:</label>
                        <span class="ms-1">Demo User</span>
                    </div>

                    <div class="info-group">
                        <label>Username:</label>
                        <span class="ms-1">demo</span>
                    </div>

                    <div class="info-group">
                        <label>Email:</label>
                        <span class="ms-1">Not set</span>
                    </div>

                    <div class="info-group">
                        <label>Role:</label>
                        <span class="highlight ms-1">Support</span>
                    </div>

                    <div class="info-group">
                        <label>Account Created:</label>
                        <span class="ms-1">Invalid Date</span>
                    </div>

                    <div class="info-group">
                        <label>Last Login:</label>
                        <span class="ms-1">Never</span>
                    </div>

                    <button class="edit-profile-btn mt-3" @click="openEditModal">
                        <i class="fas fa-edit me-2"></i> Edit Profile
                    </button>
                    </div>
                </div>

                <!-- ✨ Edit Profile Modal -->
                <div v-if="showEditModal" class="userprofile-editmodal-overlay">
                <div class="userprofile-editmodal glass-editmodal">
                    <div class="userprofile-editmodal-body">
                        <div class="userprofile-editmodal-header d-flex justify-content-between align-items-center">
                    <h4>User Profile</h4>
                    <button class="userprofile-close-btn" @click="closeEditModal">×</button>
                    </div>
                    <h5 class="section-title">Personal Information</h5>

                    <div class="form-group">
                        <label>Full Name:</label>
                        <input type="text" v-model="editData.name" />
                    </div>

                    <div class="form-group">
                        <label>Email:</label>
                        <input type="email" v-model="editData.email" />
                    </div>

                    <div class="form-group">
                        <label>Username:</label>
                        <input type="text" v-model="editData.username" />
                    </div>

                    <div class="form-group">
                        <label>Role:</label>
                        <input type="text" v-model="editData.role" />
                    </div>
                    <div class="userprofile-editmodal-footer">
                    <button class="userprofile-save-btn" @click="saveProfile">
                        <i class="fas fa-save me-2"></i> Save Changes
                    </button>
                    </div>
                    </div>

                </div>
                </div>

                <!-- Right: Security Settings -->
                <div class="col-lg-6 col-12">
                    <div class="user-card glass-card h-100">
                    <h5 class="user-card-title">
                        <i class="fas fa-key me-2"></i> Security Settings
                    </h5>

                    <div class="security-section">
                        <h6>Password</h6>
                        <p>Last changed: Never</p>
                        <button class="user-btn blue" @click="openChangePassModal"><i class="fas fa-lock me-2"></i> Change Password</button>
                    </div>

                    <div class="security-section">
                        <h6>Two-Factor Authentication</h6>
                        <p>Status: Not enabled</p>
                        <button class="user-btn grey" disabled><i class="fas fa-mobile-alt me-2"></i> Enable 2FA</button>
                    </div>

                    <div class="security-section">
                        <h6>Login Sessions</h6>
                        <p>Active sessions: 1</p>
                        <button class="user-btn purple" @click="openSessionModal"><i class="fas fa-list me-2"></i> View Sessions</button>
                    </div>
                    </div>
                </div>

                <!-- 🔐 Change Password Modal -->
                <div v-if="showChangePassModal" class="userprofile-changepassmodal-overlay">
                <div class="userprofile-changepassmodal glass-editmodal">
                    <div class="userprofile-changepassmodal-body">
                    <div class="userprofile-changepassmodal-header d-flex justify-content-between align-items-center">
                        <h4>Change Password</h4>
                        <button class="userprofile-close-btn" @click="closeChangePassModal">×</button>
                    </div>

                    <h5 class="section-title">Security Settings</h5>

                    <div class="form-group">
                        <label>Current Password:</label>
                        <input type="password" v-model="passwordData.current" placeholder="Enter current password" />
                    </div>

                    <div class="form-group">
                        <label>New Password:</label>
                        <input type="password" v-model="passwordData.newPass" placeholder="Enter new password" />
                    </div>

                    <div class="form-group">
                        <label>Confirm New Password:</label>
                        <input type="password" v-model="passwordData.confirmPass" placeholder="Confirm new password" />
                    </div>

                    <div class="userprofile-changepassmodal-footer">
                        <button class="userprofile-save-btn" @click="savePassword">
                        <i class="fas fa-lock me-2"></i> Save Password
                        </button>
                    </div>
                    </div>
                </div>
                </div>

                <!-- 🛡️ Session Management Modal -->
                <div v-if="showSessionModal" class="userprofile-sessionmodal-overlay">
                <div class="userprofile-sessionmodal glass-editmodal">
                    <div class="userprofile-sessionmodal-body">
                    <!-- Header -->
                    <div class="userprofile-sessionmodal-header d-flex justify-content-between align-items-center">
                        <h4><i class="fas fa-shield-alt me-2"></i> Session Management</h4>
                        <button class="userprofile-close-btn" @click="closeSessionModal">×</button>
                    </div>

                    <!-- Active & Total Sessions -->
                    <div class="session-summary d-flex justify-content-between mb-3">
                        <div class="session-box">
                        <p class="label">Active Sessions:</p>
                        <h5>{{ sessionData.active }}</h5>
                        </div>
                        <div class="session-box">
                        <p class="label">Total Sessions:</p>
                        <h5>{{ sessionData.total }}</h5>
                        </div>
                    </div>

                    <!-- Session Details -->
                    <div class="session-detail-box mt-2">
                        <div class="d-flex align-items-center">
                        <h6 class="fw-bold">Other Session</h6>
                        <span class="status-badge inactive ms-1">INACTIVE</span>
                        </div>
                        <p>Started: 10/28/2025, 11:13:56 AM</p>
                        <p>Last Activity: 10/28/2025, 4:16:36 PM</p>
                        <p>IP Address: 49.36.26.167</p>
                        <p>User Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)</p>

                        <button class="terminate-btn" @click="terminateSession">
                        <i class="fas fa-times me-1"></i> Terminate
                        </button>
                    </div>

                    <!-- Footer Buttons -->
                    <div class="userprofile-sessionmodal-footer mt-3">
                        <button class="terminate-all-btn" @click="terminateAllSessions">
                        <i class="fas fa-sign-out-alt me-2"></i> Terminate All Other Sessions
                        </button>
                        <button class="refresh-btn" @click="refreshSessions">
                        <i class="fas fa-sync-alt me-2"></i> Refresh
                        </button>
                    </div>
                    </div>
                </div>

                <!-- ✅ Top-right Alert -->
                <div v-if="alert.visible" :class="['alert-box', alert.type]">
                    <i :class="alert.icon"></i>
                    <span>{{ alert.message }}</span>
                    <button class="alert-close" @click="alert.visible = false">×</button>
                </div>
                </div>

            </div>
        </div>

      </div>
    </div>
    </div>
</template>

<script>
import Menu from '@/components/Menu.vue';

export default {
  name: "UserProfileView",
  components: {
    Menu
  },
  data() {
  return {
    showEditModal: false,
    editData: {
      name: "Demo User",
      email: "",
      username: "demo",
      role: "Support"
    },
    showChangePassModal: false,
    passwordData: {
      current: "",
      newPass: "",
      confirmPass: ""
    },
    showSessionModal: false,
    sessionData: {
      active: 0,
      total: 1,
    },
    alert: {
      visible: false,
      message: "",
      type: "",
      icon: "",
    },
  };
},
methods: {
  openEditModal() {
    this.showEditModal = true;
  },
  closeEditModal() {
    this.showEditModal = false;
  },
  saveProfile() {
    console.log("Updated Profile:", this.editData);
    this.showEditModal = false;
  },
  openChangePassModal() {
    this.showChangePassModal = true;
  },
  closeChangePassModal() {
    this.showChangePassModal = false;
  },
  savePassword() {
    if (!this.passwordData.current || !this.passwordData.newPass || !this.passwordData.confirmPass) {
      alert("⚠️ Please fill all password fields.");
      return;
    }
    if (this.passwordData.newPass !== this.passwordData.confirmPass) {
      alert("❌ Passwords do not match!");
      return;
    }
    console.log("Password changed successfully:", this.passwordData);
    this.showChangePassModal = false;
  },
  openSessionModal() {
    this.showSessionModal = true;
  },
  closeSessionModal() {
    this.showSessionModal = false;
  },
  terminateSession() {
    this.showAlert("Session terminated successfully", "success", "fas fa-check-circle");
  },
  terminateAllSessions() {
    this.showAlert("Terminated 1 session successfully", "success", "fas fa-check-circle");
  },
  refreshSessions() {
    this.showAlert("Refreshing sessions...", "success", "fas fa-sync-alt");
  },
  showAlert(message, type, icon) {
    this.alert = { visible: true, message, type, icon };
    setTimeout(() => (this.alert.visible = false), 3000);
  },
},
}
</script>

<style scoped>
.user-profile {
  --glass-bg: rgba(255, 255, 255, 0.08);
  --glass-border: rgba(255, 255, 255, 0.15);
  --glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  --glass-shadow-hover: 0 12px 40px rgba(0, 0, 0, 0.4);
  --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --text-primary: #ffffff;
  --text-secondary: rgba(255, 255, 255, 0.8);
  --text-muted: rgba(255, 255, 255, 0.6);
  --bg-main: linear-gradient(180deg, #1a1333, #23193d);
}

/* ===== Main Container ===== */
.user-profile .main-content {
  margin-left: 90px;
  overflow-y: auto;
}

.user-profile .dashboard {
  background: var(--bg-main);
  color: var(--text-primary);
  font-family: "Poppins", sans-serif;
  min-height: 100vh;
  padding: 30px;
}

.user-profile-header {
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
}

.user-profile-icon {
  margin-right: 12px;
  position: relative;
  top: 4px; 
}

.user-profile-icon i {
  font-size: 42px;
  background: #8b9cff;
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 15px rgba(118, 75, 162, 0.4);
}

.user-profile-text {
  display: flex;
  flex-direction: column;
}

.user-profile-text h1 {
  font-size: 34px;
  font-weight: 600;
  margin: 0;
  color: #8b9cff;
  letter-spacing: 0.5px;
  line-height: 1.2;
}

.user-profile-text p {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.8);
  margin-top: -2px; 
  padding-left: 2px;
  font-weight: 400;
}

.user-profile-divider {
  width: 100%;
  height: 1px;
  border: none;
  background: rgba(255, 255, 255, 0.2);;
  margin: 10px 0;
  opacity: 0.9;
}

.user-card {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: 16px;
  box-shadow: var(--glass-shadow);
  padding: 20px 25px;
  transition: all 0.3s ease;
}
.user-card:hover {
  box-shadow: var(--glass-shadow-hover);
}

.user-card-title {
  font-size: 30px;
  font-weight: 500;
  margin-bottom: 18px;
  display: flex;
  align-items: center;
}

.user-card-title i {
    color: #4caf50;
}

.info-group {
  display: flex;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 8px 12px;
  margin-bottom: 8px;
}
.info-group label {
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
}
.info-group span {
  color: rgba(255, 255, 255, 0.8);
}
.highlight {
  color: #6ea8ff;
}

.edit-profile-btn {
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 18px;
  font-size: 14px;
  cursor: pointer;
  transition: 0.3s;
}
.edit-profile-btn:hover {
  background: #43a047;
}

.security-section {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 15px;
}
.security-section h6 {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 5px;
}
.security-section p {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 10px;
}

.user-btn {
  border: none;
  border-radius: 8px;
  color: white;
  padding: 7px 14px;
  font-size: 13px;
  cursor: pointer;
  transition: 0.3s;
}
.user-btn.blue {
  background: #1976d2;
}
.user-btn.grey {
  background: #585857;
  cursor: not-allowed;
  box-shadow: none;
  opacity: 0.6;
}

.user-btn.grey:hover {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.5);
  transform: none;
  box-shadow: none;
}

.user-btn.purple {
  background: #7e57c2;
}
.user-btn:hover {
  opacity: 0.9;
}

/* edit modal start */
.userprofile-editmodal-overlay {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(20, 20, 35, 0.7);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.userprofile .glass-editmodal {
  width: 600px;
  max-width: 95%;
  background: rgba(28, 27, 48, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 14px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.6);
  color: #fff;
  padding: 25px 25px;
  animation: fadeIn 0.3s ease;
  backdrop-filter: blur(20px);
  position: relative;
}

.userprofile-editmodal-header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  padding-bottom: 10px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.userprofile-editmodal-header h4 {
  font-size: 22px;
  font-weight: 600;
  color: #ffffff;
}

.userprofile-close-btn {
  background: none;
  border: none;
  color: #fff;
  font-size: 22px;
  cursor: pointer;
  transition: 0.2s;
}

.userprofile-close-btn:hover {
  color: #8b9cff;
}

.userprofile-editmodal-body {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 10px;
  padding: 20px;
  width: 500px;
}

.userprofile-editmodal-body .section-title {
  margin-bottom: 16px;
  font-size: 17px;
  font-weight: 600;
  color: #ffffff;
  padding-bottom: 8px;
}

.userprofile-editmodal-body .form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
}

.userprofile-editmodal-body label {
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 5px;
}

.userprofile-editmodal-body input {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.25);
  color: #fff;
  border-radius: 6px;
  padding: 10px 12px;
  font-size: 14px;
  outline: none;
  transition: 0.3s;
}

.userprofile-editmodal-body input:focus {
  border-color: #8b9cff;
  box-shadow: 0 0 6px #8b9cff;
}

.userprofile-editmodal-footer {
  border-top: 1px solid rgba(255, 255, 255, 0.15);
  padding-top: 12px;
  display: flex;
  justify-content: flex-end;
  margin-top: 18px;
}

.userprofile-save-btn {
  background: linear-gradient(135deg, #667eea, #764ba2);
  border: none;
  color: #fff;
  padding: 6px 13px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: 0.3s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.userprofile-save-btn:hover {
  background: linear-gradient(135deg, #5a6fd9, #6a3c9c);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ===== Change Password Modal ===== */
.userprofile-changepassmodal-overlay {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(20, 20, 35, 0.7);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.userprofile .glass-editmodal {
  width: 600px;
  max-width: 95%;
  background: rgba(28, 27, 48, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 14px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.6);
  color: #fff;
  padding: 25px 25px;
  animation: fadeIn 0.3s ease;
  backdrop-filter: blur(20px);
  position: relative;
}

.userprofile-changepassmodal-body {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 10px;
  padding: 20px;
  width: 500px;
}

.userprofile-changepassmodal-header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  padding-bottom: 10px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.userprofile-changepassmodal-header h4 {
  font-size: 22px;
  font-weight: 600;
  color: #ffffff;
}

.userprofile-close-btn {
  background: none;
  border: none;
  color: #fff;
  font-size: 22px;
  cursor: pointer;
  transition: 0.2s;
}

.userprofile-close-btn:hover {
  color: #8b9cff;
}

.userprofile-changepassmodal-body .section-title {
  margin-bottom: 16px;
  font-size: 17px;
  font-weight: 600;
  color: #ffffff;
  padding-bottom: 8px;
}

.userprofile-changepassmodal-body .form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
}

.userprofile-changepassmodal-body label {
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 5px;
}

.userprofile-changepassmodal-body input {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.25);
  color: #fff;
  border-radius: 6px;
  padding: 10px 12px;
  font-size: 14px;
  outline: none;
  transition: 0.3s;
}

.userprofile-changepassmodal-body input:focus {
  border-color: #8b9cff;
  box-shadow: 0 0 6px #8b9cff;
}

.userprofile-changepassmodal-footer {
  border-top: 1px solid rgba(255, 255, 255, 0.15);
  padding-top: 12px;
  display: flex;
  justify-content: flex-end;
  margin-top: 18px;
}

.userprofile-save-btn {
  background: linear-gradient(135deg, #667eea, #764ba2);
  border: none;
  color: #fff;
  padding: 6px 13px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: 0.3s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.userprofile-save-btn:hover {
  background: linear-gradient(135deg, #5a6fd9, #6a3c9c);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ===== Overlay ===== */
.userprofile-sessionmodal-overlay {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(20, 20, 35, 0.7);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

/* ===== Glass Modal ===== */
.userprofile .glass-editmodal {
  width: 650px;
  max-width: 95%;
  background: rgba(28, 27, 48, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 14px;
  box-shadow: 0 10px 35px rgba(0, 0, 0, 0.6);
  color: #fff;
  padding: 25px;
  animation: fadeIn 0.3s ease;
  backdrop-filter: blur(20px);
  position: relative;
}

.userprofile-sessionmodal-body {
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 10px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.04);
  width: 600px;
}

/* ===== Header ===== */
.userprofile-sessionmodal-header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  padding-bottom: 10px;
  margin-bottom: 20px;
}

.userprofile-sessionmodal-header h4 {
  font-size: 22px;
  font-weight: 600;
  color: #ffffff;
}

.session-detail-box p {
    line-height: 0.5;
    font-size: 12px;
}

/* ===== Summary Boxes ===== */
.session-summary {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.session-box {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 8px;
  flex: 1;
  padding: 10px 15px;
  text-align: center;
}

.session-box .label {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.7);
}

.session-box h5 {
  font-size: 20px;
  margin: 0;
  color: #fff;
}

/* ===== Session Details Box ===== */
.session-detail-box {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 10px;
  padding: 15px;
  margin-top: 20px;
}

.session-detail-box h6 {
  font-size: 15px;
  color: #fff;
}

.status-badge {
  font-size: 8px;
  font-weight: 600;
  padding: 3px 4px;
  border-radius: 12px;
  color: #fff;
  margin-bottom: 10px;
}

.status-badge.inactive {
  background: #e74c3c;
}

/* ===== Buttons ===== */
.terminate-btn {
  background: #e74c3c;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 6px 12px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  float: right;
  margin-top: -45px;
}

.terminate-btn:hover {
  background: #c0392b;
}

.userprofile-sessionmodal-footer {
  border-top: 1px solid rgba(255, 255, 255, 0.15);
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 15px;
}

.terminate-all-btn {
  background: #e74c3c;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 8px 15px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: 0.3s;
}

.terminate-all-btn:hover {
  background: #c0392b;
}

.refresh-btn {
  background: #00c6ff;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 8px 15px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: 0.3s;
}

.refresh-btn:hover {
  background: #00b5e6;
}

/* ===== Alert Box ===== */
.alert-box {
  position: fixed;
  top: 20px;
  right: 25px;
  background: #2ecc71;
  color: #fff;
  padding: 10px 18px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  z-index: 2100;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
  animation: fadeIn 0.3s ease;
}

.alert-box.success {
  background: #2ecc71;
}

.alert-close {
  background: none;
  border: none;
  color: #fff;
  font-size: 18px;
  cursor: pointer;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .info-group {
    align-items: flex-start;
  }
  .info-group label {
    margin-bottom: 4px;
  }
}

@media (max-width: 576px) {
  .userprofile .glass-editmodal {
    width: 90%;
    padding: 15px;
  }
  .userprofile-editmodal-body {
    padding: 15px;
  }
}
</style>