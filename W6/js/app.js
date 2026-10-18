/**
 * Portfolio Web Application Engine
 * Handles State, LocalStorage Persistence, Image Uploading, Live CMS Editor,
 * Responsive Navigation, Theme Switching, and Dynamic Rendering.
 */

// Storage Keys
const STORAGE_KEY = 'woraphon_portfolio_data_v1';
const THEME_KEY = 'woraphon_portfolio_theme';

// Application State
let appData = null;
let isEditMode = false;
let tempAvatarData = null; // Staged avatar image (base64 or URL)

/* ==========================================================================
   Initialization & State Management
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  loadData();
  renderAll();
  bindEvents();
  initScrollSpy();
  
  // Initialize Lucide icons
  refreshIcons();
});

function loadData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      appData = JSON.parse(saved);
    } else {
      appData = JSON.parse(JSON.stringify(DEFAULT_PORTFOLIO_DATA));
      saveData();
    }
  } catch (err) {
    console.error('Error loading portfolio data from localStorage:', err);
    appData = JSON.parse(JSON.stringify(DEFAULT_PORTFOLIO_DATA));
  }
}

function saveData() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appData));
    showToast('บันทึกข้อมูลเรียบร้อยแล้ว!', 'success');
  } catch (err) {
    console.error('Error saving portfolio data:', err);
    showToast('เกิดข้อผิดพลาดในการบันทึกข้อมูล', 'error');
  }
}

function refreshIcons() {
  if (window.lucide) {
    lucide.createIcons();
  }
}

/* ==========================================================================
   Theme Management (Dark / Light)
   ========================================================================== */
function initTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY) || 'dark';
  applyTheme(savedTheme);

  const themeBtn = document.getElementById('theme-toggle-btn');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      localStorage.setItem(THEME_KEY, newTheme);
      showToast(`เปลี่ยนธีมเป็น: ${newTheme === 'dark' ? 'โหมดกลางคืน (Dark)' : 'โหมดสว่าง (Light)'}`);
    });
  }
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const themeIcon = document.getElementById('theme-icon');
  if (themeIcon) {
    if (theme === 'dark') {
      themeIcon.setAttribute('data-lucide', 'sun');
    } else {
      themeIcon.setAttribute('data-lucide', 'moon');
    }
    refreshIcons();
  }
}

/* ==========================================================================
   Rendering Pipeline
   ========================================================================== */
function renderAll() {
  renderProfile();
  renderAbout();
  renderEducation();
  renderSkills();
  renderProjects('all');
  renderContact();
  renderFooter();
  refreshIcons();
}

// 1. Profile / Hero Section
function renderProfile() {
  const p = appData.profile;
  if (!p) return;

  // Title & Brand
  document.title = `${p.name} | แฟ้มสะสมผลงาน (Portfolio)`;
  const brandName = document.getElementById('nav-brand-name');
  if (brandName) brandName.textContent = p.nameEn ? p.nameEn.split(' ')[0] : 'Portfolio';

  // Hero Texts
  setElText('hero-name', p.name);
  setElText('hero-title-text', p.title);
  setElText('hero-status-text', p.statusBadge || 'พร้อมรับงาน');
  setElText('hero-bio-text', p.bio);
  setElText('avatar-badge-title', p.title.split('&')[0].trim());

  // Profile Avatar
  const avatarEl = document.getElementById('profile-avatar-img');
  if (avatarEl && p.avatarUrl) {
    avatarEl.src = p.avatarUrl;
    avatarEl.alt = `รูปโปรไฟล์ของ ${p.name}`;
  }

  // Quick Stats
  setElText('stat-experience', p.yearsExperience || '3+');
  setElText('stat-projects', p.completedProjects || '15+');
  setElText('stat-skills', p.skillsCount || '20+');
  setElText('stat-satisfaction', p.happyClients || '100%');
}

// 2. About Me Section
function renderAbout() {
  const a = appData.about;
  if (!a) return;

  setElText('about-intro-text', a.introduction);

  // About Details Grid
  const detailsContainer = document.getElementById('about-details-container');
  if (detailsContainer && Array.isArray(a.details)) {
    detailsContainer.innerHTML = a.details.map(d => `
      <div class="about-detail-item">
        <span class="about-detail-label">${escapeHtml(d.label)}</span>
        <span class="about-detail-val">${escapeHtml(d.value)}</span>
      </div>
    `).join('');
  }

  // About Highlights
  const highlightsContainer = document.getElementById('about-highlights-container');
  if (highlightsContainer && Array.isArray(a.highlights)) {
    highlightsContainer.innerHTML = a.highlights.map(h => `
      <div class="highlight-card">
        <div class="highlight-icon-box">
          <i data-lucide="${getHighlightIcon(h.icon)}"></i>
        </div>
        <div class="highlight-body">
          <h4>${escapeHtml(h.title)}</h4>
          <p>${escapeHtml(h.description)}</p>
        </div>
      </div>
    `).join('');
  }
}

function getHighlightIcon(name) {
  const map = {
    code: 'code-2',
    palette: 'palette',
    zap: 'zap',
    users: 'users',
    rocket: 'rocket',
    shield: 'shield-check'
  };
  return map[name] || 'sparkles';
}

