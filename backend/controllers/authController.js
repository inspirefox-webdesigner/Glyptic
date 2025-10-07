const Admin = require('../models/Admin');
const AdminSettings = require('../models/AdminSettings');

// Login
exports.login = async (req, res) => {
  try {
    // Add CORS headers
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    
    const { email, password } = req.body;
    
    // Log the received credentials for debugging
    console.log('Login attempt:', { email });
    
    // Get current password from AdminSettings
    let settings = await AdminSettings.findOne();
    if (!settings) {
      settings = new AdminSettings({
        emailSettings: { adminEmail: 'admin@glyptic.com', emailEnabled: true },
        passwordSettings: { currentPassword: 'admin123' }
      });
      await settings.save();
    }

     console.log('Expected password:', settings.passwordSettings.currentPassword);
    
    // Check credentials
    if (email === 'admin@glyptic.com' && password === settings.passwordSettings.currentPassword) {
      console.log('Login successful');
      res.json({ success: true, message: 'Login successful' });
    } else {
      console.log('Login failed: Invalid credentials');
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Change password (deprecated - now handled in AdminSettings)
exports.changePassword = async (req, res) => {
  try {
    res.status(400).json({ success: false, message: 'Please use Settings page to change password' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};