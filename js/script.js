// Mobile Navigation Toggle
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

function setSidebarOpen(isOpen) {
    document.body.classList.toggle('sidebar-open', Boolean(isOpen));
    try {
        localStorage.setItem('sidebar-open', isOpen ? '1' : '0');
    } catch {
        // ignore
    }

    // Animate hamburger menu
    const spans = navToggle.querySelectorAll('span');
    if (document.body.classList.contains('sidebar-open')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
}

// Restore persisted state (fallback: open on desktop)
(() => {
    let saved = null;
    try {
        saved = localStorage.getItem('sidebar-open');
    } catch {
        saved = null;
    }
    if (saved === '1') setSidebarOpen(true);
    else if (saved === '0') setSidebarOpen(false);
    else if (window.matchMedia && window.matchMedia('(min-width: 900px)').matches) setSidebarOpen(true);
})();

navToggle.addEventListener('click', () => {
    setSidebarOpen(!document.body.classList.contains('sidebar-open'));
});

// A11y state for the "3 lines" button
navToggle.setAttribute('role', 'button');
navToggle.setAttribute('tabindex', '0');
navToggle.setAttribute('aria-label', 'Toggle menu');
navToggle.setAttribute('aria-expanded', document.body.classList.contains('sidebar-open') ? 'true' : 'false');

const updateToggleA11y = () => {
    navToggle.setAttribute('aria-expanded', document.body.classList.contains('sidebar-open') ? 'true' : 'false');
};

navToggle.addEventListener('click', updateToggleA11y);
document.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    if (document.activeElement !== navToggle) return;
    e.preventDefault();
    setSidebarOpen(!document.body.classList.contains('sidebar-open'));
    updateToggleA11y();
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        setSidebarOpen(false);
        updateToggleA11y();
    });
});

// Close sidebar on backdrop click (mobile)
document.addEventListener('click', (e) => {
    if (!document.body.classList.contains('sidebar-open')) return;
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    const clickedInsideNavbar = navbar.contains(e.target);
    const clickedToggle = navToggle.contains(e.target);
    if (!clickedInsideNavbar && !clickedToggle) {
        setSidebarOpen(false);
        updateToggleA11y();
    }
});

// ESC to close
document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (!document.body.classList.contains('sidebar-open')) return;
    setSidebarOpen(false);
    updateToggleA11y();
});

function setText(selector, text) {
    const el = document.querySelector(selector);
    if (!el) return;
    el.textContent = text ?? '';
}

function setHTML(selector, html) {
    const el = document.querySelector(selector);
    if (!el) return;
    el.innerHTML = html ?? '';
}

function setAttr(selector, attr, value) {
    const el = document.querySelector(selector);
    if (!el) return;
    if (value == null || value === '') {
        el.removeAttribute(attr);
        return;
    }
    el.setAttribute(attr, value);
}

function escapeHTML(input) {
    const s = String(input ?? '');
    return s
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

function joinIfPresent(parts, sep = ' | ') {
    return parts.filter(Boolean).join(sep);
}

function stripHtmlTags(input) {
    return String(input ?? '').replace(/<[^>]*>/g, '').trim();
}

function groupResponsibilities(items) {
    const groups = [];
    let current = null;

    for (const raw of (Array.isArray(items) ? items : [])) {
        const s = String(raw ?? '');
        const m = s.match(/^\s*<strong>([\s\S]*?)<\/strong>\s*(.*)\s*$/i);

        if (m) {
            const header = stripHtmlTags(m[1]).replace(/:\s*$/, '');
            current = { header, bullets: [] };
            groups.push(current);

            const remainder = stripHtmlTags(m[2]);
            if (remainder) current.bullets.push(remainder);
            continue;
        }

        const bullet = stripHtmlTags(s);
        if (!bullet) continue;

        if (!current) {
            current = { header: null, bullets: [] };
            groups.push(current);
        }

        current.bullets.push(bullet);
    }

    return groups.filter(g => g.bullets.length);
}

function findContactItemByLabel(label) {
    const items = Array.from(document.querySelectorAll('#contact .contact-item'));
    return items.find(item => {
        const h3 = item.querySelector('h3');
        return (h3?.textContent || '').trim().toLowerCase() === String(label).trim().toLowerCase();
    }) || null;
}

function observeTimelineItems() {
    document.querySelectorAll('.timeline-item').forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-30px)';
        item.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(item);
    });
}

