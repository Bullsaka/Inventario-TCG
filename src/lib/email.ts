import { Resend } from "resend";

type SendPasswordResetEmailParams = {
  to: string;
  resetUrl: string;
};

let resendClient: Resend | null = null;

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return null;
  }

  if (!resendClient) {
    resendClient = new Resend(apiKey);
  }

  return resendClient;
}

export async function sendPasswordResetEmail({
  to,
  resetUrl,
}: SendPasswordResetEmailParams) {
  const client = getResendClient();
  const from = process.env.RESEND_FROM_EMAIL;

  if (!client || !from) {
    console.log(
      `[password-reset] Email provider no configurado. Link para ${to}: ${resetUrl}`
    );
    return;
  }

  await client.emails.send({
    from,
    to,
    subject: "Restablece tu contraseña",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Restablece tu contraseña</h2>
        <p>Recibimos una solicitud para cambiar la contraseña de tu cuenta.</p>
        <p>
          <a href="${resetUrl}" style="display:inline-block;padding:12px 18px;background:#111;color:#fff;text-decoration:none;border-radius:8px;">
            Restablecer contraseña
          </a>
        </p>
        <p>Si no fuiste tú, puedes ignorar este correo.</p>
        <p>Este enlace expira en 1 hora.</p>
      </div>
    `,
  });
}
