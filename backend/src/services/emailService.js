import nodemailer from 'nodemailer';
import prisma from '../prismaClient.js';

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
     <img src="https://i.ibb.co/DgWz1VSd/logo.png" alt="Logo IMJUVER" style="width: 300px; height: auto;">
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

export const sendNewContentNotificationEmail = async (
  email,
  subject,
  mainMessage,
  buttonText,
  buttonUrl 
) => {
  const fullButtonUrl = buttonUrl.startsWith('http') ? buttonUrl : `${process.env.BASE_URL}${buttonUrl}`;

  await transporter.sendMail({
    from: `"IMJUVER Conecta" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: subject,
    html: `
    <img src="https://i.ibb.co/DgWz1VSd/logo.png" alt="Logo IMJUVER" style="width: 300px; height: auto;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td align="center" style="padding: 20px 0;">
          <table width="600" cellpadding="0" cellspacing="0" style="border: 1px solid #fafafa;">
            <tr>
              <td bgcolor="#961D48" style="padding: 30px; text-align: center;">
                <h1 style="color: #fafafa; margin: 0; font-family: Arial, sans-serif;">
                  ¡Nueva Actualización de IMJUVER!
                </h1>
              </td>
            </tr>

            <tr>
              <td style="padding: 30px; font-family: Arial, sans-serif; font-size: 16px; line-height: 1.6;">
                <p>${mainMessage}</p>

                <table cellpadding="0" cellspacing="0" border="0" style="margin: 25px 0;">
                  <tr>
                    <td align="center" bgcolor="#961D48" style="border-radius: 4px;">
                      <a href="${fullButtonUrl}"
                         style="display: inline-block;
                                padding: 12px 24px;
                                color: #fafafa;
                                text-decoration: none;
                                font-weight: bold;">
                        ${buttonText}
                      </a>
                    </td>
                  </tr>
                </table>

                <p style="font-size: 14px; color: #666666;">
                  Si tienes problemas para hacer clic en el botón, copia esta URL en tu navegador:<br>
                  <span style="word-break: break-all; color: #961D48;">${fullButtonUrl}</span>
                </p>
              </td>
            </tr>

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

export const sendNotificationToRole = async (
  roleId,
  subject,
  mainMessage,
  buttonText,
  buttonUrl
) => {
  try {
    const users = await prisma.usuarios.findMany({
      where: {
        rol_id: roleId,
        isVerified: true,
      },
      select: {
        email: true,
      },
    });

    if (users.length === 0) {
      console.log(`No users found for role ID ${roleId} to send notifications.`);
      return { success: true, message: `No se encontraron usuarios con ese rol ID: ${roleId}.` };
    }

    const emailPromises = users.map(user => {
      if (user.email) {
        return sendNewContentNotificationEmail(
          user.email,
          subject,
          mainMessage,
          buttonText,
          buttonUrl
        ).catch(error => console.error(`Error al mandar notificación al correo: ${user.email}:`, error));
      }
      return Promise.resolve(); 
    });

    const results = await Promise.allSettled(emailPromises);
    const sentCount = results.filter(result => result.status === 'fulfilled').length;
    const failedCount = results.length - sentCount;

    console.log(`Notification emails sent to ${sentCount} users of role ${roleId}. ${failedCount} failed.`);
    return { success: true, sentCount, failedCount };

  } catch (error) {
    console.error(`Error sending notifications to role ${roleId}:`, error);
    return { success: false, error: error.message };
  }
};