function observeSkillCategories() {
    document.querySelectorAll('.skill-category').forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(item);
    });
}

function observeProjectCards() {
    document.querySelectorAll('.project-card').forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(item);
    });
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 20;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
    } else {
        navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
    }
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all sections for animation
document.querySelectorAll('.section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});

// Observe timeline items
observeTimelineItems();

// Observe skill categories
observeSkillCategories();

// Observe project cards
observeProjectCards();

// Contact form submission
const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const formValues = Object.fromEntries(formData.entries());
    
    // Mailto-based submission (works on static GitHub Pages)
    const to = (window.__PORTFOLIO__?.personal?.email) || 'jimmyhan2610@gmail.com';
    const name = (formValues.name || '').trim();
    const email = (formValues.email || '').trim();
    const subject = (formValues.subject || 'Portfolio Contact').trim();
    const message = (formValues.message || '').trim();

    // Basic validation
    if (!name || !email || !message) {
        alert('Please fill out your name, email, and message.');
        return;
    }

    // Build mailto link
    const encodedSubject = encodeURIComponent(subject);
    const preface = `Name: ${name}\nEmail: ${email}\n\n`;
    const encodedBody = encodeURIComponent(preface + message);
    const mailtoLink = `mailto:${to}?subject=${encodedSubject}&body=${encodedBody}`;

    // Open default email client
    window.location.href = mailtoLink;

    // Give quick feedback and reset
    setTimeout(() => {
        alert('Opening your email client to send the message. Thank you!');
        contactForm.reset();
    }, 200);
});

// Active navigation link highlighting
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('.section, .hero');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 100) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

function startHeroTypingEffect(displayName) {
    const heroTitle = document.querySelector('.hero-title');
    if (!heroTitle) return;

    const titleText = "Hi, I'm ";
    const highlightText = displayName || 'Van-An Hoang';

    heroTitle.innerHTML = '';

    let charIndex = 0;
    let isTypingMain = true;

    function typeWriter() {
        if (isTypingMain) {
            if (charIndex < titleText.length) {
                heroTitle.innerHTML += titleText.charAt(charIndex);
                charIndex++;
                setTimeout(typeWriter, 50);
            } else {
                isTypingMain = false;
                charIndex = 0;
                heroTitle.innerHTML += '<span class="highlight">';
                setTimeout(typeWriter, 50);
            }
        } else {
            if (charIndex < highlightText.length) {
                const span = heroTitle.querySelector('.highlight');
                if (!span) return;
                span.innerHTML += escapeHTML(highlightText.charAt(charIndex));
                charIndex++;
                setTimeout(typeWriter, 50);
            } else {
                heroTitle.innerHTML += '</span>';
            }
        }
    }

    setTimeout(typeWriter, 500);
}

// Add hover effect to skill tags
document.querySelectorAll('.skill-tag').forEach(tag => {
    tag.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1)';
    });
    
    tag.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
});

// Dynamic year in footer
const currentYear = new Date().getFullYear();
const footerP = document.querySelector('.footer p');
if (footerP) {
    footerP.textContent = footerP.textContent.replace(/\b\d{4}\b/, String(currentYear));
}

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    const scrolled = window.pageYOffset;
    const rate = scrolled * 0.5;
    
    if (hero) {
        hero.style.transform = `translate3d(0, ${rate}px, 0)`;
    }
});

// Add custom cursor effect (optional)
const cursor = document.createElement('div');
cursor.className = 'custom-cursor';
document.body.appendChild(cursor);

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});

// Add click ripple effect to buttons
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        this.appendChild(ripple);
        
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Lazy loading for images (if you add images later)
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Prevent default behavior for demo links
document.querySelectorAll('.project-links a').forEach(link => {
    link.addEventListener('click', function(e) {
        if (this.getAttribute('href') === '#') {
            e.preventDefault();
            alert('This is a demo link. Replace with your actual project links!');
        }
    });
});

// Add scroll progress indicator
const scrollProgress = document.createElement('div');
scrollProgress.className = 'scroll-progress';
document.body.appendChild(scrollProgress);