// 3. Education Timeline
function renderEducation() {
  const list = appData.education;
  const container = document.getElementById('education-timeline-container');
  if (!container || !Array.isArray(list)) return;

  if (list.length === 0) {
    container.innerHTML = '<p style="color: var(--text-muted); padding: 1rem;">ยังไม่มีข้อมูลประวัติการศึกษา</p>';
    return;
  }

  container.innerHTML = list.map(item => `
    <div class="timeline-item">
      <div class="timeline-marker"></div>
      <div class="timeline-card">
        <div class="timeline-header">
          <h3 class="timeline-degree">${escapeHtml(item.degree)}</h3>
          <span class="timeline-period-badge">
            <i data-lucide="calendar" style="width: 12px; height: 12px; display: inline-block; vertical-align: middle;"></i>
            ${escapeHtml(item.period)}
          </span>
        </div>
        
        <div class="timeline-institution">
          <i data-lucide="building" style="width: 16px; height: 16px;"></i>
          <span>${escapeHtml(item.institution)}</span>
        </div>

        ${item.major ? `<p style="font-weight: 500; font-size: 0.95rem; margin-bottom: 0.5rem; color: var(--text-muted);">${escapeHtml(item.major)}</p>` : ''}
        ${item.gpa ? `<div class="timeline-gpa">⭐ ${escapeHtml(item.gpa)}</div>` : ''}

        <p class="timeline-description">${escapeHtml(item.description)}</p>
      </div>
    </div>
  `).join('');
}

// 4. Skills Section
function renderSkills() {
  const s = appData.skills;
  if (!s) return;

  // Technical Bars
  const techContainer = document.getElementById('tech-skills-container');
  if (techContainer && Array.isArray(s.technical)) {
    techContainer.innerHTML = s.technical.map(t => `
      <div class="tech-skill-item">
        <div class="tech-skill-info">
          <span>${escapeHtml(t.name)}</span>
          <span class="skill-percentage">${t.level}%</span>
        </div>
        <div class="skill-bar-track">
          <div class="skill-bar-fill" style="width: ${t.level}%;"></div>
        </div>
      </div>
    `).join('');
  }

  // Tools Badges
  const toolsContainer = document.getElementById('tools-badge-container');
  if (toolsContainer && Array.isArray(s.tools)) {
    toolsContainer.innerHTML = s.tools.map(tool => `
      <div class="tool-badge">
        <i data-lucide="${getToolIcon(tool.icon || tool.name)}" style="width: 16px; height: 16px; color: var(--accent-secondary);"></i>
        <span>${escapeHtml(tool.name)}</span>
      </div>
    `).join('');
  }

  // Soft Skills
  const softContainer = document.getElementById('soft-skills-container');
  if (softContainer && Array.isArray(s.soft)) {
    softContainer.innerHTML = s.soft.map(soft => `
      <div class="soft-skill-card">
        <h5>⭐ ${escapeHtml(soft.name)}</h5>
        <p>${escapeHtml(soft.desc)}</p>
      </div>
    `).join('');
  }
}

function getToolIcon(name) {
  const lower = String(name).toLowerCase();
  if (lower.includes('figma')) return 'figma';
  if (lower.includes('docker')) return 'container';
  if (lower.includes('code') || lower.includes('vs')) return 'terminal';
  if (lower.includes('cloud') || lower.includes('vercel') || lower.includes('netlify')) return 'cloud';
  if (lower.includes('git')) return 'git-branch';
  return 'cpu';
}

