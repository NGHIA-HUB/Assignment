/**
 * ELEGAT CMS - Admin Dashboard Logic
 * Quản lý: Services, Testimonials, Portfolio, Team, Stats, Contact
 */

const DATA_KEY = 'elegat_cms_data';

let cmsData = {
    services: [],
    testimonials: [],
    portfolio: [],
    team: [],
    stats: { clients: 232, projects: 521, hours: 1453, workers: 32 },
    contact: { address: '', phone: '', email: '', map: '' }
};

// ==================== KHỞI TẠO ====================
document.addEventListener('DOMContentLoaded', async () => {
    await loadData();
    setupTabs();
    renderAll();
});

async function loadData() {
    const stored = localStorage.getItem(DATA_KEY);
    if (stored) {
        try {
            cmsData = JSON.parse(stored);
            return;
        } catch (e) {}
    }
    
    try {
        const resp = await fetch('data.json');
        if (resp.ok) {
            cmsData = await resp.json();
            saveData();
        }
    } catch (e) {
        initDefaultData();
    }
}

function initDefaultData() {
    cmsData = {
        services: [
            { id: 's1', icon: '📊', title: 'Nesciunt Mete', description: 'Provident nihil minus qui consequatur non omnis maiores.' },
            { id: 's2', icon: '📡', title: 'Eosle Commodi', description: 'Ut autem aut autem non a. Sint sint sit facilis nam iusto sint.' },
            { id: 's3', icon: '🎨', title: 'Ledo Markt', description: 'Ut excepturi voluptatem nisi sed. Quidem fuga consequatur.' }
        ],
        testimonials: [
            { id: 't1', quote: 'Proin iaculis purus consequat sem cure digni ssim.', name: 'Saul Goodman', role: 'CEO & Founder', image: 'img/testimonials-1.jpg.png' },
            { id: 't2', quote: 'Fugiat enim eram quae cillum dolore dolor amet nulla.', name: 'Matt Brandon', role: 'Freelancer', image: 'img/testimonials-4.jpg.png' }
        ],
        portfolio: [
            { id: 'p1', title: 'App Project', category: 'app', image: 'img/Container.png' },
            { id: 'p2', title: 'Product Design', category: 'product', image: 'img/Container-1.png' }
        ],
        team: [
            { id: 'tm1', name: 'Walter White', role: 'Chief Executive Officer', image: 'img/team-1.jpg.png', social: {} },
            { id: 'tm2', name: 'Sarah Jhonson', role: 'Product Manager', image: 'img/team-2.jpg.png', social: {} }
        ],
        stats: { clients: 232, projects: 521, hours: 1453, workers: 32 },
        contact: { address: 'A108 Adam Street, New York, NY 535022', phone: '+1 5589 55488 55', email: 'info@example.com', map: '' }
    };
    saveData();
}

function saveData() {
    localStorage.setItem(DATA_KEY, JSON.stringify(cmsData));
}

// ==================== TABS NAVIGATION ====================
function setupTabs() {
    document.querySelectorAll('#adminTabs .nav-link').forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            const section = tab.dataset.section;
            
            // Update active tab
            document.querySelectorAll('#adminTabs .nav-link').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Show section
            document.querySelectorAll('.admin-section').forEach(s => s.style.display = 'none');
            document.getElementById('section-' + section).style.display = 'block';
        });
    });
}

