<template>
  <main class="fullscreen" @click="closeMenu">
    <!-- Contenido -->
    <section class="scanner-container">
      <h1>Escáner de Código de Barras</h1>

      <p class="scanner-instruction">Apunta la cámara al código de barras del producto para escanearlo.</p>
      <video id="video" autoplay></video>
      <p id="result">Esperando escaneo...</p>

      <button class="info-btn" @click="alternarInfo">ℹ️ ¿Cómo funciona?</button>
      <div class="info-box" v-show="showInfo">
        <p>Utiliza la cámara de tu dispositivo para escanear códigos de barras de productos alimenticios.
          NutriScan analizará el código y te proporcionará información detallada sobre los ingredientes y valores
          nutricionales.
          Si el producto está en nuestra base de datos, serás redirigido automáticamente a su página con más
          información.</p>
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
      canvasContext: null, // Guardar el contexto del canvas para leer imágenes
    };
  },
  methods: {
    startScan() {
      const video = document.getElementById("video");
      const result = document.getElementById("result");

      if (video && result) {
        // Acceder a la cámara
        navigator.mediaDevices
          .getUserMedia({ video: { facingMode: "environment" } })
          .then((stream) => {
            this.stream = stream; // Guardar el stream
            video.srcObject = stream; // Asignar el stream al video
            video.play(); // Iniciar reproducción del video
          })
          .catch((err) => {
            console.error("Error al acceder a la cámara:", err);
            result.textContent = "No se pudo acceder a la cámara.";
          });

        Quagga.init(
          {
            inputStream: {
              name: "Live",
              type: "LiveStream",
              target: video,
              constraints: {
                facingMode: "environment", // Cámara trasera por defecto
              },
            },
            decoder: {
              readers: ["ean_reader", "upc_reader"],
            },
          },
          (err) => {
            if (err) {
              console.error("Error al inicializar Quagga:", err);
              return;
            }
            Quagga.start();
          }
        );

        Quagga.onDetected((data) => {
          const codigo = data.codeResult.code;
          result.textContent = `Código detectado: ${codigo}`;

          // Redirigir a la página del producto 📌
          this.redirigirProducto(codigo);

          // Evita que Quagga siga escaneando repetidamente el mismo código
          Quagga.stop();
          setTimeout(() => Quagga.start(), 3000); // Reinicia después de 3 segundos
        });
      } else {
        console.error("Error: Elementos del escáner no encontrados.");
      }
    },

    redirigirProducto(codigo) {
      const url = `https://world.openfoodfacts.org/product/${codigo}`;
      window.location.href = url;
    },

    alternarInfo() {
      this.showInfo = !this.showInfo;
    },
    // Método para detener el stream y cerrar la cámara
    stopCamera() {
      if (this.stream) {
        const tracks = this.stream.getTracks();
        tracks.forEach(track => track.stop()); // Detener todas las pistas de video
      }
    },
  },

  // Hook para detener la cámara cuando el componente se desmonte
  beforeUnmount() {
    this.stopCamera();
  },

  // Inicialización del canvas para mejorar el rendimiento
  mounted() {
    this.canvasContext = document.createElement('canvas').getContext('2d');
    this.canvasContext.willReadFrequently = true; // Establecer el atributo para mejorar el rendimiento al leer

    // Iniciar el escaneo cuando el componente esté montado
    this.startScan();

  },
};
</script>