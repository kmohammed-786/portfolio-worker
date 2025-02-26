/**
 * Cloudflare Worker that serves a dynamic portfolio site with:
 *  - KV-loaded content (persistent across reloads)
 *  - Fluid animations and transitions for a modern UX
 *  - Dark/Light theme toggle plus a Theme Settings modal for custom colors
 *  - Inline editing protected by an admin password (with /auth and /update endpoints)
 *
 * Make sure your wrangler.toml includes a KV binding:
 *
 * kv_namespaces = [
 *   { binding = "CONTENT", id = "YOUR_KV_NAMESPACE_ID" }
 * ]
 */

addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request))
});

// ---------- Default KV Content (if not updated yet) ----------
const defaultValues = {
  "header-title": "SAI KEERTHI VANGA",
  "header-subtitle": "Phone: +1(940)-977-2378 | Email: saikeerthivanga6@gmail.com",
  "nav-home": "Home",
  "nav-resume": "Resume",
  "nav-projects": "Projects",
  "nav-certificates": "Certificates",
  "carousel-1": "Welcome to My Portfolio",
  "carousel-2": "Innovative Cloud & AI Solutions",
  "carousel-3": "Cutting-edge Automation & DevOps",
  "featured-title": "Featured Projects",
  "proj1-title": "Personalized Medicine Recommendation System",
  "proj1-desc": "Developed a recommendation engine using Hadoop, Python, and Spark with 90% accuracy on AWS.",
  "proj1-link": "Learn More",
  "proj2-title": "Credit Card Fraud Detection",
  "proj2-desc": "Implemented secure data pipelines and fraud detection algorithms on AWS.",
  "proj2-link": "Learn More",
  "proj3-title": "Intelligent Customer Support Chatbot",
  "proj3-desc": "Automated 85% of interactions using Python, Flask, AWS, and ML, boosting satisfaction by 30%.",
  "proj3-link": "Learn More",
  "footer-text": "&copy; 2025 Sai Keerthi Vanga. All rights reserved.",
  "resume-title": "Resume - SAI KEERTHI VANGA",
  "resume-heading": "Professional Summary",
  "resume-summary": "Passionate about cloud computing, automation, and AI-driven solutions, with a strong foundation in AWS and Hadoop. Adept at collaborating with cross-functional teams in dynamic environments.",
  "education": `<ul>
      <li><strong>Master of Science: Computer Science</strong> (Aug 2023 - May 2025), University of North Texas, Denton, TX. GPA: 4.0/4.0</li>
      <li><strong>Bachelor of Technology: Electronics & Communication Engineering</strong> (Aug 2017 - May 2021), JNTU, Hyderabad, India. GPA: 3.5/4.0</li>
    </ul>`,
  "work-experience": `<ul>
      <li><strong>University of North Texas – Graduate Student Council – Vice President, Communication & Marketing</strong> (Apr 2024 – Present)
        <ul>
          <li>Improved student satisfaction by 20% with personalized support.</li>
          <li>Boosted event participation by 30% through effective coordination.</li>
          <li>Enhanced engagement efficiency by 15% via data-driven outreach.</li>
        </ul>
      </li>
      <li><strong>JP Morgan Chase & Co - Software Engineer 1</strong> (Jan 2021 – Jun 2023)
        <ul>
          <li>Developed secure, scalable RESTful APIs using Java and Python.</li>
          <li>Optimized ETL pipelines and SQL queries, improving performance by 30%.</li>
          <li>Streamlined CI/CD pipelines, reducing deployment errors by 25%.</li>
          <li>Deployed containerized applications using Docker and AWS Lambda.</li>
        </ul>
      </li>
      <li><strong>JP Morgan Chase & Co – Intern</strong> (Jul 2020 – Dec 2020)
        <ul>
          <li>Supported scalable data solutions and improved documentation.</li>
          <li>Enhanced DPL transformation docs in Confluence, boosting knowledge sharing by 20%.</li>
        </ul>
      </li>
    </ul>`,
  "technical-skills": `<ul>
      <li><strong>Languages:</strong> C, Python, Java, JavaScript, HTML, CSS, SQL</li>
      <li><strong>Cloud Platforms:</strong> AWS, GCP, Citrix, Azure</li>
      <li><strong>Tools:</strong> IntelliJ, Visual Studio, GitHub, Bitbucket, Jenkins, Control-M, Tableau, Jira, Confluence</li>
      <li><strong>ML & AI:</strong> Scikit-Learn, TensorFlow, PyTorch, OpenAI API</li>
      <li><strong>Big Data:</strong> Apache Spark, Hadoop, Cloudera, Cassandra</li>
      <li><strong>Databases:</strong> MySQL, MongoDB, Teradata, Postgres, Redshift</li>
      <li><strong>Frameworks:</strong> Spring, Angular, React, Django, Flask, Node.js</li>
      <li><strong>OS:</strong> Windows, Linux, Mac OS</li>
      <li><strong>Others:</strong> RESTful APIs, XML, Canva, Kubernetes, Terraform</li>
    </ul>`,
  "project-experience": `<ul>
      <li><strong>Personalized Medicine Recommendation System</strong> (Oct 2024): Achieved 90% accuracy with Hadoop, Python, and Spark. Deployed on AWS S3 and SageMaker.</li>
      <li><strong>Credit Card Fraud Detection</strong> (Feb 2024): Built secure data pipelines and fraud detection algorithms on AWS.</li>
      <li><strong>Intelligent Customer Support Chatbot</strong> (Sept 2023): Automated 85% of interactions, increasing customer satisfaction by 30%.</li>
      <li><strong>Grocery Delivery Web App</strong> (Mar 2023): Developed features like instant delivery and GPS tracking, boosting user satisfaction by 40%.</li>
      <li><strong>LMS for Lend a Hand India</strong> (Mar 2022): Created a hackathon project that increased teacher productivity by 45%.</li>
    </ul>`
};

