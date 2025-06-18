<template>
  <main class="fullscreen section-light" @click="closeMenu">
    <section class="scanner-container container section-light">
      <h1 class="scanner-title">Escáner</h1>

      <!-- Información principal -->
      <div class="main-info">
        <p class="scanner-instruction">
          Apunta la cámara al código de barras del producto para obtener
          información nutricional completa
        </p>
      </div>

      <!-- Botones de acción -->
      <div class="action-buttons">
        <button v-if="!mostrandoCamara" class="btn btn-primary btn-empezar" @click="pedirPermisoCamara">
          Iniciar Escáner
        </button>

      </div>
      <!-- Contenedor de la cámara -->
      <transition name="fade">
        <div v-if="mostrandoCamara" class="camara-container">
          <div class="video-wrapper">
            <video ref="video" autoplay playsinline></video>
            <div class="scanner-overlay">
              <div class="scan-frame"></div>
              <p class="scan-instructions">Centra el código de barras dentro del marco</p>
            </div>
          </div>
          <button class="btn btn-danger btn-detener" @click="detenerCamara">
            Cerrar Cámara
          </button>
        </div>
      </transition>
      <button class="btn info-btn" @click.stop="alternarInfo">
        <span class="btn-icon">ℹ️</span>
        ¿Cómo funciona?
      </button>
      <!-- Información expandible -->
      <transition name="slide-down">
        <div class="info-box" v-show="showInfo">
          <h3>🔍 ¿Qué es NutriScan?</h3>
          <div class="info-content">
            <div class="info-item">
              <div>
                <strong>● Escáner inteligente:</strong> Utiliza la cámara de tu dispositivo para leer códigos de barras
                EAN, UPC y otros formatos estándar.
              </div>
            </div>
            <div class="info-item">
              <div>
                <strong>● Información nutricional:</strong> Accede a datos completos sobre ingredientes, valores
                nutricionales, alérgenos y más.
              </div>
            </div>
            <div class="info-item">
              <div>
                <strong>● Base de datos global:</strong> Conectado con OpenFoodFacts, la mayor base de datos abierta de
                productos alimenticios del mundo.
              </div>
            </div>
            <div class="info-item">
              <div>
                <strong> ● Resultados instantáneos:</strong> Una vez detectado el código, serás redirigido
                automáticamente
                a la información del producto.
              </div>
            </div>
          </div>

          <div class="supported-formats">
            <h4> Formatos compatibles:</h4>
            <div class="format-tags">
              <span class="format-tag">EAN-13</span>
              <span class="format-tag">EAN-8</span>
              <span class="format-tag">UPC</span>
              <span class="format-tag">Code 128</span>
              <span class="format-tag">Code 39</span>
            </div>
          </div>
        </div>
      </transition>

      <!-- Footer con información adicional -->
      <div class="footer-info" v-if="!mostrandoCamara">
        <div class="feature-cards">
          <div class="feature-card">
            <div class="feature-icon">🛡️</div>
            <h4>Privacidad</h4>
            <p>Tu cámara solo se usa localmente. No almacenamos imágenes.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">📊</div>
            <h4>Precisión</h4>
            <p>Algoritmos avanzados para una detección rápida y precisa.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🌐</div>
            <h4>Universal</h4>
            <p>Compatible con productos de todo el mundo.</p>
          </div>
          <!-- Nueva tarjeta añadida -->
          <div class="feature-card">
            <div class="feature-icon">🕒</div>
            <h4>Historial de Escaneos</h4>
            <p>Revisa y gestiona los códigos que has escaneado previamente.</p>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import Quagga from 'quagga'; // Importar Quagga como módulo

