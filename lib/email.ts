import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  try {
    const result = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to,
      subject,
      html,
    });

    if (result.error) {
      console.error('Email send error:', result.error);
      throw new Error(`Failed to send email: ${result.error.message}`);
    }

    return result;
  } catch (error) {
    console.error('Email service error:', error);
    throw error;
  }
}

export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth/verify-email?token=${token}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; border-radius: 5px; text-decoration: none; margin-top: 10px; }
          .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Verifikasi Email Anda</h1>
          </div>
          <div class="content">
            <p>Halo,</p>
            <p>Terima kasih telah mendaftar di MedPredict JKN. Untuk melengkapi pendaftaran Anda, silakan verifikasi email dengan mengklik tombol di bawah:</p>
            <a href="${verificationUrl}" class="button">Verifikasi Email</a>
            <p>Atau salin link ini: <a href="${verificationUrl}">${verificationUrl}</a></p>
            <p>Link ini berlaku selama 24 jam.</p>
            <div class="footer">
              <p>Jika Anda tidak membuat akun ini, abaikan email ini.</p>
              <p>&copy; 2025 MedPredict JKN. Semua hak dilindungi.</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: 'Verifikasi Email - MedPredict JKN',
    html,
  });
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password?token=${token}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #f5576c; color: white; padding: 12px 24px; border-radius: 5px; text-decoration: none; margin-top: 10px; }
          .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
          .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 10px; margin: 10px 0; border-radius: 3px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Reset Password</h1>
          </div>
          <div class="content">
            <p>Halo,</p>
            <p>Kami menerima permintaan untuk mengatur ulang password akun Anda. Klik tombol di bawah untuk membuat password baru:</p>
            <a href="${resetUrl}" class="button">Reset Password</a>
            <p>Atau salin link ini: <a href="${resetUrl}">${resetUrl}</a></p>
            <div class="warning">
              <strong>⚠️ Keamanan:</strong> Link ini berlaku selama 1 jam. Jangan bagikan link ini kepada siapa pun.
            </div>
            <div class="footer">
              <p>Jika Anda tidak meminta reset password ini, abaikan email ini dan password Anda akan tetap aman.</p>
              <p>&copy; 2025 MedPredict JKN. Semua hak dilindungi.</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: 'Reset Password - MedPredict JKN',
    html,
  });
}

export async function sendPasswordResetCodeEmail(email: string, code: string) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 10px 10px; }
          .code-box { background: white; border: 2px solid #f5576c; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; font-size: 32px; letter-spacing: 8px; font-weight: bold; color: #f5576c; font-family: monospace; }
          .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
          .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 10px; margin: 10px 0; border-radius: 3px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Kode Reset Password</h1>
          </div>
          <div class="content">
            <p>Halo,</p>
            <p>Kami menerima permintaan untuk mengatur ulang password akun Anda. Gunakan kode di bawah untuk melanjutkan:</p>
            <div class="code-box">${code}</div>
            <p>Masukkan kode ini di aplikasi untuk mengatur ulang password Anda.</p>
            <div class="warning">
              <strong>⚠️ Keamanan:</strong> Kode ini berlaku selama 10 menit. Jangan bagikan kode ini kepada siapa pun.
            </div>
            <div class="footer">
              <p>Jika Anda tidak meminta reset password ini, abaikan email ini dan password Anda akan tetap aman.</p>
              <p>&copy; 2025 MedPredict JKN. Semua hak dilindungi.</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: 'Kode Reset Password - MedPredict JKN',
    html,
  });
}
