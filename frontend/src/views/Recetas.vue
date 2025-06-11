<template>
  <div class="recetas-container">
    <div class="recetas-header">
      <h1>Explora Recetas</h1>
      <p class="recetas-intro">Descubre platos deliciosos según tus gustos y necesidades</p>
      <p class="mensaje-compartir">Puedes compartir tus propias recetas también.</p>
      <button class="btn-subir" @click="$router.push({ name: 'CrearReceta' })">
        Subir Receta
      </button>
    </div>

    <!-- Barra de búsqueda -->
    <div class="search-bar">
      <div class="search-input-container">
        <input v-model="search" type="text" placeholder="Buscar por ingrediente, nombre o tipo de receta..."
          @input="filtrarRecetas" />
        <button class="btn-filtros" @click="toggleFiltros" :class="{ active: mostrarFiltros }">
          <!-- SVG de filtros (reemplaza con tu SVG) -->
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M3 4C3 3.44772 3.44772 3 4 3H20C20.5523 3 21 3.44772 21 4C21 4.55228 20.5523 5 20 5H4C3.44772 5 3 4.55228 3 4Z"
              fill="currentColor" />
            <path
              d="M6 9C6 8.44772 6.44772 8 7 8H17C17.5523 8 18 8.44772 18 9C18 9.55228 17.5523 10 17 10H7C6.44772 10 6 9.55228 6 9Z"
              fill="currentColor" />
            <path
              d="M9 14C9 13.4477 9.44772 13 10 13H14C14.5523 13 15 13.4477 15 14C15 14.5523 14.5523 15 14 15H10C9.44772 15 9 14.5523 9 14Z"
              fill="currentColor" />
          </svg>
        </button>
      </div>

      <!-- Panel de filtros -->
      <div v-if="mostrarFiltros" class="filtros-panel">
        <div class="filtros-content">
          <h3>Filtros Avanzados</h3>

          <div class="filtro-grupo">
            <label for="tipo">Tipo de comida</label>
            <select v-model="filtros.tipo" id="tipo" @change="aplicarFiltros">
              <option value="">Todos</option>
              <option value="desayuno">Desayuno</option>
              <option value="almuerzo">Almuerzo</option>
              <option value="cena">Cena</option>
              <option value="postre">Postre</option>
              <option value="snack">Snack</option>
            </select>
          </div>

          <div class="filtro-grupo">
            <label for="dificultad">Dificultad</label>
            <select v-model="filtros.dificultad" id="dificultad" @change="aplicarFiltros">
              <option value="">Todas</option>
              <option value="fácil">Fácil</option>
              <option value="media">Media</option>
              <option value="difícil">Difícil</option>
            </select>
          </div>

          <div class="filtro-grupo">
            <label for="tiempo">Tiempo máximo (min)</label>
            <input type="number" v-model="filtros.tiempo" id="tiempo" @input="aplicarFiltros" min="1"
              placeholder="30" />
          </div>

          <div class="filtro-grupo">
            <label for="rating">Puntuación mínima</label>
            <select v-model="filtros.rating" id="rating" @change="aplicarFiltros">
              <option value="">Todas</option>
              <option value="1">1 estrella</option>
              <option value="2">2 estrellas</option>
              <option value="3">3 estrellas</option>
              <option value="4">4 estrellas</option>
              <option value="5">5 estrellas</option>
            </select>
          </div>

          <div class="checkbox-group">
            <label class="checkbox-item">
              <input type="checkbox" v-model="filtros.vegetariano" @change="aplicarFiltros" />
              <span>Vegetariano</span>
            </label>
            <label class="checkbox-item">
              <input type="checkbox" v-model="filtros.vegano" @change="aplicarFiltros" />
              <span>Vegano</span>
            </label>
            <label class="checkbox-item">
              <input type="checkbox" v-model="filtros.sinGluten" @change="aplicarFiltros" />
              <span>Sin gluten</span>
            </label>
            <label class="checkbox-item">
              <input type="checkbox" v-model="filtros.sinLactosa" @change="aplicarFiltros" />
              <span>Sin lactosa</span>
            </label>
          </div>

          <div class="filtros-actions">
            <button class="btn-limpiar" @click="limpiarFiltros">Limpiar</button>
            <button class="btn-cerrar" @click="cerrarFiltros">Cerrar</button>
          </div>
        </div>
      </div>
    </div>

    <!-- SECCIONES POR TIPO -->
    <div v-for="(recetas, tipo) in recetasPorTipo" :key="tipo" class="seccion-recetas">
      <h2>{{ tipo.charAt(0).toUpperCase() + tipo.slice(1) }}</h2>
      <div class="recetas-grid">
        <div v-for="receta in recetas" :key="receta._id" class="receta-card">
          <router-link :to="'/receta/' + receta._id" class="receta-link">
            <img :src="receta.image" alt="Imagen receta" class="receta-img" />
            <div class="receta-content">
              <h3>{{ receta.name }}</h3>
              <div>
                <span v-for="n in 5" :key="n" class="star" :class="starGlobalClass(receta._id, n)">★</span>
                <span class="rating-text">{{ ratings[receta._id]?.toFixed(1) || 'Sin rating' }}</span>
              </div>
            </div>
          </router-link>

          <div class="receta-actions">
            <button class="btn-guardar" :class="{ guardada: estaGuardada(receta._id) }"
              @click="toggleGuardarReceta(receta)">
              <img
                :src="estaGuardada(receta._id) ? '../src/assets/img/bookmark_added.svg' : '../src/assets/img/bookmark.svg'"
                alt="Guardar" />
            </button>
          </div>

          <div class="receta-admin" v-if="isAdmin">
            <button @click="editarReceta(receta._id)">Editar</button>
            <button @click="eliminarReceta(receta)">Eliminar</button>
          </div>
        </div>
      </div>
    </div>

    <!-- SECCIONES POR TAGS -->
    <div v-for="(recetas, tag) in recetasPorTag" :key="tag" class="seccion-recetas" v-if="recetas.length">
      <h2>{{ tag.charAt(0).toUpperCase() + tag.slice(1) }}</h2>
      <div class="recetas-grid">
        <div v-for="receta in recetas" :key="receta._id" class="receta-card">
          <router-link :to="'/receta/' + receta._id" class="receta-link">
            <img :src="receta.image" alt="Imagen receta" class="receta-img" />
            <div class="receta-content">
              <h3>{{ receta.name }}</h3>
              <div>
                <span v-for="n in 5" :key="n" class="star" :class="starGlobalClass(receta._id, n)">★</span>
                <span class="rating-text">{{ ratings[receta._id]?.toFixed(1) || 'Sin rating' }}</span>
              </div>
            </div>
          </router-link>

          <div class="receta-actions">
            <button class="btn-guardar" :class="{ guardada: estaGuardada(receta._id) }"
              @click="toggleGuardarReceta(receta)">
              <img
                :src="estaGuardada(receta._id) ? '../src/assets/img/bookmark_added.svg' : '../src/assets/img/bookmark.svg'"
                alt="Guardar" />
            </button>
          </div>

          <div class="receta-admin" v-if="isAdmin">
            <button @click="editarReceta(receta._id)">Editar</button>
            <button @click="eliminarReceta(receta)">Eliminar</button>
          </div>
        </div>
      </div>
    </div>

    <!-- SECCIÓN OTROS -->
    <div v-for="(recetas, tipo) in recetasOtros" :key="tipo" class="seccion-recetas" v-if="recetas.length">
      <h2>{{ tipo.charAt(0).toUpperCase() + tipo.slice(1) }}</h2>
      <div class="recetas-grid">
        <div v-for="receta in recetas" :key="receta._id" class="receta-card">
          <router-link :to="'/receta/' + receta._id" class="receta-link">
            <img :src="receta.image" alt="Imagen receta" class="receta-img" />
            <div class="receta-content">
              <h3>{{ receta.name }}</h3>
              <div>
                <span v-for="n in 5" :key="n" class="star" :class="starGlobalClass(receta._id, n)">★</span>
                <span class="rating-text">{{ ratings[receta._id]?.toFixed(1) || 'Sin rating' }}</span>
              </div>
            </div>
          </router-link>

          <div class="receta-actions">
            <button class="btn-guardar" :class="{ guardada: estaGuardada(receta._id) }"
              @click="toggleGuardarReceta(receta)">
              <img
                :src="estaGuardada(receta._id) ? '../src/assets/img/bookmark_added.svg' : '../src/assets/img/bookmark.svg'"
                alt="Guardar" />
            </button>
          </div>

          <div class="receta-admin" v-if="isAdmin">
            <button @click="editarReceta(receta._id)">Editar</button>
            <button @click="eliminarReceta(receta)">Eliminar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import bookmark from '@/assets/img/bookmark.svg'
