<template>
  <div class="recetas-container">
    <div class="recetas-header">
      <h1>Explora Recetas Saludables</h1>
      <p class="recetas-intro">Descubre deliciosas recetas que cuidan de tu salud y bienestar.</p>

      <!-- Mensaje invitando a compartir receta -->
      <p class="mensaje-compartir">
        ¿Te gustaría compartir tu receta? Haz clic en el botón para empezar a contribuir.
      </p>

      <!-- Botón para subir receta (si está autenticado) -->
      <router-link v-if="tieneToken" to="/subirReceta">
        <button class="btn-subir">¡Comparte tu receta!</button>
      </router-link>
      <button v-else class="btn-subir" @click="alertaLogin">
        ¡Comparte tu receta!
      </button>
    </div>

    <!-- Barra de búsqueda -->
    <div class="search-bar">
      <input v-model="search" type="text" placeholder="Buscar por ingrediente, nombre o tipo de receta..."
        @input="filtrarRecetas" />
    </div>

    <!-- Sección MÁS VALORADAS (solo con rating > 0) -->
    <div class="seccion-recetas" v-if="masValoradas.length">
      <h2>Más valoradas</h2>
      <div class="recetas-grid">
        <div v-for="receta in masValoradas.slice(0, 4)" :key="receta._id" class="receta-card">
          <router-link :to="'/receta/' + receta._id" class="receta-link">
            <img :src="receta.image" alt="Imagen de la receta" class="receta-img" />
            <div class="receta-content">
              <h3>{{ receta.name }}</h3>

              <!-- Valoración global con estrellas (soporte mitad) -->
              <div class="star-rating-global">
                <span v-for="n in 5" :key="receta._id + '-g-' + n" class="star" :class="starGlobalClass(receta._id, n)">
                  ★
                </span>
                <span class="rating-text">
                  promedio {{ (ratings[receta._id] || 0).toFixed(1) }}
                </span>
              </div>
            </div>
          </router-link>

          <!-- Opciones de admin -->
          <div v-if="isAdmin" class="receta-admin">
            <button @click="editarReceta(receta._id)">Modificar</button>
            <button @click="eliminarReceta(receta)">Eliminar</button>
          </div>
        </div>
      </div>
      <router-link to="/mas-valoradas">
        <button class="btn-mostrar-mas">Mostrar más</button>
      </router-link>
    </div>

    <!-- Sección MENOS VALORADAS (solo con rating > 0) -->
    <div class="seccion-recetas" v-if="menosValoradas.length">
      <h2>Menos valoradas</h2>
      <div class="recetas-grid">
        <div v-for="receta in menosValoradas.slice(0, 4)" :key="receta._id" class="receta-card">
          <router-link :to="'/receta/' + receta._id" class="receta-link">
            <img :src="receta.image" alt="Imagen de la receta" class="receta-img" />
            <div class="receta-content">
              <h3>{{ receta.name }}</h3>

              <!-- Valoración global -->
              <div class="star-rating-global">
                <span v-for="n in 5" :key="receta._id + '-g2-' + n" class="star"
                  :class="starGlobalClass(receta._id, n)">
                  ★
                </span>
                <span class="rating-text">
                  {{ (ratings[receta._id] || 0).toFixed(1) }}
                </span>
              </div>
            </div>
          </router-link>

          <!-- Opciones de admin -->
          <div v-if="isAdmin" class="receta-admin">
            <button @click="editarReceta(receta._id)">Modificar</button>
            <button @click="eliminarReceta(receta)">Eliminar</button>
          </div>
        </div>
      </div>
      <router-link to="/menos-valoradas">
        <button class="btn-mostrar-mas">Mostrar más</button>
      </router-link>
    </div>

    <!-- Sección TODAS LAS RECETAS -->
    <div class="seccion-recetas" v-if="recetasFiltradas.length">
      <h2>Todas las recetas</h2>
      <div class="recetas-grid">
        <div v-for="receta in recetasFiltradas" :key="receta._id" class="receta-card">
          <router-link :to="'/receta/' + receta._id" class="receta-link">
            <img :src="receta.image" alt="Imagen de la receta" class="receta-img" />
            <div class="receta-content">
              <h3>{{ receta.name }}</h3>

              <!-- Valoración global -->
              <div class="star-rating-global">
                <span v-for="n in 5" :key="receta._id + '-g3-' + n" class="star"
                  :class="starGlobalClass(receta._id, n)">
                  ★
                </span>
                <span class="rating-text">
                  ({{ (ratings[receta._id] || 0).toFixed(1) }})
                </span>
              </div>
            </div>
          </router-link>

          <!-- Opciones de admin -->
          <div v-if="isAdmin" class="receta-admin">
            <button @click="editarReceta(receta._id)">Modificar</button>
            <button @click="eliminarReceta(receta)">Eliminar</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Mensaje si no hay resultados de búsqueda -->
    <p v-if="recetasFiltradas.length === 0" class="no-resultados">
      Lo sentimos, no hemos encontrado recetas que coincidan con tu búsqueda.
    </p>
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
      isAdmin: false,
      ratings: {},        // rating promedio de cada receta
      ratingCounts: {},   // cantidad de ratings por receta
    };
  },
  created() {
    this.obtenerRecetas();
    this.verificarAdmin();
  },
  computed: {
    tieneToken() {
      return !!this.obtenerToken();
    },
    // Solo recetas con ratingCount > 0, ordenadas de mayor a menor promedio
    masValoradas() {
      return [...this.recetasFiltradas]
        .filter((receta) => (this.ratingCounts[receta._id] || 0) > 0)
        .sort((a, b) => {
          const ra = this.ratings[a._id] || 0;
          const rb = this.ratings[b._id] || 0;
          return rb - ra;
        });
    },
    // Solo recetas con ratingCount > 0, ordenadas de menor a mayor promedio
    menosValoradas() {
      return [...this.recetasFiltradas]
        .filter((receta) => (this.ratingCounts[receta._id] || 0) > 0)
        .sort((a, b) => {
          const ra = this.ratings[a._id] || 0;
          const rb = this.ratings[b._id] || 0;
          return ra - rb;
        });
    },
  },
  methods: {
    obtenerToken() {
      const token = localStorage.getItem('token');
      return token ? token.trim() : null;
    },
    decodificarPayload(token) {
      try {
        const payloadBase64 = token.split('.')[1];
        const decoded = atob(payloadBase64);
        return JSON.parse(decoded);
      } catch {
        return null;
      }
    },
    tokenValido() {
      const token = this.obtenerToken();
      if (!token) return false;
      const payload = this.decodificarPayload(token);
      if (!payload || !payload.exp) return false;
      const ahora = Math.floor(Date.now() / 1000);
      return payload.exp > ahora;
    },
    verificarAdmin() {
      const token = this.obtenerToken();
      if (!token) return;
      const payload = this.decodificarPayload(token);
      if (payload && payload.rol === 'admin') {
        this.isAdmin = true;
      }
    },
    alertaLogin() {
      alert('Debes registrarte o iniciar sesión para realizar esta acción.');
    },
    async obtenerRecetas() {
      try {
        const response = await axios.get('http://localhost:3000/api/receta');
        this.recetas = response.data;
        this.recetasFiltradas = this.recetas;

        this.ratings = {};
        this.ratingCounts = {};

        this.recetas.forEach((receta) => {
          this.ratingCounts[receta._id] = receta.ratingCount || 0;
          this.ratings[receta._id] = receta.averageRating || 0;
        });
      } catch (error) {
        console.error('Error al obtener recetas:', error);
      }
    },
    filtrarRecetas() {
      const texto = this.search.toLowerCase();
      this.recetasFiltradas = this.recetas.filter((receta) => {
        const nombre = receta.name.toLowerCase();
        const ingredientes = (receta.ingredients || [])
          .join(' ')
          .toLowerCase();
        const tipo = (receta.type || '').toLowerCase();
        return (
          nombre.includes(texto) ||
          ingredientes.includes(texto) ||
          tipo.includes(texto)
        );
      });
    },
    editarReceta(id) {
      this.$router.push({ name: 'EditarReceta', params: { id } });
    },
    async eliminarReceta(receta) {
      if (
        confirm(`¿Estás seguro que quieres eliminar la receta "${receta.name}"?`)
      ) {
        const token = this.obtenerToken();
        if (!token || !this.tokenValido()) {
          alert(
            'No tienes permiso o tu sesión expiró. Inicia sesión de nuevo.'
          );
          return;
        }
        try {
          await axios.delete(
            `http://localhost:3000/api/receta/${receta._id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          this.obtenerRecetas();
        } catch (error) {
          console.error('Error al eliminar receta:', error);
          alert('No se pudo eliminar la receta. Inténtalo de nuevo.');
        }
      }
    },
    // Devuelve la clase para cada estrella global:
    // 'filled' si n ≤ floor(rating),
    // 'half' si es la siguiente estrella y rating tiene fracción ≥ 0.5,
    // '' en caso contrario.
    starGlobalClass(recetaId, n) {
      const rating = this.ratings[recetaId] || 0;
      const entero = Math.floor(rating);
      const decimal = rating - entero;
      if (n <= entero) {
        return 'filled';
      } else if (n === entero + 1 && decimal >= 0.5) {
        return 'half';
      } else {
        return '';
      }
    },
  },
};
</script>

<style scoped>
/* Clases existentes para .star y .filled */
.star {
  display: inline-block;
  font-size: 1.7rem;
  color: #ddd;
  position: relative;
  user-select: none;
}

.star.filled {
  color: #055902;
}

/* Clase para mitad de estrella */
.star.half {
  color: #ddd;
}

.star.half::before {
  content: '★';
  position: absolute;
  left: 0;
  width: 50%;
  overflow: hidden;
  color: #055902;
}

/* Texto junto a las estrellas */
.rating-text {
  font-size: 0.9rem;
  margin-left: 0.5rem;
  color: #3b564d;
}

.recetas-container {
  max-width: 1100px;
  margin: 40px auto;
  padding: 0 20px;
  font-family: 'Lato', sans-serif;
  color: #034001;
}

.recetas-header {
  text-align: center;
  margin-bottom: 30px;
}

.recetas-header h1 {
  font-size: 2.8rem;
  color: #055902;
  margin-bottom: 10px;
  font-weight: 700;
}

.recetas-intro {
  font-size: 1.2rem;
  color: #3B564D;
  margin-bottom: 15px;
}

.mensaje-compartir {
  font-size: 1rem;
  font-style: italic;
  color: #3B564D;
  margin-bottom: 10px;
}

.btn-subir {
  background-color: #055902;
  color: white;
  border: none;
  padding: 12px 28px;
  font-size: 1.1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-subir:hover {
  background-color: #034001;
}

.search-bar {
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
}

.search-bar input {
  width: 70%;
  padding: 12px 20px;
  border: 2px solid #3B564D;
  border-radius: 25px;
  font-size: 1.1rem;
  outline: none;
  transition: border-color 0.3s ease;
}

.search-bar input:focus {
  border-color: #055902;
}

.seccion-recetas {
  margin-bottom: 60px;
}

.seccion-recetas h2 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 30px;
  color: #055902;
}

.recetas-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 28px;
}

.receta-card {
  background: #F8F7F2;
  border-radius: 12px;
  box-shadow: 0 3px 8px rgb(0 0 0 / 0.1);
  transition: transform 0.25s ease;
}

.receta-card:hover {
  transform: translateY(-6px);
}

.receta-link {
  color: inherit;
  text-decoration: none;
}

.receta-img {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 12px 12px 0 0;
}

.receta-content {
  padding: 14px 18px 20px;
}

.receta-content h3 {
  font-weight: 700;
  font-size: 1.3rem;
  margin-bottom: 12px;
  color: #034001;
}

.star-rating {
  font-size: 1.7rem;
  color: #ddd;
  cursor: pointer;
  user-select: none;
  display: inline-block;
}

.star {
  display: inline-block;
  transition: color 0.3s ease;
}

.star.filled {
  color: #055902;
}

.receta-admin {
  display: flex;
  justify-content: center;
  gap: 14px;
  padding: 12px 0 15px;
}

.receta-admin button {
  background-color: #3B564D;
  color: white;
  border: none;
  padding: 8px 18px;
  font-size: 0.95rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.receta-admin button:hover {
  background-color: #055902;
}

.btn-mostrar-mas {
  margin-top: 18px;
  padding: 12px 28px;
  font-size: 1.1rem;
  border-radius: 5px;
  border: none;
  background-color: #055902;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-mostrar-mas:hover {
  background-color: #034001;
}

.no-resultados {
  font-size: 1.3rem;
  text-align: center;
  margin-top: 80px;
  color: #3B564D;
}
</style>