// ---------- Request Handler ----------
async function handleRequest(request) {
  const url = new URL(request.url);

  // Handle POST endpoints (/auth and /update)
  if (request.method === "POST") {
    if (url.pathname === "/auth") return await handleAuth(request);
    if (url.pathname === "/update") return await handleUpdate(request);
    return new Response("Unsupported POST endpoint", { status: 404 });
  }

  // For GET requests, load KV content and render the page.
  let content = await loadContent();
  if (url.pathname === "/" || url.pathname === "/home") {
    return new Response(renderHome(content), { headers: { "Content-Type": "text/html" } });
  } else if (url.pathname === "/resume") {
    return new Response(renderResume(content), { headers: { "Content-Type": "text/html" } });
  } else if (url.pathname === "/projects") {
    return new Response(renderProjects(content), { headers: { "Content-Type": "text/html" } });
  } else if (url.pathname === "/certificates") {
    return new Response(renderCertificates(content), { headers: { "Content-Type": "text/html" } });
  }
  return new Response("404 Not Found", { status: 404 });
}

/** Load KV content or fallback to defaults */
async function loadContent() {
  let keys = Object.keys(defaultValues);
  let content = {};
  for (let key of keys) {
    let val = await CONTENT.get(key);
    content[key] = (val !== null) ? val : defaultValues[key];
  }
  return content;
}

/** POST /auth: Verify or set admin password.
 * Expects JSON: { "password": "yourpassword" }
 */
async function handleAuth(request) {
  try {
    const body = await request.json();
    const provided = body.password;
    if (!provided) return new Response(JSON.stringify({ success: false, message: "Password missing" }), { status: 400 });
    let stored = await CONTENT.get("admin_password");
    if (!stored) {
      await CONTENT.put("admin_password", provided);
      return new Response(JSON.stringify({ success: true, message: "Password set" }), { headers: { "Content-Type": "application/json" } });
    } else {
      return (provided === stored)
        ? new Response(JSON.stringify({ success: true, message: "Password verified" }), { headers: { "Content-Type": "application/json" } })
        : new Response(JSON.stringify({ success: false, message: "Incorrect password" }), { status: 403, headers: { "Content-Type": "application/json" } });
    }
  } catch (e) {
    return new Response(JSON.stringify({ success: false, message: "Error processing request" }), { status: 500 });
  }
}

