// Training Calendar Handler
class TrainingCalendarHandler {
  constructor() {
    this.apiBase = `${API_CONFIG.API_BASE}/training`;
    this.calendar = null;
    this.selectedEvent = null;
    this.init();
  }

  async init() {
    if (document.getElementById("calendar")) {
      this.initializeCalendar();
      await this.loadEvents();
      this.setupEventHandlers();
    }
  }

  initializeCalendar() {
    const calendarEl = document.getElementById("calendar");

    this.calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: "dayGridMonth",
      fixedWeekCount: true,
      showNonCurrentDates: true,
      headerToolbar: {
        left: "prev,next today",
        center: "title",
        right: "",
      },
      events: [],
      eventClick: (info) => this.handleEventClick(info),
      eventDidMount: (info) => {
        // Add hover effect and cursor pointer
        info.el.style.cursor = "pointer";
        info.el.title = `Click to register for: ${info.event.title}`;
        // Remove the time display that shows "5:30a"
        const timeEl = info.el.querySelector(".fc-event-time");
        if (timeEl) {
          timeEl.style.display = "none";
        }
      },
    });

    this.calendar.render();
  }

  async loadEvents() {
    try {
      const response = await fetch(`${this.apiBase}/events`);
      if (!response.ok) {
        throw new Error("Failed to load events");
      }

      const events = await response.json();

      this.calendar.removeAllEvents();
      events.forEach((event) => {
        this.calendar.addEvent({
          id: event._id,
          title: event.title,
          start: event.date,
          allDay: true, // This prevents time display
          description: event.description || "",
          extendedProps: {
            time: event.time || "",
            formType: event.formType || "existing",
            customFormLink: event.customFormLink || "",
          },
        });
      });

      // Also load events list
      this.loadEventsList(events);
    } catch (error) {
      console.error("Error loading events:", error);
      this.showNotification("Failed to load training events", "error");
    }
  }

  loadEventsList(events) {
    const eventsContainer = document.getElementById("events-container");
    if (!eventsContainer) return;

    if (events.length === 0) {
      eventsContainer.innerHTML =
        '<p class="text-muted">No upcoming training events scheduled.</p>';
      return;
    }

    const eventsHTML = events
      .map((event) => {
        const eventDate = new Date(event.date);
        const formattedDate = eventDate.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });

        return `
        <div class="container calender-box p-4 border-0 space mb-4" style="border: 1px solid #ddd; border-radius: 8px;">
          <div class="row g-4">
            <div class="col-12 col-md-2 date-box text-center text-md-end pe-5">
              <div class="fw-bold small">${eventDate
                .toLocaleDateString("en-US", { month: "short" })
                .toUpperCase()}</div>
              <div class="fs-3 fw-bold">${eventDate.getDate()}</div>
              <div class="fw-bold small">${eventDate.getFullYear()}</div>
            </div>
            <div class="col-12 col-md-6 border-left-blue event-description">
              <div class="mb-1 text-primary fw-bold">
                <i class="bi bi-bookmark-fill"></i> Training Event
                ${
                  event.time
                    ? `<span class="text-dark fw-normal"> at ${event.time}</span>`
                    : ""
                }
              </div>
              <h4 class="fw-bold link-click">
                <a href="#" onclick="window.trainingCalendarHandler.handleEventClickFromList('${
                  event._id
                }'); return false;">${event.title}</a>
              </h4>
              <div class="fw-bold">Glyptic Training Center</div>
              <p class="fw-normal mt-2 mb-0">
                ${
                  event.description ||
                  "Professional training program designed to enhance your skills and knowledge."
                }
              </p>
              <div class="mt-3">
                <button class="btn btn-primary btn-sm" onclick="window.trainingCalendarHandler.handleEventClickFromList('${
                  event._id
                }'); return false;">
                  Register Now
                </button>
              </div>
            </div>
            <div class="col-12 col-md-4">
              <img src="assets/img/training/training2.png" alt="Training Image" class="img-fluid rounded">
            </div>
          </div>
        </div>
      `;
      })
      .join("");

    eventsContainer.innerHTML = eventsHTML;
  }

  handleEventClickFromList(eventId) {
    // Find the event in calendar
    const calendarEvent = this.calendar.getEventById(eventId);
    if (calendarEvent) {
      this.selectedEvent = {
        id: calendarEvent.id,
        title: calendarEvent.title,
        date: calendarEvent.start,
        time: calendarEvent.extendedProps.time || "",
        formType: calendarEvent.extendedProps.formType || "existing",
        customFormLink: calendarEvent.extendedProps.customFormLink || "",
      };
      this.showEventDetailsPopup();
    }
  }

  handleEventClick(info) {
    this.selectedEvent = {
      id: info.event.id,
      title: info.event.title,
      date: info.event.start,
      time: info.event.extendedProps.time || "",
      formType: info.event.extendedProps.formType || "existing",
      customFormLink: info.event.extendedProps.customFormLink || "",
    };

    // Show event details popup first
    this.showEventDetailsPopup();
  }

  showEventDetailsPopup() {
    const popup = document.createElement("div");
    popup.className = "event-details-popup";
    popup.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      padding: 25px;
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
      z-index: 10000;
      max-width: 400px;
      width: 90%;
      text-align: center;
      border: 2px solid #007bff;
    `;

    const overlay = document.createElement("div");
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.5);
      z-index: 9999;
    `;

    const timeDisplay = this.selectedEvent.time
      ? `<p style="color: #666; margin: 10px 0; font-size: 16px;"><i class="far fa-clock"></i> ${this.formatTime12Hour(
          this.selectedEvent.time
        )}</p>`
      : "";

    const linkDisplay = this.selectedEvent.customFormLink
      ? `<p style="color: #007bff; margin: 10px 0; font-size: 14px; word-break: break-all;"><i class="far fa-link"></i> ${this.selectedEvent.customFormLink}</p>`
      : "";

    popup.innerHTML = `
      <h4 style="color: #007bff; margin-bottom: 15px; font-size: 20px;">${
        this.selectedEvent.title
      }</h4>
      ${timeDisplay}
      ${linkDisplay}
      <div style="margin-top: 20px; display: flex; gap: 10px; justify-content: center;">
        <button id="cancelBtn" style="
          padding: 10px 20px;
          background: #6c757d;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
        ">Cancel</button>
        <button id="proceedBtn" style="
          padding: 10px 20px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
        ">${
          this.selectedEvent.customFormLink ? "Go to Link" : "Register"
        }</button>
      </div>
    `;

    document.body.appendChild(overlay);
    document.body.appendChild(popup);

    // Handle button clicks
    popup.querySelector("#cancelBtn").onclick = () => {
      document.body.removeChild(overlay);
      document.body.removeChild(popup);
    };

    popup.querySelector("#proceedBtn").onclick = () => {
      document.body.removeChild(overlay);
      document.body.removeChild(popup);

      if (
        this.selectedEvent.formType === "custom" &&
        this.selectedEvent.customFormLink
      ) {
        window.open(this.selectedEvent.customFormLink, "_blank");
      } else {
        this.showRegistrationModal();
      }
    };

    // Close on overlay click
    overlay.onclick = () => {
      document.body.removeChild(overlay);
      document.body.removeChild(popup);
    };
  }

  showRegistrationModal() {
    // Update modal content
    document.getElementById("eventTitle").textContent =
      this.selectedEvent.title;

    // Show time if available
    const timeElement = document.getElementById("eventTime");
    if (timeElement) {
      if (this.selectedEvent.time) {
        timeElement.textContent = `Time: ${this.selectedEvent.time}`;
        timeElement.style.display = "block";
      } else {
        timeElement.style.display = "none";
      }
    }

    // Show the registration modal
    const modal = new bootstrap.Modal(
      document.getElementById("registrationModal")
    );
    modal.show();
  }

  setupEventHandlers() {
    // Form validation is handled by FormHandler
    const form = document.getElementById("registrationForm");
    if (form) {
      form.addEventListener("input", () => {
        if (window.formHandler) {
          window.formHandler.validateForm();
        }
      });
    }
  }

  formatTime12Hour(time24) {
    if (!time24) return "";
    const [hours, minutes] = time24.split(":");
    const hour12 = hours % 12 || 12;
    const ampm = hours >= 12 ? "PM" : "AM";
    return `${hour12}:${minutes} ${ampm}`;
  }

  showNotification(message, type = "info") {
    // Create notification element
    const notification = document.createElement("div");
    notification.className = `alert alert-${
      type === "error" ? "danger" : type === "success" ? "success" : "info"
    } alert-dismissible fade show`;
    notification.style.position = "fixed";
    notification.style.top = "20px";
    notification.style.right = "20px";
    notification.style.zIndex = "9999";
    notification.style.minWidth = "300px";

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
document.addEventListener("DOMContentLoaded", () => {
  window.trainingCalendarHandler = new TrainingCalendarHandler();
});
