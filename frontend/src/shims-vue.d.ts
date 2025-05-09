import { Router } from 'vue-router'

// Extiende las propiedades personalizadas del componente
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $router: Router
  }
}

// Declaración para archivos .vue
declare module '*.vue' {
  import { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
