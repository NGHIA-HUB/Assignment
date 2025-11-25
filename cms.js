/**
 * ELEGAT CMS - Frontend Renderer
 * File này render dữ liệu từ localStorage lên trang Landing Page
 * Dùng cho: Assignment.html
 */

const DATA_KEY = 'elegat_cms_data';
let cmsData = null;
let carouselIndex = 0;
let carouselTimer = null;

// ==================== KHỞI TẠO ====================
document.addEventListener('DOMContentLoaded', initCMS);

async function initCMS() {
    await loadData();
    
    // Render các section có dữ liệu động
    if (document.getElementById('services-list')) renderServices();
    if (document.getElementById('testimonials-list')) renderTestimonials();
    if (document.getElementById('portfolio-list')) renderPortfolio();
    if (document.getElementById('team-list')) renderTeam();
    if (document.getElementById('stats-section')) renderStats();
    if (document.getElementById('contact-info')) renderContact();
    
    // Khởi động carousel testimonials
    startCarousel();
}

// Load dữ liệu từ localStorage
async function loadData() {
    const stored = localStorage.getItem(DATA_KEY);
    if (stored) {
        try {
            cmsData = JSON.parse(stored);
            console.log('✅ CMS: Loaded from localStorage');
            return;
        } catch (e) {
            console.warn('CMS: Invalid localStorage');
        }
    }
    
    // Fetch từ data.json nếu chưa có
    try {
        const resp = await fetch('data.json');
        if (resp.ok) {
            cmsData = await resp.json();
            localStorage.setItem(DATA_KEY, JSON.stringify(cmsData));
            console.log('✅ CMS: Loaded from data.json');
            return;
        }
    } catch (e) {
        console.warn('CMS: Could not fetch data.json');
    }
    
    // Dữ liệu mặc định
    cmsData = getDefaultData();
}

function getDefaultData() {
    return {
        services: [
            { id: 's1', icon: '📊', title: 'Nesciunt Mete', description: 'Provident nihil minus qui consequatur non omnis maiores. Eos accusantium minus dolores iure perferendis.' },
            { id: 's2', icon: '📡', title: 'Eosle Commodi', description: 'Ut autem aut autem non a. Sint sint sit facilis nam iusto sint. Libero corrupti neque eum hic non ut nesciunt dolorem.' },
            { id: 's3', icon: '🎨', title: 'Ledo Markt', description: 'Ut excepturi voluptatem nisi sed. Quidem fuga consequatur. Minus ea aut. Vel qui id voluptas adipisci eos earum corrupti.' },
            { id: 's4', icon: '⬡', title: 'Asperiores Commodit', description: 'Non et temporibus minus omnis sed dolor esse consequatur. Cupiditate sed error ea fuga sit provident adipisci neque.' },
            { id: 's5', icon: '📅', title: 'Velit Doloremque', description: 'Cumque et suscipit saepe. Est maiores autem enim facilis ut aut ipsam corporis aut. Sed animi at autem alias eius labore.' },
            { id: 's6', icon: '💬', title: 'Dolori Architecto', description: 'Hic molestias ea quibusdam eos. Fugiat enim doloremque aut neque non et debitis iure. Corrupti recusandae ducimus enim.' }
        ],
        testimonials: [
            { id: 't1', quote: 'Proin iaculis purus consequat sem cure digni ssim donec porttitora entum suscipit rhoncus. Accusantium quam, ultricies eget id, aliquam eget nibh et.', name: 'Saul Goodman', role: 'CEO & Founder', image: 'img/testimonials-1.jpg.png' },
            { id: 't2', quote: 'Fugiat enim eram quae cillum dolore dolor amet nulla culpa multos export minim fugiat dolor enim duis veniam ipsum anim magna sunt elit fore quem dolore.', name: 'Matt Brandon', role: 'Freelancer', image: 'img/testimonials-4.jpg.png' },
            { id: 't3', quote: 'Quis quorum aliqua sint quem legam fore sunt eram irure aliqua veniam tempor noster veniam sunt culpa nulla illum cillum fugiat legam esse veniam culpa.', name: 'John Larson', role: 'Entrepreneur', image: 'img/testimonials-5.jpg.png' }
        ],
        portfolio: [],
        team: [],
        stats: { clients: 232, projects: 521, hours: 1453, workers: 32 },
        contact: { address: 'A108 Adam Street, New York, NY 535022', phone: '+1 5589 55488 55', email: 'info@example.com', map: '' }
    };
}

