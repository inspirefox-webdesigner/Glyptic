// Dynamic Contact Information Loader
class ContactInfoLoader {
  constructor() {
    this.apiBaseUrl = 'http://localhost:5000/api';
    this.init();
  }

  async init() {
    try {
      await this.loadContactInfo();
    } catch (error) {
      console.log('Backend not connected, using static content');
      this.loadStaticContent();
    }
  }

  async loadContactInfo() {
    const response = await fetch(`${this.apiBaseUrl}/contact-info`);
    if (!response.ok) throw new Error('Failed to fetch');
    
    const data = await response.json();
    this.renderContactInfo(data);
  }

  loadStaticContent() {
    // Static fallback content
    const staticData = {
      emailAddress: {
        title: 'Email address',
        emails: ['glyptic.sales@gmail.com', 'service@glyptic.in']
      },
      phoneNumber: {
        title: 'Phone number',
        phones: ['+91 9836838438', '+91 7020035493', '+91 9831688742', '+91 8240185599']
      },
      location: {
        title: 'Our Location',
        address: 'Registered Office: Raipur, Bhita, District -Burdwan – 713102, West Bengal, India Branch Office: 1363 Naskarhat Madhya Para, Kolkata – 700039. West Bengal, India'
      }
    };
    this.renderContactInfo(staticData);
  }

  renderContactInfo(data) {
    // Update email section
    const emailDiv = document.querySelector('.col-xl-3:nth-child(2) .contact-info');
    if (emailDiv) {
      const titleElement = emailDiv.querySelector('.box-title');
      const textElement = emailDiv.querySelector('.box-text');
      
      if (titleElement) titleElement.textContent = data.emailAddress.title;
      if (textElement) {
        textElement.innerHTML = data.emailAddress.emails
          .map(email => `<a href="mailto:${email}">${email}</a>`)
          .join('');
      }
    }

    // Update phone section
    const phoneDiv = document.querySelector('.col-xl-3:nth-child(3) .contact-info');
    if (phoneDiv) {
      const titleElement = phoneDiv.querySelector('.box-title');
      const textElement = phoneDiv.querySelector('.box-text');
      
      if (titleElement) titleElement.textContent = data.phoneNumber.title;
      if (textElement) {
        textElement.innerHTML = data.phoneNumber.phones
          .map(phone => `<a href="tel:${phone.replace(/\s/g, '')}">${phone}</a>`)
          .join('');
      }
    }

    // Update location section
    const locationDiv = document.querySelector('.col-xl-3:nth-child(4) .contact-info');
    if (locationDiv) {
      const titleElement = locationDiv.querySelector('.box-title');
      const textElement = locationDiv.querySelector('.box-text');
      
      if (titleElement) titleElement.textContent = data.location.title;
      if (textElement) textElement.textContent = data.location.address;
    }
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new ContactInfoLoader();
});