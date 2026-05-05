import type {
  CommentModel as PrismaComment,
  CommentUncheckedCreateInput,
} from '@/../generated/prisma/models'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'

export class PrismaQuestionCommentMapper {
  static toDomain(raw: PrismaComment): QuestionComment {
    if (!raw.questionId) {
      throw new Error('Invalid Comment Type')
    }
    return QuestionComment.create(
      {
        content: raw.content,
        authorId: new UniqueEntityID(raw.authorId),
        questionId: new UniqueEntityID(raw.questionId),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(
    questioncomment: QuestionComment,
  ): CommentUncheckedCreateInput {
    return {
      id: questioncomment.id.toString(),
      authorId: questioncomment.authorId.toString(),
      questionId: questioncomment.questionId.toString(),
      content: questioncomment.content,
      createdAt: questioncomment.createdAt,
      updatedAt: questioncomment.updatedAt ?? undefined,
    }
  }
}