// 5. Projects Section
function renderProjects(categoryFilter = 'all') {
  const list = appData.projects;
  const container = document.getElementById('projects-grid-container');
  if (!container || !Array.isArray(list)) return;

  const filtered = categoryFilter === 'all' 
    ? list 
    : list.filter(item => (item.category || '').toLowerCase() === categoryFilter.toLowerCase());

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px solid var(--border-subtle);">
        <p style="color: var(--text-muted); font-size: 1.1rem;">ไม่พบผลงานในหมวดหมู่นี้</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(p => `
    <div class="project-card" data-id="${p.id}">
      <div class="project-thumb-box">
        <img src="${escapeHtml(p.image || 'https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=800&q=80')}" alt="${escapeHtml(p.title)}" class="project-img" loading="lazy">
        <span class="project-category-badge">${escapeHtml(p.categoryLabel || p.category || 'Project')}</span>
      </div>
      <div class="project-body">
        <h3 class="project-title">${escapeHtml(p.title)}</h3>
        <p class="project-desc">${escapeHtml(p.description)}</p>
        <div class="project-tags">
          ${(p.tags || []).map(t => `<span class="tag-pill">#${escapeHtml(t)}</span>`).join('')}
        </div>
        <div class="project-footer-actions">
          <button class="btn btn-outline btn-sm view-project-detail-btn" data-id="${p.id}">
            <i data-lucide="eye" style="width: 14px; height: 14px;"></i> ดูรายละเอียด
          </button>
          <div class="project-links">
            ${p.liveDemo ? `
              <a href="${escapeHtml(p.liveDemo)}" target="_blank" rel="noopener noreferrer" class="btn-icon" style="width: 34px; height: 34px;" title="เปิดดูเว็บไซต์จริง">
                <i data-lucide="external-link" style="width: 16px; height: 16px;"></i>
              </a>
            ` : ''}
            ${p.github ? `
              <a href="${escapeHtml(p.github)}" target="_blank" rel="noopener noreferrer" class="btn-icon" style="width: 34px; height: 34px;" title="ดูโค้ดบน GitHub">
                <i data-lucide="github" style="width: 16px; height: 16px;"></i>
              </a>
            ` : ''}
          </div>
        </div>
      </div>
    </div>
  `).join('');

  refreshIcons();
}

// 6. Contact Section
function renderContact() {
  const p = appData.profile;
  if (!p) return;

  // Direct Channels
  const emailLink = document.getElementById('contact-email-link');
  if (emailLink) {
    emailLink.href = `mailto:${p.email}`;
    emailLink.textContent = p.email;
  }

  const phoneLink = document.getElementById('contact-phone-link');
  if (phoneLink) {
    phoneLink.href = `tel:${p.phone.replace(/[^0-9+]/g, '')}`;
    phoneLink.textContent = p.phone;
  }

  setElText('contact-location-text', p.location);
  setElText('contact-line-text', p.lineId);

  // Line QR Image
  const qrImg = document.getElementById('modal-line-qr-img');
  if (qrImg) {
    qrImg.src = p.lineQrUrl || `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://line.me/ti/p/~${encodeURIComponent(p.lineId || 'contact')}`;
  }
  setElText('modal-line-id-text', p.lineId || '@line-id');

  // Social Links
  const socialContainer = document.getElementById('social-links-container');
  if (socialContainer) {
    const socials = [
      { name: 'GitHub', icon: 'github', url: p.github },
      { name: 'LinkedIn', icon: 'linkedin', url: p.linkedin },
      { name: 'Facebook', icon: 'facebook', url: p.facebook },
      { name: 'Instagram', icon: 'instagram', url: p.instagram }
    ].filter(s => !!s.url);

    socialContainer.innerHTML = socials.map(s => `
      <a href="${escapeHtml(s.url)}" target="_blank" rel="noopener noreferrer" class="btn-icon" title="${s.name}">
        <i data-lucide="${s.icon}" style="width: 18px; height: 18px;"></i>
      </a>
    `).join('');
  }
}

// 7. Footer
function renderFooter() {
  const p = appData.profile;
  if (!p) return;
  setElText('footer-quote-text', p.quote || '"สร้างสรรค์ผลงานด้วยความมุ่งมั่นและใส่ใจในทุกรายละเอียด"');
  setElText('footer-author-name', p.name);
  const yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

/* ==========================================================================
   Event Bindings & Interactions
   ========================================================================== */
function bindEvents() {
  // Mobile Nav Toggle
  const mobileToggle = document.getElementById('mobile-nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
    });

    // Close menu when a link is clicked
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
      });
    });
  }

  // Print CV
  const printBtn = document.getElementById('print-cv-btn');
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // Toggle Edit Mode Buttons
  const editNavBtn = document.getElementById('toggle-edit-mode-nav-btn');
  const floatingEditBtn = document.getElementById('floating-edit-btn');
  const exitEditBtn = document.getElementById('exit-edit-mode-btn');

  if (editNavBtn) editNavBtn.addEventListener('click', toggleEditMode);
  if (floatingEditBtn) floatingEditBtn.addEventListener('click', () => openEditorModal('tab-profile'));
  if (exitEditBtn) exitEditBtn.addEventListener('click', () => setEditMode(false));

  const bannerOpenBtn = document.getElementById('open-editor-from-banner-btn');
  if (bannerOpenBtn) bannerOpenBtn.addEventListener('click', () => openEditorModal('tab-profile'));

  const heroEditTrigger = document.getElementById('hero-edit-trigger-btn');
  if (heroEditTrigger) heroEditTrigger.addEventListener('click', () => openEditorModal('tab-profile'));

  // Project Category Filter
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.getAttribute('data-category');
      renderProjects(cat);
    });
  });

  // Project Detail Modal Trigger (Event Delegation)
  const projectsGrid = document.getElementById('projects-grid-container');
  if (projectsGrid) {
    projectsGrid.addEventListener('click', (e) => {
      const btn = e.target.closest('.view-project-detail-btn');
      if (!btn) return;
      const projId = btn.getAttribute('data-id');
      openProjectDetail(projId);
    });
  }

  // Line QR Trigger
  const lineCard = document.getElementById('line-qr-trigger-card');
  if (lineCard) {
    lineCard.addEventListener('click', () => {
      const modal = document.getElementById('line-qr-modal');
      if (modal) modal.showModal();
    });
  }

  // Contact Form Submission
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contact-input-name').value.trim();
      const email = document.getElementById('contact-input-email').value.trim();
      const subject = document.getElementById('contact-input-subject').value.trim();
      const message = document.getElementById('contact-input-message').value.trim();

      // Launch mailto as a reliable fallback
      const mailtoUrl = `mailto:${appData.profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`จาก: ${name} (${email})\n\n${message}`)}`;
      window.location.href = mailtoUrl;

      showToast(`เตรียมส่งข้อความถึง ${appData.profile.name} เรียบร้อยแล้ว!`, 'success');
      contactForm.reset();
    });
  }

  // Avatar Click Zone -> Open Avatar Modal
  const avatarClickZone = document.getElementById('avatar-click-zone');
  if (avatarClickZone) {
    avatarClickZone.addEventListener('click', openAvatarModal);
  }

  // Modal Generic Close Buttons
  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      const modalId = btn.getAttribute('data-close-modal');
      const modal = document.getElementById(modalId);
      if (modal) modal.close();
    });
  });

  // Click outside modal backdrop to close
  document.querySelectorAll('dialog.modern-modal').forEach(dialog => {
    dialog.addEventListener('click', (e) => {
      if (e.target === dialog) {
        dialog.close();
      }
    });
  });

  // Open Edit modal from section chip buttons
  document.querySelectorAll('.open-edit-modal-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tabName = btn.getAttribute('data-tab');
      openEditorModal(`tab-${tabName}`);
    });
  });

  // Avatar Upload Management
  setupAvatarUploadEvents();

  // Portfolio Editor Modal Management
  setupEditorModalEvents();
}

