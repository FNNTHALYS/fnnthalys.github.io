// DOM Content Loaded Event Handler
document.addEventListener('DOMContentLoaded', initializeApplication);

function initializeApplication() {
    initializeSwiper();
    initializeSolutionModal();
    initializeHighlights();
    initializeHamburgerMenu();
}

// Swiper Initialization
function initializeSwiper() {
    new Swiper('.swiper', {
        loop: true,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        autoplay: {
            delay: 5000,
        },
    });
}

// Solution Modal Functionality
function initializeSolutionModal() {
    const modal = document.getElementById('solutionModal');
    const modalContent = document.getElementById('modalContent');
    const closeBtn = document.getElementsByClassName('close')[0];
    const miniSolutions = document.querySelectorAll('.solution-mini');

    miniSolutions.forEach(solution => {
        solution.addEventListener('click', () => openSolutionModal(solution, modal, modalContent));
    });

    closeBtn.addEventListener('click', () => closeModal(modal));
    window.addEventListener('click', (event) => closeModalOnOutsideClick(event, modal));
}

function openSolutionModal(solution, modal, modalContent) {
    const solutionData = extractSolutionData(solution);
    modalContent.innerHTML = createSolutionModalContent(solutionData);
    modal.style.display = 'block';
}

function extractSolutionData(solution) {
    const descriptionElement = solution.querySelector('p');
    const imgElement = solution.querySelector('.mini-img');

    return {
        id: solution.getAttribute('data-id'),
        title: solution.querySelector('.mini-title').textContent,
        date: solution.querySelector('.mini-date').textContent.trim(),
        description: descriptionElement.getAttribute('data-description') || descriptionElement.textContent,
        tech: solution.querySelector('.mini-tech').innerHTML,
        imgSrc: imgElement ? imgElement.src : '',
        imgAlt: imgElement ? imgElement.alt : solution.querySelector('.mini-title').textContent
    };
}

function createSolutionModalContent(data) {
    const imageSection = data.imgSrc ?
        `<div class="solution-image">
            <img src="${data.imgSrc}" alt="${data.imgAlt}" class="modal-img">
        </div>` : '';

    return `
        <h2 class="solution-title">${data.title}</h2>
        <div class="solution-date">${data.date}</div>
        ${imageSection}
        <div class="solution-section">
            <h4>Tarefas realizadas</h4>
            <p>${data.description}</p>
        </div>
    `;
}

function closeModal(modal) {
    modal.style.display = 'none';
}

function closeModalOnOutsideClick(event, modal) {
    if (event.target === modal) {
        closeModal(modal);
    }
}

// Image Modal Functionality
const imageModalController = (() => {
    const imageModal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const imageModalClose = document.querySelector('.image-modal-close');
    const cardSliders = document.querySelectorAll('.card-slider');

    let currentSlider;
    let currentSlideIndex;
    let currentSlides;

    function initialize() {
        setupNavigationButtons();
        setupEventListeners();
    }

    function setupNavigationButtons() {
        const prevImageBtn = createNavigationButton('modal-nav-btn modal-prev-btn', '&#10094;');
        const nextImageBtn = createNavigationButton('modal-nav-btn modal-next-btn', '&#10095;');

        imageModal.appendChild(prevImageBtn);
        imageModal.appendChild(nextImageBtn);

        prevImageBtn.addEventListener('click', showPreviousImage);
        nextImageBtn.addEventListener('click', showNextImage);
    }

    function createNavigationButton(className, innerHTML) {
        const button = document.createElement('button');
        button.className = className;
        button.innerHTML = innerHTML;
        return button;
    }

    function setupEventListeners() {
        cardSliders.forEach(slider => {
            slider.addEventListener('click', handleSliderClick);
        });

        imageModalClose.addEventListener('click', closeImageModal);
        imageModal.addEventListener('click', handleImageModalClick);
    }

    function handleSliderClick(event) {
        const clickedSlide = event.target.closest('.swiper-slide');
        if (!clickedSlide) return;

        const img = clickedSlide.querySelector('img');
        if (!img) return;

        storeCurrentSliderState(this, clickedSlide);
        openImageModal(img.src);
    }

    function storeCurrentSliderState(slider, clickedSlide) {
        currentSlider = slider;
        currentSlides = Array.from(slider.querySelectorAll('.swiper-slide'));
        currentSlideIndex = currentSlides.indexOf(clickedSlide);
    }

    function openImageModal(imageSrc) {
        imageModal.style.display = 'block';
        modalImage.src = imageSrc;
    }

    function showPreviousImage() {
        if (!currentSlides || currentSlides.length === 0) return;

        currentSlideIndex = (currentSlideIndex - 1 + currentSlides.length) % currentSlides.length;
        updateModalImage();
    }

    function showNextImage() {
        if (!currentSlides || currentSlides.length === 0) return;

        currentSlideIndex = (currentSlideIndex + 1) % currentSlides.length;
        updateModalImage();
    }

    function updateModalImage() {
        const img = currentSlides[currentSlideIndex].querySelector('img');
        if (img) {
            modalImage.src = img.src;
        }
    }

    function closeImageModal() {
        imageModal.style.display = 'none';
    }

    function handleImageModalClick(event) {
        if (event.target === imageModal) {
            closeImageModal();
        }
    }

    return { initialize };
})();

// Initialize image modal functionality
imageModalController.initialize();

// Keyword Highlighting
function initializeHighlights() {
    const solutionKeywords = [
        { word: 'transformar tarefas manuais do dia a dia em soluções automatizadas e eficientes', class: 'highlight-primary' },
        { word: 'análises estratégicas e aumento da produtividade', class: 'highlight-primary' },
        { word: 'área logística', class: 'highlight-primary' },
        { word: 'unem conhecimento técnico, visão de negócios e melhoria de processos', class: 'highlight-primary' },
        { word: 'especialista em resoluções e automações tecnológicas', class: 'highlight-primary' },
    ];

    highlightKeywords('.solution-section p', solutionKeywords);
    highlightKeywords('.hero-info p', solutionKeywords);
}

function highlightKeywords(selector, keywords) {
    const textElements = document.querySelectorAll(selector);
    if (!textElements.length) return;

    const sortedKeywords = [...keywords].sort((a, b) => b.word.length - a.word.length);

    textElements.forEach(element => {
        let html = element.innerHTML;

        sortedKeywords.forEach(keyword => {
            html = replaceKeywordWithHighlight(html, keyword);
        });

        element.innerHTML = html;
    });
}

function replaceKeywordWithHighlight(text, keyword) {
    const regex = new RegExp(`\\b(${keyword.word})\\b`, 'gi');
    const highlightClass = keyword.class || 'highlight-primary';
    return text.replace(regex, `<span class="highlight ${highlightClass}">$1</span>`);
}

// Hamburger Menu
function initializeHamburgerMenu() {
    const hamburger = document.querySelector('.hamburger-menu');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', toggleMenu);

    const links = document.querySelectorAll('.nav-links a');
    links.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', closeMenuOnOutsideClick);

    function toggleMenu() {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    }

    function closeMenu() {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    }

    function closeMenuOnOutsideClick(event) {
        if (!event.target.closest('.nav-links') && !event.target.closest('.hamburger-menu')) {
            closeMenu();
        }
    }
}