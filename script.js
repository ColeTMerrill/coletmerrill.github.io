// 1. Multi-Theme Switcher with Full-Page Ripple Wash & Canvas Sync
const themeColors = {
    ocean:    { particle: '56, 189, 248',  cursor: '16, 185, 129', ripple: 'linear-gradient(135deg, #070d19, #38bdf8)' },
    gold:     { particle: '234, 179, 8',   cursor: '245, 158, 11', ripple: 'linear-gradient(135deg, #211c12, #eab308)' },
    emerald:  { particle: '5, 150, 105',   cursor: '13, 148, 136', ripple: 'linear-gradient(135deg, #d8ebe3, #059669)' },
    amethyst: { particle: '244, 63, 94',   cursor: '192, 132, 252', ripple: 'linear-gradient(135deg, #2d0c23, #f43f5e)' },
    daylight: { particle: '37, 99, 235',   cursor: '8, 145, 178',  ripple: 'linear-gradient(135deg, #f8fafc, #2563eb)' }
};

let activeParticleRGB = themeColors.gold.particle;
let activeCursorRGB = themeColors.gold.cursor;

const themeBtns = document.querySelectorAll('.theme-btn');
const themeRipple = document.getElementById('themeRipple');

function applyTheme(themeKey, clickEvent) {
    const config = themeColors[themeKey] || themeColors.gold;
    activeParticleRGB = config.particle;
    activeCursorRGB = config.cursor;

    if (clickEvent && themeRipple) {
        const rect = clickEvent.currentTarget.getBoundingClientRect();
        themeRipple.style.left = `${rect.left + rect.width / 2}px`;
        themeRipple.style.top = `${rect.top + rect.height / 2}px`;
        themeRipple.style.background = config.ripple;
        themeRipple.classList.remove('animate');
        void themeRipple.offsetWidth;
        themeRipple.classList.add('animate');
    }

    document.documentElement.setAttribute('data-theme', themeKey);
    themeBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.themeTarget === themeKey);
    });
    localStorage.setItem('cole_portfolio_theme', themeKey);
}

themeBtns.forEach(btn => {
    btn.addEventListener('click', e => {
        applyTheme(btn.dataset.themeTarget, e);
    });
});

const savedTheme = localStorage.getItem('cole_portfolio_theme') || 'gold';
applyTheme(savedTheme, null);

