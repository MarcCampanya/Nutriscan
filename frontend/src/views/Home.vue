<template>
  <main class="landing">
    <!-- Header -->
    <header class="header-section">
      <h1>Bienvenido a NutriScan</h1>
      <p>Tu herramienta inteligente para una vida saludable. Escanea productos, descubre recetas nutritivas y conéctate
        con una comunidad que comparte tus valores.</p>
    </header>

    <!-- First Grid (image left) -->
    <section class="section-light">
      <div class="container">
        <div class="image-third">
          <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80"
            alt="Nutrición saludable" />
        </div>
        <div class="text-two-thirds">
          <h2>¿Quiénes somos?</h2>
          <p>
            NutriScan es una plataforma desarrollada por apasionados de la salud, la nutrición y la tecnología. Nuestro
            objetivo es ayudarte a tomar mejores decisiones sobre tu alimentación diaria de forma simple e intuitiva.
          </p>
          <p>
            Creemos que una vida saludable empieza con información clara y accesible. Por eso, combinamos la experiencia
            de nutricionistas, desarrolladores y una comunidad activa para ofrecerte herramientas útiles y confiables.
          </p>
          <p>
            Desde escanear productos en el supermercado hasta descubrir recetas adaptadas a tus necesidades, NutriScan
            está diseñado para acompañarte en cada paso hacia una vida más sana.
          </p>
          <p>
            Además, fomentamos una comunidad en la que puedas compartir tus logros, intercambiar consejos y aprender
            constantemente. Porque cuidarte no debería ser complicado, sino parte natural de tu día a día.
          </p>

        </div>
      </div>
    </section>

    <!-- Segundo Grid (image right) -->
    <section class="section-dark">
      <div class="container container-reverse">
        <div class="image-third">
          <img src="https://images.unsplash.com/photo-1582719478183-0ecb154c22b3?auto=format&fit=crop&w=600&q=80"
            alt="Escaneo de código de barras" />
        </div>
        <div class="text-two-thirds">
          <h2>Escanea productos</h2>
          <p>Obtén información nutricional escaneando el código de barras de cualquier producto.</p>
          <p>
            Usa la cámara de tu móvil para escanear rápidamente cualquier producto y ver detalles completos sobre sus
            ingredientes, calorías y alérgenos.
          </p>
          <p>
            Nuestro sistema analiza cada producto y te muestra una valoración clara basada en criterios nutricionales
            reconocidos, ayudándote a elegir opciones más saludables en segundos.
          </p>
          <p>
            Además, puedes guardar tus productos favoritos para compararlos y revisar su información en cualquier
            momento sin necesidad de volver a escanear.
          </p>
          <p>
            Esta funcionalidad te permite evitar ingredientes que no toleras o que prefieres evitar, como azúcares
            añadidos, gluten o grasas saturadas.
          </p>
          <div class="center-icon">
            <i class="fa fa-barcode fa-6x"></i>
          </div>
        </div>
      </div>
    </section>

    <!-- Tercer Grid (image left) -->
    <section class="section-light">
      <div class="container">
        <div class="image-third">
          <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80"
            alt="Recetas saludables" />
        </div>
        <div class="text-two-thirds">
          <h2>Recetas saludables</h2>
          <p>Encuentra recetas personalizadas para tus objetivos de salud y preferencias alimenticias.</p>
          <p>
            Explora recetas adaptadas a tus necesidades: veganas, bajas en calorías, sin gluten y más. También puedes
            subir y compartir tus recetas favoritas.
          </p>
          <p>
            Nuestro buscador avanzado te permite filtrar recetas según ingredientes, tipo de dieta, tiempo de
            preparación y nivel de dificultad, para que siempre encuentres algo que se ajuste a ti.
          </p>
          <p>
            Además, las recetas cuentan con valoraciones y comentarios de otros usuarios para que puedas decidir con
            confianza cuál preparar.
          </p>
          <p>
            ¿Quieres inspirarte? Explora nuestras colecciones temáticas: recetas rápidas para la oficina, comidas
            familiares nutritivas, y postres saludables para cuidar tu antojo sin culpa.
          </p>
          <div class="center-icon">
            <i class="fa fa-cutlery fa-6x"></i>
          </div>
        </div>
      </div>
    </section>

    <!-- Cuarto Grid (image right) -->
    <section class="section-dark">
      <div class="container container-reverse">
        <div class="image-third">
          <img src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80"
            alt="Comunidad NutriScan" />
        </div>
        <div class="text-two-thirds">
          <h2>Comunidad</h2>
          <p>Comparte recetas, consejos y motívate con personas que tienen metas similares.</p>
          <p>
            Únete a nuestro foro y chats para conectar con otros usuarios, intercambiar trucos y seguir retos saludables
            en grupo.
          </p>
          <p>
            Participa en desafíos mensuales para mejorar tus hábitos y ganar recompensas exclusivas dentro de la
            plataforma.
          </p>
          <p>
            Comparte tus logros y recibe apoyo de la comunidad para mantener la motivación alta. También puedes seguir a
            tus usuarios favoritos y descubrir sus recomendaciones.
          </p>
          <p>
            Nuestro espacio está diseñado para que tanto principiantes como expertos encuentren un lugar donde crecer y
            aprender juntos.
          </p>
          <div class="center-icon">
            <i class="fa fa-users fa-6x"></i>
          </div>
        </div>
      </div>
    </section>


    <!-- Contact -->
    <section class="section-light contact">
      <h2>Contacto</h2>
      <p>¿Tienes dudas o sugerencias? Escríbenos a <a href="mailto:info@nutriscan.com">info@nutriscan.com</a>.</p>
    </section>
  </main>
