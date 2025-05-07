<template>
  <body>
    <main class="fullscreen">
          <!-- Contenedor de contenido -->
    <div class="content-container">
      <section class="intro">
        <h2>Bienvenido a NutriScan</h2>
        <p>
          NutriScan es la herramienta definitiva para quienes desean llevar un estilo de vida saludable. Nuestra
          plataforma combina tecnología de escaneo con una amplia base de datos nutricional, permitiéndote conocer en
          detalle cada ingrediente que consumes.
        </p>
        <p>
          Nuestra misión es empoderarte para tomar decisiones informadas sobre tu alimentación, ofreciéndote datos
          claros y precisos. Además, fomentamos una comunidad vibrante en la que puedes compartir recetas, consejos y
          experiencias.
        </p>
      </section>

      <!-- Sección "¿Quiénes somos?" con imagen circular y texto envolvente -->
      <section class="quienes-somos">
        <h2>¿Quiénes somos?</h2>
        <p>
          <strong>NutriScan</strong> fue creado por un equipo apasionado por la salud y la tecnología. Con la
          colaboración de nutricionistas, desarrolladores y expertos en bienestar, trabajamos día a día para ofrecerte
          una herramienta intuitiva y eficaz.
        </p>
        <div class="image-container shaped">
          <img src="@/assets/img/NutriscanLogo.png" alt="Personas comiendo saludable">
        </div>
        <p>
          Nuestro objetivo es brindarte la información más precisa y actualizada para que puedas mejorar tus hábitos y
          vivir de manera saludable. Creemos en el poder de la educación nutricional para transformar vidas.
        </p>

        <p>
          Desde nuestros inicios, hemos puesto el foco en la transparencia y la calidad de la información. Cada dato que
          encuentras en NutriScan es fruto de una rigurosa investigación y actualización constante, para que siempre
          tengas a tu alcance lo mejor en nutrición.
        </p>
        <p>
          Creemos firmemente que el primer paso hacia una vida más sana es el conocimiento. Por eso, nuestra plataforma
          no solo te informa, sino que también te inspira a tomar decisiones que mejoren tu bienestar general. Únete a
          nosotros y descubre cómo pequeños cambios pueden marcar una gran diferencia.
        </p>
      </section>

      <section class="que-ofrecemos">
        <h2>¿Qué ofrece NutriScan?</h2>
        <div class="features">
          <div class="feature">
            <img src="@/assets/img/scanner.png" alt="Escanear productos">
            <h3>Escanea productos</h3>
            <p>
              Utiliza la cámara de tu dispositivo para escanear códigos de barras y obtener información detallada sobre
              la composición nutricional de los productos.
            </p>
          </div>
          <div class="feature">
            <img src="@/assets/img/recetas.jpg" alt="Recetas saludables">
            <h3>Recetas saludables</h3>
            <p>
              Explora una amplia colección de recetas saludables, cada una con instrucciones detalladas y
              recomendaciones nutricionales adaptadas a tus necesidades.
            </p>
          </div>
          <div class="feature">
            <img src="@/assets/img/comunidad.png" alt="Comunidad saludable">
            <h3>Comunidad</h3>
            <p>
              Únete a una comunidad de usuarios comprometidos con un estilo de vida saludable. Comparte recetas,
              consejos y experiencias que te inspiren cada día.
            </p>
          </div>
        </div>
      </section>

      <section class="contacto">
        <h2>Contacto</h2>
        <p>
          Si tienes dudas, sugerencias o deseas ponerte en contacto con nosotros, envíanos un mensaje. Tu opinión es
          fundamental para seguir mejorando.
          Escríbenos a <a href="mailto:info@nutriscan.com">info@nutriscan.com</a> o utiliza nuestro formulario de
          contacto para recibir asistencia personalizada.
        </p>
      </section>
    </div>
  </main>
  </body>
</template>

<script>
export default {

  methods: {
    // Filtrar recetas según la búsqueda
    filtrarRecetas() {
      const searchQuery = document.getElementById("search").value.toLowerCase();
      const recetas = document.querySelectorAll(".receta");

      let found = false;
      recetas.forEach((receta) => {
        const nombre = receta.getAttribute("data-name").toLowerCase();
        if (nombre.includes(searchQuery)) {
          receta.style.display = "block"; // Mostrar receta
          found = true;
        } else {
          receta.style.display = "none"; // Ocultar receta
        }
      });

      // Mostrar mensaje si no se encuentran resultados
      const noResultsMessage = document.getElementById("no-results");
      if (found) {
        noResultsMessage.style.display = "none";
      } else {
        noResultsMessage.style.display = "block";
      }
    },
  },
};
</script>

```