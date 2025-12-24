// Hero Slider Dynamic Content Loader
let heroSwiper = null;
let isBackendConnected = false;

// Default fallback slides when backend is not connected
const defaultSlides = [
  {
    title: "FIRE DETECTION",
    image: "assets/img/product/product-1.png",
    isLocal: true,
    isActive: true
  },
  {
    title: "Smart & Elegant Designs",
    image: "assets/img/product/product-2.png",
    isLocal: true,
    isActive: true
  },
  {
    title: "Innovation Meets Quality",
    image: "assets/img/product/product-3.png",
    isLocal: true,
    isActive: true
  }
];

document.addEventListener("DOMContentLoaded", function () {
  loadHeroSliderData();
});

async function loadHeroSliderData() {
  try {
    const response = await fetch(`${API_CONFIG.API_BASE}/hero-slider`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Backend not available');
    }
    
    const slides = await response.json();
    
    // Filter active slides
    const activeSlides = slides.filter(slide => slide.isActive !== false);

    if (activeSlides && activeSlides.length > 0) {
      isBackendConnected = true;
      console.log(` Backend connected: Loading ${activeSlides.length} slides from database`);
      updateHeroSlider(activeSlides);
    } else {
      console.log(" No active slides in database, using default slides");
      isBackendConnected = false;
      updateHeroSlider(defaultSlides);
    }
  } catch (error) {
    console.log("ℹ Backend not connected, using default slides");
    isBackendConnected = false;
    updateHeroSlider(defaultSlides);
  }
}

  function updateHeroSlider(slides) {
    const swiperWrapper = document.querySelector(".product-swiper-wrapper");

    if (!swiperWrapper) {
      console.error(" Hero slider wrapper not found");
      return;
    }

    if (!slides || slides.length === 0) {
      console.log(" No slides to display");
      return;
    }

    console.log(` Loading ${slides.length} slides into hero slider`);

  // Clear existing slides only if backend is connected
  if (isBackendConnected) {
    swiperWrapper.innerHTML = "";
  }

  // If backend connected, add all slides from database
  if (isBackendConnected) {
    slides.forEach((slide, index) => {
      const slideElement = createSlideElement(slide, index);
      swiperWrapper.appendChild(slideElement);
    });
  }
  // If backend not connected, keep default HTML slides but reinitialize swiper

  // Reinitialize swiper after slides are updated
  setTimeout(() => {
    reinitializeSwiper(slides.length);
  }, 100);
}

function createSlideElement(slide, index) {
  const slideDiv = document.createElement("div");
  slideDiv.className = "swiper-slide swiper-product-slide";

  // Use local image path for default slides, otherwise use backend uploads
  const imageUrl = slide.isLocal 
    ? slide.image 
    : `${API_CONFIG.API_BASE.replace('/api', '')}/uploads/${slide.image}`;
  
  const animationDirection = index % 2 === 0 ? "fade-left" : "fade-right";

  slideDiv.innerHTML = `
        <img src="${imageUrl}" alt="${slide.title || 'Hero Slide'}" class="img-transition" data-aos="${animationDirection}">
        <div class="hero-content">
            <h1 data-aos="fade-right" data-aos-delay="400">${slide.title || ''}</h1>
        </div>
    `;

  return slideDiv;
}

function reinitializeSwiper(slideCount) {
  // Destroy existing swiper if it exists
  if (heroSwiper !== null && heroSwiper.destroy) {
    heroSwiper.destroy(true, true);
    heroSwiper = null;
  }

  const swiperContainer = document.querySelector(".product-swiper");
  
  if (!swiperContainer) {
    console.error(" Swiper container not found");
    return;
  }

  // Check actual slide count in DOM
  const actualSlides = document.querySelectorAll(".product-swiper-wrapper .swiper-slide");
  const totalSlides = actualSlides.length;
  
  console.log(` Initializing swiper with ${totalSlides} slides`);

  // Configure swiper based on slide count
  const swiperConfig = {
    slidesPerView: 1,
    spaceBetween: 0,
    loop: totalSlides > 1, // Only enable loop if more than 1 slide
    speed: 1000,
    effect: "fade",
    fadeEffect: {
      crossFade: true
    },
    autoplay: totalSlides > 1 ? {
      delay: 4000,
      disableOnInteraction: false,
      pauseOnMouseEnter: false,
    } : false,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    on: {
      init: function () {
        console.log(` Hero Swiper initialized with ${this.slides.length} slides`);
        // Show/hide navigation based on slide count
        const nextBtn = document.querySelector(".swiper-button-next");
        const prevBtn = document.querySelector(".swiper-button-prev");
        if (totalSlides <= 1) {
          if (nextBtn) nextBtn.style.display = 'none';
          if (prevBtn) prevBtn.style.display = 'none';
        } else {
          if (nextBtn) nextBtn.style.display = 'flex';
          if (prevBtn) prevBtn.style.display = 'flex';
        }
      },
      slideChange: function () {
        console.log(` Current slide: ${this.realIndex + 1} of ${totalSlides}`);
        // Refresh AOS animations if available
        if (typeof AOS !== "undefined") {
          AOS.refresh();
        }
      },
    },
  };

  try {
    heroSwiper = new Swiper(".product-swiper", swiperConfig);
    console.log(" Hero Swiper initialized successfully");
  } catch (error) {
    console.error(" Error initializing swiper:", error);
  }
}
