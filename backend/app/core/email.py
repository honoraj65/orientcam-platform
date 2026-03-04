"""
Service d'envoi d'emails (SMTP)
"""
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.core.config import settings


def send_email(to_email: str, subject: str, html_body: str) -> bool:
    """Envoie un email via SMTP. Retourne True si succès."""
    if not settings.SMTP_HOST or not settings.SMTP_USER:
        print(f"[EMAIL] SMTP non configuré - email non envoyé à {to_email}", flush=True)
        return False

    try:
        msg = MIMEMultipart("alternative")
        msg["From"] = f"{settings.SMTP_FROM_NAME} <{settings.SMTP_FROM_EMAIL}>"
        msg["To"] = to_email
        msg["Subject"] = subject
        msg.attach(MIMEText(html_body, "html", "utf-8"))

        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=10) as server:
            server.starttls()
            server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.send_message(msg)

        print(f"[EMAIL] Envoyé à {to_email}: {subject}", flush=True)
        return True
    except Exception as e:
        print(f"[EMAIL] Erreur envoi à {to_email}: {e}", flush=True)
        return False


def send_password_reset_email(to_email: str, reset_token: str) -> bool:
    """Envoie l'email de réinitialisation de mot de passe."""
    reset_url = f"{settings.FRONTEND_URL}/reset-password?token={reset_token}&email={to_email}"

    html = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #059669; margin: 0;">OrientUniv</h1>
            <p style="color: #6b7280; font-size: 14px;">Université de Bertoua</p>
        </div>

        <div style="background: #f0f4ff; border-radius: 12px; padding: 30px; margin-bottom: 20px;">
            <h2 style="color: #1e40af; margin-top: 0;">Réinitialisation de votre mot de passe</h2>
            <p style="color: #374151; line-height: 1.6;">
                Vous avez demandé la réinitialisation de votre mot de passe sur OrientUniv.
                Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :
            </p>
            <div style="text-align: center; margin: 25px 0;">
                <a href="{reset_url}"
                   style="background: linear-gradient(to right, #2563eb, #1d4ed8); color: white;
                          padding: 14px 32px; border-radius: 10px; text-decoration: none;
                          font-weight: bold; font-size: 16px; display: inline-block;">
                    Réinitialiser mon mot de passe
                </a>
            </div>
            <p style="color: #6b7280; font-size: 13px;">
                Ce lien expire dans <strong>15 minutes</strong>.
            </p>
        </div>

        <div style="background: #fef3c7; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
            <p style="color: #92400e; font-size: 13px; margin: 0;">
                Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.
                Votre mot de passe restera inchangé.
            </p>
        </div>

        <div style="text-align: center; color: #9ca3af; font-size: 12px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p>OrientUniv - Plateforme d'Orientation Académique</p>
            <p>Université de Bertoua, Cameroun</p>
        </div>
    </div>
    """

    return send_email(to_email, "Réinitialisation de votre mot de passe - OrientUniv", html)
