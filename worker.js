/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run "npm run dev" in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run "npm run deploy" to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */
addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  const path = url.pathname

  switch (path) {
    case "/":
      return new Response(htmlHome, { headers: { "Content-Type": "text/html" } })
    case "/resume":
      return new Response(htmlResume, { headers: { "Content-Type": "text/html" } })
    case "/projects":
      return new Response(htmlProjects, { headers: { "Content-Type": "text/html" } })
    case "/certificates":
      return new Response(htmlCertificates, { headers: { "Content-Type": "text/html" } })
    default:
      return new Response("404 Not Found", { status: 404 })
  }
}

/* ========= COMMON STYLES (with theme variables and toggle button) ========= */
const commonStyles = `
  <style>
    :root {
      --primary-bg: #141414;
      --primary-color: #fff;
      --secondary-color: #e50914;
      --nav-bg: #141414;
      --card-bg: #1c1c1c;
      --card-border: #333;
    }
    body[data-theme="light"] {
      --primary-bg: #f5f5f5;
      --primary-color: #333;
      --secondary-color: #e50914;
      --nav-bg: #f5f5f5;
      --card-bg: #fff;
      --card-border: #ddd;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: Arial, sans-serif;
      background-color: var(--primary-bg);
      color: var(--primary-color);
    }
    .container { width: 90%; max-width: 1200px; margin: 20px auto; }
    header {
      background-color: var(--primary-bg);
      padding: 20px;
      text-align: center;
      position: relative;
    }
    header h1 { color: var(--secondary-color); margin-bottom: 5px; }
    nav {
      background-color: var(--nav-bg);
      text-align: center;
      padding: 10px;
    }
    nav a {
      color: var(--primary-color);
      margin: 0 15px;
      text-decoration: none;
      font-weight: bold;
    }
    nav a:hover { text-decoration: underline; }
    footer {
      background-color: var(--nav-bg);
      color: var(--primary-color);
      text-align: center;
      padding: 20px;
      margin-top: 40px;
    }
    /* Theme Toggle Button */
    #theme-toggle {
      position: absolute;
      top: 20px;
      right: 20px;
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: var(--primary-color);
    }
    @media (max-width: 768px) {
      header h1 { font-size: 1.8rem; }
      nav a { margin: 0 10px; }
    }
  </style>
`;

/* =========================
   HOME PAGE - Carousel & Cards
   ========================= */
const htmlHome = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Sai Keerthi Vanga Portfolio</title>
  ${commonStyles}
  <style>
    /* Carousel Styles */
    .carousel {
      position: relative;
      overflow: hidden;
      margin-bottom: 40px;
    }
    .carousel-slides {
      display: flex;
      transition: transform 0.5s ease-in-out;
    }
    .carousel-slide {
      min-width: 100%;
      padding: 60px 20px;
      background-color: var(--secondary-color);
      color: var(--primary-color);
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 2rem;
      text-align: center;
    }
    .carousel button {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      background-color: rgba(0,0,0,0.5);
      color: var(--primary-color);
      border: none;
      padding: 10px 15px;
      cursor: pointer;
      font-size: 1rem;
    }
    .carousel .prev { left: 10px; }
    .carousel .next { right: 10px; }
    /* Cards Styles */
    .cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 20px;
      margin-bottom: 40px;
    }
    .card {
      background-color: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 5px rgba(0,0,0,0.3);
      transition: transform 0.3s;
    }
    .card:hover { transform: translateY(-5px); }
    .card img { width: 100%; display: block; }
    .card-body { padding: 15px; }
    .card-title {
      font-size: 1.5rem;
      margin-bottom: 10px;
      color: var(--secondary-color);
    }
    .card-text { font-size: 1rem; margin-bottom: 15px; }
    .card a { text-decoration: none; color: var(--secondary-color); font-weight: bold; }
  </style>
