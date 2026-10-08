<div align="center">

# ⚡ SHUBHAM SAWANT — 3D CARTOON PORTFOLIO
### *Turning AI research into real-time interactive products.*

[![Portfolio](https://img.shields.io/badge/Live_Portfolio-0B0C16?style=for-the-badge&logo=safari&logoColor=1E94F6)](https://shubverse-beep.github.io/Shubham_3d_cartoon_portfolio/)
[![GitHub](https://img.shields.io/badge/GitHub-ShubVerse--beep-1F5BFF?style=for-the-badge&logo=github&logoColor=FBFAF3)](https://github.com/ShubVerse-beep)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-shub2205-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/shub2205)
[![Email](https://img.shields.io/badge/Contact-shubhamsawant2205%40gmail.com-FFB79B?style=for-the-badge&logo=gmail&logoColor=0B0C16)](mailto:shubhamsawant2205@gmail.com)

<br/>

```
  ┌────────────────────────────────────────────────────────────────────────┐
  │  ● INITIALIZING SYSTEM   ::   SS / 2026   ::   MUMBAI, INDIA           │
  │  [ AI / ML ENGINEER ]  [ FULL-STACK BUILDER ]  [ COMPUTER VISION ENG ] │
  └────────────────────────────────────────────────────────────────────────┘
```

<p align="center">
  <img src="assets/body.webp" width="130" alt="Shubham 3D Avatar Body" style="display:inline-block; vertical-align:middle;" />
  <img src="assets/head.webp" width="130" alt="Shubham 3D Avatar Head" style="display:inline-block; vertical-align:middle;" />
  <img src="assets/depth.png" width="130" alt="Depth Map" style="display:inline-block; vertical-align:middle;" />
</p>
<p align="center"><i>Body Layer · Head Color Texture · WebGL Parallax Depth Map</i></p>

---

</div>

## 🌟 Overview

Welcome to the official repository of **Shubham Sawant's Interactive 3D Cartoon Portfolio**. 

Built with **zero external framework dependencies** (no React/Vue bundle overhead, no build steps), this site pairs **modern graphic engineering** with a signature **WebGL 2.5D depth-mapped cartoon character** that dynamically turns, tilts, and tracks the user's cursor with natural spring-damped physics.

### 🎯 Key Highlights & Vitals
| Metric | Value | Detail |
| :--- | :--- | :--- |
| 🎓 **Degree** | **B.E. Computer Engineering** | St. John College of Engineering & Mgmt, Palghar (Final Year) |
| 📈 **CGPA** | **8.6 / 10.0** | Specialization in AI/ML, Computer Vision & Full-Stack Systems |
| 🏆 **Hackathon** | **1st Place Winner** | Chandigarh University Hackathon & Startup Challenge |
| 🚀 **Leadership** | **Finalist & Team Lead** | HackOrbit 2025 · *Project Kisan* (Team Mavericks) |
| 🛡️ **Role** | **Technical Joint Head** | SPCA Student Organisation |
| 📍 **Location** | **Mumbai, India** | Open to AI/ML & Full-Stack Engineering Opportunities |

---

## 🎨 Theme & Design System

The visual identity is derived directly from Shubham’s cartoon avatar — mixing high-energy electric blues with warm peach accents and deep midnight ink:

### 🌈 Color Tokens
```css
--sky-1:    #0f7be8;   /* Bright electric sky */
--sky-2:    #1e94f6;   /* Primary accent */
--sky-3:    #2bb1ff;   /* Highlight glow */
--royal:    #1f5bff;   /* Royal blue button & headers */
--royal-d:  #0f3fd0;   /* Royal hover shade */
--ink:      #0b0c16;   /* Midnight obsidian backdrop & text */
--ink-2:    #14162a;   /* Deep navy card surface */
--cream:    #fbfaf3;   /* Clean card highlights & light type */
--cream-2:  #f1efe4;   /* Warm neutral tone */
--peach:    #ffb79b;   /* Warm blush interactive highlights */
--peach-2:  #ff9a78;   /* Peach hover state */
```

### 🔤 Typography
- **Display Font**: [`Archivo`](https://fonts.google.com/specimen/Archivo) *(Variable `wdth: 125%`, heavy weights 800–900)* — Bold, punchy headlines.
- **Body Font**: [`Inter`](https://fonts.google.com/specimen/Inter) *(Weights 400–700)* — Ultra-legible, crisp technical reading experience.
- **Monospace Accent**: [`JetBrains Mono`](https://fonts.google.com/specimen/JetBrains+Mono) *(Weights 500, 700)* — Terminal tags, subtitles, and system readouts.

---

## 🧠 The Signature 3D Character Engine

The marquee feature of this portfolio is the **interactive avatar** in the hero section:

```
[ Cursor / Touch ] 
       │
       ▼
[ Spring Physics ] ────► pos += vel; vel += (target - pos) * stiffness - vel * damping;
       │
       ├────────────────────────────────────────┬────────────────────────────────────────┐
       ▼                                        ▼                                        ▼
[ CSS 3D Transform ]                     [ WebGL Canvas ]                       [ Dynamic Light ]
rotateY(-pos.x * 24deg)           Iterative Ray-Parallax Shader            Calculates surface normal
rotateX(pos.y * 18deg)            from 8-bit depth map texture             deltas to cast moving specular
translateZ(40px)                  (assets/depth.png)                       highlights across the face
```

### 🔬 Technical Implementation:
1. **Layer Separation**: The character is bifurcated into `assets/body.webp` (static torso) and `assets/head.webp` (interactive head).
2. **Ray-Marching Relief Mapping**: The WebGL fragment shader performs iterative displacement sampling across `assets/depth.png`:
   ```glsl
   // 4-step fixed-point parallax offset based on depth brightness
   for(int i = 0; i < 4; i++) {
       float d = texture2D(uD, q).r;
       q = v - uM * (d - 0.30) * uS;
   }
   ```
3. **Dynamic Normal Estimation**: Computes spatial depth deltas $(dx, dy)$ in real time to generate surface normals, giving realistic light wrap around cheekbones and glasses:
   ```glsl
   vec3 n = normalize(vec3(-dx * 5.0, -dy * 5.0, 1.0));
   vec3 L = normalize(vec3(-uM.x * 0.7 + 0.25, -uM.y * 0.7 - 0.35, 1.0));
   float s = dot(n, L) - dot(vec3(0.0, 0.0, 1.0), L);
   c.rgb *= 1.0 + clamp(s, -0.2, 0.2) * 0.55;
   ```
4. **Zero-CORS Offline Resilience**: Browsers block WebGL canvas access to local file textures when loaded via `file://`. A custom Python packer (`tools/build_inline.py`) bakes `assets/head.webp` and `assets/depth.png` into data-URIs in `js/assets-inline.js`, allowing full offline local execution without running a web server.

---

## 💻 Tech Stack & Tooling

<div align="center">

| Domain | Technologies & Frameworks |
| :--- | :--- |
| **Languages** | `Python` · `JavaScript (ES6+)` · `C / C++` · `Java` · `HTML5` · `CSS3` |
| **AI / ML & Vision** | `PyTorch` · `TensorFlow` · `Transformers (BERT)` · `YOLO` · `OpenCV` · `Hugging Face` · `RAG` |
| **Backend & Web** | `FastAPI` · `Flask` · `Django` · `React` · `Streamlit` · `Flutter` · `REST APIs` · `WebSockets` |
| **Databases & Data** | `PostgreSQL` · `Supabase` · `SQLite` · `ChromaDB` · `Pandas` · `NumPy` · `Xarray` · `NetCDF` |
| **Graphics & 3D** | `WebGL` · `GLSL Shaders` · `Canvas 2D` · `CSS 3D Transforms` · `ComfyUI` |
| **DevOps & Tools** | `Git` · `GitHub` · `Docker` · `VS Code` · `Vercel` · `Render` · `JWT` |

</div>

---

## 📂 Featured Projects

### `01` GramHealth — Adaptive AI Healthcare Platform
> **Tags**: `Medical RAG` · `FastAPI` · `Supabase` · `Multi-Agent` · `Offline-First`
- AI-assisted rural healthcare platform engineered with clinical RAG, semantic retrieval, and multi-agent routing.
- Designed with an offline-first architecture that functions resiliently in remote environments with intermittent connectivity.

### `02` Hybrid Fake News & Deepfake Detection
> **Tags**: `NLP` · `Transformers` · `BERT` · `Computer Vision` · `REST API`
- Multi-modal verification platform fusing transformer language models (BERT), computer vision artifacts, and fact-checking APIs.
- Real-time API service for content verification and manipulation detection.

### `03` BatchGen AI — Local Bulk Generation Automation
> **Tags**: `FastAPI` · `SQLite` · `WebSockets` · `ComfyUI`
- Local generation orchestrator driving ComfyUI pipelines via deterministic prompt parsing, SQLite priority queues, live WebSocket telemetry, and hardware-aware GPU concurrency.

### `04` ProductPulse AI — Market Intelligence Engine
> **Tags**: `React` · `Supabase` · `PostgreSQL` · `Data Viz`
- Competitive analysis dashboard monitoring real-time pricing, customer sentiment, and product trends with interactive visual analytics.

### `05` Face-Recognition Attendance System
> **Tags**: `Python` · `OpenCV` · `Computer Vision` · `Anti-Spoofing`
- High-throughput attendance automation with anti-spoofing liveness verification to eradicate proxy marking.

### `06` AR / VR Applications
> **Tags**: `AR` · `VR` · `3D` · `Real-Time Interaction`
- Spatial environments and augmented reality applications crafted for immersion and smooth frame delivery.

### `07` Project Kisan — HackOrbit 2025 Finalist
> **Tags**: `Mobile App` · `Team Lead` · `Hackathon Finalist`
- Farmer-centric agricultural decision platform led by Shubham (Team Mavericks), reaching the finals of HackOrbit 2025.

---

## 📁 Repository Structure

```
portfolio/
├── 📄 index.html             # Semantic single-page structure with accessible micro-interactions
├── 📄 README.md              # Project documentation, architecture & personal profile
├── 📁 assets/
│   ├── 👤 body.webp          # 2D torso art cut from cartoon avatar
│   ├── 👤 head.webp          # High-resolution head texture for WebGL shader
│   ├── 👤 head-sm.webp       # Avatar sticker thumbnail for 'About' card
│   ├── 👤 me.webp            # Real photograph of Shubham Sawant
│   ├── 🗺️ depth.png          # 8-bit grayscale parallax depth map
│   ├── 📑 Shubham_Sawant_Resume.pdf # Downloadable resume
│   └── 🎨 favicon.png        # Custom browser icon
├── 📁 css/
│   └── 🎨 style.css          # Design system, responsive layout, glassmorphism & typography
├── 📁 js/
│   ├── ⚙️ data.js            # Central content store (Projects, Skills, Timeline, Certs)
│   ├── 🤖 character.js       # WebGL depth-parallax shader & spring physics engine
│   ├── 📦 assets-inline.js   # Base64 baked textures for zero-server file:// execution
│   └── 🚀 main.js            # Preloader, smooth scroll, marquee, stats counter, custom cursor
└── 📁 tools/
    └── 🐍 build_inline.py    # Python script compiling binary textures into assets-inline.js
```

---

## 🚀 Quickstart & Local Setup

Because this site has **no dependencies** and **no build step**, you can run it immediately:

### Option 1: Direct File (Zero Server)
Double-click `index.html` to open it in Chrome, Edge, Brave, or Safari. The inline base64 fallback in `js/assets-inline.js` ensures WebGL loads without CORS limitations.

### Option 2: Local HTTP Server
```bash
# Clone the repository
git clone https://github.com/ShubVerse-beep/Shubham_3d_cartoon_portfolio.git
cd Shubham_3d_cartoon_portfolio

# Start a local python server
python -m http.server 8000
```
Open **[http://localhost:8000](http://localhost:8000)** in your browser.

### Option 3: Refreshing Textures (Optional)
If you update `assets/head.webp` or `assets/depth.png`:
```bash
python tools/build_inline.py
```

---

## 📜 Certifications & Honors

- 🏆 **1st Place** — Chandigarh University Hackathon / Startup Challenge
- 🏅 **Finalist** — HackOrbit 2025 (Project Kisan)
- 📜 **Python Zero to Hero** — DevTown (2025)
- 📜 **Array Mastery** — DevTown (2025)
- 📜 **Angular Development Certification**
- 📜 **Database Management System** — Infosys Springboard
- 📜 **Programming in Java** — Infosys Springboard
- 📜 **AR/VR & Game Development** — IOFT

---

## 📬 Contact & Connect

<div align="center">

**Open to internships, AI/ML engineering roles, and collaborative product builds.**

[![Email](https://img.shields.io/badge/Email-shubhamsawant2205%40gmail.com-FFB79B?style=for-the-badge&logo=gmail&logoColor=0B0C16)](mailto:shubhamsawant2205@gmail.com)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Shubham_Sawant-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/shub2205)
[![Phone](https://img.shields.io/badge/Phone-%2B91_88477_10196-1E94F6?style=for-the-badge&logo=whatsapp&logoColor=white)](tel:+918847710196)
[![GitHub](https://img.shields.io/badge/GitHub-ShubVerse--beep-1F5BFF?style=for-the-badge&logo=github&logoColor=FBFAF3)](https://github.com/ShubVerse-beep)

<br/>

<sub>© 2026 Shubham Sawant · Designed & Built with Vanilla HTML · CSS · WebGL</sub>

</div>