/* ==========================================================================
   Avatar Modal & File Upload System
   ========================================================================== */
function openAvatarModal() {
  const modal = document.getElementById('avatar-modal');
  const preview = document.getElementById('avatar-modal-preview');
  const urlInput = document.getElementById('avatar-url-input');

  tempAvatarData = appData.profile.avatarUrl;
  if (preview) preview.src = tempAvatarData;
  if (urlInput) urlInput.value = tempAvatarData.startsWith('data:') ? '' : tempAvatarData;

  if (modal) modal.showModal();
}

function setupAvatarUploadEvents() {
  const dropZone = document.getElementById('avatar-drop-zone');
  const fileInput = document.getElementById('avatar-file-input');
  const browseBtn = document.getElementById('browse-avatar-file-btn');
  const previewImg = document.getElementById('avatar-modal-preview');
  const saveBtn = document.getElementById('save-avatar-modal-btn');
  const resetBtn = document.getElementById('reset-default-avatar-btn');
  const previewUrlBtn = document.getElementById('preview-avatar-url-btn');
  const urlInput = document.getElementById('avatar-url-input');

  if (browseBtn && fileInput) {
    browseBtn.addEventListener('click', () => fileInput.click());
  }

  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) handleAvatarFile(file);
    });
  }

  // Drag and Drop support
  if (dropZone) {
    ['dragenter', 'dragover'].forEach(name => {
      dropZone.addEventListener(name, (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
      });
    });

    ['dragleave', 'drop'].forEach(name => {
      dropZone.addEventListener(name, (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
      });
    });

    dropZone.addEventListener('drop', (e) => {
      const dt = e.dataTransfer;
      if (dt.files && dt.files[0]) {
        handleAvatarFile(dt.files[0]);
      }
    });
  }

  // Test URL button
  if (previewUrlBtn && urlInput) {
    previewUrlBtn.addEventListener('click', () => {
      const val = urlInput.value.trim();
      if (!val) {
        showToast('กรุณากรอก URL รูปภาพ', 'error');
        return;
      }
      tempAvatarData = val;
      if (previewImg) previewImg.src = val;
      showToast('แสดงตัวอย่างรูปจาก URL');
    });
  }

  // Save new avatar
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      if (tempAvatarData) {
        appData.profile.avatarUrl = tempAvatarData;
        saveData();
        renderProfile();
        const modal = document.getElementById('avatar-modal');
        if (modal) modal.close();
        showToast('อัปเดตรูปภาพโปรไฟล์เรียบร้อยแล้ว!', 'success');
      }
    });
  }

  // Reset to default
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      tempAvatarData = DEFAULT_PORTFOLIO_DATA.profile.avatarUrl;
      if (previewImg) previewImg.src = tempAvatarData;
      if (urlInput) urlInput.value = tempAvatarData;
      showToast('คืนค่ารูปภาพเป็นรูปตัวอย่างเริ่มต้น');
    });
  }
}

function handleAvatarFile(file) {
  if (!file.type.startsWith('image/')) {
    showToast('กรุณาเลือกไฟล์รูปภาพเท่านั้น (JPG, PNG, WebP)', 'error');
    return;
  }

  // Limit file size to 3MB for localStorage safety
  if (file.size > 3.5 * 1024 * 1024) {
    showToast('ขนาดไฟล์ใหญ่เกินไป กรุณาใช้รูปขนาดไม่เกิน 3MB', 'error');
    return;
  }

  const reader = new FileReader();
  reader.onload = (event) => {
    tempAvatarData = event.target.result;
    const preview = document.getElementById('avatar-modal-preview');
    if (preview) preview.src = tempAvatarData;
    showToast('อัปโหลดไฟล์สำเร็จ! กดปุ่ม "บันทึกรูปโปรไฟล์"', 'success');
  };
  reader.readAsDataURL(file);
}

/* ==========================================================================
   Project Detail Modal
   ========================================================================== */
