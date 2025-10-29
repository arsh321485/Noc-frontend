<script >
import { RouterLink, RouterView } from 'vue-router'
import AboutNocModal from "@/components/AboutNocModal.vue";
export default {
  components: { AboutNocModal },
};
</script>

<template>
  <AboutNocModal ref="aboutModal" />
  <RouterView />
</template>

<style>
body {
  /* background: linear-gradient(180deg, #1a1333, #23193d); */
  /* background-color: rgb(52,32,60); */
  margin: 0;
  font-family: 'Poppins', sans-serif;
  color: #fff;
}
</style>