import bookmarkAdded from '@/assets/img/bookmark_added.svg'

// CLASIFICADOR DE IA PARA RECETAS
class RecipeClassifier {
  constructor() {
    // Palabras clave para clasificación por tipo
    this.tipoKeywords = {
      desayuno: ['desayuno', 'tostada', 'cereales', 'avena', 'pancake', 'tortita', 'zumo', 'café', 'té', 'croissant', 'muesli', 'yogur', 'granola'],
      almuerzo: ['almuerzo', 'comida', 'ensalada', 'sopa', 'sandwich', 'bocadillo', 'pasta', 'arroz', 'pollo', 'pescado', 'carne'],
      cena: ['cena', 'pizza', 'lasaña', 'guiso', 'estofado', 'asado', 'paella', 'risotto', 'filete', 'salmón'],
      postre: ['postre', 'tarta', 'pastel', 'flan', 'helado', 'chocolate', 'galleta', 'brownie', 'mousse', 'tiramisú', 'crema', 'dulce'],
      snack: ['snack', 'aperitivo', 'tapas', 'patatas', 'nachos', 'frutos secos', 'palomitas', 'chips'],
      bebida: ['bebida', 'batido', 'smoothie', 'zumo', 'limonada', 'té', 'café', 'cóctel', 'infusión']
    };

    // Palabras clave para dificultad
    this.dificultadKeywords = {
      fácil: ['fácil', 'simple', 'rápido', 'básico', 'sencillo', 'sin cocinar', 'mezclar', '5 minutos', '10 minutos'],
      medio: ['medio', 'moderado', 'hornear', 'freír', 'saltear', '30 minutos', '45 minutos', 'cocinar'],
      difícil: ['difícil', 'complejo', 'elaborado', 'técnica', 'professional', 'horas', '2 horas', 'fermentar', 'glasear']
    };

    // Ingredientes que indican características especiales
    this.dietaKeywords = {
      vegetariano: {
        include: ['verduras', 'vegetales', 'queso', 'huevo', 'leche', 'yogur', 'legumbres', 'tofu'],
        exclude: ['carne', 'pollo', 'pescado', 'jamón', 'bacon', 'chorizo', 'ternera', 'cerdo', 'pavo', 'atún', 'salmón', 'anchoas']
      },
      vegano: {
        include: ['verduras', 'vegetales', 'legumbres', 'tofu', 'leche de avena', 'leche de almendra', 'leche de coco'],
        exclude: ['carne', 'pollo', 'pescado', 'huevo', 'leche', 'queso', 'yogur', 'mantequilla', 'miel', 'jamón', 'bacon']
      },
      sinGluten: {
        exclude: ['harina', 'trigo', 'pan', 'pasta', 'avena', 'cebada', 'centeno', 'sémola', 'gluten'],
        include: ['harina de arroz', 'harina de almendra', 'sin gluten', 'quinoa', 'arroz']
      },
      sinLactosa: {
        exclude: ['leche', 'queso', 'yogur', 'mantequilla', 'nata', 'crema', 'lactosa'],
        include: ['leche de avena', 'leche de almendra', 'leche de coco', 'sin lactosa']
      }
    };
  }