</head>
<body data-theme="dark">
  <header>
    <h1>Sai Keerthi Vanga</h1>
    <p>Software Developer &amp; Innovator</p>
    <!-- Theme toggle switch with placeholder icons -->
    <button id="theme-toggle" title="Toggle Dark/Light Mode">☀</button>
  </header>
  <nav>
    <a href="/">Home</a>
    <a href="/resume">Resume</a>
    <a href="/projects">Projects</a>
    <a href="/certificates">Certificates</a>
  </nav>
  <div class="container">
    <!-- Carousel Section -->
    <div class="carousel">
      <div class="carousel-slides">
        <div class="carousel-slide">Welcome to My Portfolio</div>
        <div class="carousel-slide">Creative Solutions</div>
        <div class="carousel-slide">Innovative Projects</div>
      </div>
      <button class="prev">&laquo; Prev</button>
      <button class="next">Next &raquo;</button>
    </div>
    <!-- Featured Projects Cards -->
    <h2 style="margin-bottom:20px; text-align:center;">Featured Projects</h2>
    <div class="cards">
      <div class="card">
        <img src="https://designer.microsoft.com/static/media/device-lock-small.7ff9fc2d95baafcfc117.png" alt="Project One">
        <div class="card-body">
          <div class="card-title">Project One</div>
          <div class="card-text">An innovative solution using modern web technologies.</div>
          <a href="#">Learn More</a>
        </div>
      </div>
      <div class="card">
        <img src="https://designer.microsoft.com/static/media/device-lock-small.7ff9fc2d95baafcfc117.png" alt="Project Two">
        <div class="card-body">
          <div class="card-title">Project Two</div>
          <div class="card-text">A creative project showcasing responsive design.</div>
          <a href="#">Learn More</a>
        </div>
      </div>
      <div class="card">
        <img src="https://designer.microsoft.com/static/media/device-lock-small.7ff9fc2d95baafcfc117.png" alt="Project Three">
        <div class="card-body">
          <div class="card-title">Project Three</div>
          <div class="card-text">A robust application built with modern frameworks.</div>
          <a href="#">Learn More</a>
        </div>
      </div>
    </div>
  </div>
  <footer>
    <p>&copy; 2025 Sai Keerthi Vanga. All rights reserved.</p>
  </footer>
  <script>
    // Theme toggle functionality
    document.getElementById('theme-toggle').addEventListener('click', function() {
      const currentTheme = document.body.getAttribute('data-theme');
      if (currentTheme === 'dark') {
        document.body.setAttribute('data-theme', 'light');
        this.innerHTML = '🌙';
      } else {
        document.body.setAttribute('data-theme', 'dark');
        this.innerHTML = '☀';
      }
    });

    // Carousel Functionality
    const slidesContainer = document.querySelector('.carousel-slides');
    const slides = document.querySelectorAll('.carousel-slide');
    const prevBtn = document.querySelector('.carousel .prev');
    const nextBtn = document.querySelector('.carousel .next');
    let currentIndex = 0;
    const totalSlides = slides.length;

    function updateCarousel() {
      slidesContainer.style.transform = 'translateX(' + (-currentIndex * 100) + '%)';
    }

    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex === 0) ? totalSlides - 1 : currentIndex - 1;
      updateCarousel();
    });

    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex === totalSlides - 1) ? 0 : currentIndex + 1;
      updateCarousel();
    });

    // Auto-cycle every 5 seconds
    setInterval(() => {
      currentIndex = (currentIndex === totalSlides - 1) ? 0 : currentIndex + 1;
      updateCarousel();
    }, 5000);
  </script>
</body>
</html>
`;

/* =========================
   RESUME PAGE - PDF Viewer (with theme toggle)
   ========================= */
const htmlResume = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Resume - Sai Keerthi Vanga</title>
  ${commonStyles}
  <style>
    .doc-viewer {
      width: 100%;
      height: 80vh;
      border: none;
    }
    .section {
      background-color: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.3);
      margin-bottom: 20px;
    }
    .section h2 { color: var(--secondary-color); margin-bottom: 15px; text-align: center; }
    .section p { text-align: center; margin-top: 10px; }
    .section a { color: var(--secondary-color); font-weight: bold; text-decoration: none; }
  </style>
</head>
<body data-theme="dark">
  <header>
    <h1>Sai Keerthi Vanga</h1>
    <p>Resume</p>
    <button id="theme-toggle" title="Toggle Dark/Light Mode">☀</button>
  </header>
  <nav>
    <a href="/">Home</a>
    <a href="/resume">Resume</a>
    <a href="/projects">Projects</a>
    <a href="/certificates">Certificates</a>
  </nav>
  <div class="container">
    <div class="section">
      <h2>My Resume</h2>
      <!-- Updated for PDF preview from Google Drive -->
      <iframe class="doc-viewer" src="https://drive.google.com/file/d/14Trcwn38y08eah62A15zybeY_WgFmNpN/preview"></iframe>
      <p>If the document does not display, <a href="https://drive.google.com/file/d/14Trcwn38y08eah62A15zybeY_WgFmNpN/view?usp=sharing">click here to download</a>.</p>
    </div>
  </div>
  <footer>
    <p>&copy; 2025 Sai Keerthi Vanga. All rights reserved.</p>
  </footer>
  <script>
    document.getElementById('theme-toggle').addEventListener('click', function() {
      const currentTheme = document.body.getAttribute('data-theme');
      if (currentTheme === 'dark') {
        document.body.setAttribute('data-theme', 'light');
        this.innerHTML = '🌙';
      } else {
        document.body.setAttribute('data-theme', 'dark');
        this.innerHTML = '☀';
      }
    });
  </script>
</body>
</html>
`;

/* =========================
   PROJECTS PAGE (similar layout with theme toggle)
   ========================= */
