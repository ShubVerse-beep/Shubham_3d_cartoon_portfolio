/* ------------------------------------------------------------------
   All editable content lives here. Update the text / links and reload.
   - For each project, set `live` (deployed URL) and `code` (repo URL).
     Left as null, "Code" falls back to your GitHub profile and the
     "Live" button is hidden.
------------------------------------------------------------------- */
window.SITE = {
  github: 'https://github.com/ShubVerse-beep',

  roles: ['AI / ML ENGINEER', 'FULL-STACK DEVELOPER', 'COMPUTER VISION BUILDER', 'AR / VR DEVELOPER', 'TEAM LEADER'],

  projects: [
    {
      n: '01', art: 'health', title: 'GramHealth', sub: 'Adaptive AI healthcare platform', featured: true,
      desc: 'AI-assisted rural healthcare platform built around medical RAG, semantic retrieval, offline-first workflows and multi-agent routing — evidence-grounded answers on a FastAPI + Supabase architecture that adapts to patchy connectivity.',
      tags: ['Medical RAG', 'FastAPI', 'Supabase', 'Multi-agent', 'Offline-first'], live: null, code: null
    },
    {
      n: '02', art: 'shield', title: 'Fake News & Deepfake Detection', sub: 'Hybrid verification platform',
      desc: 'Hybrid detection platform combining NLP / transformer models, computer vision, rule-based checks and fact-checking APIs, exposed through API-driven real-time verification.',
      tags: ['NLP', 'Transformers', 'BERT', 'Computer Vision', 'REST API'], live: null, code: null
    },
    {
      n: '03', art: 'grid', title: 'BatchGen AI', sub: 'Local bulk image-generation automation',
      desc: 'Local automation workflow with a FastAPI backend, SQLite job queues, deterministic prompt parsing, WebSocket telemetry, retry / recovery logic and hardware-aware concurrency driving ComfyUI workflows.',
      tags: ['FastAPI', 'SQLite', 'WebSockets', 'ComfyUI'], live: null, code: null
    },
    {
      n: '04', art: 'pulse', title: 'ProductPulse AI', sub: 'Product intelligence platform',
      desc: 'Platform concept for monitoring products, competitors, prices and reviews, with AI-assisted analysis and data-visualisation workflows on React, Supabase and PostgreSQL.',
      tags: ['React', 'Supabase', 'PostgreSQL', 'Data viz'], live: null, code: null
    },
    {
      n: '05', art: 'face', title: 'Face-Recognition Attendance', sub: 'Computer-vision automation',
      desc: 'Automated attendance system using face recognition and computer vision, with anti-spoofing mechanisms to prevent proxy attendance and cut manual effort.',
      tags: ['Python', 'OpenCV', 'Computer Vision', 'Anti-spoofing'], live: null, code: null
    },
    {
      n: '06', art: 'vr', title: 'AR / VR Applications', sub: 'Immersive 3D experiences',
      desc: 'Interactive AR / VR applications with immersive 3D environments, built with a focus on usability, performance and real-time interaction.',
      tags: ['AR', 'VR', '3D', 'Real-time'], live: null, code: null
    },
    {
      n: '07', art: 'leaf', title: 'Project Kisan', sub: 'HackOrbit 2025 · Finalist',
      desc: 'Farmer-focused mobile application led by Shubham as part of Team Mavericks — the team reached the finals of HackOrbit 2025.',
      tags: ['Mobile app', 'Team lead', 'Hackathon'], live: null, code: null
    }
  ],

  skills: [
    { g: 'Languages', i: '{ }', items: ['Python', 'C', 'C++', 'Java', 'JavaScript', 'HTML', 'CSS'] },
    { g: 'AI / ML', i: '✦', items: ['NLP', 'Transformers', 'BERT', 'CNN', 'YOLO', 'Computer Vision', 'OpenCV', 'TensorFlow', 'PyTorch', 'Hugging Face'] },
    { g: 'Development', i: '&lt;/&gt;', items: ['React', 'Django', 'Flask', 'FastAPI', 'REST APIs', 'Streamlit', 'Flutter'] },
    { g: 'Data & Databases', i: '▤', items: ['Pandas', 'NumPy', 'Xarray', 'NetCDF', 'MySQL', 'PostgreSQL', 'Supabase', 'SQLite', 'ChromaDB'] },
    { g: 'Tools & Deploy', i: '⚙', items: ['Git', 'GitHub', 'VS Code', 'Docker', 'Vercel', 'Render', 'JWT'] },
    { g: 'People skills', i: '☺', items: ['Leadership', 'Public Relations', 'Event Coordination', 'Communication', 'Time Management', 'Team Coordination'] }
  ],

  timeline: [
    { when: 'FINAL YEAR', title: 'B.E. in Computer Engineering', org: 'St. John College of Engineering and Management, Palghar', body: 'CGPA 8.6. Focus on AI / ML, computer vision and full-stack development.', kind: 'edu' },
    { when: 'NOW', title: 'Technical Joint Head', org: 'SPCA · Student organisation', body: 'Technical coordination, student initiatives and technology-related activities — balancing hands-on work with planning and team communication.', kind: 'role' },
    { when: 'PAST', title: 'PR Team Co-Head', org: 'SPCA · Student organisation', body: 'Supported communication, coordination and outreach for collaborative student activities.', kind: 'role' },
    { when: '2025', title: 'HackOrbit 2025 — Finalist', org: 'Team Mavericks', body: 'Led Project Kisan, a farmer-focused mobile application, to the finals.', kind: 'win' },
    { when: 'WIN', title: '1st Place — Hackathon / Startup Challenge', org: 'Chandigarh University', body: 'Took first place at the Chandigarh University Hackathon / Startup Challenge.', kind: 'win' }
  ],

  certs: [
    'Python Zero to Hero — DevTown (2025)', 'Array Mastery — DevTown (2025)', 'Angular Development Certification',
    'Database Management System — Infosys Springboard', 'Programming in Java — Infosys Springboard', 'AR/VR & Game Development — IOFT'
  ]
};