  // Función principal para clasificar una receta
  clasificarReceta(textoReceta) {
    const texto = textoReceta.toLowerCase();

    return {
      type: this.detectarTipo(texto),
      difficulty: this.detectarDificultad(texto),
      preparationTime: this.estimarTiempo(texto),
      tags: this.detectarTags(texto)
    };
  }

  detectarTipo(texto) {
    let maxScore = 0;
    let tipoDetectado = '';

    for (const [tipo, keywords] of Object.entries(this.tipoKeywords)) {
      const score = keywords.reduce((acc, keyword) => {
        return acc + (texto.includes(keyword) ? 1 : 0);
      }, 0);

      if (score > maxScore) {
        maxScore = score;
        tipoDetectado = tipo;
      }
    }

    return tipoDetectado || '';
  }

  detectarDificultad(texto) {
    // Buscar indicadores explícitos primero
    for (const [nivel, keywords] of Object.entries(this.dificultadKeywords)) {
      for (const keyword of keywords) {
        if (texto.includes(keyword)) {
          return nivel;
        }
      }
    }

    // Si no hay indicadores explícitos, inferir por complejidad
    const indicadoresComplejos = ['hornear', 'fermentar', 'glasear', 'reducir', 'flambear', 'templar'];
    const indicadoresFaciles = ['mezclar', 'batir', 'cortar', 'servir'];

    const esComplejo = indicadoresComplejos.some(ind => texto.includes(ind));
    const esFacil = indicadoresFaciles.some(ind => texto.includes(ind));

    if (esComplejo) return 'difícil';
    if (esFacil) return 'fácil';
    return 'medio';
  }

