import { PrismaClient, Role, Confidentiality } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Démarrage du seed...');

  // ─── Admin par défaut ──────────────────────────────────────────────────────
  const adminEmail = 'admin@espoiretvie.td';
  const existing = await prisma.user.findUnique({ where: { email: adminEmail } });

  if (!existing) {
    const passwordHash = await bcrypt.hash('Admin@AEV2024!', 12);
    await prisma.user.create({
      data: {
        email: adminEmail,
        fullName: 'Administrateur AEV',
        passwordHash,
        role: Role.ADMINISTRATEUR,
        isActive: true,
      },
    });
    console.log(`✅ Admin créé : ${adminEmail} / Admin@AEV2024!`);
  } else {
    console.log(`⚠️  Admin déjà existant : ${adminEmail}`);
  }

  // ─── Catégories ───────────────────────────────────────────────────────────
  const categories = [
    { name: 'Contrats', slug: 'contrats', icon: 'ti-writing', defaultConfidentiality: Confidentiality.INTERNE, order: 1 },
    { name: 'Rapports', slug: 'rapports', icon: 'ti-chart-line', defaultConfidentiality: Confidentiality.PUBLIC, order: 2 },
    { name: 'Factures', slug: 'factures', icon: 'ti-receipt', defaultConfidentiality: Confidentiality.INTERNE, order: 3 },
    { name: 'Ressources humaines', slug: 'rh', icon: 'ti-users', defaultConfidentiality: Confidentiality.CONFIDENTIEL, order: 4 },
    { name: 'Projets', slug: 'projets', icon: 'ti-briefcase', defaultConfidentiality: Confidentiality.INTERNE, order: 5 },
  ];

  for (const cat of categories) {
    await prisma.documentCategory.upsert({
      where: { slug: cat.slug },
      create: { ...cat, description: '' },
      update: {},
    });
  }
  console.log(`✅ ${categories.length} catégories créées.`);

  console.log('🎉 Seed terminé !');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
