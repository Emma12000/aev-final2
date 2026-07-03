import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Anthropic from '@anthropic-ai/sdk';
import { PrismaService } from '../prisma/prisma.service';
import { ChatMessageDto } from './dto/chat.dto';

const SYSTEM_PROMPT = `Tu es l'assistant virtuel officiel de l'Association Espoir & Vie (AEV), une organisation humanitaire basée au Tchad.

Tu es strictement limité à deux rôles :
1. Répondre aux questions sur l'Association Espoir & Vie : sa mission, ses programmes, ses activités, son fonctionnement et sa plateforme documentaire.
2. Résumer et analyser les rapports et documents de l'association qui te sont soumis.

À propos de l'Association Espoir & Vie (AEV) :
- Organisation humanitaire basée à N'Djamena, Tchad
- Mission : promotion de la santé, action sociale et assistance humanitaire
- Domaines d'intervention : santé communautaire, nutrition, éducation, partenariats ONG nationales et internationales
- Plateforme documentaire : archives numériques sécurisées (rapports, contrats, courriers officiels, projets, finances)
- Accès : archive.espoiretvie.td
- Contact : admin@espoiretvie.td

Règles absolues :
- Si la question ne concerne pas AEV ou ses documents, réponds : "Je suis uniquement disponible pour répondre aux questions sur l'Association Espoir & Vie et pour résumer ses documents. Je ne peux pas vous aider sur ce sujet."
- Réponds toujours en français, de manière professionnelle et concise.
- Ne génère pas de code, d'histoires, de traductions générales ou tout autre contenu sans rapport avec AEV.
- Pour les résumés de documents : sois structuré, objectif et factuel.`;

@Injectable()
export class ChatService {
  private client: Anthropic | null = null;

  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    const apiKey = this.config.get<string>('ANTHROPIC_API_KEY');
    if (apiKey) {
      this.client = new Anthropic({ apiKey });
    }
  }

  async chat(messages: ChatMessageDto[], documentId?: string): Promise<string> {
    if (!this.client) {
      throw new ServiceUnavailableException(
        'Le chatbot n\'est pas encore configuré. Veuillez contacter l\'administrateur.',
      );
    }

    let systemContent = SYSTEM_PROMPT;

    if (documentId) {
      const doc = await this.prisma.document.findUnique({
        where: { id: documentId },
        select: { title: true, description: true, tags: true, category: { select: { name: true } } },
      });
      if (doc) {
        systemContent += `\n\n--- DOCUMENT EN CONTEXTE ---\nTitre : ${doc.title}\nCatégorie : ${doc.category?.name ?? '—'}\nDescription : ${doc.description ?? 'Aucune description disponible.'}\nMots-clés : ${doc.tags?.join(', ') || '—'}\n---\nL'utilisateur souhaite des informations ou un résumé sur ce document.`;
      }
    }

    const response = await this.client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      system: systemContent,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    });

    const block = response.content[0];
    return block.type === 'text' ? block.text : '';
  }
}