function openProjectDetail(projId) {
  const p = (appData.projects || []).find(item => String(item.id) === String(projId));
  if (!p) return;

  const modal = document.getElementById('project-detail-modal');
  setElText('modal-project-title', p.title);
  setElText('modal-project-category', p.categoryLabel || p.category);
  setElText('modal-project-desc', p.description);
  setElText('modal-project-details', p.details || p.description);

  const imgEl = document.getElementById('modal-project-img');
  if (imgEl) imgEl.src = p.image || '';

  const tagsContainer = document.getElementById('modal-project-tags');
  if (tagsContainer) {
    tagsContainer.innerHTML = (p.tags || []).map(t => `<span class="tag-pill">#${escapeHtml(t)}</span>`).join('');
  }

  const liveBtn = document.getElementById('modal-project-live-btn');
  if (liveBtn) {
    if (p.liveDemo) {
      liveBtn.href = p.liveDemo;
      liveBtn.style.display = 'inline-flex';
    } else {
      liveBtn.style.display = 'none';
    }
  }

  const githubBtn = document.getElementById('modal-project-github-btn');
  if (githubBtn) {
    if (p.github) {
      githubBtn.href = p.github;
      githubBtn.style.display = 'inline-flex';
    } else {
      githubBtn.style.display = 'none';
    }
  }

  if (modal) modal.showModal();
  refreshIcons();
}

/* ==========================================================================
   Full Portfolio Editor Modal (CMS Drawer)
   ========================================================================== */
function toggleEditMode() {
  setEditMode(!isEditMode);
}

function setEditMode(active) {
  isEditMode = active;
  if (isEditMode) {
    document.body.classList.add('edit-mode-active');
    setElText('nav-edit-label', 'โหมดแก้ไข (เปิด)');
    showToast('เข้าสู่โหมดแก้ไขข้อมูล (Edit Mode) เรียบร้อย!', 'success');
  } else {
    document.body.classList.remove('edit-mode-active');
    setElText('nav-edit-label', 'แก้ไขข้อมูล');
    showToast('ออกจากโหมดแก้ไขข้อมูลแล้ว');
  }
}

function openEditorModal(activeTabId = 'tab-profile') {
  setEditMode(true);
  populateEditorFields();

  // Activate chosen tab
  const tabs = document.querySelectorAll('.tab-btn');
  const panels = document.querySelectorAll('.tab-content-panel');

  tabs.forEach(tab => {
    if (tab.getAttribute('data-target') === activeTabId) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });

  panels.forEach(panel => {
    if (panel.id === activeTabId) {
      panel.classList.add('active');
    } else {
      panel.classList.remove('active');
    }
  });

  const modal = document.getElementById('portfolio-editor-modal');
  if (modal) modal.showModal();
  refreshIcons();
}

function setupEditorModalEvents() {
  // Tabs Switching
  const tabBtns = document.querySelectorAll('.tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content-panel').forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetId = btn.getAttribute('data-target');
      const panel = document.getElementById(targetId);
      if (panel) panel.classList.add('active');
    });
  });

  // Save All Changes Button
  const saveBtn = document.getElementById('save-all-changes-btn');
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      collectEditorValues();
      saveData();
      renderAll();
      const modal = document.getElementById('portfolio-editor-modal');
      if (modal) modal.close();
    });
  }

  // Education Editor: Add item
  const addEduBtn = document.getElementById('add-education-btn');
  if (addEduBtn) {
    addEduBtn.addEventListener('click', () => {
      appData.education.unshift({
        id: 'edu-' + Date.now(),
        period: '2567 - ปัจจุบัน',
        degree: 'ชื่อวุฒิการศึกษา',
        major: 'สาขาวิชา',
        institution: 'ชื่อสถาบันการศึกษา',
        gpa: '3.50',
        description: 'รายละเอียดกิจกรรมหรือผลงาน'
      });
      renderEditorEducationList();
    });
  }

  // Skills Editor: Add tech skill
  const addTechBtn = document.getElementById('add-tech-skill-btn');
  if (addTechBtn) {
    addTechBtn.addEventListener('click', () => {
      appData.skills.technical.push({
        name: 'ทักษะใหม่',
        level: 80,
        category: 'frontend'
      });
      renderEditorTechSkillsList();
    });
  }

  // Tools Editor: Add tool badge
  const addToolBtn = document.getElementById('add-tool-badge-btn');
  if (addToolBtn) {
    addToolBtn.addEventListener('click', () => {
      appData.skills.tools.push({
        name: 'เครื่องมือใหม่',
        icon: 'code'
      });
      renderEditorToolsList();
    });
  }

  // Projects Editor: Add project
  const addProjBtn = document.getElementById('add-project-btn');
  if (addProjBtn) {
    addProjBtn.addEventListener('click', () => {
      appData.projects.unshift({
        id: 'proj-' + Date.now(),
        title: 'ชื่อผลงานใหม่',
        category: 'web',
        categoryLabel: 'Web Application',
        image: 'https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=800&q=80',
        description: 'คำอธิบายผลงานสั้นๆ ที่น่าสนใจ',
        details: 'รายละเอียดเชิงลึกของผลงานนี้ สิ่งที่ได้เรียนรู้ และเทคนิคที่ใช้',
        tags: ['React', 'JavaScript', 'CSS'],
        liveDemo: '',
        github: '',
        featured: false
      });
      renderEditorProjectsList();
    });
  }

  // Backup: Export JSON
  const exportBtn = document.getElementById('export-json-btn');
  if (exportBtn) {
    exportBtn.addEventListener('click', exportPortfolioJSON);
  }

  // Backup: Import JSON
  const importBtn = document.getElementById('import-json-btn');
  const importInput = document.getElementById('import-json-input');
  if (importBtn && importInput) {
    importBtn.addEventListener('click', () => importInput.click());
    importInput.addEventListener('change', importPortfolioJSON);
  }

  // Backup: Reset All Data
  const resetAllBtn = document.getElementById('reset-all-data-btn');
  if (resetAllBtn) {
    resetAllBtn.addEventListener('click', () => {
      if (confirm('คุณแน่ใจหรือไม่ว่าต้องการรีเซ็ตข้อมูลทั้งหมดกลับเป็นค่าเริ่มต้น? การแก้ไขที่ยังไม่ได้ส่งออกไฟล์จะหายไป')) {
        appData = JSON.parse(JSON.stringify(DEFAULT_PORTFOLIO_DATA));
        saveData();
        renderAll();
        populateEditorFields();
        showToast('รีเซ็ตข้อมูลทั้งหมดเรียบร้อยแล้ว!', 'success');
      }
    });
  }
}

