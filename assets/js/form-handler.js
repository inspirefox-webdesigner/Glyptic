/**
 * Optimized Form Handler
 * Prevents duplicate submissions and improves form submission speed
 */
 
class FormHandler {
    constructor() {
        this.submissionStates = new Map();
        this.init();
    }
 
    init() {
        this.setupFormHandlers();
    }
 
    setupFormHandlers() {
        // Handle contact form
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            this.setupContactForm(contactForm);
        }
 
        // Handle career form
        const careerForm = document.getElementById('careerForm');
        if (careerForm) {
            this.setupCareerForm(careerForm);
        }
 
        // Handle training registration form
        const trainingForm = document.getElementById('registrationForm');
        if (trainingForm) {
            this.setupTrainingForm(trainingForm);
        }
    }
 
    setupContactForm(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
       
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
           
            const formId = 'contact-form';
            if (this.isSubmitting(formId)) return;
           
            this.setSubmitting(formId, true);
            this.updateButtonState(submitBtn, true, 'Sending...');
 
            try {
                const formData = this.getFormData(form);
               
                if (!this.validateContactForm(formData)) {
                    this.resetSubmission(formId, submitBtn, 'Submit Message');
                    return;
                }
 
                const response = await this.submitForm('contacts', formData);
               
                if (response.ok) {
                    this.showSuccess('Your message has been sent successfully! We will get back to you soon.');
                    form.reset();
                } else {
                    const errorData = await response.json();
                    this.showError(errorData.message || 'Failed to send message. Please try again.');
                }
            } catch (error) {
                console.error('Contact form error:', error);
                this.showError('Network error. Please check your connection and try again.');
            } finally {
                this.resetSubmission(formId, submitBtn, 'Submit Message');
            }
        });
    }
 
    setupCareerForm(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
       
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
           
            const formId = 'career-form';
            if (this.isSubmitting(formId)) return;
           
            this.setSubmitting(formId, true);
            this.updateButtonState(submitBtn, true, 'Submitting...');
 
            try {
                const formData = this.getFormData(form);
               
                if (!this.validateCareerForm(formData)) {
                    this.resetSubmission(formId, submitBtn, 'Submit Application');
                    return;
                }
 
                const response = await this.submitForm('careers', formData);
               
                if (response.ok) {
                    this.showSuccess('Your application has been submitted successfully! We will review it and get back to you soon.');
                    form.reset();
                } else {
                    const errorData = await response.json();
                    this.showError(errorData.message || 'Failed to submit application. Please try again.');
                }
            } catch (error) {
                console.error('Career form error:', error);
                this.showError('Network error. Please check your connection and try again.');
            } finally {
                this.resetSubmission(formId, submitBtn, 'Apply Now');
            }
        });
    }
 
    setupTrainingForm(form) {
        const submitBtn = document.getElementById('submitRegistration');
       
        if (submitBtn) {
            submitBtn.addEventListener('click', async () => {
                const formId = 'training-form';
                if (this.isSubmitting(formId)) return;
               
                this.setSubmitting(formId, true);
                this.updateButtonState(submitBtn, true, 'Registering...');
 
                try {
                    const formData = {
                        userName: document.getElementById('userName')?.value?.trim() || '',
                        userPhone: document.getElementById('userPhone')?.value?.trim() || '',
                        userEmail: document.getElementById('userEmail')?.value?.trim() || '',
                        userAddress: document.getElementById('userAddress')?.value?.trim() || ''
                    };
                   
                    if (!this.validateTrainingForm(formData)) {
                        this.resetSubmission(formId, submitBtn, 'Submit Registration');
                        return;
                    }
 
                    const eventTitle = document.getElementById('eventTitle')?.textContent;
                    if (!eventTitle) {
                        this.showError('No event selected');
                        this.resetSubmission(formId, submitBtn, 'Submit Registration');
                        return;
                    }
 
                    // First, get all events to find the eventId by title
                    const eventsResponse = await fetch(`${API_CONFIG.API_BASE}/training/events`);
                    if (!eventsResponse.ok) {
                        throw new Error('Failed to fetch events');
                    }
                   
                    const events = await eventsResponse.json();
                    const selectedEvent = events.find(event => event.title === eventTitle);
                   
                    if (!selectedEvent) {
                        this.showError('Event not found. Please try again.');
                        this.resetSubmission(formId, submitBtn, 'Submit Registration');
                        return;
                    }
 
                    const registrationData = {
                        eventId: selectedEvent._id,
                        name: formData.userName,
                        phone: formData.userPhone,
                        email: formData.userEmail,
                        address: formData.userAddress
                    };
 
                    const response = await this.submitForm('training/register', registrationData);
                   
                    if (response.ok) {
                        this.showSuccess('Registration successful! Thank you for registering. You will receive a confirmation email shortly.');
                        form.reset();
                        this.closeModal('registrationModal');
                    } else {
                        const errorData = await response.json();
                        if (response.status === 400 && errorData.message.includes('already registered')) {
                            this.showError(errorData.message);
                        } else {
                            this.showError(errorData.message || 'Registration failed. Please try again.');
                        }
                    }
                } catch (error) {
                    console.error('Training form error:', error);
                    this.showError('Network error. Please check your connection and try again.');
                } finally {
                    this.resetSubmission(formId, submitBtn, 'Submit Registration');
                }
            });
        }
    }
 
    async submitForm(endpoint, data) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
 
        try {
            const response = await fetch(`${API_CONFIG.API_BASE}/${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
                signal: controller.signal
            });
 
            clearTimeout(timeoutId);
            return response;
        } catch (error) {
            clearTimeout(timeoutId);
            throw error;
        }
    }
 
    getFormData(form) {
        const formData = new FormData(form);
        const data = {};
       
        for (let [key, value] of formData.entries()) {
            data[key] = typeof value === 'string' ? value.trim() : value;
        }
       
        return data;
    }
 
    validateContactForm(data) {
        const { name, email, phone, subject, message } = data;
 
        if (!name || !email || !phone || !subject || !message) {
            this.showError('Please fill all required fields');
            return false;
        }
 
        if (!this.isValidEmail(email)) {
            this.showError('Please enter a valid email address');
            return false;
        }
 
        if (!this.isValidPhone(phone)) {
            this.showError('Please enter a valid 10-digit phone number');
            return false;
        }
 
        return true;
    }
 
    validateCareerForm(data) {
        const { honorific, fullName, email, mobile, qualification, specialization, position, experience, postalAddress } = data;
 
        if (!honorific || !fullName || !email || !mobile || !qualification || !specialization || !position || !experience || !postalAddress) {
            this.showError('Please fill all required fields');
            return false;
        }
 
        if (!this.isValidEmail(email)) {
            this.showError('Please enter a valid email address');
            return false;
        }
 
        if (!this.isValidPhone(mobile)) {
            this.showError('Please enter a valid 10-digit mobile number');
            return false;
        }
 
        return true;
    }
 
    validateTrainingForm(data) {
        const { userName, userPhone, userEmail, userAddress } = data;
 
        if (!userName || !userPhone || !userEmail || !userAddress) {
            this.showError('Please fill all required fields');
            return false;
        }
 
        if (!this.isValidEmail(userEmail)) {
            this.showError('Please enter a valid email address');
            return false;
        }
 
        if (!this.isValidPhone(userPhone)) {
            this.showError('Please enter a valid phone number');
            return false;
        }
 
        return true;
    }
 
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
 
    isValidPhone(phone) {
        const phoneRegex = /^[0-9]{10}$/;
        return phoneRegex.test(phone.replace(/\D/g, ''));
    }
 
    isSubmitting(formId) {
        return this.submissionStates.get(formId) === true;
    }
 
    setSubmitting(formId, state) {
        this.submissionStates.set(formId, state);
    }
 
    updateButtonState(button, disabled, text) {
        if (button) {
            button.disabled = disabled;
            button.textContent = text;
            button.classList.toggle('btn-loading', disabled);
        }
    }
 
    resetSubmission(formId, button, originalText) {
        this.setSubmitting(formId, false);
        this.updateButtonState(button, false, originalText);
    }
 
    closeModal(modalId) {
        const modal = bootstrap.Modal.getInstance(document.getElementById(modalId));
        if (modal) {
            modal.hide();
        }
    }
 
    showSuccess(message) {
        this.showNotification(message, 'success');
    }
 
    showError(message) {
        this.showNotification(message, 'error');
    }
 
    showNotification(message, type = 'info') {
        // Remove existing notifications
        document.querySelectorAll('.form-notification').forEach(n => n.remove());
 
        const notification = document.createElement('div');
        notification.className = `alert alert-${type === 'error' ? 'danger' : type === 'success' ? 'success' : 'info'} alert-dismissible fade show form-notification`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            min-width: 300px;
            max-width: 500px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
 
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
    new FormHandler();
});