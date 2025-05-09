<template>
  <div class="recetas-container">
    <div class="recetas-header">
      <h1>Explora Recetas Saludables</h1>
      <p class="recetas-intro">Descubre deliciosas recetas que cuidan de tu salud y bienestar.</p>
      
      <!-- Mensaje invitando a compartir receta -->
      <p class="mensaje-compartir">¿Te gustaría compartir tu receta? Haz clic en el botón para empezar a contribuir.</p>

      <!-- Botón para subir receta justo debajo del mensaje -->
      <router-link v-if="verificarAcceso" to="/subirReceta">
        <button class="btn-subir">¡Comparte tu receta!</button>
      </router-link>
    </div>

    <!-- Barra de búsqueda -->
    <div class="search-bar">
      <input v-model="search" type="text" placeholder="Buscar por ingrediente, nombre o tipo de receta..." @input="filtrarRecetas" />
    </div>

    <!-- Lista de recetas -->
    <div class="recetas-grid">
      <div v-for="receta in recetasFiltradas" :key="receta._id" class="receta-card">
        <router-link :to="'/receta/' + receta._id" class="receta-link">
          <img :src="receta.image" alt="Imagen de la receta" class="receta-img" />
          <div class="receta-content">
            <h3>{{ receta.name }}</h3>
          </div>
        </router-link>

        <!-- Opciones de admin -->
        <div v-if="isAdmin" class="receta-admin">
          <button @click="editarReceta(receta._id)">Modificar</button>
          <button @click="eliminarReceta(receta)">Eliminar</button>
        </div>
      </div>
    </div>

    <!-- Mensaje si no hay resultados -->
    <p v-if="recetasFiltradas.length === 0" class="no-resultados">Lo sentimos, no hemos encontrado recetas que coincidan con tu búsqueda.</p>
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
      isAdmin: false
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
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

.recetas-container {
  margin-top: 50px;
  font-family: 'Poppins', sans-serif;
  background-color: #F2F2F2;
  color: #0D0D0D;
  padding: 40px 20px;
  min-height: 100vh;
}

.recetas-header {
  text-align: center;
  margin-bottom: 30px;
}

h1 {
  color: #034001;
  font-size: 32px;
  margin-bottom: 10px;
}

.recetas-intro {
  color: #055902;
  font-size: 16px;
}

.btn-subir {
  margin-top: 20px;
  background-color: #027313;
  color: white;
  border: none;
  padding: 12px 24px;
  font-size: 15px;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.btn-subir:hover {
  background-color: #055902;
}

.search-bar {
  text-align: center;
  margin-bottom: 30px;
}

.search-bar input {
  width: 90%;
  max-width: 500px;
  padding: 12px 16px;
  font-size: 15px;
  border: 1.5px solid #034001;
  border-radius: 8px;
  outline: none;
  background-color: white;
  transition: box-shadow 0.3s ease;
}

.search-bar input:focus {
  box-shadow: 0 0 0 3px rgba(2, 115, 19, 0.2);
}

.recetas-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr); /* Esto asegura que haya 6 columnas */
  gap: 16px; /* Reducir espacio entre tarjetas */
}

.receta-card {
  background-color: white;
  border: 1px solid #E0E0E0;
  border-radius: 8px; /* Reducir bordes para que sea más compacta */
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s;
  margin-bottom: 20px; /* Ajuste de márgenes */
}

.receta-card:hover {
  transform: translateY(-5px);
}

.receta-img {
  width: 100%;
  height: 130px; /* Reducir altura de la imagen */
  object-fit: cover;
}

.receta-content {
  padding: 12px; /* Reducir el padding interno */
}

.receta-content h3 {
  font-size: 18px; /* Reducir tamaño del título */
  color: #027313;
  margin-bottom: 6px;
}

.receta-content p {
  font-size: 16px; /* Reducir tamaño del texto de la descripción */
  color: #0D0D0D;
}


.receta-admin {
  display: flex;
  justify-content: space-around;
  padding: 10px 0;
  background-color: #f9f9f9;
  border-top: 1px solid #E0E0E0;
}

.receta-admin button {
  background-color: transparent;
  border: none;
  color: #034001;
  font-weight: 600;
  cursor: pointer;
}

.receta-admin button:hover {
  text-decoration: underline;
}

.no-resultados {
  text-align: center;
  font-size: 16px;
  color: #034001;
  margin-top: 30px;
}

.mensaje-compartir {
  text-align: center;
  font-size: 16px; /* Ajusté el tamaño del texto para que sea proporcional */
  color: #055902;
  margin-top: 15px;
}

.btn-subir {
  display: block;
  margin: 20px auto 40px;
  background-color: #027313;
  color: white;
  border: none;
  padding: 8px 16px; /* Ajusté el padding para que el botón sea más pequeño */
  font-size: 14px; /* Reduje el tamaño de la fuente para que se ajuste al resto del texto */
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.3s ease;
  width: auto; /* Mantiene el tamaño ajustado al contenido */
  max-width: 180px; /* Limitación de tamaño máximo */
  text-align: center;
}

.btn-subir:hover {
  background-color: #055902;
}

</style>