// Helper: Escape HTML
function esc(str) {
    if (!str && str !== 0) return '';
    return String(str).replace(/[&<>"']/g, s => 
        ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[s]
    );
}

// ==================== RENDER SERVICES ====================
function renderServices() {
    const container = document.getElementById('services-list');
    if (!container || !cmsData.services) return;
    
    // Map icon text to SVG icons (hoặc dùng emoji)
    const iconMap = {
        '📊': `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-activity text-white" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M6 2a.5.5 0 0 1 .47.33L10 12.036l1.53-4.208A.5.5 0 0 1 12 7.5h3.5a.5.5 0 0 1 0 1h-3.15l-1.88 5.17a.5.5 0 0 1-.94 0L6 3.964 4.47 8.171A.5.5 0 0 1 4 8.5H.5a.5.5 0 0 1 0-1h3.15l1.88-5.17A.5.5 0 0 1 6 2"/></svg>`,
        '📡': `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-broadcast text-white" viewBox="0 0 16 16"><path d="M3.05 3.05a7 7 0 0 0 0 9.9.5.5 0 0 1-.707.707 8 8 0 0 1 0-11.314.5.5 0 0 1 .707.707m2.122 2.122a4 4 0 0 0 0 5.656.5.5 0 1 1-.708.708 5 5 0 0 1 0-7.072.5.5 0 0 1 .708.708m5.656-.708a.5.5 0 0 1 .708 0 5 5 0 0 1 0 7.072.5.5 0 1 1-.708-.708 4 4 0 0 0 0-5.656.5.5 0 0 1 0-.708m2.122-2.12a.5.5 0 0 1 .707 0 8 8 0 0 1 0 11.313.5.5 0 0 1-.707-.707 7 7 0 0 0 0-9.9.5.5 0 0 1 0-.707zM10 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0"/></svg>`,
        '🎨': `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-easel text-white" viewBox="0 0 16 16"><path d="M8 0a.5.5 0 0 1 .473.337L9.046 2H14a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-1.85l1.323 3.837a.5.5 0 1 1-.946.326L11.092 11H8.5v3a.5.5 0 0 1-1 0v-3H4.908l-1.435 4.163a.5.5 0 1 1-.946-.326L3.85 11H2a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h4.954L7.527.337A.5.5 0 0 1 8 0M2 3v7h12V3z"/></svg>`,
        '⬡': `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-bounding-box-circles text-white" viewBox="0 0 16 16"><path d="M2 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2M0 2a2 2 0 0 1 3.937-.5h8.126A2 2 0 1 1 14.5 3.937v8.126a2 2 0 1 1-2.437 2.437H3.937A2 2 0 1 1 1.5 12.063V3.937A2 2 0 0 1 0 2m2.5 1.937v8.126c.703.18 1.256.734 1.437 1.437h8.126a2 2 0 0 1 1.437-1.437V3.937A2 2 0 0 1 12.063 2.5H3.937A2 2 0 0 1 2.5 3.937M14 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2M2 13a1 1 0 1 0 0 2 1 1 0 0 0 0-2m12 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2"/></svg>`,
        '📅': `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-calendar4-week text-white" viewBox="0 0 16 16"><path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M2 2a1 1 0 0 0-1 1v1h14V3a1 1 0 0 0-1-1zm13 3H1v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1z"/><path d="M11 7.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm-3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm-2 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm-3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5z"/></svg>`,
        '💬': `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-chat-square-text text-white" viewBox="0 0 16 16"><path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-2.5a2 2 0 0 0-1.6.8L8 14.333 6.1 11.8a2 2 0 0 0-1.6-.8H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2.5a1 1 0 0 1 .8.4l1.9 2.533a1 1 0 0 0 1.6 0l1.9-2.533a1 1 0 0 1 .8-.4H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/><path d="M3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5M3 6a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 6m0 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5"/></svg>`
    };
    
    container.innerHTML = cmsData.services.map(svc => {
        const iconSvg = iconMap[svc.icon] || `<span style="font-size:2rem">${esc(svc.icon) || '📦'}</span>`;
        return `
            <div class="col-md-6 col-lg-4">
                <div class="service-card text-center h-100">
                    <div class="service-icon">${iconSvg}</div>
                    <h5 class="fw-bold text-secondary-custom mt-4 mb-3">${esc(svc.title)}</h5>
                    <p class="text-muted small">${esc(svc.description)}</p>
                </div>
            </div>
        `;
    }).join('');
}

// ==================== RENDER TESTIMONIALS ====================
function renderTestimonials() {
    const container = document.getElementById('testimonials-list');
    const indicators = document.getElementById('carousel-indicators');
    if (!container || !cmsData.testimonials) return;
    
    container.innerHTML = cmsData.testimonials.map((t, idx) => `
        <div class="col-md-6 col-lg-4 testimonial-item" data-index="${idx}" style="display: ${idx === 0 ? '' : 'none'}">
            <div class="card p-4 h-100 shadow-sm border-0">
                <div class="d-flex flex-column h-100">
                    <div class="mb-4 flex-grow-1">
                        <blockquote class="mb-0 text-dark" style="font-size: 0.95rem; font-style: italic;">
                            ${esc(t.quote)}
                        </blockquote>
                    </div>
                    <div class="d-flex flex-column align-items-center mt-auto pt-3">
                        <img src="${esc(t.image)}" alt="${esc(t.name)}" 
                             class="rounded-circle mb-2 border border-3 border-light"
                             style="width: 70px; height: 70px; object-fit: cover;"
                             onerror="this.style.display='none'">
                        <h6 class="fw-bold mb-0 text-dark">${esc(t.name)}</h6>
                        <small class="text-muted">${esc(t.role)}</small>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    
    // Render indicator dots
    if (indicators) {
        indicators.innerHTML = cmsData.testimonials.map((_, idx) => `
            <span class="carousel-indicator-dot ${idx === 0 ? 'active' : ''}" 
                  data-index="${idx}" style="cursor:pointer"></span>
        `).join('');
        
        // Add click handlers
        indicators.querySelectorAll('.carousel-indicator-dot').forEach(dot => {
            dot.addEventListener('click', () => {
                showTestimonial(parseInt(dot.dataset.index));
                resetCarouselTimer();
            });
        });
    }
}

function showTestimonial(index) {
    const items = document.querySelectorAll('.testimonial-item');
    const dots = document.querySelectorAll('.carousel-indicator-dot');
    
    items.forEach((item, i) => {
        item.style.display = i === index ? '' : 'none';
    });
    
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
    
    carouselIndex = index;
}

function nextTestimonial() {
    if (!cmsData.testimonials || cmsData.testimonials.length === 0) return;
    carouselIndex = (carouselIndex + 1) % cmsData.testimonials.length;
    showTestimonial(carouselIndex);
}

function startCarousel() {
    if (carouselTimer) clearInterval(carouselTimer);
    carouselTimer = setInterval(nextTestimonial, 4000);
}

function resetCarouselTimer() {
    startCarousel();
}

// ==================== RENDER PORTFOLIO ====================
function renderPortfolio() {
    const container = document.getElementById('portfolio-list');
    if (!container || !cmsData.portfolio || cmsData.portfolio.length === 0) return;
    
    container.innerHTML = cmsData.portfolio.map(p => `
        <div class="col-12 col-sm-6 col-lg-4 portfolio-item-wrap" data-category="${esc(p.category)}">
            <div class="portfolio-item">
                <img src="${esc(p.image)}" class="img-fluid" alt="${esc(p.title)}"
                     onerror="this.src='https://via.placeholder.com/400x300?text=Image'">
            </div>
        </div>
    `).join('');
    
    // Setup filter buttons
    setupPortfolioFilter();
}

function setupPortfolioFilter() {
    const buttons = document.querySelectorAll('.filter-btn');
    const items = document.querySelectorAll('.portfolio-item-wrap');
    
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            buttons.forEach(b => {
                b.classList.remove('active', 'btn-primary-custom');
                b.classList.add('btn-outline-secondary');
            });
            btn.classList.add('active', 'btn-primary-custom');
            btn.classList.remove('btn-outline-secondary');
            
            // Filter items
            const filter = btn.dataset.filter;
            items.forEach(item => {
                if (filter === 'all' || item.dataset.category === filter) {
                    item.style.display = '';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

// ==================== RENDER TEAM ====================
function renderTeam() {
    const container = document.getElementById('team-list');
    if (!container || !cmsData.team || cmsData.team.length === 0) return;
    
    container.innerHTML = cmsData.team.map(m => `
        <div class="col-md-6 col-lg-4">
            <div class="position-relative">
                <div class="overflow-hidden rounded shadow-lg">
                    <img src="${esc(m.image)}" class="img-fluid w-100" alt="${esc(m.name)}"
                         style="height: 450px; object-fit: cover;"
                         onerror="this.src='https://via.placeholder.com/400x450?text=Photo'">
                </div>
                <div class="position-absolute start-50 translate-middle-x bottom-0 w-100 px-4">
                    <div class="bg-white rounded-top shadow-lg p-4 text-center" style="margin-top: -80px; border: 1px solid #eee;">
                        <h5 class="fw-bold mb-1">${esc(m.name)}</h5>
                        <p class="text-muted small mb-3">${esc(m.role)}</p>
                        <div class="d-flex justify-content-center gap-3">
                            ${m.social?.twitter ? `<a href="${esc(m.social.twitter)}" class="text-dark fs-5"><i class="bi bi-twitter-x"></i></a>` : ''}
                            ${m.social?.facebook ? `<a href="${esc(m.social.facebook)}" class="text-dark fs-5"><i class="bi bi-facebook"></i></a>` : ''}
                            ${m.social?.instagram ? `<a href="${esc(m.social.instagram)}" class="text-dark fs-5"><i class="bi bi-instagram"></i></a>` : ''}
                            ${m.social?.linkedin ? `<a href="${esc(m.social.linkedin)}" class="text-dark fs-5"><i class="bi bi-linkedin"></i></a>` : ''}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// ==================== RENDER STATS ====================
function renderStats() {
    const section = document.getElementById('stats-section');
    if (!section || !cmsData.stats) return;
    
    const el = (id) => section.querySelector(`[data-stat="${id}"]`);
    if (el('clients')) el('clients').textContent = cmsData.stats.clients;
    if (el('projects')) el('projects').textContent = cmsData.stats.projects;
    if (el('hours')) el('hours').textContent = cmsData.stats.hours;
    if (el('workers')) el('workers').textContent = cmsData.stats.workers;
}

// ==================== RENDER CONTACT ====================
function renderContact() {
    const info = document.getElementById('contact-info');
    if (!info || !cmsData.contact) return;
    
    const el = (id) => info.querySelector(`[data-contact="${id}"]`);
    if (el('address')) el('address').textContent = cmsData.contact.address;
    if (el('phone')) el('phone').textContent = cmsData.contact.phone;
    if (el('email')) el('email').textContent = cmsData.contact.email;
    
    const mapIframe = info.querySelector('iframe');
    if (mapIframe && cmsData.contact.map) {
        mapIframe.src = cmsData.contact.map;
    }
}