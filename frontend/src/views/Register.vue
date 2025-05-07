<template>
    <main class="fullscreen">  
      <section class="auth-container">
        <h2>Registrarse</h2>
        <form @submit.prevent="handleRegister">
          <div class="form-group">
            <label for="name">Nombre Completo</label>
            <input type="text" id="name" v-model="name" placeholder="Introduce tu nombre" required />
          </div>
          <div class="form-group">
            <label for="email">Correo Electrónico</label>
            <input type="email" id="email" v-model="email" placeholder="Introduce tu correo" required />
          </div>
          <div class="form-group">
            <label for="password">Contraseña</label>
            <input type="password" id="password" v-model="password" placeholder="Introduce tu contraseña" required />
          </div>
          <button type="submit" class="register-btn">Registrarse</button>
        </form>
        <p class="switch-auth">
          ¿Ya tienes cuenta? <router-link to="/login">Inicia sesión</router-link>
        </p>
        <p class="home-link">
          <router-link to="/">Volver al inicio</router-link>
        </p>
      </section>
    </main>
  </template>
  
  <script>
  import axios from 'axios'
  
  export default {
    data() {
      return {
        name: '',
        email: '',
        password: ''
      };
    },
    methods: {
      async handleRegister() {
        try {
          const respuesta = await axios.post('http://localhost:3000/api/auth/register', {
            nombre: this.name,
            correo: this.email,
            contraseña: this.password
          });
  
          // Guardar el token en localStorage
          localStorage.setItem('token', respuesta.data.token);
  
          // Redirigir tras el registro
          this.$router.push('/'); // o cualquier ruta privada
  
        } catch (error) {
          alert(error.response?.data?.mensaje || 'Error al registrar');
        }
      },
      toggleMenu(event) {
        this.$emit('toggle-menu', event);
      }
    }
  };
  </script>
  