// ==================== HELPERS ====================
function esc(str) {
    if (!str && str !== 0) return '';
    return String(str).replace(/[&<>"']/g, s => 
        ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[s]
    );
}

function uid(prefix = '') {
    return prefix + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
}

// ==================== RENDER ALL ====================
function renderAll() {
    renderServicesTable();
    renderTestimonialsTable();
    renderPortfolioTable();
    renderTeamTable();
    loadStatsForm();
    loadContactForm();
}

// ==================== SERVICES ====================
function renderServicesTable() {
    const tbody = document.getElementById('services-table');
    tbody.innerHTML = cmsData.services.map((s, i) => `
        <tr>
            <td>${i + 1}</td>
            <td style="font-size:1.5rem">${esc(s.icon) || '📦'}</td>
            <td>${esc(s.title)}</td>
            <td>${esc(s.description).slice(0, 40)}...</td>
            <td>
                <a href="#" class="text-primary me-2" onclick="editService('${s.id}')">Edit</a>
                <a href="#" class="text-danger" onclick="deleteService('${s.id}')">Delete</a>
            </td>
        </tr>
    `).join('');
}

function saveService() {
    const id = document.getElementById('svc-id').value;
    const icon = document.getElementById('svc-icon').value.trim();
    const title = document.getElementById('svc-title').value.trim();
    const desc = document.getElementById('svc-desc').value.trim();
    
    if (!title || !desc) return alert('Please enter title and description!');
    
    if (id) {
        const idx = cmsData.services.findIndex(s => s.id === id);
        if (idx >= 0) cmsData.services[idx] = { id, icon, title, description: desc };
    } else {
        cmsData.services.push({ id: uid('svc'), icon, title, description: desc });
    }
    
    saveData();
    renderServicesTable();
    resetServiceForm();
}

function editService(id) {
    const svc = cmsData.services.find(s => s.id === id);
    if (!svc) return;
    document.getElementById('svc-id').value = svc.id;
    document.getElementById('svc-icon').value = svc.icon || '';
    document.getElementById('svc-title').value = svc.title;
    document.getElementById('svc-desc').value = svc.description;
}

function deleteService(id) {
    if (!confirm('Delete this service?')) return;
    cmsData.services = cmsData.services.filter(s => s.id !== id);
    saveData();
    renderServicesTable();
}

function resetServiceForm() {
    document.getElementById('svc-id').value = '';
    document.getElementById('svc-icon').value = '';
    document.getElementById('svc-title').value = '';
    document.getElementById('svc-desc').value = '';
}

// ==================== TESTIMONIALS ====================
function renderTestimonialsTable() {
    const tbody = document.getElementById('testimonials-table');
    tbody.innerHTML = cmsData.testimonials.map((t, i) => `
        <tr>
            <td>${i + 1}</td>
            <td><img src="${esc(t.image)}" width="40" height="40" style="object-fit:cover;border-radius:50%" onerror="this.src='https://via.placeholder.com/40'"></td>
            <td>${esc(t.name)}</td>
            <td>${esc(t.role)}</td>
            <td>
                <a href="#" class="text-primary me-2" onclick="editTestimonial('${t.id}')">Edit</a>
                <a href="#" class="text-danger" onclick="deleteTestimonial('${t.id}')">Delete</a>
            </td>
        </tr>
    `).join('');
}

function saveTestimonial() {
    const id = document.getElementById('test-id').value;
    const name = document.getElementById('test-name').value.trim();
    const role = document.getElementById('test-role').value.trim();
    const image = document.getElementById('test-img').value.trim();
    const quote = document.getElementById('test-quote').value.trim();
    
    if (!name || !quote) return alert('Please enter name and quote!');
    
    if (id) {
        const idx = cmsData.testimonials.findIndex(t => t.id === id);
        if (idx >= 0) cmsData.testimonials[idx] = { id, name, role, image, quote };
    } else {
        cmsData.testimonials.push({ id: uid('tst'), name, role, image, quote });
    }
    
    saveData();
    renderTestimonialsTable();
    resetTestimonialForm();
}

function editTestimonial(id) {
    const t = cmsData.testimonials.find(x => x.id === id);
    if (!t) return;
    document.getElementById('test-id').value = t.id;
    document.getElementById('test-name').value = t.name;
    document.getElementById('test-role').value = t.role || '';
    document.getElementById('test-img').value = t.image || '';
    document.getElementById('test-quote').value = t.quote;
}

function deleteTestimonial(id) {
    if (!confirm('Delete this testimonial?')) return;
    cmsData.testimonials = cmsData.testimonials.filter(t => t.id !== id);
    saveData();
    renderTestimonialsTable();
}

function resetTestimonialForm() {
    ['test-id', 'test-name', 'test-role', 'test-img', 'test-quote'].forEach(id => 
        document.getElementById(id).value = ''
    );
}

// ==================== PORTFOLIO ====================
function renderPortfolioTable() {
    const tbody = document.getElementById('portfolio-table');
    tbody.innerHTML = cmsData.portfolio.map((p, i) => `
        <tr>
            <td>${i + 1}</td>
            <td><img src="${esc(p.image)}" width="60" height="40" style="object-fit:cover;border-radius:4px" onerror="this.src='https://via.placeholder.com/60x40'"></td>
            <td>${esc(p.title)}</td>
            <td><span class="badge bg-secondary">${esc(p.category)}</span></td>
            <td>
                <a href="#" class="text-primary me-2" onclick="editPortfolio('${p.id}')">Edit</a>
                <a href="#" class="text-danger" onclick="deletePortfolio('${p.id}')">Delete</a>
            </td>
        </tr>
    `).join('');
}

function savePortfolio() {
    const id = document.getElementById('port-id').value;
    const title = document.getElementById('port-title').value.trim();
    const category = document.getElementById('port-category').value;
    const image = document.getElementById('port-img').value.trim();
    
    if (!title || !image) return alert('Please enter title and image URL!');
    
    if (id) {
        const idx = cmsData.portfolio.findIndex(p => p.id === id);
        if (idx >= 0) cmsData.portfolio[idx] = { id, title, category, image };
    } else {
        cmsData.portfolio.push({ id: uid('prt'), title, category, image });
    }
    
    saveData();
    renderPortfolioTable();
    resetPortfolioForm();
}

function editPortfolio(id) {
    const p = cmsData.portfolio.find(x => x.id === id);
    if (!p) return;
    document.getElementById('port-id').value = p.id;
    document.getElementById('port-title').value = p.title;
    document.getElementById('port-category').value = p.category;
    document.getElementById('port-img').value = p.image;
}

function deletePortfolio(id) {
    if (!confirm('Delete this portfolio item?')) return;
    cmsData.portfolio = cmsData.portfolio.filter(p => p.id !== id);
    saveData();
    renderPortfolioTable();
}

function resetPortfolioForm() {
    ['port-id', 'port-title', 'port-img'].forEach(id => document.getElementById(id).value = '');
    document.getElementById('port-category').value = 'app';
}

// ==================== TEAM ====================
function renderTeamTable() {
    const tbody = document.getElementById('team-table');
    tbody.innerHTML = cmsData.team.map((m, i) => `
        <tr>
            <td>${i + 1}</td>
            <td><img src="${esc(m.image)}" width="40" height="40" style="object-fit:cover;border-radius:50%" onerror="this.src='https://via.placeholder.com/40'"></td>
            <td>${esc(m.name)}</td>
            <td>${esc(m.role)}</td>
            <td>
                <a href="#" class="text-primary me-2" onclick="editTeamMember('${m.id}')">Edit</a>
                <a href="#" class="text-danger" onclick="deleteTeamMember('${m.id}')">Delete</a>
            </td>
        </tr>
    `).join('');
}

function saveTeamMember() {
    const id = document.getElementById('team-id').value;
    const name = document.getElementById('team-name').value.trim();
    const role = document.getElementById('team-role').value.trim();
    const image = document.getElementById('team-img').value.trim();
    let social = {};
    try { social = JSON.parse(document.getElementById('team-social').value || '{}'); } catch (e) {}
    
    if (!name || !role) return alert('Please enter name and position!');
    
    if (id) {
        const idx = cmsData.team.findIndex(m => m.id === id);
        if (idx >= 0) cmsData.team[idx] = { id, name, role, image, social };
    } else {
        cmsData.team.push({ id: uid('tm'), name, role, image, social });
    }
    
    saveData();
    renderTeamTable();
    resetTeamForm();
}

function editTeamMember(id) {
    const m = cmsData.team.find(x => x.id === id);
    if (!m) return;
    document.getElementById('team-id').value = m.id;
    document.getElementById('team-name').value = m.name;
    document.getElementById('team-role').value = m.role;
    document.getElementById('team-img').value = m.image || '';
    document.getElementById('team-social').value = JSON.stringify(m.social || {});
}

function deleteTeamMember(id) {
    if (!confirm('Delete this team member?')) return;
    cmsData.team = cmsData.team.filter(m => m.id !== id);
    saveData();
    renderTeamTable();
}

function resetTeamForm() {
    ['team-id', 'team-name', 'team-role', 'team-img', 'team-social'].forEach(id => 
        document.getElementById(id).value = ''
    );
}

// ==================== STATS ====================
function loadStatsForm() {
    document.getElementById('stats-clients').value = cmsData.stats?.clients || 0;
    document.getElementById('stats-projects').value = cmsData.stats?.projects || 0;
    document.getElementById('stats-hours').value = cmsData.stats?.hours || 0;
    document.getElementById('stats-workers').value = cmsData.stats?.workers || 0;
}

function saveStats() {
    cmsData.stats = {
        clients: parseInt(document.getElementById('stats-clients').value) || 0,
        projects: parseInt(document.getElementById('stats-projects').value) || 0,
        hours: parseInt(document.getElementById('stats-hours').value) || 0,
        workers: parseInt(document.getElementById('stats-workers').value) || 0
    };
    saveData();
    alert('Statistics saved!');
}

// ==================== CONTACT ====================
function loadContactForm() {
    document.getElementById('contact-address').value = cmsData.contact?.address || '';
    document.getElementById('contact-phone').value = cmsData.contact?.phone || '';
    document.getElementById('contact-email').value = cmsData.contact?.email || '';
    document.getElementById('contact-map').value = cmsData.contact?.map || '';
}

function saveContact() {
    cmsData.contact = {
        address: document.getElementById('contact-address').value.trim(),
        phone: document.getElementById('contact-phone').value.trim(),
        email: document.getElementById('contact-email').value.trim(),
        map: document.getElementById('contact-map').value.trim()
    };
    saveData();
    alert('Contact information saved!');
}