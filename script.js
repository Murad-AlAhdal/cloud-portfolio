let currentStep = 1;
const totalSteps = 4;
let uploadedImage = null;

document.addEventListener('DOMContentLoaded', () => {
    setupNavigation();
    setupImageUpload();
});

function setupNavigation() {
    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');
    const submitBtn = document.getElementById('submit-btn');

    nextBtn.addEventListener('click', () => {
        if (validateStep(currentStep)) {
            if (currentStep < totalSteps) {
                currentStep++;
                updateUI();
            }
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentStep > 1) {
            currentStep--;
            updateUI();
        }
    });

    submitBtn.addEventListener('click', () => {
        if (validateStep(currentStep)) {
            generatePortfolio();
        }
    });
}

function updateUI() {
    document.querySelectorAll('.form-step').forEach(step => {
        step.classList.remove('active');
    });

    document.querySelector(`.form-step[data-step="${currentStep}"]`).classList.add('active');

    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const submitBtn = document.getElementById('submit-btn');

    prevBtn.style.display = currentStep === 1 ? 'none' : 'inline-block';

    if (currentStep === totalSteps) {
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'inline-block';
    } else {
        nextBtn.style.display = 'inline-block';
        submitBtn.style.display = 'none';
    }
}

function validateStep(step) {
    const currentStepEl = document.querySelector(`.form-step[data-step="${step}"]`);
    const requiredInputs = currentStepEl.querySelectorAll('[required]');
    let isValid = true;

    requiredInputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.style.borderColor = '#ff7675';
            input.addEventListener('input', () => input.style.borderColor = '#dfe6e9');
        }
    });

    if (!isValid) alert('Please fill in all required fields');
    return isValid;
}

function setupImageUpload() {
    const input = document.getElementById('profile-pic-input');
    const preview = document.getElementById('profile-preview');

    input.addEventListener('change', function () {
        const file = this.files[0];
        const span = input.parentElement.querySelector('span');
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                preview.src = e.target.result;
                preview.style.display = 'block';
                if (span) span.style.display = 'none';
                uploadedImage = e.target.result;
            }
            reader.readAsDataURL(file);
        }
    });
}

function createRemoveBtn(parent) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'remove-btn';
    btn.innerHTML = '× Remove';
    btn.onclick = () => parent.remove();
    return btn;
}

function addEducationField() {
    const container = document.getElementById('education-list');
    const div = document.createElement('div');
    div.className = 'dynamic-item';
    div.innerHTML = `
        <div class="form-grid">
            <div class="form-group full-width">
                <input type="text" placeholder="University / Institution" class="edu-school">
            </div>
            <div class="form-group">
                <input type="text" placeholder="Degree / Qualification" class="edu-degree">
            </div>
            <div class="form-group">
                <input type="text" placeholder="Year (e.g., 2024)" class="edu-year">
            </div>
        </div>
    `;
    div.appendChild(createRemoveBtn(div));
    container.appendChild(div);
}

function addExperienceField() {
    const container = document.getElementById('experience-list');
    const div = document.createElement('div');
    div.className = 'dynamic-item';
    div.innerHTML = `
        <div class="form-grid">
            <div class="form-group full-width">
                <input type="text" placeholder="Company / Organization" class="exp-company">
            </div>
            <div class="form-group">
                <input type="text" placeholder="Job Title" class="exp-role">
            </div>
            <div class="form-group">
                <input type="text" placeholder="Period (e.g., 2020 - Present)" class="exp-date">
            </div>
            <div class="form-group full-width">
                <textarea placeholder="Description of responsibilities..." class="exp-desc"></textarea>
            </div>
        </div>
    `;
    div.appendChild(createRemoveBtn(div));
    container.appendChild(div);
}

function addActivityField() {
    const container = document.getElementById('activities-list');
    const div = document.createElement('div');
    div.className = 'dynamic-item';
    div.innerHTML = `
        <div class="form-group full-width">
            <input type="text" placeholder="Activity Name / Volunteer Work" class="act-title">
            <textarea placeholder="Description..." class="act-desc" style="margin-top:10px"></textarea>
        </div>
    `;
    div.appendChild(createRemoveBtn(div));
    container.appendChild(div);
}

function getFormData() {
    const formData = {
        fullName: document.querySelector('[name="fullName"]').value.trim(),
        specialization: document.querySelector('[name="specialization"]').value,
        currentRole: document.querySelector('[name="currentRole"]').value,
        bio: document.querySelector('[name="bio"]').value,
        email: document.querySelector('[name="email"]').value,
        phone: document.querySelector('[name="phone"]').value,
        linkedin: document.querySelector('[name="linkedin"]').value,
        github: document.querySelector('[name="github"]').value,
        location: document.querySelector('[name="location"]').value,
        skills: document.querySelector('[name="skills"]').value.split(',').map(s => s.trim()),
        image: uploadedImage,
        education: [],
        experience: [],
        activities: []
    };

    document.querySelectorAll('#education-list .dynamic-item').forEach(item => {
        formData.education.push({
            school: item.querySelector('.edu-school').value,
            degree: item.querySelector('.edu-degree').value,
            year: item.querySelector('.edu-year').value
        });
    });

    document.querySelectorAll('#experience-list .dynamic-item').forEach(item => {
        formData.experience.push({
            company: item.querySelector('.exp-company').value,
            role: item.querySelector('.exp-role').value,
            date: item.querySelector('.exp-date').value,
            desc: item.querySelector('.exp-desc').value
        });
    });

    document.querySelectorAll('#activities-list .dynamic-item').forEach(item => {
        formData.activities.push({
            title: item.querySelector('.act-title').value,
            desc: item.querySelector('.act-desc').value
        });
    });

    return formData;
}

