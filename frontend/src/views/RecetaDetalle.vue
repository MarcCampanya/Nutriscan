<template>
  <div class="receta-detalle-container">
    <h2>{{ receta.name }}</h2>
    <img :src="receta.image" alt="Imagen de la receta" class="receta-image" />
    <p><strong>Descripción:</strong> {{ receta.description }}</p>

    <h3>Ingredientes:</h3>
    <ul v-if="Array.isArray(receta.ingredients) && receta.ingredients.length">
      <li v-for="(ingrediente, index) in receta.ingredients" :key="index">
        {{ ingrediente }}
      </li>
    </ul>
    <p v-else>No se han encontrado ingredientes.</p>

    <h3>Elaboración:</h3>
    <p>{{ receta.preparation }}</p>

    <!-- Solo se muestra la valoración del usuario -->
    <div v-if="tieneToken && datosCargaCompletados" class="valoracion-usuario">
      <h3>Tu valoración</h3>
      <div class="star-rating-user" @mouseleave="clearHover">
        <span v-for="n in 5" :key="n" class="star" :class="{ filled: n <= (hoverRating || userRating) }"
          @mouseover="setHover(n)" @click.prevent="enviarUserRating(n)">
          ★
        </span>
      </div>
      <p v-if="userRating > 0">
        Has valorado esta receta con {{ userRating }} estrella<span v-if="userRating > 1">s</span>.
      </p>
    </div>

    <div v-else-if="!tieneToken && datosCargaCompletados" class="prompt-login">
      <p>Inicia sesión para valorar esta receta.</p>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { reduceEachLeadingCommentRange } from 'typescript';

export default {
  name: 'RecetaDetalle',

  setup() {

    const route = useRoute();

    const receta = ref({
      _id: '',
      name: '',
      description: '',
      image: '',
      ingredients: [] as string[], // Cambiado aquí
      preparation: '',
    });
    const userRating = ref(0);
    const hoverRating = ref(0);
    const datosCargaCompletados = ref(false);

    const obtenerToken = (): string | null => {
      const token = localStorage.getItem('token');
      return token ? token.trim() : null;
    };

    const tieneToken = !!obtenerToken();

    const configConToken = () => {
      const token = obtenerToken();
      return token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : undefined;
    };

    const setHover = (n: number) => {
      hoverRating.value = n;
    };

    const clearHover = () => {
      hoverRating.value = 0;
    };

    const obtenerReceta = async () => {

      const id = route.params.id;
      try {
        const config = configConToken();
        const response = config
          ? await axios.get(`http://localhost:3000/api/receta/${id}`, config)
          : await axios.get(`http://localhost:3000/api/receta/${id}`);

        const data = response.data;
        receta.value._id = data._id;
        receta.value.name = data.name;
        receta.value.description = data.description;
        receta.value.image = data.image;
        receta.value.preparation = data.preparation;

        const ingredientsRaw = data.ingredients || data.ingredients;

        if (Array.isArray(ingredientsRaw)) {
          receta.value.ingredients = ingredientsRaw.slice();
        } else if (typeof ingredientsRaw === 'string') {
          const raw = ingredientsRaw.trim();
          receta.value.ingredients = raw
            .split(',')
            .map((i: string) => i.trim())
            .filter((i: string) => i.length > 0);
        } else {
          receta.value.ingredients = [];
        }


        userRating.value = data.userRating || 0;
        datosCargaCompletados.value = true;
      } catch (error) {
        console.error('Error al obtener los detalles de la receta:', error);
      }

    };

    const enviarUserRating = async (n: number) => {
      if (!tieneToken) {
        return;
      }
      const id = route.params.id;
      try {
        const config = configConToken();
        await axios.post(
          `http://localhost:3000/api/receta/${id}/rating`,
          { rating: n },
          config
        );

        // Actualizamos solo userRating sin mostrar alert
        userRating.value = n;
        hoverRating.value = 0;
      } catch (error: any) {
        console.error('Error al enviar valoración de usuario:', error);
      }
    };

    onMounted(() => {
      obtenerReceta();
    });

    return {
      receta,
      userRating,
      hoverRating,
      datosCargaCompletados,
      tieneToken,
      setHover,
      clearHover,
      enviarUserRating,
    };
  },
};
</script>

<style scoped>
.receta-detalle-container {
  max-width: 800px;
  margin: 40px auto;
  padding: 25px;
  background: #f8f8f8;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.receta-detalle-container h2 {
  text-align: center;
  margin-bottom: 20px;
  color: #3b564d;
  font-size: 2rem;
}

.receta-detalle-container .receta-image {
  display: block;
  width: 100%;
  max-width: 600px;
  margin: 20px auto;
  border-radius: 8px;
}

.receta-detalle-container p,
.receta-detalle-container h3 {
  font-size: 1.2rem;
  line-height: 1.6;
  color: #333;
}

.receta-detalle-container ul {
  list-style-type: none;
  padding: 0;
}

.receta-detalle-container li {
  font-size: 1rem;
  color: #555;
  margin: 5px 0;
}

.receta-detalle-container h3 {
  margin-top: 20px;
  font-size: 1.5rem;
  color: #3b564d;
}

.receta-detalle-container p {
  background-color: #f0f0f0;
  padding: 15px;
  border-radius: 5px;
  margin-top: 10px;
  font-size: 1.1rem;
  color: #555;
}

/* Estilos de estrellas igual que en Recetas.vue */
.star {
  display: inline-block;
  font-size: 1.7rem;
  color: #ddd;
  cursor: pointer;
  transition: color 0.2s;
}

.star.filled {
  color: #055902;
}
</style>
