<template>
  <div @click="cerrarMenu" class="app-container">
    <!-- Barra superior -->
    <header class="top-bar">
      <div class="left-section">
        <button class="menu-toggle" @click.stop="toggleMenu">☰</button>
        <div class="logo">NutriScan</div>
      </div>
      <div class="auth-buttons">
        <button id="toggle-theme">🌙</button>
      </div>
    </header>

    <!-- Menú lateral -->
    <nav class="side-menu" :class="{ open: menuAbierto }" @click.stop>
      <ul>
        <li><router-link to="/">Home</router-link></li>
        <li><router-link to="/scanner">Scanner</router-link></li>
        <li><router-link to="/recetas">Recetas</router-link></li>
        <li><router-link to="/perfil">Perfil</router-link></li>
        <li><router-link to="/historial">Historial</router-link></li>
      </ul>
    </nav>

    <!-- Contenedor de Perfil -->
    <div class="perfil-container">
      <section id="informacion-basica">
        <div class="informacion">
          <h2>{{ user.name }}</h2>
          <p>Email: {{ user.email }}</p>
        </div>
        <div class="avatar">
          <img src="@/assets/img/perfil.jpg" alt="Avatar" />
        </div>
      </section>
      <section id="preferencias">
        <h3>Preferencias y Restricciones Alimenticias</h3>
        <input type="text" id="preferenciasInput" placeholder="Añadir preferencia/restricción" />
        <button class="btn" @click="agregarPreferencia">Añadir</button>
        <ul id="listaPreferencias"></ul>
      </section>
      <section id="favoritos">
        <h3>Productos Favoritos</h3>
        <input type="text" id="favoritosInput" placeholder="Añadir producto favorito" />
        <button class="btn" @click="agregarFavorito">Añadir</button>
        <ul id="listaFavoritos"></ul>
      </section>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  setup() {
    const menuAbierto = ref(false);

    const toggleMenu = () => {
      menuAbierto.value = !menuAbierto.value;
    };

    const cerrarMenu = () => {
      menuAbierto.value = false;
    };

    return {
      menuAbierto,
      toggleMenu,
      cerrarMenu,
      user: {
        name: "Juan Pérez",
        email: "juan@ejemplo.com",
      },
    };
  },
};
</script>
