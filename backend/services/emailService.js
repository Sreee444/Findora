import nodemailer from 'nodemailer';

// Create transporter using Gmail SMTP
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Use TLS
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS.replace(/\s/g, ''), // Remove any spaces
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

// Send welcome email after successful registration
export const sendWelcomeEmail = async (userEmail, username) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: '🎉 Welcome to Findora - Lost & Found Community!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <!-- Header with Logo -->
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #14b8a6; margin: 0; font-size: 2.5em;">
                🔍 Findora
              </h1>
              <p style="color: #6b7280; margin: 5px 0 0 0; font-size: 1.1em;">Lost & Found Community</p>
            </div>
            
            <!-- Welcome Message -->
            <div style="text-align: center; margin-bottom: 30px;">
              <h2 style="color: #374151; margin-bottom: 15px;">Welcome to Findora, ${username || 'Friend'}! 🎊</h2>
              <p style="color: #6b7280; font-size: 1.1em; line-height: 1.6;">
                Thank you for joining our community! You're now part of a network that helps reunite people with their lost belongings.
              </p>
            </div>
            
            <!-- Feature Highlights -->
            <div style="background-color: #f0fdfa; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
              <h3 style="color: #14b8a6; margin-bottom: 15px; text-align: center;">What you can do with Findora:</h3>
              <ul style="color: #374151; padding-left: 0; list-style: none;">
                <li style="margin-bottom: 10px; padding-left: 25px; position: relative;">
                  <span style="position: absolute; left: 0; color: #14b8a6;">📍</span>
                  <strong>Report Lost Items:</strong> Quickly post details about items you've lost
                </li>
                <li style="margin-bottom: 10px; padding-left: 25px; position: relative;">
                  <span style="position: absolute; left: 0; color: #14b8a6;">🔍</span>
                  <strong>Report Found Items:</strong> Help others by posting items you've found
                </li>
                <li style="margin-bottom: 10px; padding-left: 25px; position: relative;">
                  <span style="position: absolute; left: 0; color: #14b8a6;">🔔</span>
                  <strong>Get Notifications:</strong> Receive alerts when matching items are posted
                </li>
                <li style="margin-bottom: 10px; padding-left: 25px; position: relative;">
                  <span style="position: absolute; left: 0; color: #14b8a6;">📱</span>
                  <strong>Track Your Posts:</strong> Monitor the status of your lost/found reports
                </li>
              </ul>
            </div>
            
            <!-- Getting Started -->
            <div style="text-align: center; margin-bottom: 25px;">
              <p style="color: #6b7280; margin-bottom: 20px;">Ready to get started? Log in to your account and begin helping our community!</p>
              <a href="${process.env.FRONTEND_URL || 'https://findora-rosy.vercel.app'}/login" 
                 style="background-color: #14b8a6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                Go to Findora App
              </a>
            </div>
            
            <!-- Tips -->
            <div style="background-color: #fef3c7; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
              <h4 style="color: #d97706; margin: 0 0 10px 0;">💡 Pro Tips:</h4>
              <ul style="color: #92400e; margin: 0; padding-left: 20px; font-size: 0.9em;">
                <li>Include clear photos when posting items</li>
                <li>Provide detailed descriptions and locations</li>
                <li>Check the app regularly for matches</li>
                <li>Be responsive to potential matches</li>
              </ul>
            </div>
            
            <!-- Footer -->
            <div style="text-align: center; border-top: 1px solid #e5e7eb; padding-top: 20px; color: #6b7280; font-size: 0.9em;">
              <p style="margin: 0 0 10px 0;">Need help? Contact us or check our community guidelines.</p>
              <p style="margin: 0;">
                <strong>Findora Team</strong><br>
                Connecting lost items with their owners, one find at a time. 🤝
              </p>
            </div>
          </div>
        </div>
      `,
      text: `
Welcome to Findora - Lost & Found Community!

Hi ${username || 'Friend'},

Thank you for joining Findora! You're now part of a community that helps reunite people with their lost belongings.

What you can do:
- Report Lost Items: Post details about items you've lost
- Report Found Items: Help others by posting items you've found  
- Get Notifications: Receive alerts when matching items are posted
- Track Your Posts: Monitor the status of your reports

