<template>
  <!-- Barra superior -->
  <header class="top-bar">
    <div class="left-section">
      <button class="menu-toggle">☰</button>
      <div class="logo">
        <router-link to="/">NutriScan</router-link>
      </div>

    </div>
    <div class="auth-buttons">
      <!-- Mostrar "Iniciar sesión" o "Cerrar sesión" según el estado de autenticación -->
      <button v-if="!isAuthenticated" @click="goToLogin">Iniciar Sesión</button>
      <button v-if="isAuthenticated" @click="handleLogout">Cerrar Sesión</button>
    </div>
  </header>

  <nav class="side-menu">
    <ul>
      <li>
        <router-link to="/" @click="closeMenu">
          <img src="@/assets/img/menu-home.svg" class="menu-icon" alt="Inicio" />
          Inicio
        </router-link>
      </li>
      <li>
        <router-link to="/scanner" @click="closeMenu">
          <img src="@/assets/img/menu-scanner.svg" class="menu-icon" alt="Scanner" />
          Escáner
        </router-link>
      </li>
      <li>
        <router-link to="/recetas" @click="closeMenu">
          <img src="@/assets/img/menu-recetas.svg" class="menu-icon" alt="Recetas" />
          Recetas
        </router-link>
      </li>
      <li>
        <router-link to="/perfil" @click="closeMenu">
          <img src="@/assets/img/menu-profile.svg" class="menu-icon" alt="Perfil" />
          Perfil
        </router-link>
      </li>
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
      this.setTemaBlanco();
      this.$router.push('/'); // Redirige al home tras cerrar sesión
    },
    closeMenu() {
      const sideMenu = document.querySelector(".side-menu");
      sideMenu?.classList.remove("open");
    },
    setTemaBlanco() {
      document.body.classList.remove('dark-theme');
    }
  },
  watch: {
    // Cuando la ruta cambie, verificamos el estado de autenticación nuevamente
    '$route': 'checkAuthStatus'
  }
});
</script>
<style scoped>
/* Barra superior */
.top-bar {
  position: fixed;
  /* <-- Añade esta línea */
  top: 0;
  /* <-- Añade esta línea */
  left: 0;
  /* <-- Añade esta línea */
  width: 100%;
  /* <-- Añade esta línea */
  z-index: 1100;
  /* <-- Añade esta línea para que esté sobre el menú lateral */
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #055902;
  color: white;
  padding: 0.75rem 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.top-bar .left-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.top-bar .logo {
  font-size: 1.5rem;
  font-weight: bold;
}

.top-bar .menu-toggle {
  font-size: 1.5rem;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
}

.auth-buttons button {
  background-color: #428C62;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  margin-left: 0.5rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.auth-buttons button:hover {
  background-color: #88BFA0;
}

.side-menu {
  background: linear-gradient(to bottom, #055902, #025928);
  width: 200px;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  padding: 2rem 1.5rem;
  box-shadow: 4px 0 12px rgba(0, 0, 0, 0.2);
  border-top-right-radius: 20px;
  border-bottom-right-radius: 20px;
  transform: translateX(-100%);
  transition: transform 0.4s ease-in-out;
  z-index: 111100;
  color: white;
}

.side-menu.open {
  transform: translateX(0);
}

.side-menu ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.side-menu li {
  margin-bottom: 1.2rem;
}

.side-menu a {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.7rem 1rem;
  color: white;
  text-decoration: none;
  border-radius: 10px;
  transition: background 0.3s ease, transform 0.2s ease;
  font-weight: 500;
}

.side-menu a:hover {
  background-color: #428C62;
  transform: translateX(5px);
}

.logo a {
  color: white;
  font-weight: bold;
  font-size: 1.5rem;
  text-decoration: none;
}

.logo a:hover {
  color: #88BFA0;
  /* color verde claro al pasar el mouse */
}
</style>
