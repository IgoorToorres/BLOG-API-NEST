import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Question,
  QuestionProps,
} from '@/domain/forum/enterprise/entities/question'
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'
import { PrismaQuestionMapper } from '@/infra/http/database/prisma/mappers/prisma-question-mapper'
import { PrismaService } from '@/infra/http/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'

export async function makeQuestion(
  override: Partial<QuestionProps> = {},
  id?: UniqueEntityID,
) {
  const { faker } = await import('@faker-js/faker')
  const title = override.title ?? faker.lorem.sentence()
  const generatedSlug = Slug.createFromText(
    `${title}-${faker.string.alphanumeric(8).toLowerCase()}`,
  )

  const question = Question.create(
    {
      authorId: new UniqueEntityID(),
      title,
      slug: generatedSlug,
      content: faker.lorem.text(),
      ...override,
    },
    id,
  )

  return question
}

@Injectable()
export class QuestionFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaQuestion(
    data: Partial<QuestionProps> = {},
  ): Promise<Question> {
    const question = await makeQuestion(data)

    await this.prisma.question.create({
      data: PrismaQuestionMapper.toPrisma(question),
    })

    return question
  }
}
