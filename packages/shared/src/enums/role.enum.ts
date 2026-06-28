export enum Role {
  ADMINISTRATEUR = 'ADMINISTRATEUR',
  AGENT = 'AGENT',
  SUPERVISEUR = 'SUPERVISEUR',
  CONSULTANT = 'CONSULTANT',
  LECTEUR = 'LECTEUR',
}

export const ROLE_LABELS: Record<Role, string> = {
  [Role.ADMINISTRATEUR]: 'Administrateur',
  [Role.AGENT]: 'Agent',
  [Role.SUPERVISEUR]: 'Superviseur',
  [Role.CONSULTANT]: 'Consultant',
  [Role.LECTEUR]: 'Lecteur',
};
