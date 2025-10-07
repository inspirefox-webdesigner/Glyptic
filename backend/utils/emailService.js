const nodemailer = require('nodemailer');
const AdminSettings = require('../models/AdminSettings');
 
class EmailService {
  constructor() {
    this.transporter = null;
    this.initTransporter();
  }
 
  async initTransporter() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "mail.glyptic.in", // cPanel mail host
      port: process.env.SMTP_PORT || 465, // SSL=465, TLS=587
      secure: true, // 465 mate true, 587 mate false
      auth: {
        user: process.env.SMTP_USER || "emailer@glyptic.in", // cPanel email
        pass: process.env.SMTP_PASS || "VWn}_c+4RFr*" // ema nu password
      },
      tls: {
        rejectUnauthorized: false
      }
    });
 
    // Verify connection configuration
    try {
      await this.transporter.verify();
      console.log('Email server connection established successfully');
    } catch (error) {
      console.error('Email server connection error:', error);
    }
  }
 
  async getAdminEmail() {
    try {
      const settings = await AdminSettings.findOne();
      return settings?.emailSettings?.adminEmail || 'emailer@glyptic.in';
    } catch (error) {
      return 'emailer@glyptic.in';
    }
  }
 
  async isEmailEnabled() {
    try {
      const settings = await AdminSettings.findOne();
      return settings?.emailSettings?.emailEnabled !== false;
    } catch (error) {
      return true;
    }
  }
 
  async sendCareerNotification(careerData) {
    try {
      const emailEnabled = await this.isEmailEnabled();
      if (!emailEnabled) return;
 
      const adminEmail = await this.getAdminEmail();
 
      // Send confirmation email to user
      // const userMailOptions = {
      //   from: 'sd.220841102001@gmail.com',
      //   to: careerData.email,
      //   subject: 'Career Application Confirmation - Glyptic',
      //   html: `
      //     <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
      //       <h2 style="color: #333; text-align: center;">🎯 Career Application Confirmation</h2>
      //       <p>Dear ${careerData.honorific} ${careerData.fullName},</p>
      //       <p>Thank you for applying for a position at Glyptic. We have received your application and will review it carefully.</p>
           
      //       <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
      //         <h3 style="color: #333; margin-top: 0;">Your Application Details:</h3>
      //         <p><strong>Name:</strong> ${careerData.honorific} ${careerData.fullName}</p>
      //         <p><strong>Email:</strong> ${careerData.email}</p>
      //         <p><strong>Mobile:</strong> ${careerData.mobile}</p>
      //         <p><strong>Position Applied:</strong> ${careerData.position}</p>
      //         <p><strong>Qualification:</strong> ${careerData.qualification}</p>
      //         <p><strong>Specialization:</strong> ${careerData.specialization}</p>
      //         <p><strong>Experience:</strong> ${careerData.experience}</p>
      //         <p><strong>Application Date:</strong> ${new Date().toLocaleDateString()}</p>
      //       </div>
           
      //       <p>Our HR team will review your application and contact you if your profile matches our requirements.</p>
      //       <p>We appreciate your interest in joining our team.</p>
           
      //       <p>Best regards,<br>Glyptic HR Team</p>
      //     </div>
      //   `
      // };
      // await this.transporter.sendMail(userMailOptions);
 
      // Send notification to admin
      const adminMailOptions = {
        from: 'emailer@glyptic.in',
        to: adminEmail,
        subject: 'New Career Application - Glyptic',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
            <h2 style="color: #333; text-align: center;">🎯 New Career Application</h2>
           
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">Application Details:</h3>
              <p><strong>Name:</strong> ${careerData.honorific} ${careerData.fullName}</p>
              <p><strong>Email:</strong> ${careerData.email}</p>
              <p><strong>Mobile:</strong> ${careerData.mobile}</p>
              <p><strong>Position Applied:</strong> ${careerData.position}</p>
              <p><strong>Qualification:</strong> ${careerData.qualification}</p>
              <p><strong>Specialization:</strong> ${careerData.specialization}</p>
              <p><strong>Experience:</strong> ${careerData.experience}</p>
              <p><strong>Address:</strong> ${careerData.postalAddress}</p>
              <p><strong>Application Date:</strong> ${new Date().toLocaleDateString()}</p>
            </div>
          </div>
        `
      };
      await this.transporter.sendMail(adminMailOptions);
    } catch (error) {
      console.error('Email error:', error);
    }
  }
 
  async sendContactNotification(contactData) {
    try {
      const emailEnabled = await this.isEmailEnabled();
      if (!emailEnabled) return;
 
      const adminEmail = await this.getAdminEmail();
 
      // Send confirmation email to user
      // const userMailOptions = {
      //   from: 'sd.220841102001@gmail.com',
      //   to: contactData.email,
      //   subject: 'Contact Form Submission Confirmation - Glyptic',
      //   html: `
      //     <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
      //       <h2 style="color: #333; text-align: center;">📧 Contact Form Submission Confirmation</h2>
      //       <p>Dear ${contactData.name},</p>
      //       <p>Thank you for contacting us. We have received your message and will get back to you soon.</p>
           
      //       <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
      //         <h3 style="color: #333; margin-top: 0;">Your Message Details:</h3>
      //         <p><strong>Name:</strong> ${contactData.name}</p>
      //         <p><strong>Email:</strong> ${contactData.email}</p>
      //         <p><strong>Phone:</strong> ${contactData.phone}</p>
      //         <p><strong>Subject:</strong> ${contactData.subject}</p>
      //         <p><strong>Message:</strong> ${contactData.message}</p>
      //         <p><strong>Submitted Date:</strong> ${new Date().toLocaleDateString()}</p>
      //       </div>
           
      //       <p>We will contact you within 24-48 hours.</p>
      //       <p>If you have any urgent queries, please feel free to call us directly.</p>
           
      //       <p>Best regards,<br>Glyptic Team</p>
      //     </div>
      //   `
      // };
      // await this.transporter.sendMail(userMailOptions);
 
      // Send notification to admin
      const adminMailOptions = {
        from: 'emailer@glyptic.in',
        to: adminEmail,
        subject: 'New Contact Form Submission - Glyptic',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
            <h2 style="color: #333; text-align: center;">📧 New Contact Form Submission</h2>
           
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">Contact Details:</h3>
              <p><strong>Name:</strong> ${contactData.name}</p>
              <p><strong>Email:</strong> ${contactData.email}</p>
              <p><strong>Phone:</strong> ${contactData.phone}</p>
              <p><strong>Subject:</strong> ${contactData.subject}</p>
              <p><strong>Message:</strong> ${contactData.message}</p>
              <p><strong>Submitted Date:</strong> ${new Date().toLocaleDateString()}</p>
            </div>
          </div>
        `
      };
      await this.transporter.sendMail(adminMailOptions);
    } catch (error) {
      console.error('Email error:', error);
    }
  }
 
  async sendTrainingNotification(trainingData, recipientEmail = null) {
    try {
      const emailEnabled = await this.isEmailEnabled();
      if (!emailEnabled) return;
 
      const adminEmail = await this.getAdminEmail();
     
      // Send only one email to admin with all registration details
      const adminMailOptions = {
        from: 'emailer@glyptic.in',
        to: adminEmail,
        subject: 'New Training Registration - Glyptic',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
            <h2 style="color: #333; text-align: center;">🎓 New Training Registration</h2>
           
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">Registration Details:</h3>
              <p><strong>Event:</strong> ${trainingData.eventTitle}</p>
              <p><strong>Event Date:</strong> ${trainingData.eventDate}</p>
              <p><strong>Name:</strong> ${trainingData.name}</p>
              <p><strong>Email:</strong> ${trainingData.email}</p>
              <p><strong>Phone:</strong> ${trainingData.phone}</p>
              <p><strong>Address:</strong> ${trainingData.address}</p>
              <p><strong>Registration Date:</strong> ${new Date().toLocaleDateString()}</p>
            </div>
          </div>
        `
      };
      await this.transporter.sendMail(adminMailOptions);
    } catch (error) {
      console.error('Email error:', error);
    }
  }
}
 
module.exports = new EmailService();