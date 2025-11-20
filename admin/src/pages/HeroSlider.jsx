import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const HeroSlider = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/hero-slider");
      const data = await response.json();
      setSlides(data);
    } catch (error) {
      console.error("Error fetching slides:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteSlide = async (id) => {
    if (window.confirm("Are you sure you want to delete this slide?")) {
      try {
        await fetch(`http://localhost:5000/api/hero-slider/${id}`, {
          method: "DELETE",
        });
        fetchSlides();
      } catch (error) {
        console.error("Error deleting slide:", error);
      }
    }
  };

  const toggleActive = async (id, isActive) => {
    try {
      await fetch(`http://localhost:5000/api/hero-slider/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive: !isActive }),
      });
      fetchSlides();
    } catch (error) {
      console.error("Error updating slide:", error);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading slides...</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">Hero Slider Management</h1>
          <p className="page-subtitle">
            Manage homepage hero slider images and content
          </p>
        </div>
        <Link to="/hero-slider/new" className="btn btn-primary">
          <i className="fas fa-plus"></i>
          Add New Slide
        </Link>
      </div>

      <div className="content-card">
        {slides.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <i className="fas fa-images"></i>
            </div>
            <h3>No slides found</h3>
            <p>Create your first hero slider slide to get started.</p>
            <Link to="/hero-slider/new" className="btn btn-primary">
              <i className="fas fa-plus"></i>
              Add First Slide
            </Link>
          </div>
        ) : (
          <div className="slides-grid">
            {slides.map((slide) => (
              <div key={slide._id} className="slide-card">
                <div className="slide-image">
                  <img
                    src={`http://localhost:5000/uploads/${slide.image}`}
                    alt={slide.title}
                  />
                  <div className="slide-overlay">
                    <div className="slide-actions">
                      <Link
                        to={`/hero-slider/edit/${slide._id}`}
                        className="btn btn-sm btn-primary"
                        title="Edit"
                      >
                        <i className="fas fa-edit"></i>
                      </Link>
                      <button
                        onClick={() => toggleActive(slide._id, slide.isActive)}
                        className={`btn btn-sm ${
                          slide.isActive ? "btn-success" : "btn-secondary"
                        }`}
                        title={slide.isActive ? "Deactivate" : "Activate"}
                      >
                        <i
                          className={`fas ${
                            slide.isActive ? "fa-eye" : "fa-eye-slash"
                          }`}
                        ></i>
                      </button>
                      <button
                        onClick={() => deleteSlide(slide._id)}
                        className="btn btn-sm btn-danger"
                        title="Delete"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="slide-info">
                  <h3 className="slide-title">{slide.title}</h3>
                  <div className="slide-meta">
                    <span
                      className={`slide-status ${
                        slide.isActive ? "active" : "inactive"
                      }`}
                    >
                      {slide.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HeroSlider;
