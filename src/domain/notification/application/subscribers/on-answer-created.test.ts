import { beforeEach, describe, it, vi, MockInstance, expect } from 'vitest'
import { OnAswerCreated } from './on-answer-created'
import { makeAnswer } from '@/../test/factories/make-answer'
import { InMemoryAnswersRepository } from '@/../test/repositories/in-memory-answers-repository'
import { InMemoryAnswerAttachmentsRepository } from '@/../test/repositories/in-memory-answer-attachments-repository copy'
import { InMemoryQuestionsRepository } from '@/../test/repositories/in-memory-questions-repository'
import {
  SendNotificationUseCase,
  SendNotificationUseCaseRequest,
  SendNotificationUseCaseResponse,
} from '../use-cases/send-notification'
import { InMemoryNotificationsRepository } from '@/../test/repositories/in-memory-notifications-repository'
import { InMemoryQuestionAttachmentsRepository } from '@/../test/repositories/in-memory-question-attachments-repository'
import { makeQuestion } from '@/../test/factories/make-question'
import { waitFor } from '../../../../../test/utils/wait-for'

let inMemoryQuestionAttachmentsReposityory: InMemoryQuestionAttachmentsRepository
let inMemoryQuestionRepository: InMemoryQuestionsRepository
let inMemoryNotificationRepository: InMemoryNotificationsRepository
let sendNotification: SendNotificationUseCase
let inMemoryAnswersAttachmentsRepositor: InMemoryAnswerAttachmentsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository

let sendNotificationExecuteSpy: MockInstance<
  (
    request: SendNotificationUseCaseRequest,
  ) => Promise<SendNotificationUseCaseResponse>
>

describe('On answer created', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsReposityory =
      new InMemoryQuestionAttachmentsRepository()
    inMemoryQuestionRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsReposityory,
    )
    inMemoryAnswersAttachmentsRepositor =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryNotificationRepository = new InMemoryNotificationsRepository()
    sendNotification = new SendNotificationUseCase(
      inMemoryNotificationRepository,
    )

    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswersAttachmentsRepositor,
    )

    sendNotificationExecuteSpy = vi.spyOn(sendNotification, 'execute')

    new OnAswerCreated(inMemoryQuestionRepository, sendNotification)
  })

  it('should send a notification when an answer is created', async () => {
    const question = await makeQuestion()
    const answer = await makeAnswer({ questionId: question.id })

    inMemoryQuestionRepository.create(question)
    inMemoryAnswersRepository.create(answer)

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled()
    })
  })
})