function populateEditorFields() {
  const p = appData.profile;
  setInputValue('edit-name', p.name);
  setInputValue('edit-name-en', p.nameEn);
  setInputValue('edit-title', p.title);
  setInputValue('edit-status', p.statusBadge);
  setInputValue('edit-bio', p.bio);
  setInputValue('edit-email', p.email);
  setInputValue('edit-phone', p.phone);
  setInputValue('edit-location', p.location);
  setInputValue('edit-line', p.lineId);
  setInputValue('edit-github', p.github);
  setInputValue('edit-linkedin', p.linkedin);
  setInputValue('edit-facebook', p.facebook);
  setInputValue('edit-instagram', p.instagram);
  setInputValue('edit-quote', p.quote);

  // About Narrative
  setInputValue('edit-about-intro', appData.about.introduction);

  renderEditorAboutDetailsList();
  renderEditorEducationList();
  renderEditorTechSkillsList();
  renderEditorToolsList();
  renderEditorProjectsList();
}

function collectEditorValues() {
  const p = appData.profile;
  p.name = getInputValue('edit-name');
  p.nameEn = getInputValue('edit-name-en');
  p.title = getInputValue('edit-title');
  p.statusBadge = getInputValue('edit-status');
  p.bio = getInputValue('edit-bio');
  p.email = getInputValue('edit-email');
  p.phone = getInputValue('edit-phone');
  p.location = getInputValue('edit-location');
  p.lineId = getInputValue('edit-line');
  p.github = getInputValue('edit-github');
  p.linkedin = getInputValue('edit-linkedin');
  p.facebook = getInputValue('edit-facebook');
  p.instagram = getInputValue('edit-instagram');
  p.quote = getInputValue('edit-quote');

  // About Intro
  appData.about.introduction = getInputValue('edit-about-intro');

  // Collect About Details
  const aboutRows = document.querySelectorAll('.editor-about-row');
  appData.about.details = [];
  aboutRows.forEach(row => {
    const label = row.querySelector('.about-row-label').value.trim();
    const value = row.querySelector('.about-row-val').value.trim();
    if (label) {
      appData.about.details.push({ label, value });
    }
  });

  // Collect Education items
  const eduRows = document.querySelectorAll('.editor-edu-row');
  appData.education = [];
  eduRows.forEach(row => {
    appData.education.push({
      id: row.getAttribute('data-id'),
      period: row.querySelector('.edu-row-period').value.trim(),
      degree: row.querySelector('.edu-row-degree').value.trim(),
      major: row.querySelector('.edu-row-major').value.trim(),
      institution: row.querySelector('.edu-row-institution').value.trim(),
      gpa: row.querySelector('.edu-row-gpa').value.trim(),
      description: row.querySelector('.edu-row-desc').value.trim()
    });
  });

  // Collect Tech Skills
  const techRows = document.querySelectorAll('.editor-tech-row');
  appData.skills.technical = [];
  techRows.forEach(row => {
    appData.skills.technical.push({
      name: row.querySelector('.tech-row-name').value.trim(),
      level: parseInt(row.querySelector('.tech-row-level').value, 10) || 50,
      category: 'frontend'
    });
  });

  // Collect Tools Badges
  const toolRows = document.querySelectorAll('.editor-tool-row');
  appData.skills.tools = [];
  toolRows.forEach(row => {
    const name = row.querySelector('.tool-row-name').value.trim();
    if (name) {
      appData.skills.tools.push({ name, icon: 'code' });
    }
  });

  // Collect Projects
  const projRows = document.querySelectorAll('.editor-proj-row');
  appData.projects = [];
  projRows.forEach(row => {
    const tagsStr = row.querySelector('.proj-row-tags').value;
    const tags = tagsStr.split(',').map(t => t.trim()).filter(Boolean);

    appData.projects.push({
      id: row.getAttribute('data-id'),
      title: row.querySelector('.proj-row-title').value.trim(),
      category: row.querySelector('.proj-row-category').value,
      categoryLabel: row.querySelector('.proj-row-category-label').value.trim(),
      image: row.querySelector('.proj-row-image').value.trim(),
      description: row.querySelector('.proj-row-desc').value.trim(),
      details: row.querySelector('.proj-row-details').value.trim(),
      tags: tags,
      liveDemo: row.querySelector('.proj-row-livedemo').value.trim(),
      github: row.querySelector('.proj-row-github').value.trim()
    });
  });
}

