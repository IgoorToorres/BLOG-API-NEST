import { beforeEach, describe, expect, it } from 'vitest'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryAnswerCommentsRepository } from '@/../test/repositories/in-memory-answer-comments-repository'
import { makeAnswerComment } from '@/../test/factories/make-answer-comment'
import { FetchAnswerCommentsUseCase } from './fetch-answers-comments'

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: FetchAnswerCommentsUseCase

describe('Fetch answer comments', () => {
  beforeEach(() => {
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()
    sut = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentsRepository)
  })

  it('should be able to fetch answer comments', async () => {
    inMemoryAnswerCommentsRepository.create(
      await makeAnswerComment({
        answerId: new UniqueEntityID('answer-1'),
        createdAt: new Date(2026, 0, 20),
      }),
    )

    inMemoryAnswerCommentsRepository.create(
      await makeAnswerComment({
        answerId: new UniqueEntityID('answer-1'),
        createdAt: new Date(2026, 0, 22),
      }),
    )

    inMemoryAnswerCommentsRepository.create(
      await makeAnswerComment({
        answerId: new UniqueEntityID('answer-1'),
        createdAt: new Date(2026, 0, 18),
      }),
    )

    const result = await sut.execute({
      page: 1,
      answerId: 'answer-1',
    })

    expect(result.value?.answerComments).toEqual([
      expect.objectContaining({ createdAt: new Date(2026, 0, 22) }),
      expect.objectContaining({ createdAt: new Date(2026, 0, 20) }),
      expect.objectContaining({ createdAt: new Date(2026, 0, 18) }),
    ])
  })

  it('should be able to fetch pagination answer comments', async () => {
    for (let i = 1; i <= 22; i++) {
      inMemoryAnswerCommentsRepository.create(
        await makeAnswerComment({
          answerId: new UniqueEntityID('answer-1'),
        }),
      )
    }

    const result = await sut.execute({
      page: 2,
      answerId: 'answer-1',
    })

    expect(result.value?.answerComments).toHaveLength(2)
  })
})
