import nodemailer from "nodemailer";

// Create a transporter using environment variables
// For development, you can use services like:
// - Gmail (with app password)
// - Mailtrap (for testing)
// - SendGrid, Mailgun, etc.
export const createTransporter = () => {
  const emailUser = process.env.EMAIL_USER || "";
  const emailPassword = process.env.EMAIL_PASSWORD || "";
  const emailHost = process.env.EMAIL_HOST || "smtp.gmail.com";
  const emailPort = parseInt(process.env.EMAIL_PORT || "587");

  if (!emailUser || !emailPassword) {
    console.warn("Email credentials not configured. Password reset emails will not be sent.");
    return null;
  }

  return nodemailer.createTransport({
    host: emailHost,
    port: emailPort,
    secure: emailPort === 465, // true for port 465, false for other ports
    auth: {
      user: emailUser,
      pass: emailPassword,
    },
  });
};

export async function sendPasswordResetEmail(
  email: string,
  resetToken: string,
  firstName: string
) {
  const transporter = createTransporter();
  
  if (!transporter) {
    throw new Error("Email service not configured. Please contact support.");
  }

  const resetUrl = `${process.env.BASE_URL || "http://localhost:5000"}/reset-password?token=${resetToken}`;
  
  const mailOptions = {
    from: `"Standfit Wholesale" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Password Reset Request - Standfit Wholesale",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 30px; background: #2563eb; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Password Reset Request</h1>
            </div>
            <div class="content">
              <p>Hello ${firstName},</p>
              <p>We received a request to reset your password for your Standfit Wholesale account.</p>
              <p>Click the button below to reset your password:</p>
              <div style="text-align: center;">
                <a href="${resetUrl}" class="button">Reset Password</a>
              </div>
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #2563eb;">${resetUrl}</p>
              <p><strong>This link will expire in 1 hour.</strong></p>
              <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
              <div class="footer">
                <p>© ${new Date().getFullYear()} Standfit Wholesale. All rights reserved.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
Hello ${firstName},

We received a request to reset your password for your Standfit Wholesale account.

Click this link to reset your password:
${resetUrl}

This link will expire in 1 hour.

If you didn't request a password reset, please ignore this email or contact support if you have concerns.

© ${new Date().getFullYear()} Standfit Wholesale. All rights reserved.
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error: any) {
    console.error("Email send error:", error);
    throw new Error("Failed to send password reset email");
  }
}
