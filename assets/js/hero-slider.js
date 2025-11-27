// Hero Slider Dynamic Content Loader
document.addEventListener("DOMContentLoaded", function () {
  setTimeout(() => {
    loadHeroSliderData();
  }, 1000);
});

async function loadHeroSliderData() {
  try {
    const response = await fetch(`${API_CONFIG.API_BASE}/hero-slider`);
    const slides = await response.json();

    if (slides && slides.length > 0) {
      updateHeroSlider(slides);
    }
  } catch (error) {
    console.error("Error loading hero slider data:", error);
  }
}

function updateHeroSlider(slides) {
  const swiperWrapper = document.querySelector(".product-swiper-wrapper");

  if (!swiperWrapper) {
    console.error("Hero slider wrapper not found");
    return;
  }

  // Get active slides only
  const activeSlides = slides.filter((slide) => slide.isActive);

  if (activeSlides.length === 0) {
    return;
  }

  // Clear existing slides
  swiperWrapper.innerHTML = "";

  // Add new slides from database
  activeSlides.forEach((slide, index) => {
    const slideElement = createSlideElement(slide, index);
    swiperWrapper.appendChild(slideElement);
  });
  reinitializeSwiper();
}

function createSlideElement(slide, index) {
  const slideDiv = document.createElement("div");
  slideDiv.className = "swiper-slide swiper-product-slide";

  const imageUrl = `${API_CONFIG.API_BASE.replace('/api', '')}/uploads/${slide.image}`;
  const animationDirection = index % 2 === 0 ? "fade-right" : "fade-left";

  slideDiv.innerHTML = `
        <img src="${imageUrl}" alt="${slide.title}" class="img-transition" data-aos="${animationDirection}">
        <div class="hero-content">
            <h1 data-aos="fade-right" data-aos-delay="400">${slide.title}</h1>
        </div>
    `;

  return slideDiv;
}

function reinitializeSwiper() {
  // Destroy existing swiper if it exists
  if (window.swiper) {
    window.swiper.destroy(true, true);
  }

  // Wait a bit then reinitialize
  setTimeout(() => {
    window.swiper = new Swiper(".product-swiper", {
      loop: true,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
        pauseOnMouseEnter: false,
      },
      speed: 1000,
      effect: "fade",
      fadeEffect: { crossFade: true },
      on: {
        slideChangeTransitionEnd: function () {
          if (typeof AOS !== "undefined") {
            AOS.refresh();
          }
        },
      },
    });
  }, 100);
}