// 2. Live Interactive Constellation Canvas on Hero Landing Page
const canvas = document.getElementById('heroCanvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    const mouse = { x: null, y: null, radius: 135 };

    function resizeCanvas() {
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    window.addEventListener('mousemove', e => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    const count = 58;
    for (let i = 0; i < count; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.55,
            vy: (Math.random() - 0.5) * 0.55,
            size: Math.random() * 2 + 1
        });
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${activeParticleRGB}, 0.55)`;
            ctx.fill();

            // Connect nearby particles
            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.hypot(dx, dy);

                if (dist < 125) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(${activeParticleRGB}, ${0.2 * (1 - dist / 125)})`;
                    ctx.lineWidth = 1;
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }

            // Connect to cursor
            if (mouse.x !== null && mouse.y !== null) {
                const dx = p.x - mouse.x;
                const dy = p.y - mouse.y;
                const dist = Math.hypot(dx, dy);
                if (dist < mouse.radius) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(${activeCursorRGB}, ${0.38 * (1 - dist / mouse.radius)})`;
                    ctx.lineWidth = 1.2;
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animateParticles);
    }
    animateParticles();
}

// 3. Dynamic Scroll-Spy Navigation
const sections = document.querySelectorAll('.scroll-section');
const navItems = document.querySelectorAll('.nav-item');

function updateActiveNav() {
    const scrollPos = window.scrollY + window.innerHeight * 0.35;
    let currentId = 'home';

    sections.forEach(sec => {
        if (scrollPos >= sec.offsetTop) {
            currentId = sec.id;
        }
    });

    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 40) {
        currentId = 'contact-footer';
    }

    navItems.forEach(link => {
        link.classList.toggle('active', link.dataset.section === currentId);
    });
}

window.addEventListener('scroll', updateActiveNav, { passive: true });
updateActiveNav();

// 4. Portfolio Deep-Dive Modals
const projectDetails = {
    cfc: {
        kicker: 'CODE FOR CHANGE • CO-FOUNDER (SEP 2022 – MAY 2024)',
        title: 'Scalable Data Pipelines & AI Retraining Workflows',
        body: 'Co-founded and directed Data & Operations for a technology organization focused on delivering data solutions for partner organizations under tight budget constraints.',
        bullets: [
            'Architected scalable Python and SQL data collection pipelines and AI model retraining workflows.',
            'Established weekly agile development sprints, code reviews, and iterative testing to improve team delivery velocity.',
            'Led cross-functional teams to translate technical data tools into measurable real-world impact for partner organizations.'
        ]
    },
    rimidi: {
        kicker: 'RIMIDI • STRATEGIC ANALYSIS INTERN',
        title: 'Healthcare Market Positioning & Asset Evaluation Framework',
        body: 'Supported executive investment and product positioning strategy in the digital health and remote patient monitoring space.',
        bullets: [
            'Designed a structured decision tree evaluating healthcare software assets across pricing, EHR integration, and regulatory complexity.',
            'Engineered a systematic cross-market dataset in Google Sheets to benchmark competitor pricing architectures and service offerings.',
            'Distilled complex technical and pricing datasets into succinct executive summaries for leadership decision-making.'
        ]
    },
    joint: {
        kicker: 'THE JOINT CHIROPRACTIC • DATA & OPERATIONS COORDINATOR',
        title: 'Demand-Based Pricing & Clinic Workflow Optimization',
        body: 'Directed site-level operational and pricing analysis from Nov 2023 to Mar 2026, aligning clinic capacity and membership tiers with local market trends.',
        bullets: [
            'Modeled membership pricing structures against local market demand and demographic trends to maximize new-patient conversion.',
            'Analyzed site-level engagement and foot-traffic data to drive long-term client retention and facility utilization.',
            'Evaluated spatial clinic workflows and peak-hour utilization data to eliminate bottlenecks and keep wait times under 10 minutes.'
        ]
    },
    systems: {
        kicker: 'SOFTWARE & SYSTEMS ENGINEERING',
        title: 'Multi-Monitor Computer Vision Controller & C++ Audio Engine',
        body: 'Custom desktop engineering projects combining computer vision, spatial coordinate mapping, and low-level graphics programming.',
        bullets: [
            'Multi-Monitor Gesture Controller: Built a Python application using OpenCV and MediaPipe to track hand landmarks via webcam and control cursor movement/clicks across a 3-monitor setup.',
            'Real-Time Audio Visualizer: Developed a native C++ application using the Windows API and GDI to render live frequency spectrums across radial, subwoofer, and horizontal layouts.'
        ]
    }
};

const modal = document.getElementById('detailModal');
const modalKicker = document.getElementById('modalKicker');
const modalTitle = document.getElementById('modalTitle');
const modalBody = document.getElementById('modalBody');
const modalBullets = document.getElementById('modalBullets');

document.querySelectorAll('.project-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const data = projectDetails[btn.dataset.modal];
        if (!data) return;

        modalKicker.textContent = data.kicker;
        modalTitle.textContent = data.title;
        modalBody.textContent = data.body;
        modalBullets.innerHTML = data.bullets.map(b => `<li>${b}</li>`).join('');
        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
    });
});

document.getElementById('closeModal').addEventListener('click', () => {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
});

modal.addEventListener('click', e => {
    if (e.target === modal) {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
    }
});

// 5. Interactive Footer Toolkit Tabs (4 Categories + Staggered Slide-In)
const toolkitData = {
    strategy: [
        'Competitive Benchmarking',
        'Market Positioning',
        'Healthcare Strategy',
        'Process Improvement',
        'Public Policy Analysis'
    ],
    finance: [
        'Financial Management (MGT 3062)',
        'Financial & Managerial Accounting',
        'P&L Budgeting & Forecasting',
        'Excel (XLOOKUP, SUMIF)',
        'Pricing Architecture'
    ],
    tech: [
        'Python (OpenCV / MediaPipe)',
        'SQL & Data Pipelines',
        'C++ (Win32 / GDI)',
        'AI Workflows (ChatGPT, Claude, Gemini)',
        'Spanish (Fluent)'
    ],
    interests: [
        'Investing & Markets',
        'Rock Climbing',
        'International Travel & Hiking',
        'Strategy Games & Chess',
        'PC Gaming',
        'Systems Programming'
    ]
};

const ftabPanel = document.getElementById('ftabPanel');
document.querySelectorAll('.ftab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.ftab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const items = toolkitData[tab.dataset.tab] || [];
        ftabPanel.innerHTML = items
            .map((item, idx) => `<span class="fchip" style="animation-delay: ${idx * 45}ms"><span class="chip-dot"></span>${item}</span>`)
            .join('');
    });
});

// 6. Back to Top Button
const backToTopBtn = document.getElementById('backToTopBtn');
if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// 7. Live Atlanta Clock in Footer
function updateClock() {
    const now = new Date();
    const formatted = now.toLocaleTimeString('en-US', {
        timeZone: 'America/New_York',
        hour: '2-digit',
        minute: '2-digit'
    });
    const el = document.getElementById('atlantaClock');
    if (el) el.textContent = formatted + ' EST';
}
updateClock();
setInterval(updateClock, 15000);

// 8. Click-to-Copy Toast
const toast = document.getElementById('toast');
document.querySelectorAll('.copy-trigger').forEach(btn => {
    btn.addEventListener('click', () => {
        const text = btn.dataset.copy;
        navigator.clipboard.writeText(text).then(() => {
            toast.textContent = `Copied ${text} to clipboard!`;
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 2800);
        });
    });
});