  estimarTiempo(texto) {
    // Buscar tiempo explícito en el texto
    const timeRegex = /(\d+)\s*(min|minuto|minutos|hora|horas|h)/gi;
    const matches = texto.match(timeRegex);

    if (matches) {
      let tiempoTotal = 0;

      matches.forEach(match => {
        const numero = parseInt(match.match(/\d+/)[0]);
        if (match.includes('hora') || match.includes('h')) {
          tiempoTotal += numero * 60;
        } else {
          tiempoTotal += numero;
        }
      });

      if (tiempoTotal > 0) {
        return tiempoTotal.toString();
      }
    }

    // Si no encuentra tiempo explícito, inferir por tipo de receta
    if (texto.includes('rápido') || texto.includes('express')) return '15';
    if (texto.includes('lento') || texto.includes('cocción lenta')) return '120';

    return '30'; // Tiempo por defecto
  }

  detectarTags(texto) {
    const tags = [];

    if (this.esVegetariano(texto)) tags.push('vegetariano');
    if (this.esVegano(texto)) tags.push('vegano');
    if (this.esSinGluten(texto)) tags.push('sin gluten');
    if (this.esSinLactosa(texto)) tags.push('sin lactosa');

    return tags;
  }

  esVegetariano(texto) {
    const { include, exclude } = this.dietaKeywords.vegetariano;

    // Si contiene ingredientes no vegetarianos, no es vegetariano
    const contieneNoVegetariano = exclude.some(ing => texto.includes(ing));
    if (contieneNoVegetariano) return false;

    // Si contiene ingredientes típicamente vegetarianos, probablemente lo sea
    const contieneVegetariano = include.some(ing => texto.includes(ing));
    return contieneVegetariano;
  }

  esVegano(texto) {
    const { include, exclude } = this.dietaKeywords.vegano;

    // Si contiene ingredientes no veganos, no es vegano
    const contieneNoVegano = exclude.some(ing => texto.includes(ing));
    if (contieneNoVegano) return false;

    // Si contiene ingredientes típicamente veganos, probablemente lo sea
    const contieneVegano = include.some(ing => texto.includes(ing));
    return contieneVegano;
  }