</template>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css');

.landing {
  font-family: 'Lato', sans-serif;
  color: #025928;
  background-color: #88BFA0;
  margin: 0;
  padding: 0;
}

/* Header */
.header-section {
  position: relative;
  background-image: url('@/assets/img/hero.jpg');
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  color: #fff;
  padding: 80px 20px;
  text-align: center;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-family: 'Lato', sans-serif;
}

.header-section::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(ellipse at center,
      rgba(0, 0, 0, 0.2) 0%,
      rgba(0, 0, 0, 0.4) 70%,
      rgba(0, 0, 0, 0.65) 900%);
  z-index: 0;
  pointer-events: none;
}

.header-section h1 {
  font-family: 'Montserrat', sans-serif;
  font-size: 3.5rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 1rem;
  z-index: 1;
}

.header-section p {
  font-size: 1.2rem;
  letter-spacing: 1px;
  max-width: 800px;
  margin: 0 auto;
  z-index: 1;
}

.btn-get-started {
  background-color: #025928;
  color: white;
  border: none;
  padding: 1rem 2.5rem;
  font-size: 1.2rem;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.who-we-are.container {
  display: block;
  padding: 60px 60px;
}

.who-we-are h2 {
  text-align: center;
}

.circle-img {
  float: left;
  width: 220px;
  height: 220px;
  margin: 0 20px 20px 0;
  border-radius: 50%;
  object-fit: cover;
  shape-outside: circle(50%);
  -webkit-shape-outside: circle(50%);
  shape-margin: 15px;
  box-shadow: 0 0 15px rgba(3, 64, 1, 0.4);
}

/* Containers */
.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 64px 60px;
  display: block;
}

/* Container with image on the right and text wrapping */
.container-reverse {
  max-width: 1100px;
  margin: 0 auto;
  padding: 64px 60px;
}

.container-reverse .image-third {
  float: right;
  width: 220px;
  height: 220px;
  margin-left: 20px;
  border-radius: 50%;
  shape-outside: circle(50%);
  -webkit-shape-outside: circle(50%);
  shape-margin: 15px;
  object-fit: cover;
  box-shadow: 4px 4px 15px rgba(2, 57, 40, 0.3);
  display: block;
}

.container-reverse .image-third img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  display: block;
}

.container-reverse .text-two-thirds {
  overflow: hidden;
  /* clear float */
  color: #B9C5B1;
}

/* Image circular with shape-outside for text wrap on left side */
.image-third {
  float: left;
  width: 220px;
  height: 220px;
  margin: 0 20px 20px 0;
  border-radius: 50%;
  shape-outside: circle(50%);
  -webkit-shape-outside: circle(50%);
  shape-margin: 15px;
  object-fit: cover;
  box-shadow: 4px 4px 15px rgba(2, 57, 40, 0.3);
  display: block;
}

.image-third img {
  width: 220px;
  height: 220px;
  border-radius: 50%;
  object-fit: cover;
}

/* Text column */
.text-two-thirds {
  padding-top: 0;
}

/* Section backgrounds */
.section-light {
  background-color: #F8F7F2;
  color: #055902;
}

.section-dark {
  background-color: #034001;
  color: #B9C5B1;
}

/* Center icons */
.center-icon {
  text-align: center;
  margin-top: 20px;
}

/* Contact section */
.contact {
  padding: 60px 60px;
  background-color: #F8F7F2;
  text-align: center;
  color: #034001;
}

.contact a {
  color: #055902;
  font-weight: 600;
  text-decoration: none;
}

.contact a:hover {
  text-decoration: underline;
}

/* Responsive */
@media (max-width: 768px) {
  .image-third {
    float: none;
    margin: 0 auto 20px auto;
    display: block;
    width: 180px;
    height: 180px;
    shape-outside: none;
  }

  .container,
  .container-reverse {
    padding: 60px 60px;
  }
}
</style>
