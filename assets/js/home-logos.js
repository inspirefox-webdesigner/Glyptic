// Dynamic Home Logos Handler
const API_BASE_URL = window.API_CONFIG?.BASE_URL || 'http://localhost:5000/api';

// Static fallback logos
const STATIC_LOGOS = [
  { imageUrl: 'assets/img/brand/1.jpg', type: 'brand', value: 'Ansul' },
  { imageUrl: 'assets/img/brand/2.jpg', type: 'brand', value: 'Ware' },
  { imageUrl: 'assets/img/brand/3.jpg', type: 'brand', value: 'Edwards' },
  { imageUrl: 'assets/img/brand/4.jpg', type: 'brand', value: 'ESSER' },
  { imageUrl: 'assets/img/brand/5.jpg', type: 'brand', value: 'Farenhyt' },
  { imageUrl: 'assets/img/brand/6.jpg', type: 'brand', value: 'Fipron' },
  { imageUrl: 'assets/img/brand/7.jpg', type: 'brand', value: 'Glyptic' }
];

let brandSwiper = null;

async function loadHomeLogos() {
  const brandSlider = document.getElementById('brandSlider1');
  if (!brandSlider) return;

  const swiperWrapper = brandSlider.querySelector('.swiper-wrapper');
  if (!swiperWrapper) return;

  try {
    const response = await fetch(`${API_BASE_URL}/home-logos`);
    
    let logos = [];
    
    if (response.ok) {
      const data = await response.json();
      logos = data.length > 0 ? data : STATIC_LOGOS;
    } else {
      logos = STATIC_LOGOS;
    }

    swiperWrapper.innerHTML = '';

    // Duplicate logos multiple times for seamless loop
    const duplicateCount = Math.max(5, Math.ceil(20 / logos.length));
    const allLogos = [];
    for (let i = 0; i < duplicateCount; i++) {
      allLogos.push(...logos);
    }

    allLogos.forEach(logo => {
      const slide = document.createElement('div');
      slide.className = 'swiper-slide';
      
      const link = document.createElement('a');
      link.className = 'brand-box';
      link.href = '#';
      link.dataset.type = logo.type;
      link.dataset.value = logo.value;
      
      const img = document.createElement('img');
      const baseURL = API_BASE_URL.replace('/api', '');
      img.src = logo.imageUrl.startsWith('/uploads') 
        ? `${baseURL}${logo.imageUrl}` 
        : logo.imageUrl;
      img.alt = logo.value;
      img.onerror = function() {
        console.error('Image load error:', this.src);
      };
      
      link.appendChild(img);
      slide.appendChild(link);
      swiperWrapper.appendChild(slide);
    });

    initSwiper();
    setupBrandNavigation();

  } catch (error) {
    console.error('Error loading home logos:', error);
    loadStaticLogos(swiperWrapper);
  }
}

function loadStaticLogos(swiperWrapper) {
  swiperWrapper.innerHTML = '';
  
  const duplicateCount = Math.max(5, Math.ceil(20 / STATIC_LOGOS.length));
  const allLogos = [];
  for (let i = 0; i < duplicateCount; i++) {
    allLogos.push(...STATIC_LOGOS);
  }
  
  allLogos.forEach(logo => {
    const slide = document.createElement('div');
    slide.className = 'swiper-slide';
    
    const link = document.createElement('a');
    link.className = 'brand-box';
    link.href = '#';
    link.dataset.type = logo.type;
    link.dataset.value = logo.value;
    
    const img = document.createElement('img');
    img.src = logo.imageUrl;
    img.alt = logo.value;
    
    link.appendChild(img);
    slide.appendChild(link);
    swiperWrapper.appendChild(slide);
  });

  initSwiper();
  setupBrandNavigation();
}

function initSwiper() {
  const brandSlider = document.getElementById('brandSlider1');
  if (!brandSlider) return;

  if (brandSwiper) {
    brandSwiper.destroy(true, true);
  }

  brandSwiper = new Swiper('#brandSlider1', {
    slidesPerView: 'auto',
    spaceBetween: 145,
    loop: true,
    // loopedSlides: 50,
    speed: 5000,
    autoplay: {
      delay: 0,
      disableOnInteraction: false,
      pauseOnMouseEnter: false,
    },
    allowTouchMove: false,
    freeMode: {
      enabled: true,
      momentum: false,
    },
    grabCursor: false,
  });
}

function setupBrandNavigation() {
  const brandSlider = document.getElementById('brandSlider1');
  if (!brandSlider) return;

  brandSlider.addEventListener('click', function(e) {
    const brandBox = e.target.closest('.brand-box');
    
    if (brandBox) {
      e.preventDefault();
      
      const type = brandBox.dataset.type;
      const value = brandBox.dataset.value;
      
      if (type && value) {
        const param = type === 'brand' ? 'brand' : 'category';
        window.location.href = `products.html?${param}=${encodeURIComponent(value)}`;
      }
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadHomeLogos);
} else {
  loadHomeLogos();
}