  esSinGluten(texto) {
    const { include, exclude } = this.dietaKeywords.sinGluten;

    // Si menciona explícitamente "sin gluten"
    if (texto.includes('sin gluten')) return true;

    // Si contiene ingredientes con gluten, no es sin gluten
    const contieneGluten = exclude.some(ing => texto.includes(ing));
    if (contieneGluten) return false;

    // Si contiene alternativas sin gluten
    const contieneAlternativas = include.some(ing => texto.includes(ing));
    return contieneAlternativas;
  }

  esSinLactosa(texto) {
    const { include, exclude } = this.dietaKeywords.sinLactosa;

    // Si menciona explícitamente "sin lactosa"
    if (texto.includes('sin lactosa')) return true;

    // Si contiene lácteos, no es sin lactosa
    const contieneLacteos = exclude.some(ing => texto.includes(ing));
    if (contieneLacteos) return false;

    // Si contiene alternativas sin lactosa
    const contieneAlternativas = include.some(ing => texto.includes(ing));
    return contieneAlternativas;
  }
}

export default {
  data() {
    return {
      recetas: [],
      recetasFiltradas: [],
      search: '',
      isAdmin: false,
      ratings: {},
      ratingCounts: {},
      savedIds: [],
      bookmark: bookmark,
      bookmarkAdded: bookmarkAdded,
      mostrarFiltros: false,
      filtros: {
        tipo: '',
        dificultad: '',
        tiempo: '',
        rating: '',
        vegetariano: false,
        vegano: false,
        sinGluten: false,
        sinLactosa: false
      },
      // NUEVA INSTANCIA DEL CLASIFICADOR IA
      clasificadorIA: new RecipeClassifier()
    };
  },
  created() {
    this.obtenerRecetas();
    this.verificarAdmin();
    this.loadSaved();
  },
  computed: {

    tieneToken() {
      return !!this.obtenerToken();
    },
    masValoradas() {
      return [...this.recetasFiltradas]
        .filter(r => (this.ratingCounts[r._id] || 0) > 0)
        .sort((a, b) => (this.ratings[b._id] || 0) - (this.ratings[a._id] || 0));
    },
    menosValoradas() {
      return [...this.recetasFiltradas]
        .filter(r => (this.ratingCounts[r._id] || 0) > 0)
        .sort((a, b) => (this.ratings[a._id] || 0) - (this.ratings[b._id] || 0));
    },
    recetasPorTipo() {
      const secciones = {};
      this.recetasFiltradas.forEach(receta => {
        const tipo = receta.type || 'Otros';
        if (tipo === 'Otros') return;  // Ignorar "Otros" aquí
        if (!secciones[tipo]) {
          secciones[tipo] = [];
        }
        secciones[tipo].push(receta);
      });

      // Ordenar claves alfabéticamente (opcional)
      const ordenClaves = Object.keys(secciones).sort();

      const seccionesOrdenadas = {};
      ordenClaves.forEach(clave => {
        seccionesOrdenadas[clave] = secciones[clave];
      });

      return seccionesOrdenadas;
    },

    recetasPorTag() {
      const tagsDeseados = ['vegano', 'vegetariano', 'sin gluten', 'sin lactosa'];
      const secciones = {};
      tagsDeseados.forEach(tag => {
        secciones[tag] = this.recetasFiltradas.filter(receta => receta.tags?.includes(tag));
      });
      return secciones;
    },

    recetasOtros() {
      const seccionOtros = {};
      const otros = this.recetasFiltradas.filter(receta => !receta.type || receta.type === 'Otros');
      if (otros.length > 0) {
        seccionOtros['Otros'] = otros;
      }
      return seccionOtros;
    }
  },
  methods: {
    obtenerToken() {
      const token = localStorage.getItem('token');
      return token ? token.trim() : null;
    },
    decodificarPayload(token) {
      try {
        const payloadBase64 = token.split('.')[1];
        return JSON.parse(atob(payloadBase64));
      } catch {
        return null;
      }
    },
    tokenValido() {
      const token = this.obtenerToken();
      if (!token) return false;
      const payload = this.decodificarPayload(token);
      return payload && payload.exp > Math.floor(Date.now() / 1000);
    },
    verificarAdmin() {
      const token = this.obtenerToken();
      if (!token) return;
      const payload = this.decodificarPayload(token);
      if (payload && payload.rol === 'admin') this.isAdmin = true;
    },
    alertaLogin() {
      alert('Debes registrarte o iniciar sesión para realizar esta acción.');
    },
    async obtenerRecetas() {
      try {
        const response = await axios.get('http://localhost:3000/api/receta');
        this.recetas = response.data;

        // CLASIFICAR AUTOMÁTICAMENTE RECETAS SIN CLASIFICAR
        this.clasificarRecetasAutomaticamente();

        this.recetasFiltradas = this.recetas;
        this.ratings = {};
        this.ratingCounts = {};
        this.recetas.forEach(r => {
          this.ratingCounts[r._id] = r.ratingCount || 0;
          this.ratings[r._id] = r.averageRating || 0;
        });
      } catch (e) {
        console.error('Error al obtener recetas:', e);
      }
    },

    // NUEVOS MÉTODOS PARA LA IA
    clasificarRecetasAutomaticamente() {
      this.recetas.forEach(receta => {
        // Solo clasificar si no tiene ya tipo o dificultad asignados
        if (!receta.type || !receta.difficulty || !receta.preparationTime) {
          const clasificacion = this.clasificarRecetaConIA(receta);

          // Actualizar la receta solo si no tiene esos campos
          if (!receta.type) receta.type = clasificacion.type;
          if (!receta.difficulty) receta.difficulty = clasificacion.difficulty;
          if (!receta.preparationTime) receta.preparationTime = clasificacion.preparationTime;
          if (!receta.tags || receta.tags.length === 0) receta.tags = clasificacion.tags;

          console.log(`Receta "${receta.name}" clasificada automáticamente:`, clasificacion);
        }
      });
    },

    clasificarRecetaConIA(receta) {
      // Combinar toda la información de la receta en un texto
      const textoCompleto = [
        receta.name || '',
        receta.description || '',
        Array.isArray(receta.ingredients) ? receta.ingredients.join(' ') : '',
        receta.instructions || ''
      ].join(' ');

      // Usar el clasificador de IA
      return this.clasificadorIA.clasificarReceta(textoCompleto);
    },

    // MÉTODO PARA ACTUALIZAR UNA RECETA ESPECÍFICA CON IA
    async actualizarRecetaConIA(recetaId) {
      const receta = this.recetas.find(r => r._id === recetaId);
      if (!receta) return;

      const clasificacion = this.clasificarRecetaConIA(receta);

      try {
        const token = this.obtenerToken();
        if (!token || !this.tokenValido()) {
          console.warn('No hay token válido para actualizar la receta');
          return;
        }

        // Actualizar en el servidor
        await axios.put(`http://localhost:3000/api/receta/${recetaId}`, {
          ...receta,
          ...clasificacion
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Actualizar localmente
        Object.assign(receta, clasificacion);

        console.log(`Receta "${receta.name}" actualizada con IA:`, clasificacion);

      } catch (error) {
        console.error('Error al actualizar receta con IA:', error);
      }
    },

    filtrarRecetas() {
      const texto = this.search.toLowerCase();
      let recetasFiltradas = this.recetas.filter(r => {
        const nombre = r.name.toLowerCase();
        const ingredientes = (r.ingredients || []).join(' ').toLowerCase();
        const tipo = (r.type || '').toLowerCase();
        return nombre.includes(texto) || ingredientes.includes(texto) || tipo.includes(texto);
      });

      // Aplicar filtros adicionales
      recetasFiltradas = this.aplicarFiltrosAvanzados(recetasFiltradas);
      this.recetasFiltradas = recetasFiltradas;
    },
    aplicarFiltros() {
      this.filtrarRecetas();
    },
    aplicarFiltrosAvanzados(recetas) {
      return recetas.filter(receta => {
        // Filtro por tipo
        if (this.filtros.tipo && receta.type !== this.filtros.tipo) {
          return false;
        }

        // Filtro por dificultad
        if (this.filtros.dificultad && receta.difficulty !== this.filtros.dificultad) {
          return false;
        }

        // Filtro por tiempo
        if (this.filtros.tiempo) {
          const tiempoMaximo = parseInt(this.filtros.tiempo);
          const tiempoReceta = parseInt(receta.preparationTime) || 0;
          if (tiempoReceta > tiempoMaximo) {
            return false;
          }
        }

        // Filtro por rating
        if (this.filtros.rating) {
          const ratingMinimo = parseFloat(this.filtros.rating);
          const ratingReceta = this.ratings[receta._id] || 0;
          if (ratingReceta < ratingMinimo) {
            return false;
          }
        }

        // Filtros de características especiales (MEJORADOS CON IA)
        const tags = receta.tags || [];

        if (this.filtros.vegetariano) {
          if (!tags.includes('vegetariano')) {
            return false;
          }
        }

        if (this.filtros.vegano) {
          if (!tags.includes('vegano')) {
            return false;
          }
        }

        if (this.filtros.sinGluten) {
          if (!tags.includes('sin gluten')) {
            return false;
          }
        }

        if (this.filtros.sinLactosa) {
          if (!tags.includes('sin lactosa')) {
            return false;
          }
        }

        return true;
      });
    },
    toggleFiltros() {
      this.mostrarFiltros = !this.mostrarFiltros;
    },
    cerrarFiltros() {
      this.mostrarFiltros = false;
    },
    limpiarFiltros() {
      this.filtros = {
        tipo: '',
        dificultad: '',
        tiempo: '',
        rating: '',
        vegetariano: false,
        vegano: false,
        sinGluten: false,
        sinLactosa: false
      };
      this.aplicarFiltros();
    },
    editarReceta(id) {
      this.$router.push({ name: 'EditarReceta', params: { id } });
    },
    async eliminarReceta(receta) {
      if (confirm(`¿Estás seguro que quieres eliminar la receta "${receta.name}"?`)) {
        const token = this.obtenerToken();
        if (!token || !this.tokenValido()) {
          alert('No tienes permiso o tu sesión expiró. Inicia sesión de nuevo.');
          return;
        }
        try {
          await axios.delete(`http://localhost:3000/api/receta/${receta._id}`, { headers: { Authorization: `Bearer ${token}` } });
          this.obtenerRecetas();
        } catch (e) {
          console.error('Error al eliminar receta:', e);
          alert('No se pudo eliminar la receta. Inténtalo de nuevo.');
        }
      }
    },
    loadSaved() {
      const saved = localStorage.getItem('recetasGuardadas');
      this.savedIds = saved ? JSON.parse(saved) : [];
    },
    persistSaved() {
      localStorage.setItem('recetasGuardadas', JSON.stringify(this.savedIds));
    },
    estaGuardada(id) {
      return this.savedIds.includes(id);
    },
    // Nueva función que maneja tanto guardar como quitar de guardados
    toggleGuardarReceta(receta) {
      if (this.estaGuardada(receta._id)) {
        // Quitar de guardados
        this.quitarRecetaGuardada(receta);
      } else {
        // Guardar receta
        this.guardarReceta(receta);
      }
    },
    guardarReceta(receta) {
      if (!this.estaGuardada(receta._id)) {
        this.savedIds.push(receta._id);
        this.persistSaved();
        alert(`Receta "${receta.name}" guardada.`);
      }
    },
    quitarRecetaGuardada(receta) {
      const index = this.savedIds.indexOf(receta._id);
      if (index > -1) {
        this.savedIds.splice(index, 1);
        this.persistSaved();
        alert(`Receta "${receta.name}" eliminada de guardados.`);
      }
    },
    starGlobalClass(recetaId, n) {
      const rating = this.ratings[recetaId] || 0;
      const entero = Math.floor(rating);
      const decimal = rating - entero;
      if (n <= entero) return 'filled';
      if (n === entero + 1 && decimal >= 0.5) return 'half';
      return '';
    }
  }
};
</script>

<style scoped>
/* Clases existentes para estrellas */
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

.rating-text {
  font-size: 0.9rem;
  margin-left: 0.5rem;
  color: #3b564d;
}

/* Contenedor principal */
.recetas-container {
  max-width: 1100px;
  margin: 60px auto;
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

/* Barra de búsqueda */
.search-bar {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 40px;
  position: relative;
}

.search-input-container {
  display: flex;
  align-items: center;
  width: 70%;
  position: relative;
}

.search-bar input {
  width: 100%;
  padding: 12px 60px 12px 20px;
  border: 2px solid #3B564D;
  border-radius: 25px;
  font-size: 1.1rem;
  outline: none;
  transition: border-color 0.3s ease;
}

.search-bar input:focus {
  border-color: #055902;
}

.btn-filtros {
  position: absolute;
  right: 8px;
  background: #055902;
  color: white;
  border: none;
  padding: 8px;
  border-radius: 50%;
  cursor: pointer;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.btn-filtros:hover {
  background: #034001;
  transform: scale(1.05);
}

.btn-filtros.active {
  background: #034001;
  box-shadow: 0 0 0 2px #055902;
}

.btn-filtros svg {
  width: 20px;
  height: 20px;
}

/* Panel de filtros */
.filtros-panel {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  width: 500px;
  max-width: 90vw;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  z-index: 100;
  margin-top: 10px;
  border: 2px solid #3B564D;
}

.filtros-content {
  padding: 20px;
}

.filtros-content h3 {
  color: #055902;
  font-size: 1.4rem;
  margin-bottom: 20px;
  text-align: center;
  font-weight: 700;
}

.filtro-grupo {
  margin-bottom: 16px;
}

.filtro-grupo label {
  display: block;
  color: #034001;
  font-weight: 600;
  margin-bottom: 6px;
}

.filtro-grupo select {
  width: 100%;
  padding: 8px 12px;
  border: 2px solid #3B564D;
  border-radius: 6px;
  font-size: 1rem;
  background: white;
  color: #034001;
  outline: none;
  transition: border-color 0.3s ease;
}

.filtro-grupo select:focus {
  border-color: #055902;
}

.checkbox-group {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.checkbox-item {
  display: flex !important;
  align-items: center;
  margin-bottom: 0 !important;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.checkbox-item:hover {
  background-color: #f0f8f0;
}

.checkbox-item input[type="checkbox"] {
  margin-right: 8px;
  width: 16px;
  height: 16px;
}

.checkbox-item span {
  color: #034001;
  font-size: 0.95rem;
}

.filtros-actions {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #ddd;
}

.btn-limpiar,
.btn-cerrar {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;
}

.btn-limpiar {
  background: #f8f9fa;
  color: #3B564D;
  border: 2px solid #3B564D;
}

.btn-limpiar:hover {
  background: #3B564D;
  color: white;
}

.btn-cerrar {
  background: #055902;
  color: white;
}

.btn-cerrar:hover {
  background: #034001;
}

/* Secciones de recetas */
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
  position: relative;
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

/* Acciones de receta (botón guardar) */
.receta-actions {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 10;
}

.btn-guardar {
  background: rgba(255, 255, 255, 0.9);
  border: none;
  cursor: pointer;
  padding: 8px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-guardar:hover {
  background: rgba(255, 255, 255, 1);
  transform: scale(1.1);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.btn-guardar img {
  width: 24px;
  height: 24px;
  transition: all 0.3s ease;
}

.btn-guardar.guardada {
  background: rgba(5, 89, 2, 0.1);
}

.btn-guardar.guardada img {
  filter: none;
}

.btn-mostrar-mas {
  background-color: #055902;
  color: white;
  border: none;
  padding: 12px 28px;
  font-size: 1.1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 20px;
}

.btn-mostrar-mas:hover {
  background-color: #034001;
}

/* Admin */
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

/* Sin resultados */
.no-resultados {
  font-size: 1.3rem;
  text-align: center;
  margin-top: 80px;
  color: #3B564D;
}
</style>