import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// Create transporter with placeholders for USER to fill in .env
const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export const sendResetPasswordEmail = async (email, resetLink) => {
    const mailOptions = {
        from: `"GoodHabit" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Recuperar Contraseña - GoodHabit',
        html: `
        <div style="background-color: #0f172a; color: white; padding: 40px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; border-radius: 20px; max-width: 600px; margin: auto; border: 1px solid #1e293b;">
            <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #2dd4bf; margin: 0; font-size: 32px; letter-spacing: -1px;">GH.</h1>
                <p style="color: #64748b; margin-top: 5px; font-size: 14px;">Crecimiento personal hecho simple.</p>
            </div>
            <h2 style="font-size: 24px; margin-bottom: 20px; color: #ffffff; text-align: center;">Recuperar tu contraseña</h2>
            <p style="color: #94a3b8; line-height: 1.6; font-size: 16px;">
                Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en <strong>GoodHabit</strong>.
            </p>
            <p style="color: #94a3b8; line-height: 1.6; font-size: 16px; margin-bottom: 40px;">
                Si tú no realizaste esta solicitud, puedes ignorar este mensaje de forma segura. Si quieres continuar, pulsa el botón de abajo:
            </p>
            <div style="text-align: center; margin-bottom: 40px;">
                <a href="${resetLink}" style="background-color: #2dd4bf; color: #000; padding: 15px 30px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 16px; display: inline-block;">Restablecer Contraseña</a>
            </div>
            <p style="color: #64748b; font-size: 12px; text-align: center; border-top: 1px solid #1e293b; padding-top: 20px;">
                Este enlace expirará en 15 minutos.<br>
                &copy; 2026 GoodHabit. Todos los derechos reservados.
            </p>
        </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error("Email send error:", error);
        return false;
    }
};
