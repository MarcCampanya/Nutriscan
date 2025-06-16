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

          // 1) Guardar el token en localStorage
          localStorage.setItem('token', respuesta.data.token);

          // 2) Guardar datos del usuario igual que en Login.vue
          const usuario = respuesta.data.usuario;
          const key = `user_${usuario._id || usuario.id}`;
          localStorage.setItem(key, JSON.stringify({
            nombre: usuario.nombre,
            correo: usuario.correo
          }));

          // 3) Redirigir tras el registro
          this.$router.push('/perfil');
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
  <style scoped>
.fullscreen {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.auth-container {
  background: #fff;
  padding: 2.5rem 2rem 2rem 2rem;
  border-radius: 18px;
  box-shadow: 0 6px 32px rgba(5, 89, 2, 0.10), 0 1.5px 6px rgba(66, 140, 98, 0.10);
  width: 100%;
  max-width: 370px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.auth-container h2 {
  color: #055902;
  margin-bottom: 1.5rem;
  font-weight: bold;
  font-size: 2rem;
}

.form-group {
  width: 100%;
  margin-bottom: 1.2rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.4rem;
  color: #055902;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 0.6rem 0.9rem;
  border: 1.5px solid #428C62;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s;
}

.form-group input:focus {
  border-color: #055902;
}

.login-btn, .register-btn {
  width: 100%;
  padding: 0.7rem 0;
  background: #055902;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 0.5rem;
  transition: background 0.2s;
}

.login-btn:hover {
  background: #428C62;
}

.switch-auth, .home-link {
  margin-top: 1.1rem;
  text-align: center;
  color: #055902;
}

.switch-auth a, .home-link a {
  color: #428C62;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.2s;
}

.switch-auth a:hover, .home-link a:hover {
  color: #055902;
}
</style>