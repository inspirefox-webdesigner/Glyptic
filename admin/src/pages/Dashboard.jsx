import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from '../config/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    services: 0,
    solutions: 0,
    products: 0,
    blogs: 0,
    gallery: 0,
    careers: 0,
    contacts: 0,
    faqs: 0,
    trainingEvents: 0,
    eventRegistrations: 0,
    loading: true,
    error: null,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [
        servicesRes,
        solutionsRes,
        productsRes,
        blogsRes,
        galleryRes,
        careersRes,
        contactsRes,
        faqsRes,
        trainingEventsRes,
        registrationsRes,
      ] = await Promise.all([
        axios.get(`${API_BASE_URL}/services`),
        axios.get(`${API_BASE_URL}/solutions`),
        axios.get(`${API_BASE_URL}/products`),
        axios.get(`${API_BASE_URL}/blogs`),
        axios.get(`${API_BASE_URL}/gallery`),
        axios.get(`${API_BASE_URL}/careers`),
        axios.get(`${API_BASE_URL}/contacts`),
        axios.get(`${API_BASE_URL}/faqs`),
        axios.get(`${API_BASE_URL}/training/events`),
        axios.get(`${API_BASE_URL}/training/registrations`),
      ]);

      setStats({
        services: servicesRes.data.length,
        solutions: solutionsRes.data.length,
        products: productsRes.data.length,
        blogs: blogsRes.data.length,
        gallery: galleryRes.data.length,
        careers: careersRes.data.length,
        contacts: contactsRes.data.length,
        faqs: faqsRes.data.length,
        trainingEvents: trainingEventsRes.data.length,
        eventRegistrations: registrationsRes.data.length,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      setStats({
        services: 0,
        solutions: 0,
        products: 0,
        blogs: 0,
        gallery: 0,
        careers: 0,
        contacts: 0,
        faqs: 0,
        trainingEvents: 0,
        eventRegistrations: 0,
        loading: false,
        error: "Backend server not connected. Please start the backend server.",
      });
    }
  };

  if (stats.loading) {
    return <div className="loading-spinner">Loading Dashboard...</div>;
  }

  if (stats.error) {
    return (
      <div>
        <div className="page-header">
          <h1 className="page-title">Dashboard</h1>
        </div>
        <div
          className="card"
          style={{ border: "2px solid #f56565", backgroundColor: "#fed7d7" }}
        >
          <div className="card-body">
            <h3 style={{ color: "#c53030", marginBottom: "1rem" }}>
              ⚠️ Connection Error
            </h3>
            <p style={{ color: "#742a2a", marginBottom: "1rem" }}>
              {stats.error}
            </p>
            <div style={{ display: "flex", gap: "1rem" }}>
              <button onClick={fetchStats} className="btn btn-primary">
                🔄 Retry Connection
              </button>
              <a
                href="#"
                onClick={() =>
                  window.open(`${API_BASE_URL}/services`, "_blank")
                }
                className="btn btn-secondary"
              >
                🔗 Test Backend
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
      </div>

      <div
        className="dashboard-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "2rem",
          marginBottom: "2rem",
          width: "100%",
          overflowX: "auto",
        }}
      >
        <div className="card">
          <div className="card-header">Getting Started</div>
          <div className="card-body">
            <div
              className="dashboard-services-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "2rem",
                width: "100%",
                overflowX: "auto",
              }}
            >
              <div>
                <div style={{ display: "flex" }}>                  
                  <p
                    style={{
                      color: "#718096",
                      marginBottom: "1rem",
                      fontSize: "1.5rem",
                    }}
                  >
                    Services
                  </p>
                  <h4 style={{ color: "#2d3748", fontSize: "1.5rem" , marginBottom: "1rem", marginLeft:"0.5rem"}}>
                    {" "}
                    ({stats.services})
                  </h4>
                </div>
                <Link to="/services" className="btn btn-secondary">
                  View Services
                </Link>
              </div>


              <div>
                <div style={{ display: "flex" }}>
                    <p
                  style={{
                    color: "#718096",
                    marginBottom: "1rem",
                    fontSize: "1.5rem",
                  }}
                >
                  Solutions
                </p>
                <h4 style={{ color: "#2d3748", fontSize: "1.5rem",marginBottom: "1rem", marginLeft:"0.5rem"}}>
                  {" "}
                  ({stats.solutions})
                </h4>
              
                </div>
                <Link to="/solutions" className="btn btn-secondary">
                  View Solutions
                </Link>
              </div>


              <div>
                <div style={{ display: "flex" }}>
                   <p
                  style={{
                    color: "#718096",
                    marginBottom: "1rem",
                    fontSize: "1.5rem",
                  }}
                >
                  Products
                </p>
                <h4 style={{ color: "#2d3748", fontSize: "1.5rem", marginBottom: "1rem", marginLeft:"0.5rem"}}>
                  {" "}
                  ({stats.products})
                </h4>
                </div>
               
                <Link to="/products" className="btn btn-secondary">
                  View Products
                </Link>
              </div>


              <div>
                <div style={{ display: "flex" }}>
                   <p
                  style={{
                    color: "#718096",
                    marginBottom: "1rem",
                    fontSize: "1.5rem",
                  }}
                >
                  Blogs
                </p>
                <h4 style={{ color: "#2d3748", fontSize: "1.5rem", marginBottom: "1rem", marginLeft:"0.5rem"}}>
                  {" "}
                 ({stats.blogs})
                </h4>
                </div>
               
                <Link to="/blogs" className="btn btn-secondary">
                  View Blogs
                </Link>
              </div>


              <div>
                <div style={{ display: "flex" }}>
                  <p
                  style={{
                    color: "#718096",
                    marginBottom: "1rem",
                    fontSize: "1.5rem",
                  }}
                >
                  Gallery Images
                </p>
                <h4 style={{ color: "#2d3748", fontSize: "1.5rem", marginBottom: "1rem", marginLeft:"0.5rem"}}>
                  {" "}
                  ({stats.gallery})
                </h4>
                </div>
                
                <Link to="/gallery" className="btn btn-secondary">
                  View Gallery
                </Link>
              </div>


              <div>
               <div style={{ display: "flex" }}>
                 <p
                  style={{
                    color: "#718096",
                    marginBottom: "1rem",
                    fontSize: "1.5rem",
                  }}
                >
                  Career Applications
                </p>
                <h4 style={{ color: "#2d3748", fontSize: "1.5rem", marginBottom: "1rem", marginLeft:"0.5rem"}}>
                  {" "}
                  ({stats.careers})
                </h4>
               </div>
                
                <Link to="/careers" className="btn btn-secondary">
                  View Applications
                </Link>
              </div>


              <div>
               <div style={{ display: "flex" }}>
                 <p
                  style={{
                    color: "#718096",
                    marginBottom: "1rem",
                    fontSize: "1.5rem",
                  }}
                >
                  Contact Form Submissions <span style={{color: "#2d3748", fontSize: "1.5rem", marginBottom: "1rem" , fontWeight: "700"}}>({stats.contacts})</span>
                </p>
                {/* <h4 style={{ color: "#2d3748", fontSize: "1.5rem", marginBottom: "1rem"}}>
                  {" "}
                   ({stats.contacts})
                </h4> */}
               </div>
                
                <Link to="/contacts" className="btn btn-secondary">
                  View Contacts
                </Link>
              </div>


              <div>
                <div style={{ display: "flex" }}>
                   <p
                  style={{
                    color: "#718096",
                    marginBottom: "1rem",
                    fontSize: "1.5rem",
                  }}
                >
                  FAQ Categories
                </p>
                <h4 style={{ color: "#2d3748", fontSize: "1.5rem", marginBottom: "1rem", marginLeft:"0.5rem"}}>
                  {" "}
                  ({stats.faqs})
                </h4>
                </div>
               
                <Link to="/faqs" className="btn btn-secondary">
                  View FAQs
                </Link>
              </div>


              <div>
                <div style={{ display: "flex" }}>
                  <p
                  style={{
                    color: "#718096",
                    marginBottom: "1rem",
                    fontSize: "1.5rem",
                  }}
                >
                  Training Events
                </p>
                <h4 style={{ color: "#2d3748", fontSize: "1.5rem", marginBottom: "1rem", marginLeft:"0.5rem"}}>
                  {" "}
                  ({stats.trainingEvents})
                </h4>
                </div>
                
                <Link to="/training-calendar" className="btn btn-secondary">
                  View Calendar
                </Link>
              </div>


              <div>
              <div style={{ display: "flex" }}>
                  <p
                  style={{
                    color: "#718096",
                    marginBottom: "1rem",
                    fontSize: "1.5rem",
                  }}
                >
                  Event Registrations
                </p>
                <h4 style={{ color: "#2d3748", fontSize: "1.5rem", marginBottom: "1rem", marginLeft:"0.5rem"}}>
                  {" "}
                  ({stats.eventRegistrations})
                </h4>
              </div>
                
                <Link to="/events-data" className="btn btn-secondary">
                  View Registrations
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    // <div>
    //   <div className="page-header">
    //     <h1 className="page-title">Dashboard</h1>
    //   </div>

    //   <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
    //   <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
    //     <div className="card">
    //       <div className="card-header">
    //          Content Overview
    //       </div>
    //       <div className="card-body">
    //         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
    //           <div>
    //             <h3 style={{ margin: 0, color: '#667eea' }}>{stats.services}</h3>
    //             <p style={{ margin: 0, color: '#718096' }}>Services</p>
    //           </div>
    //           {/* <div style={{ fontSize: '2rem' }}>📋</div> */}
    //         </div>
    //         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
    //           <div>
    //             <h3 style={{ margin: 0, color: '#764ba2' }}>{stats.solutions}</h3>
    //             <p style={{ margin: 0, color: '#718096' }}>Solutions</p>
    //           </div>
    //           {/* <div style={{ fontSize: '2rem' }}>💡</div> */}
    //         </div>
    //         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
    //           <div>
    //             <h3 style={{ margin: 0, color: '#f093fb' }}>{stats.products}</h3>
    //             <p style={{ margin: 0, color: '#718096' }}>Products</p>
    //           </div>
    //           {/* <div style={{ fontSize: '2rem' }}>📦</div> */}
    //         </div>
    //         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
    //           <div>
    //             <h3 style={{ margin: 0, color: '#38b2ac' }}>{stats.blogs}</h3>
    //             <p style={{ margin: 0, color: '#718096' }}>Blogs</p>
    //           </div>
    //           {/* <div style={{ fontSize: '2rem' }}>📝</div> */}
    //         </div>
    //         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
    //           <div>
    //             <h3 style={{ margin: 0, color: '#ed8936' }}>{stats.gallery}</h3>
    //             <p style={{ margin: 0, color: '#718096' }}>Gallery Images</p>
    //           </div>
    //           {/* <div style={{ fontSize: '2rem' }}>🖼️</div> */}
    //         </div>
    //         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
    //           <div>
    //             <h3 style={{ margin: 0, color: '#9f7aea' }}>{stats.careers}</h3>
    //             <p style={{ margin: 0, color: '#718096' }}>Career Applications</p>
    //           </div>
    //           {/* <div style={{ fontSize: '2rem' }}>💼</div> */}
    //         </div>
    //         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
    //           <div>
    //             <h3 style={{ margin: 0, color: '#48bb78' }}>{stats.contacts}</h3>
    //             <p style={{ margin: 0, color: '#718096' }}>Contact Submissions</p>
    //           </div>
    //           {/* <div style={{ fontSize: '2rem' }}>📞</div> */}
    //         </div>
    //         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
    //           <div>
    //             <h3 style={{ margin: 0, color: '#e53e3e' }}>{stats.faqs}</h3>
    //             <p style={{ margin: 0, color: '#718096' }}>FAQ Categories</p>
    //           </div>
    //           {/* <div style={{ fontSize: '2rem' }}>❓</div> */}
    //         </div>
    //         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
    //           <div>
    //             <h3 style={{ margin: 0, color: '#3182ce' }}>{stats.trainingEvents}</h3>
    //             <p style={{ margin: 0, color: '#718096' }}>Training Events</p>
    //           </div>
    //           {/* <div style={{ fontSize: '2rem' }}>📅</div> */}
    //         </div>
    //         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    //           <div>
    //             <h3 style={{ margin: 0, color: '#38a169' }}>{stats.eventRegistrations}</h3>
    //             <p style={{ margin: 0, color: '#718096' }}>Event Registrations</p>
    //           </div>
    //           {/* <div style={{ fontSize: '2rem' }}>📊</div> */}
    //         </div>
    //       </div>
    //     </div>

    //     <div className="card">
    //       <div className="card-header">
    //          Quick Actions
    //       </div>
    //       <div className="card-body">
    //         <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

    //            <Link to="/services/new" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.3rem 1rem' }}>
    //             <span style={{ fontSize: '2rem', color:'#fff', }}>+</span> Add New Service
    //           </Link>

    //           <Link to="/solutions/new" className="btn btn-success" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.3rem 1rem' }}>
    //             <span style={{ fontSize: '2rem', color:'#fff', }}>+</span> Add New Solution
    //           </Link>

    //           <Link to="/products/new" className="btn btn-info" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.3rem 1rem' }}>
    //             <span style={{ fontSize: '2rem', color:'#fff', }}>+</span> Add New Product
    //           </Link>

    //           <Link to="/blogs/new" className="btn btn-warning" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.3rem 1rem' }}>
    //             <span style={{ fontSize: '2rem', color:'#fff', }}>+</span> Add New Blog
    //           </Link>

    //           <Link to="/gallery/new" className="btn btn-dark" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.3rem 1rem' }}>
    //             <span style={{ fontSize: '2rem', color:'#fff', }}>+</span> Add Gallery Images
    //           </Link>

    //           <Link to="/careers" className="btn btn-purple" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1rem' }}>
    //             <span style={{ fontSize: '1.3rem', color:'#fff', }}>📋</span> View Career Applications
    //           </Link>

    //           <Link to="/contacts" className="btn btn-teal" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 1rem' }}>
    //             <span style={{ fontSize: '1rem', color:'#fff', }}>📞</span> View Contact Submissions
    //           </Link>

    //          <Link to="/faqs/new" className="btn btn-FAQs" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.3rem 1rem' }}>
    //             <span style={{ fontSize: '2rem', color:'#fff', }}>+</span> Add New FAQ
    //           </Link>

    //           <Link to="/training-calendar" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 1rem' }}>
    //             <span style={{ fontSize: '1rem', color:'#fff', }}>📅</span> View Training Calendar
    //           </Link>

    //            <Link to="/events-data" className="btn btn-success" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 1rem' }}>
    //             <span style={{ fontSize: '1rem', color:'#fff', }}>📊</span> Events Data
    //           </Link>

    //         </div>
    //       </div>
    //     </div>
    //   </div>

    //   <div className="card">
    //     <div className="card-header">
    //        Getting Started
    //     </div>
    //     <div className="card-body">
    //       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
    //         <div>
    //           <h4 style={{ color: '#2d3748', marginBottom: '1rem' }}> Services</h4>
    //           <p style={{ color: '#718096', marginBottom: '1rem' }}>
    //             Manage your service offerings with rich content blocks including titles, images, and formatted text.
    //           </p>
    //           <Link to="/services" className="btn btn-secondary">
    //             View Services
    //           </Link>
    //         </div>
    //         <div>
    //           <h4 style={{ color: '#2d3748', marginBottom: '1rem' }}> Solutions</h4>
    //           <p style={{ color: '#718096', marginBottom: '1rem' }}>
    //             Create and manage solution pages with dynamic content that showcases your expertise.
    //           </p>
    //           <Link to="/solutions" className="btn btn-secondary">
    //             View Solutions
    //           </Link>
    //         </div>
    //         <div>
    //           <h4 style={{ color: '#2d3748', marginBottom: '1rem' }}> Products</h4>
    //           <p style={{ color: '#718096', marginBottom: '1rem' }}>
    //             Manage your product catalog with categories and rich content for better organization.
    //           </p>
    //           <Link to="/products" className="btn btn-secondary">
    //             View Products
    //           </Link>
    //         </div>
    //         <div>
    //           <h4 style={{ color: '#2d3748', marginBottom: '1rem' }}> Blogs</h4>
    //           <p style={{ color: '#718096', marginBottom: '1rem' }}>
    //             Create and manage blog posts with rich content that will be displayed on your website.
    //           </p>
    //           <Link to="/blogs" className="btn btn-secondary">
    //             View Blogs
    //           </Link>
    //         </div>
    //         <div>
    //           <h4 style={{ color: '#2d3748', marginBottom: '1rem' }}> Gallery</h4>
    //           <p style={{ color: '#718096', marginBottom: '1rem' }}>
    //             Upload and manage gallery images that will be displayed in your website gallery.
    //           </p>
    //           <Link to="/gallery" className="btn btn-secondary">
    //             View Gallery
    //           </Link>
    //         </div>
    //         <div>
    //           <h4 style={{ color: '#2d3748', marginBottom: '1rem' }}> Careers</h4>
    //           <p style={{ color: '#718096', marginBottom: '1rem' }}>
    //             View and manage job applications submitted through the career form.
    //           </p>
    //           <Link to="/careers" className="btn btn-secondary">
    //             View Applications
    //           </Link>
    //         </div>
    //         <div>
    //           <h4 style={{ color: '#2d3748', marginBottom: '1rem' }}> Contacts</h4>
    //           <p style={{ color: '#718096', marginBottom: '1rem' }}>
    //             View and manage contact form submissions from potential clients.
    //           </p>
    //           <Link to="/contacts" className="btn btn-secondary">
    //             View Contacts
    //           </Link>
    //         </div>
    //         <div>
    //           <h4 style={{ color: '#2d3748', marginBottom: '1rem' }}> FAQs</h4>
    //           <p style={{ color: '#718096', marginBottom: '1rem' }}>
    //             Manage FAQ categories and questions that will be displayed on your FAQ page.
    //           </p>
    //           <Link to="/faqs" className="btn btn-secondary">
    //             View FAQs
    //           </Link>
    //         </div>
    //         <div>
    //           <h4 style={{ color: '#2d3748', marginBottom: '1rem' }}> Training Calendar</h4>
    //           <p style={{ color: '#718096', marginBottom: '1rem' }}>
    //             Manage training events and view user registrations for your training programs.
    //           </p>
    //           <Link to="/training-calendar" className="btn btn-secondary">
    //             View Calendar
    //           </Link>
    //         </div>
    //         <div>
    //           <h4 style={{ color: '#2d3748', marginBottom: '1rem' }}> Events Data</h4>
    //           <p style={{ color: '#718096', marginBottom: '1rem' }}>
    //             View and manage user registrations for training events and programs.
    //           </p>
    //           <Link to="/events-data" className="btn btn-secondary">
    //             View Registrations
    //           </Link>
    //         </div>
    //       </div>
    //     </div>
    //   </div>

    //   </div>

    // </div>
  );
};

export default Dashboard;
