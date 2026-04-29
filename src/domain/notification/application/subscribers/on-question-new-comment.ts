import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { QuestionsRepository } from '@/domain/forum/application/repository/questions-repository'
import { QuestionNewComment } from '@/domain/forum/enterprise/events/question-new-comment'
import { SendNotificationUseCase } from '../use-cases/send-notification'

export class OnQuestionNewComment implements EventHandler {
  constructor(
    private questionsRepository: QuestionsRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendNewCommentNotification.bind(this),
      QuestionNewComment.name,
    )
  }

  private async sendNewCommentNotification({
    questionComment,
  }: QuestionNewComment) {
    const question = await this.questionsRepository.findById(
      questionComment.questionId.toString(),
    )

    if (question) {
      await this.sendNotification.execute({
        recipientId: question.authorId.toString(),
        title: `Novo comentário em "${question.title.substring(0, 40).concat('...')}"`,
        content: questionComment.content
          .substring(0, 120)
          .trimEnd()
          .concat('...'),
      })
    }
  }
}
