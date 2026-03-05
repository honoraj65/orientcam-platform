"""
Service d'envoi d'emails (SMTP)
"""
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.core.config import settings


def _email_header():
    """En-tête HTML commun pour tous les emails"""
    return """
    <div style="background: linear-gradient(135deg, #059669 0%, #1e40af 100%); padding: 30px 20px; text-align: center; border-radius: 12px 12px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold; letter-spacing: 1px;">OrientUniv</h1>
        <p style="color: rgba(255,255,255,0.85); font-size: 13px; margin: 5px 0 0 0;">Plateforme d'Orientation Académique</p>
        <p style="color: rgba(255,255,255,0.7); font-size: 12px; margin: 3px 0 0 0;">Université de Bertoua</p>
    </div>
    """


def _email_footer():
    """Pied de page HTML commun pour tous les emails"""
    return f"""
    <div style="background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 12px 12px; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 12px; margin: 0 0 8px 0;">
            <a href="{settings.FRONTEND_URL}" style="color: #2563eb; text-decoration: none; font-weight: 600;">www.orientuniv.cm</a>
        </p>
        <p style="color: #9ca3af; font-size: 11px; margin: 0 0 4px 0;">
            OrientUniv - Université de Bertoua, Cameroun
        </p>
        <p style="color: #9ca3af; font-size: 11px; margin: 0;">
            Cet email a été envoyé automatiquement. Merci de ne pas y répondre.
        </p>
        <p style="color: #9ca3af; font-size: 11px; margin: 8px 0 0 0;">
            <a href="{settings.FRONTEND_URL}/contact" style="color: #6b7280; text-decoration: none;">Nous contacter</a>
            &nbsp;&middot;&nbsp;
            <a href="{settings.FRONTEND_URL}/privacy" style="color: #6b7280; text-decoration: none;">Confidentialité</a>
            &nbsp;&middot;&nbsp;
            <a href="{settings.FRONTEND_URL}/conditions" style="color: #6b7280; text-decoration: none;">Conditions</a>
        </p>
    </div>
    """


def _wrap_email(body_content: str) -> str:
    """Enveloppe le contenu dans le template email complet"""
    return f"""
    <!DOCTYPE html>
    <html lang="fr">
    <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
    <body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: 'Segoe UI', Arial, sans-serif;">
        <div style="max-width: 600px; margin: 20px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.07);">
            {_email_header()}
            <div style="padding: 30px 25px;">
                {body_content}
            </div>
            {_email_footer()}
        </div>
    </body>
    </html>
    """


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
        msg["Reply-To"] = f"support@orientuniv.cm"
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

    body = f"""
        <h2 style="color: #1e40af; margin-top: 0; font-size: 20px;">Réinitialisation de votre mot de passe</h2>

        <p style="color: #374151; line-height: 1.7; font-size: 15px;">
            Bonjour,
        </p>
        <p style="color: #374151; line-height: 1.7; font-size: 15px;">
            Nous avons reçu une demande de réinitialisation du mot de passe associé à votre compte
            <strong style="color: #1e40af;">{to_email}</strong> sur la plateforme OrientUniv.
        </p>

        <div style="text-align: center; margin: 30px 0;">
            <a href="{reset_url}"
               style="background: linear-gradient(to right, #2563eb, #1d4ed8); color: white;
                      padding: 16px 40px; border-radius: 10px; text-decoration: none;
                      font-weight: bold; font-size: 16px; display: inline-block;
                      box-shadow: 0 4px 12px rgba(37,99,235,0.3);">
                Récupérer mon compte
            </a>
        </div>

        <div style="background: #eff6ff; border-left: 4px solid #2563eb; padding: 12px 16px; border-radius: 0 8px 8px 0; margin: 20px 0;">
            <p style="color: #1e40af; font-size: 13px; margin: 0;">
                <strong>Ce lien expire dans 15 minutes.</strong> Si vous n'avez pas fait cette demande,
                ignorez simplement cet email.
            </p>
        </div>

        <p style="color: #6b7280; font-size: 13px; line-height: 1.6;">
            Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :
        </p>
        <p style="background: #f9fafb; padding: 10px 14px; border-radius: 6px; word-break: break-all; font-size: 12px; color: #4b5563; border: 1px solid #e5e7eb;">
            {reset_url}
        </p>
    """

    html = _wrap_email(body)
    return send_email(to_email, "Récupération de votre compte OrientUniv", html)
