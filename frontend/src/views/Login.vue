<template>
  <main class="fullscreen">
    <section class="auth-container">
      <h2>Iniciar Sesión</h2>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="email">Correo Electrónico</label>
          <input type="email" id="email" v-model="email" placeholder="Introduce tu correo" required />
        </div>
        <div class="form-group">
          <label for="password">Contraseña</label>
          <input type="password" id="password" v-model="password" placeholder="Introduce tu contraseña" required />
        </div>
        <button type="submit" class="login-btn">Iniciar Sesión</button>
      </form>
      <p class="switch-auth">
        ¿No tienes una cuenta? <router-link to="/register">Regístrate</router-link>
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
      email: '',
      password: ''
    }
  },
  methods: {
    async handleLogin() {
      try {
        const respuesta = await axios.post(
          'http://localhost:3000/api/auth/login',
          {
            correo: this.email,
            contraseña: this.password
          }
        )

        // 1) Guardar token
        localStorage.setItem('token', respuesta.data.token)
        console.log('Token guardado:', respuesta.data.token)

        // 2) Guardar datos del usuario
        const usuario = respuesta.data.usuario
        console.log('Objeto usuario recibido:', usuario)

        // IMPORTANTE: aquí usamos usuario.id
        const key = `user_${usuario.id}`
        localStorage.setItem(key, JSON.stringify({
          nombre: usuario.nombre,
          correo: usuario.correo
        }))
        console.log(`Datos de usuario guardados en "${key}" =>`, {
          nombre: usuario.nombre,
          correo: usuario.correo
        })

        // 3) Redirigir al perfil
        this.$router.push('/perfil')
      } catch (error) {
        console.error('Error en handleLogin:', error)
        alert(error.response?.data?.mensaje || 'Error al iniciar sesión')
      }
    }
  }
}
</script>
