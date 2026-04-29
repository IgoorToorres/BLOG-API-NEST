import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { SendNotificationUseCase } from '../use-cases/send-notification'
import { AnswerRepository } from '@/domain/forum/application/repository/answer-repository'
import { AnswerNewComment } from '@/domain/forum/enterprise/events/answer-new-comment'

export class OnAnswerNewComment implements EventHandler {
  constructor(
    private answersRepository: AnswerRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendNewAnswerCommentNotification.bind(this),
      AnswerNewComment.name,
    )
  }

  private async sendNewAnswerCommentNotification({
    answerComment,
  }: AnswerNewComment) {
    const comment = await this.answersRepository.findById(
      answerComment.answerId.toString(),
    )

    if (comment) {
      await this.sendNotification.execute({
        recipientId: comment.authorId.toString(),
        title: `Novo comentário na resposta "${comment.content.substring(0, 40).concat('...')}"`,
        content: answerComment.content
          .substring(0, 120)
          .trimEnd()
          .concat('...'),
      })
    }
  }
}
