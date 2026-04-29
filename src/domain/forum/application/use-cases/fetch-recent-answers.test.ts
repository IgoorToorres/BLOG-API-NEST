import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryAnswersRepository } from '@/../test/repositories/in-memory-answers-repository'
import { makeAnswer } from '@/../test/factories/make-answer'
import { FetchRecentAnswersUseCase } from './fetch-recent-answers'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryAnswerAttachmentsRepository } from '@/../test/repositories/in-memory-answer-attachments-repository copy'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: FetchRecentAnswersUseCase

describe('Fetch recent answers', () => {
  beforeEach(() => {
    const inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    )
    sut = new FetchRecentAnswersUseCase(inMemoryAnswersRepository)
  })

  it('should be able to fetch recent answers', async () => {
    inMemoryAnswersRepository.create(
      await makeAnswer({
        questionId: new UniqueEntityID('question-1'),
        createdAt: new Date(2026, 0, 20),
      }),
    )

    inMemoryAnswersRepository.create(
      await makeAnswer({
        questionId: new UniqueEntityID('question-1'),
        createdAt: new Date(2026, 0, 22),
      }),
    )

    inMemoryAnswersRepository.create(
      await makeAnswer({
        questionId: new UniqueEntityID('question-1'),
        createdAt: new Date(2026, 0, 18),
      }),
    )

    const result = await sut.execute({
      page: 1,
      questionId: 'question-1',
    })

    expect(result.value?.answers).toEqual([
      expect.objectContaining({ createdAt: new Date(2026, 0, 22) }),
      expect.objectContaining({ createdAt: new Date(2026, 0, 20) }),
      expect.objectContaining({ createdAt: new Date(2026, 0, 18) }),
    ])
  })

  it('should be able to fetch pagination recent answers', async () => {
    for (let i = 1; i <= 22; i++) {
      inMemoryAnswersRepository.create(
        await makeAnswer({ questionId: new UniqueEntityID('question-1') }),
      )
    }

    const result = await sut.execute({
      page: 2,
      questionId: 'question-1',
    })

    expect(result.value?.answers).toHaveLength(2)
  })
})
