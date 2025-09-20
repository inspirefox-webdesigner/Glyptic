// Training Calendar Handler
class TrainingCalendarHandler {
  constructor() {
    this.apiBase = 'http://localhost:5000/api/training';
    this.calendar = null;
    this.selectedEvent = null;
    this.init();
  }
 
  async init() {
    if (document.getElementById('calendar')) {
      this.initializeCalendar();
      await this.loadEvents();
      this.setupEventHandlers();
    }
  }
 
  initializeCalendar() {
    const calendarEl = document.getElementById('calendar');
 
    this.calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'dayGridMonth',
      fixedWeekCount: true,
      showNonCurrentDates: true,
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: ''
      },
      events: [],
      eventClick: (info) => this.handleEventClick(info),
      eventDidMount: (info) => {
        // Add hover effect and cursor pointer
        info.el.style.cursor = 'pointer';
        info.el.title = `Click to register for: ${info.event.title}`;
        // Remove the time display that shows "5:30a"
        const timeEl = info.el.querySelector('.fc-event-time');
        if (timeEl) {
          timeEl.style.display = 'none';
        }
      }
    });
 
    this.calendar.render();
  }
 
  async loadEvents() {
    try {
      const response = await fetch(`${this.apiBase}/events`);
      if (!response.ok) {
        throw new Error('Failed to load events');
      }
 
      const events = await response.json();
 
      this.calendar.removeAllEvents();
      events.forEach(event => {
        this.calendar.addEvent({
          id: event._id,
          title: event.title,
          start: event.date,
          allDay: true, // This prevents time display
          description: event.description || ''
        });
      });
    } catch (error) {
      console.error('Error loading events:', error);
      this.showNotification('Failed to load training events', 'error');
    }
  }
 
  handleEventClick(info) {
    this.selectedEvent = {
      id: info.event.id,
      title: info.event.title,
      date: info.event.start
    };
 
    document.getElementById('eventTitle').textContent = this.selectedEvent.title;
 
    const modal = new bootstrap.Modal(document.getElementById('registrationModal'));
    modal.show();
  }
 
  setupEventHandlers() {
    // Form validation only - submission is handled by FormHandler
    const form = document.getElementById('registrationForm');
    if (form) {
      form.addEventListener('input', () => this.validateForm());
    }
  }
 
  async handleRegistration() {
    // This method is now handled by the FormHandler class
    // to prevent duplicate submissions and improve performance
    console.log('Registration handled by FormHandler');
  }
 
  getFormData() {
    return {
      name: document.getElementById('userName').value.trim(),
      phone: document.getElementById('userPhone').value.trim(),
      email: document.getElementById('userEmail').value.trim(),
      address: document.getElementById('userAddress').value.trim()
    };
  }
 
  validateFormData(data) {
    const { name, phone, email, address } = data;
 
    if (!name || !phone || !email || !address) {
      this.showNotification('Please fill in all required fields.', 'error');
      return false;
    }
 
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      this.showNotification('Please enter a valid email address.', 'error');
      return false;
    }
 
    // Phone validation (basic)
    const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
    if (!phoneRegex.test(phone)) {
      this.showNotification('Please enter a valid phone number.', 'error');
      return false;
    }
 
    return true;
  }
 
  validateForm() {
    const formData = this.getFormData();
    const submitBtn = document.getElementById('submitRegistration');
 
    const isValid = formData.name && formData.phone && formData.email && formData.address;
 
    if (submitBtn) {
      submitBtn.disabled = !isValid;
      submitBtn.classList.toggle('btn-primary', isValid);
      submitBtn.classList.toggle('btn-secondary', !isValid);
    }
  }
 
  clearForm() {
    const form = document.getElementById('registrationForm');
    if (form) {
      form.reset();
    }
  }
 
  closeModal() {
    const modal = bootstrap.Modal.getInstance(document.getElementById('registrationModal'));
    if (modal) {
      modal.hide();
    }
  }
 
  showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'error' ? 'danger' : type === 'success' ? 'success' : 'info'} alert-dismissible fade show`;
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.zIndex = '9999';
    notification.style.minWidth = '300px';
 
    notification.innerHTML = `
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
 
    document.body.appendChild(notification);
 
    // Auto remove after 5 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 5000);
  }
}
 
// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new TrainingCalendarHandler();
});