import { createWebHistory, createRouter } from 'vue-router'; // Cambié createWebHashHistory por createWebHistory
import Home from '../views/Home.vue';
import Historial from '../views/Historial.vue';
import Recetas from '../views/Recetas.vue';
import Scanner from '../views/Scanner.vue';
import Perfil from '../views/Perfil.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import subirReceta from '../components/subirReceta.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: { title: 'Home' }, // Establecer un título para esta ruta
  },
  {
    path: '/Historial',
    name: 'Historial',
    component: Historial,
    meta: { title: 'Historial' },  // Título personalizado para esta ruta
  },
  {
    path: '/Recetas',
    name: 'Recetas',
    component: Recetas,
    meta: { title: 'Recetas' },  // Título personalizado para esta ruta
  },
  {
    path: '/Scanner', // Ruta para la nueva vista
    name: 'Scanner',
    component: Scanner,
    meta: { title: 'Scanner' }, // Título para esta ruta
  },
  {
    path: '/Perfil', // Ruta para la nueva vista
    name: 'Perfil',
    component: Perfil,
    meta: { title: 'Perfil' }, // Título para esta ruta
  },{
    path: '/Login',
    name: 'login',
    component: Login
  },
  {
    path: '/Register',
    name: 'register',
    component: Register
  },
  {
    path: '/subirReceta',
    name: 'subirReceta',
    component: subirReceta,
    meta: { title: 'Subir Receta' }
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),  // Usé createWebHistory en lugar de createWebHashHistory
  routes,
});

export default router;
