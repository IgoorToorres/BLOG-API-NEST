import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-detailes'

export class QuestionDetailsPresenter {
  static toHttp(questionDetails: QuestionDetails) {
    return {
      questionId: questionDetails.questionId.toString(),
      authorId: questionDetails.authorId.toString(),
      authorName: questionDetails.author,
      title: questionDetails.title,
      content: questionDetails.content,
      slug: questionDetails.slug,
      bestAnswerId: questionDetails.bestAnswerId?.toString(),
      createdAt: questionDetails.createdAt,
      updatedAt: questionDetails.updatedAt,
    }
  }
}
