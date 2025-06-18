<template>
  <div class="recetas-container">
    <div class="recetas-header">
      <h1>Explora Recetas</h1>
      <p class="recetas-intro">Descubre platos deliciosos según tus gustos y necesidades</p>
      <p class="mensaje-compartir">Puedes compartir tus propias recetas también.</p>
      <button class="btn-subir" @click="$router.push({ name: 'subirReceta' })">
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
      <h2 class="tipo-receta">{{ tipo.charAt(0).toUpperCase() + tipo.slice(1) }}</h2>
      <div class="recetas-grid">
        <div v-for="receta in recetas" :key="receta._id" class="receta-card">
          <router-link :to="'/receta/' + receta._id" class="receta-link">
            <img :src="receta.image" alt="Imagen receta" class="receta-img" />
            <div class="tipo-receta">
              <h3 class="tipo-receta">{{ receta.name }}</h3>
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
            <button class="btn-editar" @click="editarReceta(receta._id)">Editar</button>
            <button @click="eliminarReceta(receta._id)">Eliminar</button>
          </div>
        </div>
      </div>
    </div>

    <!-- SECCIONES POR TAGS -->
    <div v-for="(recetas, tag) in recetasPorTag" :key="tag" class="seccion-recetas" v-if="recetas.length">
      <h2 class="tipo-receta">{{ tag.charAt(0).toUpperCase() + tag.slice(1) }}</h2>
      <div class="recetas-grid">
        <div v-for="receta in recetas" :key="receta._id" class="receta-card">
          <router-link :to="'/receta/' + receta._id" class="receta-link">
            <img :src="receta.image" alt="Imagen receta" class="receta-img" />
            <div class="receta-content">
              <h3 class="tipo-receta">{{ receta.name }}</h3>
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
            <button class="btn-editar" @click="editarReceta(receta._id)">Editar</button>
            <button @click="eliminarReceta(receta._id)">Eliminar</button>
          </div>
        </div>
      </div>
    </div>

    <!-- SECCIÓN OTROS -->
    <div v-for="(recetas, tipo) in recetasOtros" :key="tipo" class="seccion-recetas" v-if="recetas.length">
      <h2 class="tipo-receta">{{ tipo.charAt(0).toUpperCase() + tipo.slice(1) }}</h2>
      <div class="recetas-grid">
        <div v-for="receta in recetas" :key="receta._id" class="receta-card">
          <router-link :to="'/receta/' + receta._id" class="receta-link">
            <img :src="receta.image" alt="Imagen receta" class="receta-img" />
            <div class="receta-content">
              <h3 class="tipo-receta">{{ receta.name }}</h3>
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
            <button class="btn-editar" @click="editarReceta(receta._id)">Editar</button>
            <button @click="eliminarReceta(receta._id)">Eliminar</button>
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
      desayuno: ['desayuno', 'desayunar', 'tostada', 'cereales', 'avena', 'pancake', 'tortita', 'zumo', 'café', 'té', 'croissant', 'muesli', 'yogur', 'granola', 'Smoothie'],
      almuerzo: ['almuerzo', 'ensalada', 'sopa', 'sandwich', 'bocadillo', 'pasta', 'arroz', 'pollo', 'pescado', 'carne'],
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
    async eliminarReceta(recetaId) {

      if (!confirm('¿Estás seguro de que deseas eliminar esta receta?')) return;
      try {
        await axios.delete(`http://localhost:3000/api/receta/${recetaId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        window.location.reload(); // Refresca la página automáticamente
      } catch (error) {
        alert('Error al eliminar la receta.');
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
      const token = localStorage.getItem('token')
      if (!token) return alert('Debes iniciar sesión para guardar recetas.')

      let id
      try {
        id = JSON.parse(atob(token.split('.')[1])).id
      } catch {
        console.error('Token inválido')
        return
      }

      const key = `recipes_${id}`
      const current = JSON.parse(localStorage.getItem(key) || '[]')

      const index = current.findIndex(r => r._id === receta._id)

      if (index > -1) {
        current.splice(index, 1)
      } else {
        current.push(receta)
      }

      localStorage.setItem(key, JSON.stringify(current))

      // --- Cambia el icono actualizando el array reactivo de guardadas ---
      if (this.recetasGuardadas) {
        // Si usas un array reactivo para los IDs de recetas guardadas:
        this.recetasGuardadas = current.map(r => r._id)
      }
    },
    guardarReceta(receta) {
      if (!this.estaGuardada(receta._id)) {
        this.savedIds.push(receta._id);
        this.persistSaved();
      }
    },
    quitarRecetaGuardada(receta) {
      const index = this.savedIds.indexOf(receta._id);
      if (index > -1) {
        this.savedIds.splice(index, 1);
        this.persistSaved();
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

<script setup>
import { ref, onMounted } from 'vue'
import bookmark from '@/assets/img/bookmark.svg'
import bookmarkAdded from '@/assets/img/bookmark_added.svg'

const recetasGuardadas = ref([])

function estaGuardada(recetaId) {
  return recetasGuardadas.value.includes(recetaId)
}

function toggleGuardarReceta(receta) {
  const token = localStorage.getItem('token')
  if (!token) return alert('Debes iniciar sesión para guardar recetas.')
  let id
  try {
    id = JSON.parse(atob(token.split('.')[1])).id
  } catch {
    console.error('Token inválido')
    return
  }
  const key = `recipes_${id}`
  const current = JSON.parse(localStorage.getItem(key) || '[]')
  const index = current.findIndex(r => r._id === receta._id)
  if (index > -1) {
    current.splice(index, 1)
  } else {
    current.push(receta)
  }
  localStorage.setItem(key, JSON.stringify(current))
  recetasGuardadas.value = current.map(r => r._id)
}

onMounted(() => {
  const token = localStorage.getItem('token')
  if (!token) return
  let id
  try {
    id = JSON.parse(atob(token.split('.')[1])).id
  } catch {
    return
  }
  const key = `recipes_${id}`
  const current = JSON.parse(localStorage.getItem(key) || '[]')
  recetasGuardadas.value = current.map(r => r._id)
})
</script>