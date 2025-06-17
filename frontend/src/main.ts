import { createApp } from 'vue';
import App from './App.vue';
import { createVuetify } from 'vuetify';
import 'vuetify/styles';
import router from './router';
import './assets/styles.css'; 
import './assets/variables.css';
import { applyThemeFromStorage } from '../theme.ts'; // Importa la función para aplicar el tema

applyThemeFromStorage();

const vuetify = createVuetify(); // Instancia Vuetify

createApp(App)
  .use(vuetify) // Usas Vuetify
  .use(router)  // Usas Vue Router
  .mount('#app');
