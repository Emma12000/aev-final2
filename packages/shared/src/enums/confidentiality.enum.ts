export enum Confidentiality {
  PUBLIC = 'PUBLIC',
  INTERNE = 'INTERNE',
  CONFIDENTIEL = 'CONFIDENTIEL',
}

export const CONFIDENTIALITY_LABELS: Record<Confidentiality, string> = {
  [Confidentiality.PUBLIC]: 'Public',
  [Confidentiality.INTERNE]: 'Interne',
  [Confidentiality.CONFIDENTIEL]: 'Confidentiel',
};

export const CONFIDENTIALITY_COLORS: Record<
  Confidentiality,
  { bg: string; text: string; border: string }
> = {
  [Confidentiality.PUBLIC]: {
    bg: '#ECFDF5',
    text: '#059669',
    border: '#A7F3D0',
  },
  [Confidentiality.INTERNE]: {
    bg: '#EFF6FF',
    text: '#1B3A8C',
    border: '#BFDBFE',
  },
  [Confidentiality.CONFIDENTIEL]: {
    bg: '#FEF2F2',
    text: '#C0392B',
    border: '#FECACA',
  },
};
