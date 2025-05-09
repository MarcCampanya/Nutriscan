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
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

export default {
  name: 'RecetaDetalle',
  setup() {
    const route = useRoute();
    const receta = ref({
      name: '',
      description: '',
      image: '',
      ingredients: [] as string[],
      preparation: ''
    });

    const obtenerReceta = async () => {
      const id = route.params.id;
      try {
        const response = await axios.get(`http://localhost:3000/api/receta/${id}`);
        const data = response.data;

        console.log('Datos recibidos:', data);

        if (data.ingredients && Array.isArray(data.ingredients)) {
          receta.value.ingredients = data.ingredients.slice();
        } else if (data.ingredients && typeof data.ingredients === 'string') {
          receta.value.ingredients = data.ingredients.split(',').map((i: string) => i.trim());
        }

        console.log('Ingredientes asignados:', receta.value.ingredients);

        receta.value.name = data.name;
        receta.value.description = data.description;
        receta.value.image = data.image;
        receta.value.preparation = data.preparation;

      } catch (error) {
        console.error('Error al obtener los detalles de la receta:', error);
      }
    };

    onMounted(() => {
      obtenerReceta();
    });

    return {
      receta
    };
  }
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
</style>