const htmlProjects = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Projects - Sai Keerthi Vanga</title>
  ${commonStyles}
  <style>
    .cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 20px;
      margin-bottom: 40px;
    }
    .card {
      background-color: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 5px rgba(0,0,0,0.3);
      transition: transform 0.3s;
    }
    .card:hover { transform: translateY(-5px); }
    .card img { width: 100%; }
    .card-body { padding: 15px; }
    .card-title {
      font-size: 1.5rem;
      margin-bottom: 10px;
      color: var(--secondary-color);
    }
    .card-text { font-size: 1rem; margin-bottom: 15px; }
    .card a { text-decoration: none; color: var(--secondary-color); font-weight: bold; }
  </style>
</head>
<body data-theme="dark">
  <header>
    <h1>Sai Keerthi Vanga</h1>
    <p>Projects</p>
    <button id="theme-toggle" title="Toggle Dark/Light Mode">☀</button>
  </header>
  <nav>
    <a href="/">Home</a>
    <a href="/resume">Resume</a>
    <a href="/projects">Projects</a>
    <a href="/certificates">Certificates</a>
  </nav>
  <div class="container">
    <div class="cards">
      <div class="card">
        <img src="https://designer.microsoft.com/static/media/device-lock-small.7ff9fc2d95baafcfc117.png" alt="Project One">
        <div class="card-body">
          <div class="card-title">Project One</div>
          <div class="card-text">An innovative solution using modern web technologies.</div>
          <a href="#">Learn More</a>
        </div>
      </div>
      <div class="card">
        <img src="https://designer.microsoft.com/static/media/device-lock-small.7ff9fc2d95baafcfc117.png" alt="Project Two">
        <div class="card-body">
          <div class="card-title">Project Two</div>
          <div class="card-text">A creative project showcasing responsive design.</div>
          <a href="#">Learn More</a>
        </div>
      </div>
      <div class="card">
        <img src="https://designer.microsoft.com/static/media/device-lock-small.7ff9fc2d95baafcfc117.png" alt="Project Three">
        <div class="card-body">
          <div class="card-title">Project Three</div>
          <div class="card-text">A robust application built with modern frameworks.</div>
          <a href="#">Learn More</a>
        </div>
      </div>
    </div>
  </div>
  <footer>
    <p>&copy; 2025 Sai Keerthi Vanga. All rights reserved.</p>
  </footer>
  <script>
    document.getElementById('theme-toggle').addEventListener('click', function() {
      const currentTheme = document.body.getAttribute('data-theme');
      if (currentTheme === 'dark') {
        document.body.setAttribute('data-theme', 'light');
        this.innerHTML = '🌙';
      } else {
        document.body.setAttribute('data-theme', 'dark');
        this.innerHTML = '☀';
      }
    });
  </script>
</body>
</html>
`;

/* =========================
   CERTIFICATES PAGE (similar layout with theme toggle)
   ========================= */
const htmlCertificates = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Certificates - Sai Keerthi Vanga</title>
  ${commonStyles}
  <style>
    .cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 20px;
      margin-bottom: 40px;
    }
    .card {
      background-color: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 5px rgba(0,0,0,0.3);
      transition: transform 0.3s;
    }
    .card:hover { transform: translateY(-5px); }
    .card img { width: 100%; }
    .card-body { padding: 15px; }
    .card-title {
      font-size: 1.5rem;
      margin-bottom: 10px;
      color: var(--secondary-color);
    }
    .card-text { font-size: 1rem; margin-bottom: 15px; }
    .card a { text-decoration: none; color: var(--secondary-color); font-weight: bold; }
  </style>
</head>
<body data-theme="dark">
  <header>
    <h1>Sai Keerthi Vanga</h1>
    <p>Certificates</p>
    <button id="theme-toggle" title="Toggle Dark/Light Mode">☀</button>
  </header>
  <nav>
    <a href="/">Home</a>
    <a href="/resume">Resume</a>
    <a href="/projects">Projects</a>
    <a href="/certificates">Certificates</a>
  </nav>
  <div class="container">
    <div class="cards">
      <div class="card">
        <img src="https://source.unsplash.com/random/400x200?certificate" alt="Certificate One">
        <div class="card-body">
          <div class="card-title">Certificate One</div>
          <div class="card-text">Issued by [Organization Name] on [Date].</div>
          <a href="#">View Certificate</a>
        </div>
      </div>
      <div class="card">
        <img src="https://source.unsplash.com/random/400x200?award" alt="Certificate Two">
        <div class="card-body">
          <div class="card-title">Certificate Two</div>
          <div class="card-text">Issued by [Organization Name] on [Date].</div>
          <a href="#">View Certificate</a>
        </div>
      </div>
    </div>
  </div>
  <footer>
    <p>&copy; 2025 Sai Keerthi Vanga. All rights reserved.</p>
  </footer>
  <script>
    document.getElementById('theme-toggle').addEventListener('click', function() {
      const currentTheme = document.body.getAttribute('data-theme');
      if (currentTheme === 'dark') {
        document.body.setAttribute('data-theme', 'light');
        this.innerHTML = '🌙';
      } else {
        document.body.setAttribute('data-theme', 'dark');
        this.innerHTML = '☀';
      }
    });
  </script>
</body>
</html>
`;