// Sub-renderers for editor lists
function renderEditorAboutDetailsList() {
  const container = document.getElementById('editor-about-details-list');
  if (!container) return;

  container.innerHTML = (appData.about.details || []).map((d, index) => `
    <div class="editor-about-row" style="display: flex; gap: 0.5rem; align-items: center;">
      <input type="text" class="form-input about-row-label" value="${escapeHtml(d.label)}" placeholder="หัวข้อ (เช่น วันเกิด)" style="width: 35%;">
      <input type="text" class="form-input about-row-val" value="${escapeHtml(d.value)}" placeholder="ข้อมูลรายละเอียด" style="width: 55%;">
      <button type="button" class="btn btn-sm btn-icon" onclick="deleteEditorAboutRow(${index})" title="ลบรายการ" style="color: var(--accent-warm);">✕</button>
    </div>
  `).join('');
}

window.deleteEditorAboutRow = function(index) {
  appData.about.details.splice(index, 1);
  renderEditorAboutDetailsList();
};

function renderEditorEducationList() {
  const container = document.getElementById('editor-education-list');
  if (!container) return;

  container.innerHTML = (appData.education || []).map((e, index) => `
    <div class="editor-edu-row" data-id="${e.id}" style="background: rgba(255,255,255,0.03); padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
        <strong style="color: var(--accent-secondary);">ระดับการศึกษา #${index + 1}</strong>
        <button type="button" class="btn btn-sm" onclick="deleteEditorEducation(${index})" style="color: var(--accent-warm); font-size: 0.8rem;">
          <i data-lucide="trash-2" style="width: 14px; height: 14px; display: inline-block;"></i> ลบรายการนี้
        </button>
      </div>
      <div class="form-group-grid">
        <div class="form-field">
          <label class="form-label">ช่วงปีที่ศึกษา (เช่น 2563 - 2567):</label>
          <input type="text" class="form-input edu-row-period" value="${escapeHtml(e.period)}">
        </div>
        <div class="form-field">
          <label class="form-label">วุฒิการศึกษา (Degree):</label>
          <input type="text" class="form-input edu-row-degree" value="${escapeHtml(e.degree)}">
        </div>
      </div>
      <div class="form-group-grid">
        <div class="form-field">
          <label class="form-label">สาขาวิชา (Major):</label>
          <input type="text" class="form-input edu-row-major" value="${escapeHtml(e.major || '')}">
        </div>
        <div class="form-field">
          <label class="form-label">สถาบันการศึกษา (Institution):</label>
          <input type="text" class="form-input edu-row-institution" value="${escapeHtml(e.institution)}">
        </div>
      </div>
      <div class="form-field">
        <label class="form-label">เกรดเฉลี่ยหรือเกียรตินิยม (GPA / Honors):</label>
        <input type="text" class="form-input edu-row-gpa" value="${escapeHtml(e.gpa || '')}">
      </div>
      <div class="form-field">
        <label class="form-label">คำอธิบายเพิ่มเติม:</label>
        <textarea class="form-textarea edu-row-desc" rows="2">${escapeHtml(e.description || '')}</textarea>
      </div>
    </div>
  `).join('');

  refreshIcons();
}

window.deleteEditorEducation = function(index) {
  appData.education.splice(index, 1);
  renderEditorEducationList();
};

function renderEditorTechSkillsList() {
  const container = document.getElementById('editor-tech-skills-list');
  if (!container) return;

  container.innerHTML = (appData.skills.technical || []).map((t, index) => `
    <div class="editor-tech-row" style="display: flex; gap: 0.5rem; align-items: center;">
      <input type="text" class="form-input tech-row-name" value="${escapeHtml(t.name)}" placeholder="ชื่อทักษะ (เช่น JavaScript)" style="width: 60%;">
      <input type="number" min="1" max="100" class="form-input tech-row-level" value="${t.level}" placeholder="ระดับ 0-100" style="width: 25%;">
      <span style="font-size: 0.85rem; color: var(--text-faint);">%</span>
      <button type="button" class="btn btn-sm btn-icon" onclick="deleteEditorTechSkill(${index})" title="ลบ" style="color: var(--accent-warm);">✕</button>
    </div>
  `).join('');
}

window.deleteEditorTechSkill = function(index) {
  appData.skills.technical.splice(index, 1);
  renderEditorTechSkillsList();
};

function renderEditorToolsList() {
  const container = document.getElementById('editor-tools-list');
  if (!container) return;

  container.innerHTML = (appData.skills.tools || []).map((tool, index) => `
    <div class="editor-tool-row" style="display: flex; gap: 0.5rem; align-items: center;">
      <input type="text" class="form-input tool-row-name" value="${escapeHtml(tool.name)}" placeholder="ชื่อเครื่องมือ (เช่น Docker, Figma)" style="width: 80%;">
      <button type="button" class="btn btn-sm btn-icon" onclick="deleteEditorTool(${index})" title="ลบ" style="color: var(--accent-warm);">✕</button>
    </div>
  `).join('');
}

