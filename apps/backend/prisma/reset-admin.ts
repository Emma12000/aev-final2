/**
 * Script de réinitialisation du compte administrateur.
 * Usage sur Railway : railway run npx ts-node prisma/reset-admin.ts
 * Usage local      : cd apps/backend && npx ts-node prisma/reset-admin.ts
 */
import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const ADMIN_EMAIL    = 'admin@espoiretvie.td';
const ADMIN_PASSWORD = 'Admin@AEV2024!';
const ADMIN_NAME     = 'Administrateur AEV';

async function main() {
  console.log('🔐 Réinitialisation du compte administrateur...');

  const hash = await bcrypt.hash(ADMIN_PASSWORD, 12);

  const admin = await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: {
      passwordHash:    hash,
      isActive:        true,
      emailVerified:   true,
      role:            Role.ADMINISTRATEUR,
      fullName:        ADMIN_NAME,
      // Révoquer tous les tokens actifs pour forcer une reconnexion propre
    },
    create: {
      email:         ADMIN_EMAIL,
      fullName:      ADMIN_NAME,
      passwordHash:  hash,
      role:          Role.ADMINISTRATEUR,
      isActive:      true,
      emailVerified: true,
    },
  });

  // Révoquer tous les refresh tokens existants de l'admin
  await prisma.refreshToken.updateMany({
    where: { userId: admin.id, revokedAt: null },
    data:  { revokedAt: new Date() },
  });

  console.log('✅ Compte admin réinitialisé avec succès !');
  console.log(`   Email    : ${ADMIN_EMAIL}`);
  console.log(`   Mot de passe : ${ADMIN_PASSWORD}`);
  console.log(`   Rôle     : ADMINISTRATEUR`);
  console.log(`   Actif    : oui`);
}

main()
  .catch((e) => { console.error('❌ Erreur :', e.message); process.exit(1); })
  .finally(() => prisma.$disconnect());