export default {
  data() {
    return {
      scannedCode: null,
      showInfo: false,
      isMenuOpen: false, // Estado del menú lateral
      stream: null, // Guardar el stream de la cámara
      mostrandoCamara: false,
      mensajeResultado: 'Listo para escanear tu primer producto 🎯',
      quaggaIniciado: false
    };
  },
  methods: {
    async pedirPermisoCamara() {
      if (confirm('¿Quieres permitir el acceso a la cámara para escanear códigos de barras?')) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: "environment" // Cámara trasera por defecto
            }
          });

          this.stream = stream;
          this.mostrandoCamara = true;
          this.mensajeResultado = '📡 Inicializando escáner...';

          // Esperar a que el video esté listo
          this.$nextTick(() => {
            this.$refs.video.srcObject = stream;
            this.iniciarQuagga();
          });

        } catch (err) {
          console.error('Error al acceder a la cámara:', err);
          alert('No se pudo acceder a la cámara. Asegúrate de dar permisos.');
          this.mensajeResultado = '❌ Error al acceder a la cámara.';
        }
      }
    },

    iniciarQuagga() {
      if (this.quaggaIniciado) {
        Quagga.stop();
        this.quaggaIniciado = false;
      }

      Quagga.init(
        {
          inputStream: {
            name: "Live",
            type: "LiveStream",
            target: this.$refs.video,
            constraints: {
              facingMode: "environment", // Cámara trasera por defecto
            },
          },
          decoder: {
            readers: ["ean_reader", "ean_8_reader", "code_128_reader", "code_39_reader"],
          },
        },
        (err) => {
          if (err) {
            console.error("Error al inicializar Quagga:", err);
            this.mensajeResultado = '⚠️ Error al inicializar el escáner.';
            return;
          }

          Quagga.start();
          this.quaggaIniciado = true;
          this.mensajeResultado = '✅ Escáner activo. Apunta al código de barras.';
        }
      );

      // Configurar el detector de códigos
      Quagga.onDetected((data) => {
        const codigo = data.codeResult.code;
        this.scannedCode = codigo;
        this.mensajeResultado = `🎉 ¡Código detectado! ${codigo}`;

        // Redirigir a la página del producto
        this.redirigirProducto(codigo);

        // Detener temporalmente para evitar escaneos repetidos
        Quagga.stop();
        this.quaggaIniciado = false;

        setTimeout(() => {
          if (this.mostrandoCamara) {
            this.iniciarQuagga();
          }
        }, 3000); // Reinicia después de 3 segundos
      });
    },

    redirigirProducto(codigo) {
      const url = `https://world.openfoodfacts.org/product/${codigo}`;
      const history = JSON.parse(localStorage.getItem('scanHistory') || '[]');
      history.unshift({ codigo, url, fecha: new Date().toISOString() });
      localStorage.setItem('scanHistory', JSON.stringify(history.slice(0, 20)));
      window.open(url, '_blank'); // Abrir en nueva pestaña
    },

    detenerCamara() {
      // Detener Quagga
      if (this.quaggaIniciado) {
        Quagga.stop();
        this.quaggaIniciado = false;
        window.location.reload()
      }

      // Detener el stream de la cámara
      if (this.stream) {
        this.stream.getTracks().forEach(track => track.stop());
        this.stream = null;
      }

      this.mostrandoCamara = false;
      this.scannedCode = null;
      this.mensajeResultado = 'Listo para escanear tu primer producto 🎯';
    },

    alternarInfo() {
      this.showInfo = !this.showInfo;
    },

    closeMenu() {
      this.isMenuOpen = false;
    }
  },

  // Hook para limpiar recursos cuando el componente se desmonte
  beforeUnmount() {
    this.detenerCamara();
  }
};
</script>

<style scoped>
.fullscreen {
  min-height: 100vh;
  margin-top: 80px;
  padding: 1rem;
  background: var(--bg-color);
  display: flex;
  align-items: center;
  justify-content: center;
}

.scanner-container {
  max-width: 700px;
  width: 100%;
  margin: 0 auto;
  text-align: center;
  background: var(--card-bg);
  color: var(--text-color);
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-light);
}

/* Header Section */
.header-section {
  margin-bottom: 2rem;
}

.logo-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.scanner-icon {
  font-size: 2.5rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.scanner-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--verde-medio);
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Main Info */
.main-info {
  margin-bottom: 2rem;
}

.scanner-instruction {
  font-size: 1.2rem;
  color: var(--text-color);
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

/* Result Container */
.result-container {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: var(--input-bg);
  padding: 1.25rem;
  border-radius: 12px;
  border: 2px solid var(--border-light);
  margin-bottom: 1.5rem;
  transition: all 0.3s ease;
}

.status-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--text-secondary);
  transition: all 0.3s ease;
  opacity: 0.5;
}

.status-indicator.active {
  background: #f59e0b;
  box-shadow: 0 0 0 4px rgba(245, 158, 11, 0.2);
  animation: pulse 2s infinite;
  opacity: 1;
}

.status-indicator.success {
  background: var(--verde-medio);
  box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.2);
  opacity: 1;
}

@keyframes pulse {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.6;
  }
}

.scanner-result {
  flex: 1;
  margin: 0;
  font-weight: 600;
  color: var(--text-color);
  font-size: 1rem;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  position: relative;
  overflow: hidden;
}

.btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.btn:hover::before {
  left: 100%;
}

.btn-primary {
  background: var(--btn-bg);
  color: var(--btn-text);
  box-shadow: var(--shadow-sm);
}

.btn-danger {
  background: #dc2626;
  color: white;
  box-shadow: var(--shadow-sm);
}