window.deleteEditorTool = function(index) {
  appData.skills.tools.splice(index, 1);
  renderEditorToolsList();
};

function renderEditorProjectsList() {
  const container = document.getElementById('editor-projects-list');
  if (!container) return;

  container.innerHTML = (appData.projects || []).map((p, index) => `
    <div class="editor-proj-row" data-id="${p.id}" style="background: rgba(255,255,255,0.03); padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
        <strong style="color: var(--accent-secondary);">ผลงาน #${index + 1}: ${escapeHtml(p.title)}</strong>
        <button type="button" class="btn btn-sm" onclick="deleteEditorProject(${index})" style="color: var(--accent-warm); font-size: 0.8rem;">
          <i data-lucide="trash-2" style="width: 14px; height: 14px; display: inline-block;"></i> ลบผลงานนี้
        </button>
      </div>

      <div class="form-group-grid">
        <div class="form-field">
          <label class="form-label">ชื่อผลงาน (Project Title):</label>
          <input type="text" class="form-input proj-row-title" value="${escapeHtml(p.title)}">
        </div>
        <div class="form-field">
          <label class="form-label">หมวดหมู่สำหรับกรอง:</label>
          <select class="form-input proj-row-category">
            <option value="web" ${p.category === 'web' ? 'selected' : ''}>Web Application</option>
            <option value="mobile" ${p.category === 'mobile' ? 'selected' : ''}>Mobile App</option>
            <option value="design" ${p.category === 'design' ? 'selected' : ''}>UI/UX Design</option>
            <option value="other" ${p.category === 'other' ? 'selected' : ''}>อื่นๆ</option>
          </select>
        </div>
      </div>

      <div class="form-group-grid">
        <div class="form-field">
          <label class="form-label">ป้ายชื่อหมวดหมู่ (Category Label):</label>
          <input type="text" class="form-input proj-row-category-label" value="${escapeHtml(p.categoryLabel || p.category)}">
        </div>
        <div class="form-field">
          <label class="form-label">URL รูปภาพตัวอย่าง:</label>
          <input type="url" class="form-input proj-row-image" value="${escapeHtml(p.image || '')}">
        </div>
      </div>

      <div class="form-field">
        <label class="form-label">คำอธิบายย่อ (Short Summary):</label>
        <textarea class="form-textarea proj-row-desc" rows="2">${escapeHtml(p.description || '')}</textarea>
      </div>

      <div class="form-field">
        <label class="form-label">รายละเอียดเชิงลึก (Deep Dive Details):</label>
        <textarea class="form-textarea proj-row-details" rows="3">${escapeHtml(p.details || '')}</textarea>
      </div>

      <div class="form-field">
        <label class="form-label">แท็กเทคโนโลยี (คั่นด้วยจุลภาค , เช่น React, Node.js, MongoDB):</label>
        <input type="text" class="form-input proj-row-tags" value="${escapeHtml((p.tags || []).join(', '))}">
      </div>

      <div class="form-group-grid">
        <div class="form-field">
          <label class="form-label">ลิงก์ทดลองใช้งานจริง (Live Demo URL):</label>
          <input type="url" class="form-input proj-row-livedemo" value="${escapeHtml(p.liveDemo || '')}">
        </div>
        <div class="form-field">
          <label class="form-label">ลิงก์ซอร์สโค้ด (GitHub Repository URL):</label>
          <input type="url" class="form-input proj-row-github" value="${escapeHtml(p.github || '')}">
        </div>
      </div>
    </div>
  `).join('');

  refreshIcons();
}

window.deleteEditorProject = function(index) {
  appData.projects.splice(index, 1);
  renderEditorProjectsList();
};

/* ==========================================================================
   JSON Export & Import System
   ========================================================================== */
function exportPortfolioJSON() {
  collectEditorValues();
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(appData, null, 2));
  const downloadAnchor = document.createElement('a');
  const filename = `portfolio_backup_${new Date().toISOString().slice(0, 10)}.json`;
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', filename);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  showToast(`ส่งออกข้อมูลสำเร็จเป็นไฟล์ ${filename}`, 'success');
}

function importPortfolioJSON(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const parsed = JSON.parse(event.target.result);
      if (parsed.profile && parsed.about && parsed.skills && parsed.projects) {
        appData = parsed;
        saveData();
        renderAll();
        populateEditorFields();
        showToast('นำเข้าข้อมูล Portfolio สำเร็จเรียบร้อย!', 'success');
      } else {
        showToast('รูปแบบไฟล์ JSON ไม่ถูกต้องสำหรับ Portfolio', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('เกิดข้อผิดพลาดในการอ่านไฟล์ JSON', 'error');
    }
  };
  reader.readAsText(file);
}

/* ==========================================================================
   ScrollSpy & Active Navigation Tracking
   ========================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, {
    rootMargin: '-20% 0px -70% 0px'
  });

  sections.forEach(sec => observer.observe(sec));
}

/* ==========================================================================
   Toast Notification System
   ========================================================================== */
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span>${escapeHtml(message)}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(15px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

/* ==========================================================================
   Utilities
   ========================================================================== */
function setElText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text || '';
}

function setInputValue(id, val) {
  const el = document.getElementById(id);
  if (el) el.value = val || '';
}

function getInputValue(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : '';
}

function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
