import nodemailer from 'nodemailer';
import config from '../config';

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Initialize the transporter if email configuration is available
    if (config.email?.user && config.email?.password && config.email?.service) {
      this.transporter = nodemailer.createTransport({
        service: config.email.service,
        auth: {
          user: config.email.user,
          pass: config.email.password,
        },
      });
    }
  }

  /**
   * Check if email service is configured
   */
  public isConfigured(): boolean {
    return !!this.transporter;
  }

  /**
   * Send an email
   */
  public async sendEmail(
    to: string,
    subject: string,
    text: string,
    from: string = config.email?.user
  ): Promise<boolean> {
    if (!this.isConfigured()) {
      console.warn('Email configuration not found. Skipping email sending.');
      return false;
    }

    try {
      const mailOptions = {
        to,
        from,
        subject,
        text,
      };

      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Failed to send email:', error);
      return false;
    }
  }

  /**
   * Send a password reset email
   */
  public async sendPasswordResetEmail(email: string, token: string): Promise<boolean> {
    const resetUrl = `http://${config.frontendHost}/reset/${token}`;
    const text = `You are receiving this because you (or someone else) have requested the reset of the password for your account.

Please click on the following link, or paste this into your browser to complete the process:

${resetUrl}

If you did not request this, please ignore this email and your password will remain unchanged.`;

    return this.sendEmail(email, 'Password Reset', text);
  }

  /**
   * Send an email verification email
   */
  public async sendVerificationEmail(email: string, token: string): Promise<boolean> {
    const verificationUrl = `http://${config.frontendHost}/confirm-email/${token}`;
    const text = `You are receiving this because you (or someone else) have created an account.

Please click on the following link, or paste this into your browser to complete the process:

${verificationUrl}

If you did not request this, please ignore this email.`;

    return this.sendEmail(email, 'Email Confirmation', text);
  }
}

export default EmailService;