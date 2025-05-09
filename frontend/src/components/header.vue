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
<style scoped>
/* Estilos para el header y la barra de navegación */
.top-bar {
  background-color: #027313; /* Verde claro */
  color: #F2F2F2; /* Gris claro */
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: 'Segoe UI', sans-serif;
}

.left-section {
  display: flex;
  align-items: center;
}

.menu-toggle {
  background: none;
  border: none;
  color: #F2F2F2; /* Gris claro */
  font-size: 30px;
  cursor: pointer;
  margin-right: 20px;
}

.logo {
  font-size: 24px;
  font-weight: bold;
  color: #F2F2F2; /* Gris claro */
}

.auth-buttons button {
  background-color: #055902; /* Verde medio */
  color: #F2F2F2; /* Gris claro */
  border: none;
  padding: 8px 20px;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 10px;
  transition: background-color 0.3s;
}

.auth-buttons button:hover {
  background-color: #034001; /* Verde oscuro */
}

.side-menu {
  background-color: #F2F2F2; /* Gris claro */
  color: #0D0D0D; /* Negro */
  position: fixed;
  top: 0;
  left: -250px;
  width: 250px;
  height: 100%;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.2);
  transition: left 0.3s ease;
}

.side-menu.open {
  left: 0;
}

.side-menu ul {
  list-style: none;
  padding: 0;
  margin-top: 60px;
}

.side-menu li {
  padding: 15px;
  text-align: center;
}

.side-menu a {
  text-decoration: none;
  color: #034001; /* Verde oscuro */
  font-size: 18px;
  display: block;
  padding: 8px 0;
}

.side-menu a:hover {
  background-color: #B9C5B1; /* Gris verde suave */
}
</style>