.btn-danger:hover {
  background: #b91c1c;
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.info-btn {
  background: var(--verde-medio);
  color: white;
  border: 2px solid var(--border-light);
  font-size: 0.9rem;
}

.btn-empezar {
  font-size: 1.2rem;
  padding: 1rem 2rem;
}

.btn-detener {
  padding: 0.875rem 1.5rem;
}

.btn-icon {
  font-size: 1.1em;
}

/* Info Box */
.info-box {
  background: var(--input-bg);
  border: 1px solid var(--border-light);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  text-align: left;
  color: var(--text-color);
}

.info-box h3 {
  color: var(--verde-medio);
  margin-bottom: 1rem;
  font-size: 1.25rem;
  font-weight: 700;
}

.info-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.supported-formats h4 {
  color: var(--text-color);
  margin-bottom: 0.75rem;
  font-size: 1rem;
  font-weight: 600;
}

.format-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.format-tag {
  background: var(--verde-medio);
  color: white;
  padding: 0.375rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
}

/* Camera Container */
.camara-container {
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.video-wrapper {
  position: relative;
  width: 100%;
  max-width: 400px;
}

.camara-container video {
  width: 100%;
  border-radius: 15px;
  box-shadow: var(--shadow-md);
  background-color: #000;
}

.scanner-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.scan-frame {
  width: 80%;
  height: 40%;
  border: 3px solid var(--verde-medio);
  border-radius: 10px;
  position: relative;
  animation: scanPulse 2s infinite;
}

.scan-frame::before,
.scan-frame::after {
  content: '';
  position: absolute;
  width: 20px;
  height: 20px;
  border: 3px solid var(--verde-medio);
}

.scan-frame::before {
  top: -3px;
  left: -3px;
  border-right: none;
  border-bottom: none;
}

.scan-frame::after {
  bottom: -3px;
  right: -3px;
  border-left: none;
  border-top: none;
}

@keyframes scanPulse {

  0%,
  100% {
    border-color: var(--verde-medio);
    opacity: 1;
  }

  50% {
    opacity: 0.6;
  }
}

.scan-instructions {
  margin-top: 1rem;
  color: white;
  background: rgba(0, 0, 0, 0.8);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
}

/* Feature Cards */
.footer-info {
  margin-top: 2rem;
}

.feature-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.feature-card {
  text-align: center;
  padding: 1.5rem;
  background: var(--input-bg);
  border-radius: 12px;
  border: 1px solid var(--border-light);
  transition: all 0.3s ease;
  color: var(--text-color);
}

.feature-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
  border-color: var(--verde-medio);
}

.feature-icon {
  font-size: 2rem;
  margin-bottom: 0.75rem;
}

.feature-card h4 {
  color: var(--text-color);
  font-weight: 600;
  margin-bottom: 0.5rem;
  font-size: 1rem;
}

.feature-card p {
  color: var(--text-secondary);
  font-size: 0.9rem;
  line-height: 1.4;
  margin: 0;
}

/* Transitions */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-20px);
  max-height: 0;
}

.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-20px);
  max-height: 0;
}

.slide-down-enter-active {
  max-height: 600px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Responsive Design */
@media (max-width: 768px) {
  .scanner-container {
    padding: 1.5rem;
  }

  .scanner-title {
    font-size: 2rem;
  }

  .scanner-icon {
    font-size: 2rem;
  }

  .logo-container {
    gap: 0.5rem;
  }

  .action-buttons {
    flex-direction: column;
    align-items: center;
  }

  .btn {
    width: 100%;
    max-width: 280px;
  }

  .video-wrapper {
    max-width: 320px;
  }

  .feature-cards {
    grid-template-columns: 1fr;
  }

  .info-item {
    gap: 0.5rem;
  }

  .format-tags {
    justify-content: flex-start;
  }

  .result-container {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .scanner-container {
    padding: 1rem;
  }

  .scanner-instruction {
    font-size: 1rem;
  }

  .result-container {
    flex-direction: column;
    text-align: center;
    gap: 0.75rem;
  }

  .logo-container {
    flex-direction: column;
    gap: 0.25rem;
  }

  .scanner-title {
    font-size: 1.8rem;
  }

  .btn {
    padding: 0.75rem 1.25rem;
  }

  .btn-empezar {
    font-size: 1.1rem;
    padding: 0.875rem 1.5rem;
  }
}

/* Mejoras adicionales para accesibilidad */
@media (prefers-reduced-motion: reduce) {

  .btn::before,
  .status-indicator,
  .scan-frame,
  .feature-card {
    animation: none;
    transition: none;
  }
}

/* Focus states para accesibilidad */
.btn:focus {
  outline: 2px solid var(--verde-medio);
  outline-offset: 2px;
}

.info-btn:focus {
  outline-color: var(--text-color);
}
</style>