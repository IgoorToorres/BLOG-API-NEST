import { beforeEach, describe, it, vi, MockInstance, expect } from 'vitest'
import { OnAnswerNewComment } from './on-answer-new-comment'
import { makeAnswer } from '@/../test/factories/make-answer'
import { makeAnswerComment } from '@/../test/factories/make-answer-comment'
import { InMemoryAnswersRepository } from '@/../test/repositories/in-memory-answers-repository'
import { InMemoryAnswerCommentsRepository } from '@/../test/repositories/in-memory-answer-comments-repository'
import {
  SendNotificationUseCase,
  SendNotificationUseCaseRequest,
  SendNotificationUseCaseResponse,
} from '../use-cases/send-notification'
import { InMemoryNotificationsRepository } from '@/../test/repositories/in-memory-notifications-repository'
import { InMemoryAnswerAttachmentsRepository } from '@/../test/repositories/in-memory-answer-attachments-repository copy'
import { waitFor } from '../../../../../test/utils/wait-for'

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sendNotification: SendNotificationUseCase

let sendNotificationExecuteSpy: MockInstance<
  (
    request: SendNotificationUseCaseRequest,
  ) => Promise<SendNotificationUseCaseResponse>
>

describe('On answer new comment', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    )
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sendNotification = new SendNotificationUseCase(
      inMemoryNotificationsRepository,
    )

    sendNotificationExecuteSpy = vi.spyOn(sendNotification, 'execute')

    new OnAnswerNewComment(inMemoryAnswersRepository, sendNotification)
  })

  it('should send a notification when an answer receives a new comment', async () => {
    const answer = await makeAnswer()
    const answerComment = await makeAnswerComment({
      answerId: answer.id,
    })

    inMemoryAnswersRepository.create(answer)
    inMemoryAnswerCommentsRepository.create(answerComment)

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled()
    })
  })
})
