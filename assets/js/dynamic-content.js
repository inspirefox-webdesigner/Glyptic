// Dynamic content loader for services and solutions
class DynamicContentLoader {
  constructor() {
    this.apiBase = `${API_CONFIG.API_BASE}`;
    this.init();
  }

  async init() {
    // Load services if on service page
    if (window.location.pathname.includes('service.html')) {
      await this.loadServices();
    }

    // Load solutions if on solution page
    if (window.location.pathname.includes('solution.html')) {
      await this.loadSolutions();
    }
  }

  async loadServices() {
    try {
      const response = await fetch(`${this.apiBase}/services`);
      const services = await response.json();
      this.renderServices(services);
    } catch (error) {
      console.error('Error loading services:', error);
    }
  }

  async loadSolutions() {
    try {
      const response = await fetch(`${this.apiBase}/solutions`);
      const solutions = await response.json();
      this.renderSolutions(solutions);
    } catch (error) {
      console.error('Error loading solutions:', error);
    }
  }

  renderServices(services) {
    const tabNav = document.querySelector('#v-pills-tab');
    const tabContent = document.querySelector('#v-pills-tabContent');

    if (!tabNav || !tabContent) return;

    // Clear existing content
    tabNav.innerHTML = '';
    tabContent.innerHTML = '';

    services.forEach((service, index) => {
      // Create tab button
      const tabButton = document.createElement('button');
      tabButton.className = `nav-link ${index === 0 ? 'active' : ''}`;
      tabButton.id = `tab-${index + 1}`;
      tabButton.setAttribute('data-bs-toggle', 'pill');
      tabButton.setAttribute('data-bs-target', `#content-${index + 1}`);
      tabButton.setAttribute('type', 'button');
      tabButton.setAttribute('role', 'tab');
      tabButton.textContent = service.title;
      tabNav.appendChild(tabButton);

      // Create tab content
      const tabPane = document.createElement('div');
      tabPane.className = `tab-pane fade ${index === 0 ? 'show active' : ''}`;
      tabPane.id = `content-${index + 1}`;
      tabPane.setAttribute('role', 'tabpanel');

      const container = document.createElement('div');
      container.className = 'container p-0';
      container.style.wordWrap = 'break-word';
      container.style.overflowWrap = 'break-word';

      // Render service contents
      service.contents.forEach(content => {
        const element = this.createContentElement(content);
        container.appendChild(element);
      });

      tabPane.appendChild(container);
      tabContent.appendChild(tabPane);
    });
  }

  renderSolutions(solutions) {
    const tabNav = document.querySelector('#v-pills-tab');
    const tabContent = document.querySelector('#v-pills-tabContent');

    if (!tabNav || !tabContent) return;

    // Clear existing content
    tabNav.innerHTML = '';
    tabContent.innerHTML = '';

    solutions.forEach((solution, index) => {
      // Create tab button
      const tabButton = document.createElement('button');
      tabButton.className = `nav-link ${index === 0 ? 'active' : ''}`;
      tabButton.id = `tab-sol-${index + 1}`;
      tabButton.setAttribute('data-bs-toggle', 'pill');
      tabButton.setAttribute('data-bs-target', `#content-sol-${index + 1}`);
      tabButton.setAttribute('type', 'button');
      tabButton.setAttribute('role', 'tab');
      tabButton.textContent = solution.title;
      tabNav.appendChild(tabButton);

      // Create tab content
      const tabPane = document.createElement('div');
      tabPane.className = `tab-pane fade ${index === 0 ? 'show active' : ''}`;
      tabPane.id = `content-sol-${index + 1}`;
      tabPane.setAttribute('role', 'tabpanel');

      const container = document.createElement('div');
      container.className = 'container p-0 p-lg-2';
      container.style.wordWrap = 'break-word';
      container.style.overflowWrap = 'break-word';

      // Render solution contents
      solution.contents.forEach(content => {
        const element = this.createContentElement(content);
        container.appendChild(element);
      });
      

      tabPane.appendChild(container);
      tabContent.appendChild(tabPane);
    });
  }

  createContentElement(content) {
    let element;

    switch (content.type) {
      case 'title':
        element = document.createElement('h1');
        element.textContent = content.data;
        // element.style.fontSize = '3.3rem';
        element.style.fontWeight = 'bold';
        element.style.marginBottom = '1rem';
        element.style.color = '#333';
        break;

      case 'image':
        element = document.createElement('img');
        element.src = `${API_CONFIG.API_BASE.replace('/api', '')}/uploads/${content.data}`;
        element.alt = 'Service/Solution Image';
        element.style.maxWidth = '100%';
        element.style.height = 'auto';
        element.style.marginBottom = '1rem';
        break;

      case 'content':
        element = document.createElement('div');
        element.innerHTML = this.processContentHTML(content.data);
        element.className = 'text-box';
        element.style.marginBottom = '1rem';
        element.style.textAlign = 'justify';
        element.style.lineHeight = '1.6';
        break;

      default:
        element = document.createElement('div');
        element.textContent = content.data;
    }

    return element;
  }

  processContentHTML(html) {
    // Replace h1 tags with h2 to maintain proper hierarchy
    html = html.replace(/<h1([^>]*)>/gi, '<h2$1>');
    html = html.replace(/<\/h1>/gi, '</h2>');

    // Ensure h2 and h3 don't break container boundaries
    html = html.replace(/<h2([^>]*)>/gi, '<h2$1 style="word-wrap: break-word; overflow-wrap: break-word;">');
    html = html.replace(/<h3([^>]*)>/gi, '<h3$1 style="word-wrap: break-word; overflow-wrap: break-word;">');

    // Ensure paragraphs are justified
    html = html.replace(/<p([^>]*)>/gi, '<p$1 style="text-align: justify; word-wrap: break-word;">');

    return html;
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new DynamicContentLoader();
});