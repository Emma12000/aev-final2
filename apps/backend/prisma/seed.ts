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

  // ─── 10 familles documentaires (CDC §6.2) ────────────────────────────────
  const categories = [
    { name: 'Administration',             slug: 'admin',         icon: 'ti-building-community', defaultConfidentiality: Confidentiality.INTERNE,       description: 'Statuts, règlements, PV, actes légaux',                   order: 1 },
    { name: 'Finance et comptabilité',    slug: 'finance',       icon: 'ti-cash',               defaultConfidentiality: Confidentiality.CONFIDENTIEL,   description: 'Budgets, bilans, factures, états financiers',             order: 2 },
    { name: 'Contrats et conventions',    slug: 'contrat',       icon: 'ti-writing',            defaultConfidentiality: Confidentiality.CONFIDENTIEL,   description: 'Contrats de prestation, partenariat, subvention, don',   order: 3 },
    { name: 'Courriers',                  slug: 'courrier',      icon: 'ti-mail',               defaultConfidentiality: Confidentiality.INTERNE,        description: 'Correspondances officielles entrantes et sortantes',      order: 4 },
    { name: 'Rapports et comptes rendus', slug: 'rapport',       icon: 'ti-chart-line',         defaultConfidentiality: Confidentiality.INTERNE,        description: 'Rapports annuels, d\'activité, financiers, de mission',  order: 5 },
    { name: 'Projets et programmes',      slug: 'projet',        icon: 'ti-briefcase',          defaultConfidentiality: Confidentiality.INTERNE,        description: 'Plans de travail, programmes, fiches projets',           order: 6 },
    { name: 'Partenariats',               slug: 'partenariat',   icon: 'ti-handshake',          defaultConfidentiality: Confidentiality.INTERNE,        description: 'Accords, profils partenaires, mémorandums d\'entente',   order: 7 },
    { name: 'Communication',              slug: 'communication', icon: 'ti-megaphone',          defaultConfidentiality: Confidentiality.PUBLIC,         description: 'Plaquettes, communiqués, visuels institutionnels',       order: 8 },
    { name: 'Ressources humaines',        slug: 'rh',            icon: 'ti-users',              defaultConfidentiality: Confidentiality.CONFIDENTIEL,   description: 'Contrats de travail, évaluations, registre du personnel',order: 9 },
    { name: 'Pièces diverses',            slug: 'divers',        icon: 'ti-folder',             defaultConfidentiality: Confidentiality.INTERNE,        description: 'Documents temporaires ou non classés',                  order: 10 },
  ];

  for (const cat of categories) {
    await prisma.documentCategory.upsert({
      where: { slug: cat.slug },
      create: { ...cat, description: '' },
      update: {},
    });
  }
  console.log(`✅ ${categories.length} catégories documentaires créées (CDC §6.2).`);

  console.log('🎉 Seed terminé !');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