Ready to get started? Log in at: ${process.env.FRONTEND_URL || 'https://findora-rosy.vercel.app'}/login

Pro Tips:
- Include clear photos when posting items
- Provide detailed descriptions and locations
- Check the app regularly for matches
- Be responsive to potential matches

Need help? Contact us or check our community guidelines.

Best regards,
The Findora Team
Connecting lost items with their owners, one find at a time.
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent successfully to ${userEmail}`);
    return { success: true, message: 'Welcome email sent successfully' };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return { success: false, error: error.message };
  }
};

// Send notification email for potential matches
export const sendMatchNotificationEmail = async (userEmail, itemTitle, matchType) => {
  try {
    const transporter = createTransporter();
    
    const subject = matchType === 'found' 
      ? `🎉 Someone may have found your lost item: ${itemTitle}`
      : `🔍 Someone lost an item matching your found item: ${itemTitle}`;
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h1 style="color: #14b8a6; text-align: center;">🔍 Findora Match Alert!</h1>
            <p style="color: #374151; font-size: 1.1em;">
              Great news! There's a potential match for <strong>"${itemTitle}"</strong>.
            </p>
            <p style="color: #6b7280;">
              ${matchType === 'found' 
                ? 'Someone has reported finding an item that matches your lost item description.'
                : 'Someone has reported losing an item that matches your found item.'
              }
            </p>
            <div style="text-align: center; margin: 25px 0;">
              <a href="${process.env.FRONTEND_URL || 'https://findora-rosy.vercel.app'}/user/dashboard" 
                 style="background-color: #14b8a6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                Check Your Dashboard
              </a>
            </div>
            <p style="color: #6b7280; font-size: 0.9em; text-align: center;">
              Log in to view details and contact the other person if it's a match!
            </p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Match notification email sent to ${userEmail}`);
    return { success: true };
  } catch (error) {
    console.error('Error sending match notification email:', error);
    return { success: false, error: error.message };
  }
};

// Send password reset email
export const sendPasswordResetEmail = async (userEmail, username, resetToken) => {
  try {
    const transporter = createTransporter();
    const resetUrl = `${process.env.FRONTEND_URL || 'https://findora-rosy.vercel.app'}/reset-password/${resetToken}`;
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: '🔐 Findora - Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #14b8a6; margin: 0; font-size: 2.5em;">🔍 Findora</h1>
              <p style="color: #6b7280; margin: 5px 0 0 0; font-size: 1.1em;">Lost & Found Community</p>
            </div>
            
            <!-- Reset Message -->
            <div style="text-align: center; margin-bottom: 30px;">
              <h2 style="color: #374151; margin-bottom: 15px;">Password Reset Request 🔐</h2>
              <p style="color: #6b7280; font-size: 1.1em; line-height: 1.6;">
                Hi ${username || 'there'}! We received a request to reset your password for your Findora account.
              </p>
            </div>
            
            <!-- Reset Button -->
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" style="display: inline-block; background-color: #14b8a6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 1.1em;">
                Reset My Password
              </a>
            </div>
            
            <!-- Instructions -->
            <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
              <p style="color: #92400e; margin: 0; font-size: 0.95em; line-height: 1.5;">
                <strong>⚠️ Important:</strong><br>
                • This link will expire in 1 hour<br>
                • If you didn't request this reset, you can safely ignore this email<br>
                • For security, never share this link with anyone
              </p>
            </div>
            
            <!-- Alternative Link -->
            <div style="text-align: center; margin: 20px 0;">
              <p style="color: #6b7280; font-size: 0.9em; margin-bottom: 10px;">
                If the button doesn't work, copy and paste this link:
              </p>
              <p style="color: #14b8a6; font-size: 0.85em; word-break: break-all; background-color: #f3f4f6; padding: 10px; border-radius: 4px;">
                ${resetUrl}
              </p>
            </div>
            
            <!-- Footer -->
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 0.85em; margin: 0;">
                This email was sent to ${userEmail}<br>
                © 2025 Findora - Lost & Found Community
              </p>
            </div>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Password reset email sent to ${userEmail}`);
    return { success: true };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return { success: false, error: error.message };
  }
};

export default { sendWelcomeEmail, sendMatchNotificationEmail, sendPasswordResetEmail };
