import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { ChatRequestDto } from './dto/chat.dto';
import { CurrentUser, JwtPayload } from '../auth/decorators/current-user.decorator';

@ApiTags('Chat')
@ApiBearerAuth('access-token')
@Controller('chat')
export class ChatController {
  constructor(private readonly chat: ChatService) {}

  @Post()
  @ApiOperation({ summary: 'Chatbot IA AEV — questions association + résumés documents' })
  async sendMessage(
    @Body() dto: ChatRequestDto,
    @CurrentUser() _actor: JwtPayload,
  ): Promise<{ reply: string }> {
    const reply = await this.chat.chat(dto.messages, dto.documentId);
    return { reply };
  }
}
