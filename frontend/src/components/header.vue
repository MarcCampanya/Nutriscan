<template>
  <!-- Barra superior -->
  <header class="top-bar">
    <div class="left-section">
      <button class="menu-toggle">☰</button>
      <div class="logo">NutriScan</div>
    </div>
    <div class="auth-buttons">
      <!-- Mostrar "Iniciar sesión" o "Cerrar sesión" según el estado de autenticación -->
      <button v-if="!isAuthenticated" @click="goToLogin">Iniciar Sesión</button>
      <button v-if="isAuthenticated" @click="handleLogout">Cerrar Sesión</button>
    </div>
  </header>

  <!-- Menú lateral -->
  <nav class="side-menu">
    <ul>
      <li><router-link to="/" @click="closeMenu">Home</router-link></li>
      <li><router-link to="/scanner" @click="closeMenu">Scanner</router-link></li>
      <li><router-link to="/recetas" @click="closeMenu">Recetas</router-link></li>
      <li><router-link to="/perfil" @click="closeMenu">Perfil</router-link></li>
      <li><router-link to="/historial" @click="closeMenu">Historial</router-link></li>
    </ul>
  </nav>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  data() {
    return {
      isAuthenticated: false
    };
  },
  mounted() {
    this.checkAuthStatus();
    const menuToggle = document.querySelector(".menu-toggle");
    const sideMenu = document.querySelector(".side-menu");

    menuToggle?.addEventListener("click", (e) => {
      e.stopPropagation();
      sideMenu?.classList.toggle("open");
    });

    document.addEventListener("click", (event) => {
      if (sideMenu && !sideMenu.contains(event.target as Node) && !menuToggle?.contains(event.target as Node)) {
        sideMenu.classList.remove("open");
      }
    });
  },
  methods: {
    // Verifica el estado de autenticación y actualiza el estado
    checkAuthStatus() {
      this.isAuthenticated = !!localStorage.getItem('token');
    },
    goToLogin() {
      this.$router.push('/login');
    },
    handleLogout() {
      localStorage.removeItem('token');
      this.isAuthenticated = false;
      this.$router.push('/'); // Redirige al home tras cerrar sesión
    },
    closeMenu() {
      const sideMenu = document.querySelector(".side-menu");
      sideMenu?.classList.remove("open");
    },
  },
  watch: {
    // Cuando la ruta cambie, verificamos el estado de autenticación nuevamente
    '$route': 'checkAuthStatus'
  }
});
</script>
