import { useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from '../config/api';

const TrainingCalendar = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventDescription, setNewEventDescription] = useState("");
  const [newEventTime, setNewEventTime] = useState("");
  const [newEventFormType, setNewEventFormType] = useState("existing");
  const [newEventCustomLink, setNewEventCustomLink] = useState("");
  const [editingEvent, setEditingEvent] = useState(null);
  const [calendar, setCalendar] = useState(null);

  useEffect(() => {
    fetchEvents();
    initializeCalendar();
  }, []);

  useEffect(() => {
    if (calendar && events.length > 0) {
      updateCalendarEvents(events);
    }
  }, [calendar, events]);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/training/events`
      );
      console.log("Fetched events:", response.data);
      setEvents(response.data);
      if (calendar) {
        updateCalendarEvents(response.data);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const initializeCalendar = () => {
    setTimeout(() => {
      if (typeof FullCalendar !== "undefined") {
        const calendarEl = document.getElementById("adminCalendar");
        if (calendarEl) {
          const cal = new FullCalendar.Calendar(calendarEl, {
            initialView: "dayGridMonth",
            fixedWeekCount: false,
            showNonCurrentDates: true,
            dayMaxEvents: true,
            headerToolbar: {
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth",
            },
            height: "auto",
            dateClick: handleDateClick,
            eventClick: handleEventClick,
            events: [],
          });
          cal.render();
          setCalendar(cal);

          // Load events after calendar is initialized
          if (events.length > 0) {
            updateCalendarEvents(events);
          }
        }
      }
    }, 100);
  };

  const updateCalendarEvents = (eventList) => {
    if (calendar) {
      calendar.removeAllEvents();
      eventList.forEach((event) => {
        calendar.addEvent({
          id: event._id,
          title: event.title,
          start: event.date,
          allDay: true,
          extendedProps: {
            description: event.description,
          },
        });
      });
    }
  };

  const handleDateClick = (info) => {
    setSelectedDate(info.dateStr);
    setShowModal(true);
  };

  const handleEventClick = (info) => {
    const event = events.find((e) => e._id === info.event.id);
    if (event) {
      setEditingEvent(event);
      setNewEventTitle(event.title);
      setNewEventDescription(event.description || "");
      setNewEventTime(event.time || "");
      setNewEventFormType(event.formType || "existing");
      setNewEventCustomLink(event.customFormLink || "");
      setShowEditModal(true);
    }
  };

  const createEvent = async () => {
    if (!newEventTitle.trim() || !selectedDate) return;

    try {
      const eventData = {
        title: newEventTitle,
        description: newEventDescription,
        date: selectedDate,
        time: newEventTime,
        formType: newEventFormType,
        customFormLink: newEventFormType === "custom" ? newEventCustomLink : "",
      };

      const response = await axios.post(
        `${API_BASE_URL}/training/events`,
        eventData
      );

      fetchEvents();
      setShowModal(false);
      setNewEventTitle("");
      setNewEventDescription("");
      setNewEventTime("");
      setNewEventFormType("existing");
      setNewEventCustomLink("");
      setSelectedDate(null);
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  const updateEvent = async () => {
    if (!newEventTitle.trim() || !editingEvent) return;

    try {
      const eventData = {
        title: newEventTitle,
        description: newEventDescription,
        date: editingEvent.date,
        time: newEventTime,
        formType: newEventFormType,
        customFormLink: newEventFormType === "custom" ? newEventCustomLink : "",
      };

      await axios.put(
        `${API_BASE_URL}/training/events/${editingEvent._id}`,
        eventData
      );

      fetchEvents();
      setShowEditModal(false);
      setNewEventTitle("");
      setNewEventDescription("");
      setNewEventTime("");
      setNewEventFormType("existing");
      setNewEventCustomLink("");
      setEditingEvent(null);
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  const deleteEvent = async (eventToDelete = null) => {
    const eventId = eventToDelete ? eventToDelete._id : editingEvent?._id;
    if (!eventId) return;

    try {
      await axios.delete(
        `${API_BASE_URL}/training/events/${eventId}`
      );

      fetchEvents();
      if (showEditModal) {
        setShowEditModal(false);
      }
      setNewEventTitle("");
      setNewEventDescription("");
      setNewEventTime("");
      setNewEventFormType("existing");
      setNewEventCustomLink("");
      setEditingEvent(null);
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  if (loading)
    return <div className="loading-spinner">Loading Training Calendar...</div>;

  return (
    <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "20px" }}>
      <div className="page-header">
        <h1 className="page-title">Training Calendar</h1>
      </div>

      <div className="card">
        <div className="card-body" style={{ padding: "20px" }}>
          <div
            id="adminCalendar"
            style={{ minHeight: "500px", width: "100%", color: "#000" }}
          ></div>
        </div>
      </div>

      {/* Debug: Show events list */}
      <div className="card" style={{ marginTop: "20px" }}>
        <div className="card-header">
          <h5 style={{ margin: 0, color: "#000" }}>
            All Events ({events.length} events)
          </h5>
        </div>
        <div className="card-body">
          {events.length === 0 ? (
            <p style={{ color: "#666" }}>No events found</p>
          ) : (
            events.map((event) => (
              <div
                key={event._id}
                style={{
                  padding: "10px",
                  border: "1px solid #ddd",
                  margin: "5px 0",
                  borderRadius: "4px",
                  color: "#000",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <div style={{ flex: 1 }}>
                  <strong>{event.title}</strong> -{" "}
                  {new Date(event.date).toLocaleDateString()}
                  {event.time && (
                    <span style={{ color: "#666", marginLeft: "10px" }}>
                      at {event.time}
                    </span>
                  )}
                  {event.description && (
                    <p style={{ margin: "5px 0", color: "#666" }}>
                      {event.description}
                    </p>
                  )}
                  <p
                    style={{
                      margin: "5px 0",
                      fontSize: "0.9em",
                      color: "#888",
                    }}
                  >
                    Form Type: {event.formType || "existing"}
                    {event.formType === "custom" && event.customFormLink && (
                      <span>
                        {" "}
                        | Link:{" "}
                        <a
                          href={event.customFormLink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {event.customFormLink}
                        </a>
                      </span>
                    )}
                  </p>
                </div>
                <div
                  style={{ display: "flex", gap: "10px", marginLeft: "20px" }}
                >
                  <button
                    onClick={() => {
                      setEditingEvent(event);
                      setNewEventTitle(event.title);
                      setNewEventDescription(event.description || "");
                      setNewEventTime(event.time || "");
                      setNewEventFormType(event.formType || "existing");
                      setNewEventCustomLink(event.customFormLink || "");
                      setShowEditModal(true);
                    }}
                    style={{
                      padding: "5px 10px",
                      backgroundColor: "#007bff",
                      color: "white",
                      border: "none",
                      borderRadius: "3px",
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm("Delete this event?")) {
                        deleteEvent(event);
                      }
                    }}
                    style={{
                      padding: "5px 10px",
                      backgroundColor: "#dc3545",
                      color: "white",
                      border: "none",
                      borderRadius: "3px",
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Event Modal */}
      {showModal && (
        <div
          className="modal fade show"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 1050,
          }}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            style={{ margin: 0, maxWidth: "600px", width: "90%" }}
          >
            <div
              className="modal-content"
              style={{
                backgroundColor: "white",
                borderRadius: "8px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                color: "#000",
              }}
            >
              <div
                className="modal-header"
                style={{
                  borderBottom: "1px solid #dee2e6",
                  padding: "1rem 1.5rem",
                }}
              >
                <h4
                  className="modal-title"
                  style={{ color: "#000", fontWeight: "600" }}
                >
                  Add Event on {selectedDate}
                </h4>
              </div>
              <div className="modal-body" style={{ padding: "1.5rem" }}>
                <div className="mb-3">
                  <label
                    className="form-label"
                    style={{ color: "#000", fontWeight: "500" }}
                  >
                    Event Title
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter event title"
                    value={newEventTitle}
                    onChange={(e) => setNewEventTitle(e.target.value)}
                    style={{
                      border: "1px solid #ced4da",
                      borderRadius: "4px",
                      padding: "0.5rem 0.75rem",
                      color: "#000",
                    }}
                  />
                </div>
                <div className="mb-3">
                  <label
                    className="form-label"
                    style={{ color: "#000", fontWeight: "500" }}
                  >
                    Description
                  </label>
                  <textarea
                    className="form-control"
                    placeholder="Enter event description"
                    value={newEventDescription}
                    onChange={(e) => setNewEventDescription(e.target.value)}
                    rows={3}
                    style={{
                      border: "1px solid #ced4da",
                      borderRadius: "4px",
                      padding: "0.5rem 0.75rem",
                      color: "#000",
                      resize: "vertical",
                    }}
                  />
                </div>
                <div className="mb-3">
                  <label
                    className="form-label"
                    style={{ color: "#000", fontWeight: "500" }}
                  >
                    Time (Ex: 10:00 AM)
                  </label>
                  <input
                    type="time"
                    className="form-control"
                    value={newEventTime}
                    onChange={(e) => setNewEventTime(e.target.value)}
                    style={{
                      border: "1px solid #ced4da",
                      borderRadius: "4px",
                      padding: "0.5rem 0.75rem",
                      color: "#000",
                    }}
                  />
                </div>
                <div className="mb-3">
                  <label
                    className="form-label"
                    style={{ color: "#000", fontWeight: "500" }}
                  >
                    Form Type
                  </label>
                  <select
                    className="form-control"
                    value={newEventFormType}
                    onChange={(e) => setNewEventFormType(e.target.value)}
                    style={{
                      border: "1px solid #ced4da",
                      borderRadius: "4px",
                      padding: "0.5rem 0.75rem",
                      color: "#000",
                    }}
                  >
                    <option value="existing">Existing Form</option>
                    <option value="custom">Custom Form</option>
                  </select>
                </div>
                {newEventFormType === "custom" && (
                  <div className="mb-3">
                    <label
                      className="form-label"
                      style={{ color: "#000", fontWeight: "500" }}
                    >
                      Custom Form Link
                    </label>
                    <input
                      type="url"
                      className="form-control"
                      placeholder="Enter custom form URL"
                      value={newEventCustomLink}
                      onChange={(e) => setNewEventCustomLink(e.target.value)}
                      style={{
                        border: "1px solid #ced4da",
                        borderRadius: "4px",
                        padding: "0.5rem 0.75rem",
                        color: "#000",
                      }}
                    />
                  </div>
                )}
              </div>
              <div
                className="modal-footer"
                style={{
                  borderTop: "1px solid #dee2e6",
                  padding: "1rem 1.5rem",
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "0.5rem",
                }}
              >
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                  style={{
                    backgroundColor: "#6c757d",
                    borderColor: "#6c757d",
                    color: "white",
                    padding: "0.5rem 1rem",
                    borderRadius: "4px",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={createEvent}
                  style={{
                    backgroundColor: "#0d6efd",
                    borderColor: "#0d6efd",
                    color: "white",
                    padding: "0.5rem 1rem",
                    borderRadius: "4px",
                  }}
                >
                  Add Event
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Event Modal */}
      {showEditModal && (
        <div
          className="modal fade show"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 1050,
          }}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            style={{ margin: 0, maxWidth: "700px", width: "95%" }}
          >
            <div
              className="modal-content"
              style={{
                backgroundColor: "white",
                borderRadius: "8px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                color: "#000",
              }}
            >
              <div
                className="modal-header"
                style={{
                  borderBottom: "1px solid #dee2e6",
                  padding: "1rem 1.5rem",
                }}
              >
                <h5
                  className="modal-title"
                  style={{ color: "#000", fontWeight: "600" }}
                >
                  Edit Event
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowEditModal(false)}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: "1.5rem",
                  }}
                >
                  ×
                </button>
              </div>
              <div className="modal-body" style={{ padding: "1.5rem" }}>
                <div className="mb-3">
                  <label
                    className="form-label"
                    style={{ color: "#000", fontWeight: "500" }}
                  >
                    Event Title
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter event title"
                    value={newEventTitle}
                    onChange={(e) => setNewEventTitle(e.target.value)}
                    style={{
                      border: "1px solid #ced4da",
                      borderRadius: "4px",
                      padding: "0.5rem 0.75rem",
                      color: "#000",
                    }}
                  />
                </div>
                <div className="mb-3">
                  <label
                    className="form-label"
                    style={{ color: "#000", fontWeight: "500" }}
                  >
                    Description
                  </label>
                  <textarea
                    className="form-control"
                    placeholder="Enter event description"
                    value={newEventDescription}
                    onChange={(e) => setNewEventDescription(e.target.value)}
                    rows={3}
                    style={{
                      border: "1px solid #ced4da",
                      borderRadius: "4px",
                      padding: "0.5rem 0.75rem",
                      color: "#000",
                      resize: "vertical",
                    }}
                  />
                </div>
                <div className="mb-3">
                  <label
                    className="form-label"
                    style={{ color: "#000", fontWeight: "500" }}
                  >
                    Time
                  </label>
                  <input
                    type="time"
                    className="form-control"
                    value={newEventTime}
                    onChange={(e) => setNewEventTime(e.target.value)}
                    style={{
                      border: "1px solid #ced4da",
                      borderRadius: "4px",
                      padding: "0.5rem 0.75rem",
                      color: "#000",
                    }}
                  />
                </div>
                <div className="mb-3">
                  <label
                    className="form-label"
                    style={{ color: "#000", fontWeight: "500" }}
                  >
                    Form Type
                  </label>
                  <select
                    className="form-control"
                    value={newEventFormType}
                    onChange={(e) => setNewEventFormType(e.target.value)}
                    style={{
                      border: "1px solid #ced4da",
                      borderRadius: "4px",
                      padding: "0.5rem 0.75rem",
                      color: "#000",
                    }}
                  >
                    <option value="existing">Existing Form</option>
                    <option value="custom">Custom Form</option>
                  </select>
                </div>
                {newEventFormType === "custom" && (
                  <div className="mb-3">
                    <label
                      className="form-label"
                      style={{ color: "#000", fontWeight: "500" }}
                    >
                      Custom Form Link
                    </label>
                    <input
                      type="url"
                      className="form-control"
                      placeholder="Enter custom form URL"
                      value={newEventCustomLink}
                      onChange={(e) => setNewEventCustomLink(e.target.value)}
                      style={{
                        border: "1px solid #ced4da",
                        borderRadius: "4px",
                        padding: "0.5rem 0.75rem",
                        color: "#000",
                      }}
                    />
                  </div>
                )}
              </div>
              <div
                className="modal-footer"
                style={{
                  borderTop: "1px solid #dee2e6",
                  padding: "1rem 1.5rem",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => {
                    if (
                      window.confirm(
                        "Are you sure you want to delete this event?"
                      )
                    ) {
                      deleteEvent();
                    }
                  }}
                  style={{
                    backgroundColor: "#dc3545",
                    borderColor: "#dc3545",
                    color: "white",
                    padding: "0.5rem 1rem",
                    borderRadius: "4px",
                  }}
                >
                  Delete Event
                </button>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowEditModal(false)}
                    style={{
                      backgroundColor: "#6c757d",
                      borderColor: "#6c757d",
                      color: "white",
                      padding: "0.5rem 1rem",
                      borderRadius: "4px",
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={updateEvent}
                    style={{
                      backgroundColor: "#0d6efd",
                      borderColor: "#0d6efd",
                      color: "white",
                      padding: "0.5rem 1rem",
                      borderRadius: "4px",
                    }}
                  >
                    Update Event
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainingCalendar;
