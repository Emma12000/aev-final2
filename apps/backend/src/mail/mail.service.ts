import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private readonly resend: Resend | null;
  private readonly from: string;
  private readonly adminEmail: string;
  private readonly logger = new Logger(MailService.name);

  constructor(private config: ConfigService) {
    const apiKey = config.get<string>('email.resendApiKey');
    this.from    = config.get<string>('email.from') ?? 'no-reply@espoiretvie.td';
    this.adminEmail = config.get<string>('email.adminEmail') ?? 'admin@espoiretvie.td';
    this.resend  = apiKey ? new Resend(apiKey) : null;
  }

  // ─── Document déposé → admin ──────────────────────────────
  async notifyAdminNewDocument(opts: {
    docTitle: string;
    uploaderName: string;
    uploaderEmail: string;
    category: string;
  }) {
    await this.send({
      to: this.adminEmail,
      subject: `📄 Nouveau document à valider — ${opts.docTitle}`,
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto">
          <div style="background:#1E3A5F;padding:24px 32px;border-radius:8px 8px 0 0">
            <h2 style="color:white;margin:0;font-size:18px">Association Espoir &amp; Vie</h2>
            <p style="color:rgba(255,255,255,.7);margin:4px 0 0;font-size:13px">Plateforme d'archives numériques</p>
          </div>
          <div style="background:#f9fafb;padding:32px;border-radius:0 0 8px 8px;border:1px solid #e5e7eb">
            <h3 style="margin:0 0 16px;color:#111827">Nouveau document en attente de validation</h3>
            <table style="width:100%;border-collapse:collapse;font-size:14px">
              <tr><td style="padding:8px 0;color:#6b7280;width:140px">Document</td><td style="padding:8px 0;font-weight:600;color:#111827">${opts.docTitle}</td></tr>
              <tr><td style="padding:8px 0;color:#6b7280">Catégorie</td><td style="padding:8px 0;color:#374151">${opts.category}</td></tr>
              <tr><td style="padding:8px 0;color:#6b7280">Déposé par</td><td style="padding:8px 0;color:#374151">${opts.uploaderName} (${opts.uploaderEmail})</td></tr>
            </table>
            <a href="https://aev-final2.vercel.app" style="display:inline-block;margin-top:24px;padding:12px 24px;background:#1E3A5F;color:white;text-decoration:none;border-radius:6px;font-size:14px;font-weight:600">
              Valider le document →
            </a>
          </div>
          <p style="text-align:center;font-size:11px;color:#9ca3af;margin-top:16px">Association Espoir &amp; Vie · N'Djaména, Tchad</p>
        </div>`,
    });
  }

  // ─── Nouveau membre inscrit → admin ───────────────────────
  async notifyAdminNewMember(opts: {
    memberName: string;
    memberEmail: string;
    role: string;
  }) {
    await this.send({
      to: this.adminEmail,
      subject: `👤 Nouveau membre inscrit — ${opts.memberName}`,
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto">
          <div style="background:#1E3A5F;padding:24px 32px;border-radius:8px 8px 0 0">
            <h2 style="color:white;margin:0;font-size:18px">Association Espoir &amp; Vie</h2>
            <p style="color:rgba(255,255,255,.7);margin:4px 0 0;font-size:13px">Plateforme d'archives numériques</p>
          </div>
          <div style="background:#f9fafb;padding:32px;border-radius:0 0 8px 8px;border:1px solid #e5e7eb">
            <h3 style="margin:0 0 16px;color:#111827">Nouveau compte créé sur la plateforme</h3>
            <table style="width:100%;border-collapse:collapse;font-size:14px">
              <tr><td style="padding:8px 0;color:#6b7280;width:140px">Nom</td><td style="padding:8px 0;font-weight:600;color:#111827">${opts.memberName}</td></tr>
              <tr><td style="padding:8px 0;color:#6b7280">Email</td><td style="padding:8px 0;color:#374151">${opts.memberEmail}</td></tr>
              <tr><td style="padding:8px 0;color:#6b7280">Rôle</td><td style="padding:8px 0;color:#374151">${opts.role}</td></tr>
            </table>
            <a href="https://aev-final2.vercel.app" style="display:inline-block;margin-top:24px;padding:12px 24px;background:#1E3A5F;color:white;text-decoration:none;border-radius:6px;font-size:14px;font-weight:600">
              Gérer les membres →
            </a>
          </div>
          <p style="text-align:center;font-size:11px;color:#9ca3af;margin-top:16px">Association Espoir &amp; Vie · N'Djaména, Tchad</p>
        </div>`,
    });
  }

  // ─── Document approuvé → membre ───────────────────────────
  async notifyMemberDocApproved(opts: {
    to: string;
    memberName: string;
    docTitle: string;
  }) {
    await this.send({
      to: opts.to,
      subject: `✅ Votre document a été publié — ${opts.docTitle}`,
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto">
          <div style="background:#166534;padding:24px 32px;border-radius:8px 8px 0 0">
            <h2 style="color:white;margin:0;font-size:18px">Association Espoir &amp; Vie</h2>
          </div>
          <div style="background:#f9fafb;padding:32px;border-radius:0 0 8px 8px;border:1px solid #e5e7eb">
            <h3 style="margin:0 0 12px;color:#111827">Bonjour ${opts.memberName},</h3>
            <p style="color:#374151;font-size:14px;line-height:1.6">
              Votre document <strong>${opts.docTitle}</strong> a été <span style="color:#166534;font-weight:700">approuvé et publié</span> sur la plateforme d'archives de l'association.
            </p>
            <a href="https://aev-final2.vercel.app" style="display:inline-block;margin-top:20px;padding:12px 24px;background:#166534;color:white;text-decoration:none;border-radius:6px;font-size:14px;font-weight:600">
              Voir mon document →
            </a>
          </div>
          <p style="text-align:center;font-size:11px;color:#9ca3af;margin-top:16px">Association Espoir &amp; Vie · N'Djaména, Tchad</p>
        </div>`,
    });
  }

  // ─── Document rejeté → membre ─────────────────────────────
  async notifyMemberDocRejected(opts: {
    to: string;
    memberName: string;
    docTitle: string;
  }) {
    await this.send({
      to: opts.to,
      subject: `❌ Votre document n'a pas été retenu — ${opts.docTitle}`,
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto">
          <div style="background:#991B1B;padding:24px 32px;border-radius:8px 8px 0 0">
            <h2 style="color:white;margin:0;font-size:18px">Association Espoir &amp; Vie</h2>
          </div>
          <div style="background:#f9fafb;padding:32px;border-radius:0 0 8px 8px;border:1px solid #e5e7eb">
            <h3 style="margin:0 0 12px;color:#111827">Bonjour ${opts.memberName},</h3>
            <p style="color:#374151;font-size:14px;line-height:1.6">
              Votre document <strong>${opts.docTitle}</strong> n'a pas été retenu pour la publication. Vous pouvez le modifier et le soumettre à nouveau depuis votre espace membre.
            </p>
            <a href="https://aev-final2.vercel.app" style="display:inline-block;margin-top:20px;padding:12px 24px;background:#991B1B;color:white;text-decoration:none;border-radius:6px;font-size:14px;font-weight:600">
              Mon espace membre →
            </a>
          </div>
          <p style="text-align:center;font-size:11px;color:#9ca3af;margin-top:16px">Association Espoir &amp; Vie · N'Djaména, Tchad</p>
        </div>`,
    });
  }

  // ─── Envoi générique (non bloquant) ───────────────────────
  private async send(opts: { to: string; subject: string; html: string }) {
    if (!this.resend) {
      this.logger.warn(`[Mail] RESEND_API_KEY absent — email non envoyé : ${opts.subject}`);
      return;
    }
    try {
      await this.resend.emails.send({ from: this.from, ...opts });
      this.logger.log(`[Mail] Envoyé à ${opts.to} — ${opts.subject}`);
    } catch (err) {
      this.logger.error(`[Mail] Échec envoi à ${opts.to} : ${err.message}`);
    }
  }
}
