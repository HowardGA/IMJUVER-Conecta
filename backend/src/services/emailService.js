import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'Gmail', 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendVerificationEmail = async (email, token) => {
  const verificationUrl = `${process.env.BASE_URL}/emailConfirmation/${token}`;

  await transporter.sendMail({
    from: `"IMJUVER Conecta" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Verificación de su correo electrónico',
    html: `
     <img src="https://i.imgur.com/tu5DWD3.png" alt="Logo IMJUVER" style="width: 300px; height: auto;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td align="center" style="padding: 20px 0;">
          <table width="600" cellpadding="0" cellspacing="0" style="border: 1px solid #fafafa;">
            <!-- Header -->
            <tr>
              <td bgcolor="#961D48" style="padding: 30px; text-align: center;">
                <h1 style="color: #fafafa; margin: 0; font-family: Arial, sans-serif;">
                  ¡Bienvenido a IMJUVER Conecta!
                </h1>
              </td>
            </tr>
            
            <!-- Body -->
            <tr>
              <td style="padding: 30px; font-family: Arial, sans-serif; font-size: 16px; line-height: 1.6;">
                <p>Gracias por registrarte. Por favor verifica tu correo electrónico:</p>
                
                <table cellpadding="0" cellspacing="0" border="0" style="margin: 25px 0;">
                  <tr>
                    <td align="center" bgcolor="#961D48" style="border-radius: 4px;">
                      <a href="${verificationUrl}" 
                         style="display: inline-block; 
                                padding: 12px 24px; 
                                color: #fafafa; 
                                text-decoration: none; 
                                font-weight: bold;">
                        Verificar Email
                      </a>
                    </td>
                  </tr>
                </table>
                
                <p style="font-size: 14px; color: #666666;">
                  Si tienes problemas, copia esta URL en tu navegador:<br>
                  <span style="word-break: break-all; color: #961D48;">${verificationUrl}</span>
                </p>
              </td>
            </tr>
            
            <!-- Footer -->
            <tr>
              <td style="padding: 20px; text-align: center; font-size: 12px; color: #999999;">
                © ${new Date().getFullYear()} IMJUVER Conecta
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
    `,
  });
};