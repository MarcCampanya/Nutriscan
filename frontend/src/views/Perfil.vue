<template>
  <div class="profile-container">
    <!-- Header del perfil -->
    <section class="profile-header">
      <div class="avatar-section">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" width="40" height="40" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </div>
      <div class="user-info">
        <h1>{{ user.nombre }}</h1>
        <p>{{ user.correo }}</p>
      </div>
      <button class="btn-tema" @click="toggleTheme" :aria-label="darkMode ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'">
        <img
          v-if="!darkMode"
          :src="lightModeIcon"
          alt="Tema claro"
          class="icon-tema"
          key="light"
        />
        <img
          v-else
          :src="darkModeIcon"
          alt="Tema oscuro"
          class="icon-tema"
          key="dark"
        />
      </button>
    </section>

    <!-- Recetas guardadas -->
    <section class="saved-recipes">
      <h2>Recetas guardadas</h2>
      <div v-if="recipes.length" class="recetas-grid">
        <div v-for="receta in recipes" :key="receta._id" class="receta-card">
          <button class="btn-guardar" @click="quitarDeFavoritos(receta)">
            <img :src="bookmarkAdded" alt="Quitar de favoritos" />
          </button>
          <img :src="receta.image" alt="Imagen receta" class="receta-img" @click="irAReceta(receta._id)" />
          <div class="receta-content">
            <h3 @click="irAReceta(receta._id)">{{ receta.name }}</h3>
          </div>
        </div>
      </div>
      <div v-else class="no-resultados">
        No tienes recetas guardadas.
      </div>
    </section>

    <!-- Mis Recetas -->
    <section class="mis-recetas">
      <h2>Mis Recetas</h2>
      <div v-if="misRecetas.length" class="recetas-grid">
        <div v-for="receta in misRecetas" :key="receta._id" class="receta-card">
          <img :src="receta.image" alt="Imagen receta" class="receta-img" @click="irAReceta(receta._id)" />
          <div class="receta-content">
            <h3 @click="irAReceta(receta._id)">{{ receta.name }}</h3>
          </div>
          <div class="receta-admin">
            <button class="btn-editar" @click="editarReceta(receta._id)">Editar</button>
            <button @click="eliminarReceta(receta._id)">Eliminar</button>
          </div>
        </div>
      </div>
      <div v-else class="no-resultados">
        No has subido ninguna receta.
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import bookmark from '@/assets/img/bookmark.svg'
import bookmarkAdded from '@/assets/img/bookmark_added.svg'
import lightModeIcon from '@/assets/img/light_mode.svg'
import darkModeIcon from '@/assets/img/dark_mode.svg'

const user = ref({ nombre: '', correo: '' })
const recipes = ref([])
const misRecetas = ref([])
const router = useRouter()
const darkMode = ref(false)

function editProfile() {
  alert('Funcionalidad de edición aún no implementada')
}

function clearAllData() {
  if (confirm('¿Estás seguro de que quieres borrar todos tus datos?')) {
    localStorage.clear()
    alert('Datos borrados. Recarga la página.')
    location.reload()
  }
}

function cargarGuardadas() {
  const token = localStorage.getItem('token')
  if (!token) return
  let id
  try {
    id = JSON.parse(atob(token.split('.')[1])).id
  } catch {
    return
  }
  const key = `recipes_${id}`
  recipes.value = JSON.parse(localStorage.getItem(key) || '[]')
}

function irAReceta(recetaId) {
  router.push(`/receta/${recetaId}`)
}

function quitarDeFavoritos(receta) {
  const token = localStorage.getItem('token')
  if (!token) return
  let id
  try {
    id = JSON.parse(atob(token.split('.')[1])).id
  } catch {
    return
  }
  const key = `recipes_${id}`
  let current = JSON.parse(localStorage.getItem(key) || '[]')
  current = current.filter(r => r._id !== receta._id)
  localStorage.setItem(key, JSON.stringify(current))
  recipes.value = current
}

const obtenerMisRecetas = async () => {
  const token = localStorage.getItem('token')
  const config = { headers: { Authorization: `Bearer ${token}` } }
  const res = await axios.get('http://localhost:3000/api/receta/mis-recetas', config)
  misRecetas.value = res.data
}

const eliminarReceta = async (id) => {
  if (!confirm('¿Seguro que quieres eliminar esta receta?')) return;
  const token = localStorage.getItem('token');
  try {
    await axios.delete(`http://localhost:3000/api/receta/mis-recetas/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    misRecetas.value = misRecetas.value.filter(r => r._id !== id);
    alert('Receta eliminada');
  } catch (error) {
    alert('Error al eliminar la receta');
  }
};

const editarReceta = (id) => {
  router.push(`/receta/editar/${id}`);
};

// Obtén el id del usuario desde el token
function getUserId() {
  const token = localStorage.getItem('token')
  if (!token) return null
  try {
    return JSON.parse(atob(token.split('.')[1])).id
  } catch {
    return null
  }
}

// Al cambiar el tema:
const toggleTheme = () => {
  darkMode.value = !darkMode.value
  document.body.classList.toggle('dark-theme', darkMode.value)
  localStorage.setItem('darkMode', darkMode.value)
}

onMounted(() => {
  cargarGuardadas()
  obtenerMisRecetas()
  const token = localStorage.getItem('token')
  if (!token) {
    console.error('Sin token, no hay sesión iniciada')
    return
  }
  let id
  try {
    id = JSON.parse(atob(token.split('.')[1])).id
  } catch {
    console.error('JWT inválido')
    return
  }

  const userKey = `user_${id}`
  const recipesKey = `recipes_${id}`

  const storedUser = localStorage.getItem(userKey)
  if (!storedUser) {
    console.error(`No hay datos de usuario bajo "${userKey}"`)
  } else {
    const data = JSON.parse(storedUser)
    user.value.nombre = data.nombre
    user.value.correo = data.correo
  }

  const storedRecipes = localStorage.getItem(recipesKey)
  if (!storedRecipes) {
    console.warn(`No hay recetas guardadas para usuario ${id}`)
  } else {
    recipes.value = JSON.parse(storedRecipes)
  }
})
</script>

<style scoped>

</style>