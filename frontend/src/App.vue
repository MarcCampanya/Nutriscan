<template>
  <Header />
  <router-view></router-view>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Header from './components/header.vue';

export default defineComponent({
  name: 'App',
  components: {
    Header,
  },
});
</script>