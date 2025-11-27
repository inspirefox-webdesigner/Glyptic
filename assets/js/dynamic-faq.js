// Dynamic FAQ loader
class DynamicFAQLoader {
  constructor() {
    this.apiBase = `${API_CONFIG.API_BASE}`;
    this.init();
  }

  async init() {
    if (window.location.pathname.includes('faq.html')) {
      await this.loadFAQs();
    }
  }

  async loadFAQs() {
    try {
      const response = await fetch(`${this.apiBase}/faqs`);
      const faqs = await response.json();
      this.renderFAQs(faqs);
    } catch (error) {
      console.error('Error loading FAQs:', error);
      this.showError();
    }
  }

  renderFAQs(faqs) {
    const sidebar = document.querySelector('.faq-menu');
    const content = document.querySelector('.col-lg-9');

    if (!sidebar || !content) return;

    // Clear loading state
    content.innerHTML = '';
    sidebar.innerHTML = '';

    if (faqs.length === 0) {
      content.innerHTML = '<p class="text-center">No FAQs available.</p>';
      return;
    }

    // Render sidebar menu
    faqs.forEach((faq, index) => {
      const menuItem = document.createElement('li');
      menuItem.innerHTML = `
        <a href="#" class="faq-menu-item ${index === 0 ? 'active' : ''}" data-category="category-${index}">
          ${faq.categoryName}
        </a>
      `;
      sidebar.appendChild(menuItem);
    });

    // Render FAQ content
    faqs.forEach((faq, categoryIndex) => {
      const categoryDiv = document.createElement('div');
      categoryDiv.className = `faq-category ${categoryIndex === 0 ? 'active' : ''}`;
      categoryDiv.id = `category-${categoryIndex}`;

      let accordionHTML = `
        <h3 class="mb-4">${faq.categoryName}</h3>
        <div class="accordion" id="accordion-${categoryIndex}">
      `;

      faq.questions.forEach((question, questionIndex) => {
        const collapseId = `collapse-${categoryIndex}-${questionIndex}`;
        accordionHTML += `
          <div class="accordion-item">
            <h2 class="accordion-header">
              <button class="accordion-button ${questionIndex !== 0 ? 'collapsed' : ''}" 
                      type="button" 
                      data-bs-toggle="collapse" 
                      data-bs-target="#${collapseId}"
                      aria-expanded="${questionIndex === 0 ? 'true' : 'false'}" 
                      aria-controls="${collapseId}">
                ${question.question}
              </button>
            </h2>
            <div id="${collapseId}" 
                 class="accordion-collapse collapse ${questionIndex === 0 ? 'show' : ''}" 
                 data-bs-parent="#accordion-${categoryIndex}">
              <div class="accordion-body">
                ${question.answer}
              </div>
            </div>
          </div>
        `;
      });

      accordionHTML += '</div>';
      categoryDiv.innerHTML = accordionHTML;
      content.appendChild(categoryDiv);
    });

    // Add event listeners
    this.addEventListeners();
  }

  addEventListeners() {
    const menuItems = document.querySelectorAll('.faq-menu-item');
    const categories = document.querySelectorAll('.faq-category');

    menuItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();

        // Remove active from all menu items
        menuItems.forEach(mi => mi.classList.remove('active'));

        // Add active to clicked item
        item.classList.add('active');

        // Hide all categories
        categories.forEach(cat => cat.classList.remove('active'));

        // Show selected category
        const categoryId = item.getAttribute('data-category');
        const targetCategory = document.getElementById(categoryId);
        if (targetCategory) {
          targetCategory.classList.add('active');
        }
      });
    });
  }

  showError() {
    const content = document.querySelector('.col-lg-9');
    if (content) {
      content.innerHTML = '<p class="text-center text-danger">Error loading FAQs. Please try again later.</p>';
    }
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new DynamicFAQLoader();
});