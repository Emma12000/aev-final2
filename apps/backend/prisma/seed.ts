import { PrismaClient, Role, Confidentiality } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Démarrage du seed...');

  // ─── Utilisateurs ─────────────────────────────────────────────────────────
  const users = [
    {
      email: 'admin@espoiretvie.td',
      fullName: 'Administrateur AEV',
      password: 'Admin@AEV2024!',
      role: Role.ADMINISTRATEUR,
    },
    {
      email: 'a.ngaradoum@espoiretvie.td',
      fullName: 'Aïcha Ngaradoum',
      password: 'Agent@AEV2024!',
      role: Role.AGENT,
    },
  ];

  for (const u of users) {
    const exists = await prisma.user.findUnique({ where: { email: u.email } });
    if (!exists) {
      const passwordHash = await bcrypt.hash(u.password, 12);
      await prisma.user.create({
        data: {
          email: u.email,
          fullName: u.fullName,
          passwordHash,
          role: u.role,
          isActive: true,
        },
      });
      console.log(`✅ Utilisateur créé : ${u.email}`);
    } else {
      console.log(`⚠️  Déjà existant : ${u.email}`);
    }
  }

  // ─── 10 familles documentaires (CDC §6.2) ────────────────────────────────
  const categories = [
    { name: 'Administration',             slug: 'admin',         icon: 'ti-building-community', defaultConfidentiality: Confidentiality.INTERNE,      description: 'Statuts, règlements, PV, actes légaux',                    order: 1  },
    { name: 'Finance et comptabilité',    slug: 'finance',       icon: 'ti-cash',               defaultConfidentiality: Confidentiality.CONFIDENTIEL, description: 'Budgets, bilans, factures, états financiers',              order: 2  },
    { name: 'Contrats et conventions',    slug: 'contrat',       icon: 'ti-writing',            defaultConfidentiality: Confidentiality.CONFIDENTIEL, description: 'Contrats de prestation, partenariat, subvention, don',    order: 3  },
    { name: 'Courriers',                  slug: 'courrier',      icon: 'ti-mail',               defaultConfidentiality: Confidentiality.INTERNE,      description: 'Correspondances officielles entrantes et sortantes',       order: 4  },
    { name: 'Rapports et comptes rendus', slug: 'rapport',       icon: 'ti-chart-line',         defaultConfidentiality: Confidentiality.INTERNE,      description: "Rapports annuels, d'activité, financiers, de mission",    order: 5  },
    { name: 'Projets et programmes',      slug: 'projet',        icon: 'ti-briefcase',          defaultConfidentiality: Confidentiality.INTERNE,      description: 'Plans de travail, programmes, fiches projets',             order: 6  },
    { name: 'Partenariats',               slug: 'partenariat',   icon: 'ti-affiliate',          defaultConfidentiality: Confidentiality.INTERNE,      description: "Accords, profils partenaires, mémorandums d'entente",     order: 7  },
    { name: 'Communication',              slug: 'communication', icon: 'ti-speakerphone',       defaultConfidentiality: Confidentiality.PUBLIC,        description: 'Plaquettes, communiqués, visuels institutionnels',         order: 8  },
    { name: 'Ressources humaines',        slug: 'rh',            icon: 'ti-users',              defaultConfidentiality: Confidentiality.CONFIDENTIEL, description: 'Contrats de travail, évaluations, registre du personnel',  order: 9  },
    { name: 'Pièces diverses',            slug: 'divers',        icon: 'ti-folder',             defaultConfidentiality: Confidentiality.INTERNE,      description: 'Documents temporaires ou non classés',                    order: 10 },
  ];

  for (const cat of categories) {
    await prisma.documentCategory.upsert({
      where:  { slug: cat.slug },
      create: cat,
      update: { name: cat.name, icon: cat.icon, description: cat.description, order: cat.order },
    });
  }
  console.log(`✅ ${categories.length} catégories documentaires créées (CDC §6.2).`);

  console.log('🎉 Seed terminé !');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
