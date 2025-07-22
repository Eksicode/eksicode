import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import config from '../config';

class EmailService {
  private transporter: nodemailer.Transporter;
  private isConfigured: boolean;

  constructor() {
    this.isConfigured = !!(config.email?.user && config.email?.password && config.email?.service);
    if (this.isConfigured) {
      this.transporter = nodemailer.createTransport({
        service: config.email.service,
        auth: {
          user: config.email.user,
          pass: config.email.password,
        },
      });
    }
  }

  private async getTemplate(templateName: string, data: Record<string, string>): Promise<string> {
    const templatePath = path.join(__dirname, '..', 'templates', `${templateName}.html`);
    let template = fs.readFileSync(templatePath, 'utf-8');
    for (const key in data) {
      template = template.replace(new RegExp(`{{${key}}}`, 'g'), data[key]);
    }
    return template;
  }
  
  public async sendEmail(
    to: string,
    subject: string,
    template: string,
    data: Record<string, string>,
    from: string = config.email?.user
  ): Promise<boolean> {
    if (!this.isConfigured) {
      console.warn('Email configuration not found. Skipping email sending.');
      return false;
    }

    try {
      const html = await this.getTemplate(template, data);
      const mailOptions = {
        to,
        from,
        subject,
        html,
      };

      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Failed to send email:', error);
      return false;
    }
  }

  public async sendPasswordResetEmail(email: string, token: string): Promise<boolean> {
    const resetUrl = `http://${config.frontendHost}/reset/${token}`;
    return this.sendEmail(email, 'Password Reset', 'passwordReset', { resetUrl });
  }

  public async sendVerificationEmail(email: string, token:string): Promise<boolean> {
    const verificationUrl = `http://${config.frontendHost}/confirm-email/${token}`;
    return this.sendEmail(email, 'Email Confirmation', 'emailVerification', { verificationUrl });
  }
}

export default EmailService;