async function sendEmailNotification(formData, formType) {
    try {
        const response = await fetch('http://localhost:5000/api/notifications/email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                to: formData.to || 'sd.220841102001@gmail.com', // Default recipient email
                formType: formType,
                formData: formData
            })
        });
        
        return response;
    } catch (error) {
        console.error('Email notification error:', error);
        throw error;
    }
}

/**
 * Show success message in an alert box
 * @param {string} message - Success message to display
 */
function showSuccessMessage(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'alert alert-success alert-dismissible fade show';
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.zIndex = '9999';
    notification.style.minWidth = '300px';
    
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Add event listener to close button
    const closeButton = notification.querySelector('.btn-close');
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            notification.remove();
        });
    }
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}