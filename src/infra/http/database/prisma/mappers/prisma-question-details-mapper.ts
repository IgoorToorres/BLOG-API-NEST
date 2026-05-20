import {
  UserModel as PrismaUser,
  QuestionModel as PrismaQuestion,
} from '@/../generated/prisma/models'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-detailes'
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'

type PrismaQuestionDetails = PrismaQuestion & {
  author: PrismaUser
}

export class PrismaQuestionDetailsMapper {
  static toDomain(raw: PrismaQuestionDetails): QuestionDetails {
    return QuestionDetails.create({
      author: raw.author.name,
      authorId: new UniqueEntityID(raw.authorId),
      content: raw.content,
      createdAt: raw.createdAt,
      questionId: new UniqueEntityID(raw.id),
      slug: Slug.create(raw.slug),
      title: raw.title,
      bestAnswerId: raw.bestAnswerId
        ? new UniqueEntityID(raw.bestAnswerId?.toString())
        : null,
      updatedAt: raw.updatedAt,
    })
  }
}
