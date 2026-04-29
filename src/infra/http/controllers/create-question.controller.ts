import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../../auth/jwt-auth.guard'
import { CurrentUser } from '../../auth/current-user.decorator'
import type { UserPayload } from '../../auth/jwt.strategy'
import z from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation.pipe'
import { PrismaService } from '../database/prisma/prisma.service'

const createQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
})

type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  constructor(private prisma: PrismaService) {}

  @Post()
  async handle(
    @Body(new ZodValidationPipe(createQuestionBodySchema))
    body: CreateQuestionBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { content, title } = body
    const userId = user.sub
    const slug = this.generateSlug(title)

    await this.prisma.question.create({
      data: {
        authorId: userId,
        title,
        content,
        slug,
      },
    })
  }

  private generateSlug(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD') // separa acentos das letras
      .replace(/[\u0300-\u036f]/g, '') // remove acentos
      .replace(/[^a-z0-9\s-]/g, '') // remove caracteres especiais
      .trim()
      .replace(/\s+/g, '-') // espaços -> hífen
      .replace(/-+/g, '-') // remove múltiplos hífens
  }
}
