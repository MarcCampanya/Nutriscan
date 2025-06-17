<template>
  <div class="editar-receta-container">
    <h2>Editar Receta</h2>
    <form v-if="receta" @submit.prevent="guardarCambios">
      <div class="form-group">
        <label>Nombre</label>
        <input v-model="receta.name" required />
      </div>
      <div class="form-group">
        <label>Descripción</label>
        <textarea v-model="receta.description"></textarea>
      </div>
      <div class="form-group">
        <label>Imagen (URL)</label>
        <input v-model="receta.image" />
      </div>
      <div class="form-group">
        <label>Ingredientes</label>
        <textarea v-model="receta.ingredients"></textarea>
      </div>
      <div class="form-group">
        <label>Preparación</label>
        <textarea v-model="receta.preparation"></textarea>
      </div>
      <button type="submit">Guardar Cambios</button>
    </form>
    <div v-else>Cargando receta...</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const recetaId = route.params.id
const receta = ref(null)

onMounted(async () => {
  try {
    const { id } = route.params
    const res = await axios.get(`http://localhost:3000/api/receta/${id}`)
    receta.value = res.data
  } catch (error) {
    console.error('Error al cargar la receta:', error)
    alert('Error al cargar la receta')
  }
})

const guardarCambios = async () => {
  const token = localStorage.getItem('token');
  
  // Usa los datos directamente del objeto receta
  const datosEditados = {
    name: receta.value.name,
    description: receta.value.description,
    image: receta.value.image,
    ingredients: receta.value.ingredients,
    preparation: receta.value.preparation
  };

  try {
    await axios.put(
      `http://localhost:3000/api/receta/mis-recetas/${recetaId}`,
      datosEditados,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    alert('Receta actualizada');
    router.push('/perfil');
  } catch (error) {
    console.error('Error al actualizar la receta:', error);
    alert('Error al actualizar la receta');
  }
};
</script>
