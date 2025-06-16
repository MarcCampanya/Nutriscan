<template>
  <div class="profile-container" style="max-width: 700px; margin: 2rem auto; padding: 2rem; background-color: #f9f9f9; border-radius: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
    <!-- Header del perfil -->
    <section class="profile-header" style="display: flex; align-items: center; gap: 1.5rem; margin-bottom: 2rem;">
      <div class="avatar-section" style="width: 80px; height: 80px; background-color: #ddd; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" width="40" height="40" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </div>
      <div class="user-info">
        <h1 style="margin: 0; font-size: 2rem; color: #333;">{{ user.nombre }}</h1>
        <p style="margin: 0.25rem 0 0; color: #555;">{{ user.correo }}</p>
      </div>
    </section>

    <!-- Recetas guardadas -->
    <section class="saved-recipes" style="margin-top: 2rem;">
      <h2 style="font-size: 1.2rem; margin-bottom: 1rem;">Recetas guardadas</h2>
      <div v-if="recipes.length" class="recetas-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem;">
        <div
          v-for="receta in recipes"
          :key="receta._id"
          class="receta-card"
        >
          <button class="btn-guardar" @click="quitarDeFavoritos(receta)">
            <img :src="bookmarkAdded" alt="Quitar de favoritos" />
          </button>
          <img :src="receta.image" alt="Imagen receta" class="receta-img" @click="irAReceta(receta._id)" style="cursor:pointer" />
          <div class="receta-content">
            <h3 @click="irAReceta(receta._id)" style="cursor:pointer">{{ receta.name }}</h3>
          </div>
        </div>
      </div>
      <div v-else class="no-resultados" style="color: #888; text-align: center; margin-top: 1rem;">
        No tienes recetas guardadas.
      </div>
    </section>

    <!-- Acciones -->
    <section class="profile-actions" style="margin-top: 2rem;">
      <h2 style="font-size: 1.2rem; margin-bottom: 1rem;">Acciones</h2>
      <button @click="editProfile" style="padding: 0.5rem 1rem; margin-right: 0.5rem;">Editar Perfil</button>
      <button @click="clearAllData" style="padding: 0.5rem 1rem; background-color: red; color: white;">Borrar Todo</button>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import bookmark from '@/assets/img/bookmark.svg'
import bookmarkAdded from '@/assets/img/bookmark_added.svg'

const user = ref({ nombre: '', correo: '' })
const recipes = ref([])
const router = useRouter()

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

onMounted(() => {
  cargarGuardadas()
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
    console.log('Usuario cargado:', user.value)
  }

  const storedRecipes = localStorage.getItem(recipesKey)
  if (!storedRecipes) {
    console.warn(`No hay recetas guardadas para usuario ${id}`)
  } else {
    recipes.value = JSON.parse(storedRecipes)
    console.log('Recetas cargadas:', recipes.value)
  }
})

function starClass(receta, n) {
  const rating = receta.averageRating || 0
  const entero = Math.floor(rating)
  const decimal = rating - entero
  if (n <= entero) return 'filled'
  if (n === entero + 1 && decimal >= 0.5) return 'half'
  return ''
}
</script>

<style scoped>
.recetas-container {
  max-width: 900px;
  margin: 40px auto;
  padding: 25px;
  background: #f8f8f8;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}
.recetas-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
}
.receta-card {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(66, 140, 98, 0.08);
  padding: 1rem;
  width: 220px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative; /* Necesario para posicionar el botón */
}
.btn-guardar {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 2;
  background: rgba(255, 255, 255, 1);

}
.btn-guardar img {
  width: 28px;
  height: 28px;
}
.receta-img {
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 0.7rem;
}
.receta-content h3 {
  margin: 0.5rem 0 1rem 0;
  color: #055902;
  font-size: 1.1rem;
  text-align: center;
}
.no-resultados {
  text-align: center;
  color: #888;
  margin-top: 2rem;
}
</style>