window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.pageYOffset / windowHeight) * 100;
    scrollProgress.style.width = scrolled + '%';
});

// Add CSS for scroll progress indicator
const style = document.createElement('style');
style.textContent = `
    .scroll-progress {
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: var(--primary-color);
        z-index: 9999;
        transition: width 0.2s ease;
    }
    
    .custom-cursor {
        display: none;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .nav-link.active { }
`;
document.head.appendChild(style);

console.log('Personal website loaded successfully! 🚀');

async function loadPortfolioData() {
    const res = await fetch('data/portfolio.json', { cache: 'no-store' });
    if (!res.ok) throw new Error(`Failed to load portfolio.json (${res.status})`);
    return await res.json();
}

function renderPortfolio(data) {
    window.__PORTFOLIO__ = data;

    const personal = data?.personal ?? {};
    const about = data?.about ?? {};

    /* Keep in sync with portfolio; avoids stale HTML / CDN showing old copy */
    setText('#projects .section-title', 'Projects');

    // Meta/title
    const baseTitle = personal?.name ? `${personal.name} - ${personal.title || 'Portfolio'}` : document.title;
    document.title = baseTitle;
    setAttr('meta[name="description"]', 'content', personal?.description || '');
    setAttr('meta[property="og:title"]', 'content', baseTitle);
    setAttr('meta[property="og:description"]', 'content', personal?.description || '');
    setAttr('meta[property="twitter:title"]', 'content', baseTitle);
    setAttr('meta[property="twitter:description"]', 'content', personal?.description || '');

    // Navbar branding
    setText('.nav-brand h2', personal?.name || '');
    setAttr('.nav-brand .nav-avatar', 'src', 'assets/images/avatar.jpeg');
    setAttr('.nav-brand .nav-avatar', 'alt', personal?.name ? `${personal.name} Avatar` : 'Avatar');

    // Hero
    setText('.hero-subtitle', personal?.title || '');
    setText('.hero-description', personal?.description || '');
    setAttr('.hero-buttons-row a.btn-secondary', 'href', personal?.cv || '');

    // Social links (hero + footer)
    const mailto = personal?.email ? `mailto:${personal.email}` : '';
    const tel = personal?.phone ? `tel:${personal.phone}` : '';
    setAttr('.social-links a[title="Email"]', 'href', mailto);
    setAttr('.social-links a[title="LinkedIn"]', 'href', personal?.linkedin || '');
    setAttr('.social-links a[title="GitHub"]', 'href', personal?.github || '');
    setAttr('.social-links a[title="Phone"]', 'href', tel);

    // About
    setAttr('.about-image img', 'src', personal?.portrait || '');
    setAttr('.about-image img', 'alt', personal?.name ? `${personal.name} Portrait` : 'Portrait');
    if (Array.isArray(about?.paragraphs)) {
        setHTML('.about-text', about.paragraphs.map(p => `<p>${escapeHTML(p)}</p>`).join(''));
    }
    if (Array.isArray(about?.highlights)) {
        setHTML('.about-highlights', about.highlights.map(h => {
            const icon = h?.icon || 'fas fa-star';
            return `
                <div class="highlight-item">
                    <i class="${escapeHTML(icon)}"></i>
                    <h3>${escapeHTML(h?.title || '')}</h3>
                    <p>${escapeHTML(h?.description || '')}</p>
                </div>
            `;
        }).join(''));
    }

    // Experience (timeline)
    if (Array.isArray(data?.experience)) {
        const timelineHTML = data.experience.map(job => {
            const title = job?.title || '';
            const company = job?.company || '';
            const location = job?.location || '';
            const period = job?.period || '';
            const dateLine = joinIfPresent([period, location], ' | ');
            const responsibilities = Array.isArray(job?.responsibilities) ? job.responsibilities : [];
            const grouped = groupResponsibilities(responsibilities);

            const responsibilitiesHTML = grouped.length
                ? grouped.map(g => `
                    <div class="responsibility-group">
                        ${g.header ? `<div class="responsibility-header">${escapeHTML(g.header)}</div>` : ''}
                        <ul class="responsibility-list">
                            ${g.bullets.map(b => `<li>${escapeHTML(b)}</li>`).join('')}
                        </ul>
                    </div>
                `).join('')
                : `
                    <ul>
                        ${responsibilities.map(li => `<li>${escapeHTML(stripHtmlTags(li))}</li>`).join('')}
                    </ul>
                `;
            return `
                <div class="timeline-item">
                    <div class="timeline-dot"></div>
                    <div class="timeline-content">
                        <h3>${escapeHTML(title)}</h3>
                        <h4>${escapeHTML(company)}</h4>
                        <span class="timeline-date"><i class="fas fa-calendar-alt"></i> ${escapeHTML(dateLine)}</span>
                        ${responsibilitiesHTML}
                    </div>
                </div>
            `;
        }).join('');
        setHTML('#experience .timeline', timelineHTML);
    }

    // Research (timeline)
    if (Array.isArray(data?.research)) {
        const researchHTML = data.research.map(r => {
            const title = r?.title || '';
            const institution = r?.institution || '';
            const location = r?.location || '';
            const period = r?.period || '';
            const dateLine = joinIfPresent([period, location], ' | ');
            const responsibilities = Array.isArray(r?.responsibilities) ? r.responsibilities : [];
            return `
                <div class="timeline-item">
                    <div class="timeline-dot"></div>
                    <div class="timeline-content">
                        <h3>${escapeHTML(title)}</h3>
                        <h4>${escapeHTML(institution)}</h4>
                        <span class="timeline-date"><i class="fas fa-calendar-alt"></i> ${escapeHTML(dateLine)}</span>
                        <ul>
                            ${responsibilities.map(li => `<li>${escapeHTML(li)}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            `;
        }).join('');
        setHTML('#research .timeline', researchHTML);

        // Hide section if empty
        const researchSection = document.getElementById('research');
        if (researchSection) researchSection.style.display = data.research.length ? '' : 'none';
    } else {
        const researchSection = document.getElementById('research');
        if (researchSection) researchSection.style.display = 'none';
    }

    // Education
    if (Array.isArray(data?.education)) {
        const educationHTML = data.education.map(ed => {
            const degree = ed?.degree || '';
            const institution = ed?.institution || '';
            const period = ed?.period || '';
            const location = ed?.location || '';
            const dateLine = joinIfPresent([period, location], ' | ');
            const details = Array.isArray(ed?.details) ? ed.details : [];
            const detailsHTML = details.length
                ? details.map(d => escapeHTML(d)).join('<br>')
                : '';

            return `
                <div class="education-card">
                    <div class="education-icon">
                        <i class="fas fa-graduation-cap"></i>
                    </div>
                    <h3>${escapeHTML(degree)}</h3>
                    <h4>${escapeHTML(institution)}</h4>
                    <span class="education-date">${escapeHTML(dateLine)}</span>
                    ${detailsHTML ? `<p>${detailsHTML}</p>` : ''}
                </div>
            `;
        }).join('');
        setHTML('#education .education-grid', educationHTML);
    }

    // Projects
    if (Array.isArray(data?.projects)) {
        const projectsHTML = data.projects.map(p => {
            const icon = p?.icon || 'fas fa-code';
            const image = p?.image || '';
            const title = p?.title || '';
            const description = p?.description || '';
            const techStack = Array.isArray(p?.techStack) ? p.techStack : [];
            const link = p?.link || '';

            return `
                <div class="project-card">
                    <div class="project-image">
                        ${image
                            ? `<img src="${escapeHTML(image)}" alt="${escapeHTML(title)} preview" loading="lazy">`
                            : `<i class="${escapeHTML(icon)}"></i>`}
                    </div>
                    <div class="project-content">
                        <h3>${escapeHTML(title)}</h3>
                        <p>${escapeHTML(description)}</p>
                        ${techStack.length ? `
                            <div class="project-tech">
                                ${techStack.map(t => `<span>${escapeHTML(t)}</span>`).join('')}
                            </div>
                        ` : ''}
                        ${link ? `
                            <div class="project-links">
                                <a href="${escapeHTML(link)}" target="_blank" rel="noopener noreferrer">
                                    <i class="fas fa-external-link-alt"></i> View Project
                                </a>
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
        }).join('');
        setHTML('#projects .projects-grid', projectsHTML);
    }

    // Publications
    if (Array.isArray(data?.publications)) {
        const pubsHTML = data.publications.map(p => {
            const title = p?.title || '';
            const venue = p?.venue || '';
            const location = p?.location || '';
            const doi = p?.doi || '';
            const url = p?.url || '';
            const abstract = p?.abstract || '';
            const contributions = Array.isArray(p?.contributions) ? p.contributions : [];
            const image = p?.image || '';

            const subtitle = joinIfPresent([venue, location], ' • ');
            const link = url || (doi ? `https://doi.org/${doi}` : '');

            return `
                <article class="project-card publication-card ${image ? '' : 'publication-card--no-figure'}">
                    <div class="project-content">
                        <div class="publication-header">
                            <div class="publication-title-row">
                                <h3 class="publication-title"><i class="fas fa-file-alt"></i> ${escapeHTML(title)}</h3>
                                ${link ? `
                                    <a class="publication-cta" href="${escapeHTML(link)}" target="_blank" rel="noopener noreferrer">
                                        <i class="fas fa-external-link-alt"></i> View
                                    </a>
                                ` : ''}
                            </div>
                            ${subtitle ? `<p class="publication-meta"><strong>${escapeHTML(subtitle)}</strong></p>` : ''}
                            ${doi ? `<p class="publication-doi">DOI: <a href="${escapeHTML(`https://doi.org/${doi}`)}" target="_blank" rel="noopener noreferrer">${escapeHTML(doi)}</a></p>` : ''}
                        </div>

                        ${(abstract || contributions.length || image) ? `
                            <div class="publication-body">
                                <div class="publication-main">
                                    ${abstract ? `
                                        <div class="publication-abstract">
                                            <h4>Abstract</h4>
                                            <p>${escapeHTML(abstract)}</p>
                                        </div>
                                    ` : ''}

                                    ${contributions.length ? `
                                        <div class="publication-contrib">
                                            <h4>Main contributions</h4>
                                            <ul>
                                                ${contributions.map(c => `<li>${escapeHTML(c)}</li>`).join('')}
                                            </ul>
                                        </div>
                                    ` : ''}
                                </div>

                                ${image ? `
                                    <figure class="publication-figure">
                                        <img src="${escapeHTML(image)}" alt="${escapeHTML(title)} preview" loading="lazy">
                                    </figure>
                                ` : ''}
                            </div>
                        ` : ''}
                    </div>
                </article>
            `;
        }).join('');

        setHTML('#publications .projects-grid', pubsHTML);
        const pubsSection = document.getElementById('publications');
        if (pubsSection) pubsSection.style.display = data.publications.length ? '' : 'none';
    } else {
        const pubsSection = document.getElementById('publications');
        if (pubsSection) pubsSection.style.display = 'none';
    }

    // Certificates
    if (Array.isArray(data?.certificates)) {
        const certsHTML = data.certificates.map(c => {
            const title = c?.title || '';
            const code = c?.code || '';
            const issuer = c?.issuer || '';
            const certificateIconClass = (() => {
                const codeStr = String(code || '').toUpperCase();
                const issuerStr = String(issuer || '').toLowerCase();

                // Use distinct icons per certificate
                if (codeStr.includes('AI-102') || codeStr.includes('AI102')) return 'fas fa-medal';
                if (codeStr.includes('AI-900') || codeStr.includes('AI900')) return 'fas fa-award';
                if (issuerStr.includes('deeplearning.ai')) return 'fas fa-brain';
                return 'fas fa-certificate';
            })();
            const credential = String(
                c?.credential ?? c?.credentialUrl ?? c?.credential_url ?? ''
            ).trim();
            const subtitle = joinIfPresent([issuer, code].filter(Boolean), ' • ');
            const credentialBlock = credential
                ? `
                    <div class="certificate-credential-wrap">
                        <a class="certificate-credential-btn" href="${escapeHTML(credential)}" target="_blank" rel="noopener noreferrer">
                            <i class="fas fa-award"></i> Show credential
                        </a>
                    </div>
                `
                : '';
            return `
                <div class="project-card certificate-card">
                    <div class="project-image">
                        <i class="${escapeHTML(certificateIconClass)}"></i>
                    </div>
                    <div class="project-content">
                        <h3>${escapeHTML(title)}</h3>
                        ${subtitle ? `<p><strong>${escapeHTML(subtitle)}</strong></p>` : ''}
                        ${credentialBlock}
                    </div>
                </div>
            `;
        }).join('');

        setHTML('#certificates .projects-grid', certsHTML);
        const certsSection = document.getElementById('certificates');
        if (certsSection) certsSection.style.display = data.certificates.length ? '' : 'none';
    } else {
        const certsSection = document.getElementById('certificates');
        if (certsSection) certsSection.style.display = 'none';
    }

    // Skills
    const skillsIconMap = {
        'Programming Languages': 'fas fa-code',
        'Agentic AI & LLMs': 'fas fa-robot',
        'Computer Vision & ML': 'fas fa-eye',
        'Generative AI': 'fas fa-wand-magic-sparkles',
        'MLOps & Cloud': 'fas fa-cloud',
        'Data Engineering': 'fas fa-diagram-project',
        'Databases & Search': 'fas fa-database',
        'Languages': 'fas fa-language'
    };

    if (data?.skills && typeof data.skills === 'object') {
        const categories = Object.entries(data.skills);
        const skillsHTML = categories.map(([category, tags]) => {
            const icon = skillsIconMap[category] || 'fas fa-tags';
            const tagList = Array.isArray(tags) ? tags : [];
            return `
                <div class="skill-category">
                    <h3><i class="${escapeHTML(icon)}"></i> ${escapeHTML(category)}</h3>
                    <div class="skill-tags">
                        ${tagList.map(t => `<span class="skill-tag">${escapeHTML(t)}</span>`).join('')}
                    </div>
                </div>
            `;
        }).join('');

        setHTML('#skills .skills-grid', skillsHTML);

        // Re-bind hover effects for newly-rendered tags
        document.querySelectorAll('.skill-tag').forEach(tag => {
            tag.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.1)';
            });
            tag.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
            });
        });
    }

    // References
    if (Array.isArray(data?.references)) {
        const refsHTML = data.references.map(r => {
            const icon = r?.icon || 'fas fa-user';
            const name = r?.name || '';
            const title = r?.title || '';
            const org = r?.organization || '';
            const email = r?.email || '';
            return `
                <div class="reference-card">
                    <div class="reference-icon">
                        <i class="${escapeHTML(icon)}"></i>
                    </div>
                    <h3>${escapeHTML(name)}</h3>
                    <h4>${escapeHTML(title)}</h4>
                    <p class="reference-org">${escapeHTML(org)}</p>
                    ${email ? `
                        <a href="mailto:${escapeHTML(email)}" class="reference-email">
                            <i class="fas fa-envelope"></i> ${escapeHTML(email)}
                        </a>
                    ` : ''}
                </div>
            `;
        }).join('');
        setHTML('#references .references-grid', refsHTML);
    }

    // Contact section
    const emailItem = findContactItemByLabel('Email');
    if (emailItem) {
        const a = emailItem.querySelector('a');
        if (a) {
            a.textContent = personal?.email || '';
            if (mailto) a.setAttribute('href', mailto);
        }
    }

    const phoneItem = findContactItemByLabel('Phone');
    if (phoneItem) {
        const a = phoneItem.querySelector('a');
        if (a) {
            a.textContent = personal?.phone || '';
            if (tel) a.setAttribute('href', tel);
        }
    }

    const locItem = findContactItemByLabel('Location');
    if (locItem) {
        const p = locItem.querySelector('p');
        if (p) p.textContent = personal?.location || '';
    }

    // Footer
    const footerText = `© ${currentYear} ${personal?.name || 'Van-An Hoang'}. All rights reserved.`;
    setText('.footer p', footerText);
    setAttr('.footer-links a[href^="mailto:"]', 'href', mailto);
    setAttr('.footer-links a[href*="linkedin.com"]', 'href', personal?.linkedin || '');
    setAttr('.footer-links a[href*="github.com"]', 'href', personal?.github || '');

    // Typing effect last, so it uses latest name
    startHeroTypingEffect(personal?.name);

    // Re-attach section observers for newly-rendered elements
    observeTimelineItems();
    observeProjectCards();
    observeSkillCategories();
}

window.addEventListener('load', async () => {
    try {
        const data = await loadPortfolioData();
        renderPortfolio(data);
    } catch (err) {
        console.error(err);
    }
});
