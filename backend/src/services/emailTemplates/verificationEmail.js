
export const verificationEmailTemplate = (verificationUrl) => {
  const { html } = mjml2html(`
    <mjml>
      <mj-head>
        <mj-title>Verificación de Email</mj-title>
        <mj-font name="Roboto" href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" />
        <mj-attributes>
          <mj-all font-family="Roboto, Arial, sans-serif" />
          <mj-text padding="0" line-height="1.5" />
          <mj-button font-weight="700" />
        </mj-attributes>
      </mj-head>

      <mj-body background-color="#fafafa">
        <!-- Header -->
        <mj-section background-color="#961D48" padding="40px 0">
          <mj-column>
            <mj-text align="center" color="#ffffff" font-size="28px" font-weight="700">
              ¡Bienvenido a IMJUVER Conecta!
            </mj-text>
          </mj-column>
        </mj-section>

        <!-- Main Content -->
        <mj-section background-color="#ffffff" padding="40px 20px">
          <mj-column>
            <mj-text color="#333333" font-size="16px">
              Gracias por registrarte. Por favor verifica tu correo electrónico para activar tu cuenta:
            </mj-text>

            <mj-spacer height="30px" />

            <mj-button background-color="#961D48" color="#ffffff" href="${verificationUrl}" 
                      border-radius="8px" padding="15px 30px" font-size="16px">
              Verificar Email
            </mj-button>

            <mj-spacer height="30px" />

            <mj-text color="#666666" font-size="14px">
              Si el botón no funciona, copia y pega este enlace en tu navegador:
            </mj-text>
            <mj-text color="#A07F58" font-size="14px" css-class="url">
              ${verificationUrl}
            </mj-text>
          </mj-column>
        </mj-section>

        <!-- Footer -->
        <mj-section background-color="#f5f5f5" padding="20px">
          <mj-column>
            <mj-text align="center" color="#999999" font-size="12px">
              © ${new Date().getFullYear()} IMJUVER Conecta. Todos los derechos reservados.
            </mj-text>
          </mj-column>
        </mj-section>
      </mj-body>
    </mjml>
  `);

  return html;
};