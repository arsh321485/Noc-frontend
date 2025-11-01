import { createRouter, createWebHistory } from 'vue-router'
import TopologyLinksView from '@/views/TopologyLinksView.vue'
import NotificationCenterView from '@/views/NotificationCenterView.vue'
import WebsiteMonitoringView from '@/views/WebsiteMonitoringView.vue'
import RrdIntegrationView from '@/views/RrdIntegrationView.vue'
import UserProfileView from '@/views/UserProfileView.vue'
import DowntimenotesView from '@/views/DowntimenotesView.vue'
import SLAManagementView from '@/views/SLAManagementView.vue'
import MrtgdeviceView from '@/views/MrtgdeviceView.vue'
import Signup from '@/components/Signup.vue'
import Forgetpassword from '@/components/Forgetpassword.vue'
import Login from '@/components/Login.vue'
import SystemView from '@/views/SystemView.vue'
import NetworktopologyView from '@/views/NetworktopologyView.vue'
import DevicemonitorView from '@/views/DevicemonitorView.vue'
import ResetPassword from '@/components/ResetPassword.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'signup',
      component: Signup,
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/forgotpassword',
      name: 'forgotpassword',
      component: Forgetpassword,
    },
    {
      path: '/resetpassword',
      name: 'resetpassword',
      component: ResetPassword,
    },
    {
      path: '/topology-links',
      name: 'topology-links',
      component: TopologyLinksView,
    },
    {
      path: '/notification-center',
      name: 'notification-center',
      component: NotificationCenterView,
    },
    {
      path: '/website-monitoring',
      name: 'website-monitoring',
      component: WebsiteMonitoringView,
    },
    {
      path: '/rrd-integration',
      name: 'rrd-integration',
      component: RrdIntegrationView,
    },
    {
      path: '/user-profile',
      name: 'user-profile',
      component: UserProfileView,
    },
    {
      path: '/downtime-notes',
      name: 'downtime-notes',
      component: DowntimenotesView,
    },
    {
      path: '/sla-management',
      name: 'sla-management',
      component: SLAManagementView,
    },
    {
      path: '/mrtg-device',
      name: 'mrtg-device',
      component: MrtgdeviceView,
    },
    {
      path: '/system',
      name: 'system',
      component: SystemView,
    },
    {
      path: '/network-topology',
      name: 'network-topology',
      component: NetworktopologyView,
    },
    {
      path: '/device-monitor',
      name: 'device-monitor',
      component: DevicemonitorView,
    },
  ],
})

export default router
