import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../../auth/jwt-auth.guard'
import z from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation.pipe'
import { PrismaService } from '../database/prisma/prisma.service'

const pageQuesryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQuesryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQuesryParamSchema>

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class FetchRecentQuestionController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async handle(@Query('page', queryValidationPipe) page: PageQueryParamSchema) {
    const perPage = 20

    const questions = await this.prisma.question.findMany({
      take: perPage,
      skip: (page - 1) * perPage,
      orderBy: {
        createdAt: 'desc',
      },
    })

    return { questions }
  }
}