/** POST /update: Update KV content.
 * Expects JSON: { "updates": { key: value, ... }, "password": "yourpassword" }
 */
async function handleUpdate(request) {
  try {
    const body = await request.json();
    const provided = body.password;
    if (!provided) return new Response(JSON.stringify({ success: false, message: "Password missing" }), { status: 400 });
    let stored = await CONTENT.get("admin_password");
    if (!stored || provided !== stored) {
      return new Response(JSON.stringify({ success: false, message: "Incorrect password" }), { status: 403 });
    }
    let updates = body.updates;
    if (typeof updates !== "object") {
      return new Response(JSON.stringify({ success: false, message: "Invalid updates object" }), { status: 400 });
    }
    for (let key in updates) {
      await CONTENT.put(key, updates[key]);
    }
    return new Response(JSON.stringify({ success: true, message: "Content updated" }), { headers: { "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ success: false, message: "Error updating content" }), { status: 500 });
  }
}

// ----------------- Common HTML Fragments -----------------
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
    /* Global resets and transitions */
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: Arial, sans-serif;
      background-color: var(--primary-bg);
      color: var(--primary-color);
      transition: background-color 0.4s ease, color 0.4s ease;
      overflow-x: hidden;
    }
    .container {
      width: 90%;
      max-width: 1200px;
      margin: 20px auto;
      animation: fadeIn 0.8s ease-out;
    }
    header {
      background-color: var(--primary-bg);
      padding: 20px;
      text-align: center;
      position: relative;
      animation: slideDown 0.6s ease-out;
    }
    header h1 { 
      color: var(--secondary-color);
      margin-bottom: 5px;
    }
    header p { margin-bottom: 10px; }
    /* Header Buttons */
    .header-buttons {
      position: absolute;
      top: 20px;
      right: 20px;
    }
    .header-buttons button {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: var(--primary-color);
      margin-left: 10px;
      transition: transform 0.3s ease;
    }
    .header-buttons button:hover { transform: scale(1.1); }
    nav {
      background-color: var(--nav-bg);
      text-align: center;
      padding: 10px;
      animation: fadeIn 0.8s ease-out;
    }
    nav a {
      color: var(--primary-color);
      margin: 0 15px;
      text-decoration: none;
      font-weight: bold;
      transition: color 0.3s ease;
    }
    nav a:hover { text-decoration: underline; }
    footer {
      background-color: var(--nav-bg);
      color: var(--primary-color);
      text-align: center;
      padding: 20px;
      margin-top: 40px;
      animation: fadeIn 0.8s ease-out;
    }
    @media (max-width: 768px) {
      header h1 { font-size: 1.8rem; }
      nav a { margin: 0 10px; }
    }
    /* Editable element styling */
    .editable { outline: 1px dashed transparent; }
    body[data-edit="true"] .editable { outline: 1px dashed var(--secondary-color); }
    /* Animations */
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  </style>
`;

// Theme Settings Modal (with fade & scale animation)
const settingsModalHTML = `
<div id="settings-modal" style="display:none; position: fixed; top: 0; left:0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index:1000;">
  <div style="background: #fff; color: #000; padding: 20px; width: 300px; margin: 100px auto; border-radius: 8px; animation: modalFadeIn 0.4s ease-out;">
    <h3>Theme Settings</h3>
    <label>Primary BG: <input type="color" id="input-primary-bg" value="#141414"></label><br/>
    <label>Primary Color: <input type="color" id="input-primary-color" value="#fff"></label><br/>
    <label>Secondary Color: <input type="color" id="input-secondary-color" value="#e50914"></label><br/>
    <label>Nav BG: <input type="color" id="input-nav-bg" value="#141414"></label><br/>
    <label>Card BG: <input type="color" id="input-card-bg" value="#1c1c1c"></label><br/>
    <label>Card Border: <input type="color" id="input-card-border" value="#333"></label><br/><br/>
    <button id="save-theme">Save</button>
    <button id="cancel-theme">Cancel</button>
  </div>
</div>
<style>
  @keyframes modalFadeIn {
    from { opacity: 0; transform: scale(0.8); }
    to { opacity: 1; transform: scale(1); }
  }
</style>
`;

// ----------------- Common Client-Side Script -----------------
const commonScript = `
  <script>
    // Apply saved theme settings from localStorage.
    document.addEventListener('DOMContentLoaded', function() {
      const savedSettings = localStorage.getItem('themeSettings');
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        document.documentElement.style.setProperty('--primary-bg', settings.primaryBg);
        document.documentElement.style.setProperty('--primary-color', settings.primaryColor);
        document.documentElement.style.setProperty('--secondary-color', settings.secondaryColor);
        document.documentElement.style.setProperty('--nav-bg', settings.navBg);
        document.documentElement.style.setProperty('--card-bg', settings.cardBg);
        document.documentElement.style.setProperty('--card-border', settings.cardBorder);
      }
      // Load any locally saved editable content.
      document.querySelectorAll('[data-key]').forEach(el => {
        const saved = localStorage.getItem('content_' + el.getAttribute('data-key'));
        if (saved) { el.innerHTML = saved; }
      });
    });
    
    // Insert settings modal into body.
    document.body.insertAdjacentHTML('beforeend', \`${settingsModalHTML}\`);
    
    // Theme Settings Modal event handlers.
    document.getElementById('settings-toggle').addEventListener('click', function(){
      document.getElementById('settings-modal').style.display = 'block';
    });
    document.getElementById('cancel-theme').addEventListener('click', function(){
      document.getElementById('settings-modal').style.display = 'none';
    });
    document.getElementById('save-theme').addEventListener('click', function(){
      const primaryBg = document.getElementById('input-primary-bg').value;
      const primaryColor = document.getElementById('input-primary-color').value;
      const secondaryColor = document.getElementById('input-secondary-color').value;
      const navBg = document.getElementById('input-nav-bg').value;
      const cardBg = document.getElementById('input-card-bg').value;
      const cardBorder = document.getElementById('input-card-border').value;
      document.documentElement.style.setProperty('--primary-bg', primaryBg);
      document.documentElement.style.setProperty('--primary-color', primaryColor);
      document.documentElement.style.setProperty('--secondary-color', secondaryColor);
      document.documentElement.style.setProperty('--nav-bg', navBg);
      document.documentElement.style.setProperty('--card-bg', cardBg);
      document.documentElement.style.setProperty('--card-border', cardBorder);
      localStorage.setItem('themeSettings', JSON.stringify({primaryBg, primaryColor, secondaryColor, navBg, cardBg, cardBorder}));
      document.getElementById('settings-modal').style.display = 'none';
    });
    
    // Inline Editing with Admin Password.
    let adminPassword = localStorage.getItem('adminPassword') || null;
    document.getElementById('edit-toggle').addEventListener('click', async function() {
      const editing = document.body.getAttribute('data-edit') === 'true';
      if (!editing) {
        if (!adminPassword) {
          adminPassword = prompt("Enter admin password (or set a new one if first time):");
          if (!adminPassword) return;
          let res = await fetch('/auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: adminPassword })
          });
          let data = await res.json();
          if (!data.success) {
            alert("Password not accepted: " + data.message);
            return;
          }
          localStorage.setItem('adminPassword', adminPassword);
        }
        document.body.setAttribute('data-edit', 'true');
        this.innerHTML = 'Exit Edit';
        document.querySelectorAll('.editable').forEach(el => { el.contentEditable = 'true'; });
        document.getElementById('save-btn').style.display = 'inline-block';
      } else {
        document.body.setAttribute('data-edit', 'false');
        this.innerHTML = 'Edit';
        document.querySelectorAll('.editable').forEach(el => { el.contentEditable = 'false'; });
        document.getElementById('save-btn').style.display = 'none';
      }
    });
    document.getElementById('save-btn').addEventListener('click', async function() {
      let updates = {};
      document.querySelectorAll('[data-key]').forEach(el => {
        updates[el.getAttribute('data-key')] = el.innerHTML;
      });
      let res = await fetch('/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates, password: adminPassword })
      });
      let data = await res.json();
      alert(data.success ? "Changes saved!" : "Save failed: " + data.message);
    });
    
    // Dark/Light Theme Toggle.
    document.getElementById('theme-toggle').addEventListener('click', function() {
      const current = document.body.getAttribute('data-theme');
      if (current === 'dark') {
        document.body.setAttribute('data-theme', 'light');
        this.innerHTML = '🌙';
      } else {
        document.body.setAttribute('data-theme', 'dark');
        this.innerHTML = '☀';
      }
    });
    
    // Carousel functionality.
    const slidesContainer = document.querySelector('.carousel-slides');
    if (slidesContainer) {
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
      setInterval(() => {
        currentIndex = (currentIndex === totalSlides - 1) ? 0 : currentIndex + 1;
        updateCarousel();
      }, 5000);
    }
  </script>
`;

// ----------------- Render Functions for Pages -----------------

function renderHome(c) {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title data-key="home-title" class="editable">${c["header-title"]} Portfolio</title>
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
        transition: transform 0.6s ease-in-out;
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
        animation: fadeIn 0.8s ease-out;
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
        transition: transform 0.3s ease, opacity 0.3s ease;
        animation: fadeIn 0.8s ease-out;
      }
      .card:hover { transform: translateY(-5px); opacity: 0.95; }
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
  <body data-theme="dark" data-edit="false">
    <header>
      <h1 class="editable" data-key="header-title">${c["header-title"]}</h1>
      <p class="editable" data-key="header-subtitle">${c["header-subtitle"]}</p>
      <div class="header-buttons">
        <button id="theme-toggle" title="Toggle Dark/Light Mode">☀</button>
        <button id="settings-toggle" title="Theme Settings">⚙</button>
        <button id="edit-toggle" title="Toggle Edit Mode">Edit</button>
        <button id="save-btn" title="Save Changes" style="display:none;">💾</button>
      </div>
    </header>
    <nav>
      <a href="/" class="editable" data-key="nav-home">${c["nav-home"]}</a>
      <a href="/resume" class="editable" data-key="nav-resume">${c["nav-resume"]}</a>
      <a href="/projects" class="editable" data-key="nav-projects">${c["nav-projects"]}</a>
      <a href="/certificates" class="editable" data-key="nav-certificates">${c["nav-certificates"]}</a>
    </nav>
    <div class="container">
      <div class="carousel">
        <div class="carousel-slides">
          <div class="carousel-slide editable" data-key="carousel-1">${c["carousel-1"]}</div>
          <div class="carousel-slide editable" data-key="carousel-2">${c["carousel-2"]}</div>
          <div class="carousel-slide editable" data-key="carousel-3">${c["carousel-3"]}</div>
        </div>
        <button class="prev">&laquo; Prev</button>
        <button class="next">Next &raquo;</button>
      </div>
      <h2 class="editable" data-key="featured-title" style="margin-bottom:20px; text-align:center;">${c["featured-title"]}</h2>
      <div class="cards">
        <div class="card">
          <img src="https://source.unsplash.com/random/400x200?technology" alt="Project One">
          <div class="card-body">
            <div class="card-title editable" data-key="proj1-title">${c["proj1-title"]}</div>
            <div class="card-text editable" data-key="proj1-desc">${c["proj1-desc"]}</div>
            <a href="#" class="editable" data-key="proj1-link">${c["proj1-link"]}</a>
          </div>
        </div>
        <div class="card">
          <img src="https://source.unsplash.com/random/400x200?finance" alt="Project Two">
          <div class="card-body">
            <div class="card-title editable" data-key="proj2-title">${c["proj2-title"]}</div>
            <div class="card-text editable" data-key="proj2-desc">${c["proj2-desc"]}</div>
            <a href="#" class="editable" data-key="proj2-link">${c["proj2-link"]}</a>
          </div>
        </div>
        <div class="card">
          <img src="https://source.unsplash.com/random/400x200?chatbot" alt="Project Three">
          <div class="card-body">
            <div class="card-title editable" data-key="proj3-title">${c["proj3-title"]}</div>
            <div class="card-text editable" data-key="proj3-desc">${c["proj3-desc"]}</div>
            <a href="#" class="editable" data-key="proj3-link">${c["proj3-link"]}</a>
          </div>
        </div>
      </div>
    </div>
    <footer>
      <p class="editable" data-key="footer-text">${c["footer-text"]}</p>
    </footer>
    ${commonScript}
  </body>
  </html>
  `;
}

function renderResume(c) {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title class="editable" data-key="resume-title">${c["resume-title"]}</title>
    ${commonStyles}
    <style>
      .section {
        background-color: var(--card-bg);
        border: 1px solid var(--card-border);
        border-radius: 8px;
        padding: 20px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        margin-bottom: 20px;
        animation: fadeIn 0.8s ease-out;
      }
      .section h2 {
        color: var(--secondary-color);
        margin-bottom: 15px;
        text-align: center;
      }
      .section p { text-align: justify; margin-top: 10px; }
    </style>
  </head>
  <body data-theme="dark" data-edit="false">
    <header>
      <h1 class="editable" data-key="header-title">${c["header-title"]}</h1>
      <p class="editable" data-key="header-subtitle">${c["header-subtitle"]}</p>
      <div class="header-buttons">
        <button id="theme-toggle" title="Toggle Dark/Light Mode">☀</button>
        <button id="settings-toggle" title="Theme Settings">⚙</button>
        <button id="edit-toggle" title="Toggle Edit Mode">Edit</button>
        <button id="save-btn" title="Save Changes" style="display:none;">💾</button>
      </div>
    </header>
    <nav>
      <a href="/" class="editable" data-key="nav-home">${c["nav-home"]}</a>
      <a href="/resume" class="editable" data-key="nav-resume">${c["nav-resume"]}</a>
      <a href="/projects" class="editable" data-key="nav-projects">${c["nav-projects"]}</a>
      <a href="/certificates" class="editable" data-key="nav-certificates">${c["nav-certificates"]}</a>
    </nav>
    <div class="container">
      <div class="section">
        <h2 class="editable" data-key="resume-heading">${c["resume-heading"]}</h2>
        <p class="editable" data-key="resume-summary">${c["resume-summary"]}</p>
      </div>
      <div class="section">
        <h2>Education</h2>
        <p class="editable" data-key="education">${c["education"]}</p>
      </div>
      <div class="section">
        <h2>Work Experience</h2>
        <p class="editable" data-key="work-experience">${c["work-experience"]}</p>
      </div>
      <div class="section">
        <h2>Technical Skills</h2>
        <p class="editable" data-key="technical-skills">${c["technical-skills"]}</p>
      </div>
      <div class="section">
        <h2>Project Experience</h2>
        <p class="editable" data-key="project-experience">${c["project-experience"]}</p>
      </div>
    </div>
    <footer>
      <p class="editable" data-key="footer-text">${c["footer-text"]}</p>
    </footer>
    ${commonScript}
  </body>
  </html>
  `;
}

function renderProjects(c) {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title class="editable" data-key="nav-projects">${c["nav-projects"]} - ${c["header-title"]}</title>
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
        transition: transform 0.3s ease, opacity 0.3s ease;
        animation: fadeIn 0.8s ease-out;
      }
      .card:hover { transform: translateY(-5px); opacity: 0.95; }
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
  <body data-theme="dark" data-edit="false">
    <header>
      <h1 class="editable" data-key="header-title">${c["header-title"]}</h1>
      <p class="editable" data-key="header-subtitle">Projects</p>
      <div class="header-buttons">
        <button id="theme-toggle" title="Toggle Dark/Light Mode">☀</button>
        <button id="settings-toggle" title="Theme Settings">⚙</button>
        <button id="edit-toggle" title="Toggle Edit Mode">Edit</button>
        <button id="save-btn" title="Save Changes" style="display:none;">💾</button>
      </div>
    </header>
    <nav>
      <a href="/" class="editable" data-key="nav-home">${c["nav-home"]}</a>
      <a href="/resume" class="editable" data-key="nav-resume">${c["nav-resume"]}</a>
      <a href="/projects" class="editable" data-key="nav-projects">${c["nav-projects"]}</a>
      <a href="/certificates" class="editable" data-key="nav-certificates">${c["nav-certificates"]}</a>
    </nav>
    <div class="container">
      <div class="cards">
        <div class="card">
          <img src="https://source.unsplash.com/random/400x200?health" alt="Project One">
          <div class="card-body">
            <div class="card-title editable" data-key="proj1-title">${c["proj1-title"]}</div>
            <div class="card-text editable" data-key="proj1-desc">${c["proj1-desc"]}</div>
            <a href="#" class="editable" data-key="proj1-link">${c["proj1-link"]}</a>
          </div>
        </div>
        <div class="card">
          <img src="https://source.unsplash.com/random/400x200?finance" alt="Project Two">
          <div class="card-body">
            <div class="card-title editable" data-key="proj2-title">${c["proj2-title"]}</div>
            <div class="card-text editable" data-key="proj2-desc">${c["proj2-desc"]}</div>
            <a href="#" class="editable" data-key="proj2-link">${c["proj2-link"]}</a>
          </div>
        </div>
        <div class="card">
          <img src="https://source.unsplash.com/random/400x200?chatbot" alt="Project Three">
          <div class="card-body">
            <div class="card-title editable" data-key="proj3-title">${c["proj3-title"]}</div>
            <div class="card-text editable" data-key="proj3-desc">${c["proj3-desc"]}</div>
            <a href="#" class="editable" data-key="proj3-link">${c["proj3-link"]}</a>
          </div>
        </div>
      </div>
    </div>
    <footer>
      <p class="editable" data-key="footer-text">${c["footer-text"]}</p>
    </footer>
    ${commonScript}
  </body>
  </html>
  `;
}

function renderCertificates(c) {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title class="editable" data-key="nav-certificates">${c["nav-certificates"]} - ${c["header-title"]}</title>
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
        transition: transform 0.3s ease, opacity 0.3s ease;
        animation: fadeIn 0.8s ease-out;
      }
      .card:hover { transform: translateY(-5px); opacity: 0.95; }
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
  <body data-theme="dark" data-edit="false">
    <header>
      <h1 class="editable" data-key="header-title">${c["header-title"]}</h1>
      <p class="editable" data-key="header-subtitle">Certificates</p>
      <div class="header-buttons">
        <button id="theme-toggle" title="Toggle Dark/Light Mode">☀</button>
        <button id="settings-toggle" title="Theme Settings">⚙</button>
        <button id="edit-toggle" title="Toggle Edit Mode">Edit</button>
        <button id="save-btn" title="Save Changes" style="display:none;">💾</button>
      </div>
    </header>
    <nav>
      <a href="/" class="editable" data-key="nav-home">${c["nav-home"]}</a>
      <a href="/resume" class="editable" data-key="nav-resume">${c["nav-resume"]}</a>
      <a href="/projects" class="editable" data-key="nav-projects">${c["nav-projects"]}</a>
      <a href="/certificates" class="editable" data-key="nav-certificates">${c["nav-certificates"]}</a>
    </nav>
    <div class="container">
      <div class="cards">
        <div class="card">
          <img src="https://source.unsplash.com/random/400x200?certificate" alt="Certificate One">
          <div class="card-body">
            <div class="card-title editable" data-key="cert1-title">Certificate One</div>
            <div class="card-text editable" data-key="cert1-desc">Issued by [Organization Name] on [Date].</div>
            <a href="#" class="editable" data-key="cert1-link">View Certificate</a>
          </div>
        </div>
        <div class="card">
          <img src="https://source.unsplash.com/random/400x200?award" alt="Certificate Two">
          <div class="card-body">
            <div class="card-title editable" data-key="cert2-title">Certificate Two</div>
            <div class="card-text editable" data-key="cert2-desc">Issued by [Organization Name] on [Date].</div>
            <a href="#" class="editable" data-key="cert2-link">View Certificate</a>
          </div>
        </div>
      </div>
    </div>
    <footer>
      <p class="editable" data-key="footer-text">${c["footer-text"]}</p>
    </footer>
    ${commonScript}
  </body>
  </html>
  `;
}

// End of Worker script.
