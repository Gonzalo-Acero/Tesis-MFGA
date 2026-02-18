import nodemailer from "nodemailer";

const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  SMTP_FROM,
  APP_BASE_URL,
  FRONTEND_LOGIN_URL,
} = process.env;

const parsedPort = Number(SMTP_PORT ?? 587);

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: parsedPort,
  secure: parsedPort === 465,
  auth: SMTP_USER && SMTP_PASS ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
});

const buildVerifyUrl = (token) => {
  const base = APP_BASE_URL?.replace(/\/+$/, "") || "http://localhost:4000/api";
  return `${base}/auth/verify-email?token=${encodeURIComponent(token)}`;
};

const defaultLoginUrl =
  FRONTEND_LOGIN_URL ||
  "http://localhost:4000/frontend/webV2/Login_Register/Login.html";

const sendVerificationEmail = async (to, token) => {
  const verifyUrl = buildVerifyUrl(token);
  const from = SMTP_FROM || SMTP_USER || "no-reply@mfga.com";

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2>Verifica tu cuenta en MFGA</h2>
      <p>Gracias por registrarte. Haz clic en el botón para confirmar tu correo.</p>
      <p style="text-align: center;">
        <a href="${verifyUrl}" style="background: #75AADB; color: #fff; padding: 12px 20px; text-decoration: none; border-radius: 6px; display: inline-block;">
          Verificar correo
        </a>
      </p>
      <p>Si el botón no funciona, copia y pega este enlace en tu navegador:</p>
      <p><a href="${verifyUrl}">${verifyUrl}</a></p>
      <p style="font-size: 12px; color: #666;">Si no creaste esta cuenta, puedes ignorar este mensaje.</p>
    </div>
  `;

  await transporter.sendMail({
    from,
    to,
    subject: "Confirma tu correo en MFGA",
    html,
  });
};

export { sendVerificationEmail, defaultLoginUrl };
