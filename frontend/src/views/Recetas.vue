<template>
  <div class="recetas-container">
    <h1>Recetas Saludables</h1>
    <p class="recetas-intro">Busca y filtra recetas saludables recomendadas por la comunidad.</p>

    <!-- Botón para ir al formulario de subir receta -->
    <router-link v-if="isAdmin" to="/subirReceta">
      <button class="btn-subir-receta">Subir Receta</button>
    </router-link>

    <!-- Barra de búsqueda -->
    <div class="search-bar">
      <input v-model="search" type="text" placeholder="Buscar recetas..." @input="filtrarRecetas" />
    </div>

    <!-- Lista de recetas -->
    <div class="grid" id="recetas-grid">
      <div v-for="receta in recetasFiltradas" :key="receta._id" class="receta">
        <img :src="receta.image" alt="Imagen de la receta" class="receta-image" />
        <h3 class="receta-title">{{ receta.name }}</h3>

        <!-- Botones de editar y eliminar solo si el usuario es admin -->
        <div v-if="isAdmin">
          <button @click="editarReceta(receta._id)">Editar</button>
          <button @click="eliminarReceta(receta)">Eliminar</button>
        </div>
      </div>
    </div>

    <!-- Mensaje cuando no hay resultados -->
    <p v-if="recetasFiltradas.length === 0" class="no-results">No se encontraron recetas.</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      recetas: [],
      recetasFiltradas: [],
      search: '',
      isAdmin: false // Variable para verificar si el usuario es admin
    };
  },
  created() {
    this.obtenerRecetas();

    // Obtener el token y verificar el rol sin librerías adicionales
    const token = localStorage.getItem('token');
    if (token) {
      // Decodificar el token (separar las partes)
      const tokenParts = token.split('.');
      if (tokenParts.length === 3) {
        // El payload es la segunda parte del token (en Base64)
        const payload = JSON.parse(atob(tokenParts[1]));
        console.log('Payload decodificado:', payload); // Mostrar el payload completo

        // Verificar si el rol es admin
        if (payload.rol === 'admin') {
          this.isAdmin = true;
        }
      }
    }
  },
  methods: {
    async obtenerRecetas() {
      try {
        const response = await axios.get('http://localhost:3000/api/receta');
        console.log('Recetas obtenidas:', response.data);
        this.recetas = response.data;
        this.recetasFiltradas = this.recetas;
      } catch (error) {
        console.error('Error al obtener las recetas:', error);
      }
    },
    filtrarRecetas() {
      this.recetasFiltradas = this.recetas.filter(receta =>
        receta.name.toLowerCase().includes(this.search.toLowerCase()) ||
        receta.description.toLowerCase().includes(this.search.toLowerCase())
      );
    },
    verificarAcceso() {
      const token = localStorage.getItem('token');
      console.log('Token en localStorage:', token); // Verificación

      if (token) {
        this.$router.push('/subirReceta');
      } else {
        alert('Debes registrarte o iniciar sesión para subir una receta.');
      }
    },
    async eliminarReceta(receta) {
      if (window.confirm('¿Estás seguro de que quieres eliminar esta receta?')) {
        try {
          // Usar receta._id aquí
          await axios.delete(`http://localhost:3000/api/receta/${receta._id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          this.obtenerRecetas(); // Refrescar las recetas
        } catch (error) {
          console.error('Error al eliminar la receta:', error);
        }
      }
    }
  }
};
</script>

<style scoped>
.recetas-container {
  padding: 20px;
}

.search-bar input {
  padding: 10px;
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20px;
}

.receta {
  background-color: #f2f2f2;
  padding: 15px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.receta-image {
  width: 100%;
  height: auto;
  border-radius: 5px;
}

.receta-title {
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  margin-top: 10px;
}

.no-results {
  text-align: center;
  font-size: 18px;
  color: #888;
}
</style>
