// Tab handler for addressable fire alarm page
document.addEventListener('DOMContentLoaded', function () {
  // Handle tab switching
  const tabButtons = document.querySelectorAll('.nav-link[data-bs-toggle="pill"]');

  tabButtons.forEach(button => {
    button.addEventListener('click', function (e) {
      e.preventDefault();

      // Remove active class from all tabs
      tabButtons.forEach(btn => btn.classList.remove('active'));

      // Add active class to clicked tab
      this.classList.add('active');

      // Hide all tab content
      const tabContents = document.querySelectorAll('.tab-pane');
      tabContents.forEach(content => {
        content.classList.remove('show', 'active');
      });

      // Show target tab content
      const targetId = this.getAttribute('data-bs-target');
      const targetContent = document.querySelector(targetId);
      if (targetContent) {
        targetContent.classList.add('show', 'active');
      }
    });
  });

  // Handle category toggles
  const categoryTitles = document.querySelectorAll('.nav-category-title');

  categoryTitles.forEach(title => {
    title.addEventListener('click', function () {
      const category = this.getAttribute('data-category');
      const content = document.getElementById(category);

      if (content) {
        // Toggle display
        if (content.style.display === 'none') {
          content.style.display = 'block';
          this.classList.add('active');
        } else {
          content.style.display = 'none';
          this.classList.remove('active');
        }
      }
    });
  });
});