function generatePortfolio() {
    const data = getFormData();
    const container = document.getElementById('generated-content');
    const formSection = document.getElementById('form-section');
    const previewSection = document.getElementById('portfolio-preview');

    let html = '';
    const themeClass = `theme-${data.specialization}`;

    html += `<div class="portfolio-container ${themeClass}">`;

    if (data.specialization === 'creative') {
        html += `
            <nav class="p-nav">
                <div class="p-logo">${data.fullName.split(' ')[0]}<span>.</span></div>
                <div class="p-nav-links">
                    <a href="#home">Home</a>
                    <a href="#about">About</a>
                    <a href="#portfolio">Portfolio</a>
                    <a href="#blog">Blog</a>
                    <a href="#contact">Contact</a>
                </div>
                <a href="mailto:${data.email}" class="btn-talk">Let's Talk</a>
            </nav>
            <header class="p-hero" id="home">
                <div class="hero-text">
                    <h2 class="hero-greeting">Hi, I'm <span class="accent-text">${data.fullName}</span></h2>
                    <h1 class="hero-role">${data.currentRole}</h1>
                    <p class="hero-desc">${data.bio || 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore et officiis suscipit ut assumenda libero tenetur expedita eaque, quaerat quasi.'}</p>
                    <div class="hero-btns">
                        <button class="btn-hire">Hire Me</button>
                        <button class="btn-projects">See Projects</button>
                    </div>
                </div>
                <div class="hero-image">
                    ${data.image ? `<img src="${data.image}" alt="${data.fullName}">` : '<img src="https://via.placeholder.com/600x800" alt="Profile">'}
                </div>
                <div class="hero-social">
                    <a href="#"><i class="fab fa-linkedin-in"></i></a>
                    <a href="#"><i class="fab fa-facebook-f"></i></a>
                    <a href="#"><i class="fab fa-twitter"></i></a>
                </div>
            </header>
        `;
    } else {
        html += `
            <header class="p-header">
                ${data.image ? `<img src="${data.image}" class="p-profile-img" alt="Profile">` : ''}
                <h1>${data.fullName}</h1>
                <p class="role">${data.currentRole}</p>
                <div class="p-contact-links">
                    ${data.email ? `<a href="mailto:${data.email}"><i class="fas fa-envelope"></i></a>` : ''}
                    ${data.linkedin ? `<a href="${data.linkedin}" target="_blank"><i class="fab fa-linkedin"></i></a>` : ''}
                    ${data.github ? `<a href="${data.github}" target="_blank"><i class="fab fa-github"></i></a>` : ''}
                    ${data.phone ? `<a href="tel:${data.phone}"><i class="fas fa-phone"></i></a>` : ''}
                </div>
                <p class="p-location"><i class="fas fa-map-marker-alt"></i> ${data.location}</p>
            </header>
        `;
    }

    if (data.specialization !== 'creative') {
        html += `
            <section class="p-section">
                <h2>About Me</h2>
                <div class="p-content-wrapper">
                    <p>${data.bio}</p>
                </div>
            </section>
        `;
    }

    if (data.experience.length > 0) {
        html += `<section class="p-section" id="portfolio"><h2>Professional Experience</h2><div class="p-content-wrapper">`;
        data.experience.forEach(exp => {
            html += `
                    <div class="p-card">
                        ${data.specialization === 'business' ? `<span class="p-date">${exp.date}</span>` : ''}
                        <div>
                            <h3>${exp.role} at ${exp.company}</h3>
                            ${data.specialization !== 'business' ? `<span class="p-date">${exp.date}</span>` : ''}
                            <p>${exp.desc}</p>
                        </div>
                    </div>
                `;
        });
        html += `</div></section>`;
    }

    if (data.education.length > 0) {
        html += `<section class="p-section"><h2>Education</h2><div class="p-content-wrapper">`;
        data.education.forEach(edu => {
            html += `
                <div class="p-card">
                     ${data.specialization === 'business' ? `<span class="p-date">${edu.year}</span>` : ''}
                    <div>
                        <h3>${edu.school}</h3>
                        <p>${edu.degree} ${data.specialization !== 'business' ? `- ${edu.year}` : ''}</p>
                    </div>
                </div>
            `;
        });
        html += `</div></section>`;
    }

    if (data.skills.length > 0 && data.skills[0] !== "") {
        html += `<section class="p-section"><h2>Skills</h2><div class="p-content-wrapper"><div class="p-skills">`;
        html += `<p>${data.skills.join(' • ')}</p>`;
        html += `</div></div></section>`;
    }

    if (data.activities.length > 0) {
        html += `<section class="p-section"><h2>Activities & Leadership</h2><div class="p-content-wrapper">`;
        data.activities.forEach(act => {
            html += `
                <div class="p-card">
                    <h3>${act.title}</h3>
                    <p>${act.desc}</p>
                </div>
            `;
        });
        html += `</div></section>`;
    }

    html += `</div>`;

    container.innerHTML = html;
    formSection.style.display = 'none';
    document.querySelector('.app-header').style.display = 'none';
    previewSection.style.display = 'block';

    window.scrollTo(0, 0);
}

function editPortfolio() {
    document.getElementById('portfolio-preview').style.display = 'none';
    document.getElementById('form-section').style.display = 'block';
    document.querySelector('.app-header').style.display = 'block';
}

function printPortfolio() {
    window.print();
}
