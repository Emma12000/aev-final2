import { Confidentiality } from '../enums/confidentiality.enum';
import { DocumentStatus } from '../enums/document-status.enum';
import { Permission } from '../enums/permission.enum';
import { User } from './user.types';

export interface DocumentCategory {
  id: string;
  name: string;
  description: string | null;
  slug: string;
  parentId: string | null;
  order: number;
  icon: string | null;
  defaultConfidentiality: Confidentiality;
  children?: DocumentCategory[];
  createdAt: string;
  updatedAt: string;
}

export interface Document {
  id: string;
  title: string;
  description: string | null;
  fileName: string;
  fileMimeType: string;
  fileSize: number;
  confidentiality: Confidentiality;
  status: DocumentStatus;
  categoryId: string;
  category?: DocumentCategory;
  uploadedById: string;
  uploadedBy?: Pick<User, 'id' | 'fullName' | 'email'>;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface DocumentAccessRule {
  id: string;
  documentId: string;
  userId: string;
  permission: Permission;
  grantedById: string;
  expiresAt: string | null;
  createdAt: string;
}

export interface CategoryAccessRule {
  id: string;
  categoryId: string;
  userId: string;
  grantedById: string;
  expiresAt: string | null;
  createdAt: string;
}

export interface UploadDocumentPayload {
  title: string;
  description?: string;
  categoryId: string;
  tags?: string[];
  confidentiality?: Confidentiality;
}

export interface UpdateDocumentPayload {
  title?: string;
  description?: string;
  categoryId?: string;
  tags?: string[];
  confidentiality?: Confidentiality;
}

export interface DocumentFilters {
  q?: string;
  categoryId?: string;
  confidentiality?: Confidentiality;
  status?: DocumentStatus;
  uploadedById?: string;
  dateFrom?: string;
  dateTo?: string;
  tags?: string[];
  page?: number;
  limit?: number;
}
