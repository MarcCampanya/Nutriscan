<template>
  <div class="editar-receta-container">
    <h2>Editar Receta</h2>
    <form v-if="receta" @submit.prevent="guardarCambios">
      <div class="form-group">
        <label>Nombre</label>
        <input v-model="receta.name" required />
      </div>
      <div class="form-group">
        <label>Imagen (URL)</label>
        <input v-model="receta.image" />
      </div>
      <div class="form-group">
        <label>Ingredientes</label>
        <textarea v-model="receta.ingredientes"></textarea>
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
const receta = ref(null)

onMounted(async () => {
  const { id } = route.params
  const res = await axios.get(`http://localhost:3000/api/receta/${id}`)
  receta.value = res.data
})

async function guardarCambios() {
  const { id } = route.params
  await axios.put(`http://localhost:3000/api/receta/${id}`, receta.value, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  })
  router.push('/recetas')
}
</script>

<style scoped>
.editar-receta-container {
  max-width: 500px;
  margin: 40px auto;
  background: #f8f8f8;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.08);
}
.form-group {
  margin-bottom: 1.2rem;
}
.form-group label {
  font-weight: 500;
  color: #055902;
}
.form-group input, .form-group textarea {
  width: 100%;
  padding: 0.6rem;
  border: 1.5px solid #428C62;
  border-radius: 8px;
  margin-top: 0.3rem;
}
button[type="submit"] {
  background: #055902;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.7rem 1.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 0.5rem;
  transition: background 0.2s;
}
button[type="submit"]:hover {
  background: #428C62;
}
</style>