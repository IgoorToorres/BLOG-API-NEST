import { beforeEach, describe, expect, it } from 'vitest'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryQuestionCommentsRepository } from '@/../test/repositories/in-memory-question-comments-repository'
import { FetchQuestionCommentsUseCase } from './fetch-question-comments'
import { makeQuestionComment } from '@/../test/factories/make-question-comment'

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let sut: FetchQuestionCommentsUseCase

describe('Fetch question comments', () => {
  beforeEach(() => {
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository()
    sut = new FetchQuestionCommentsUseCase(inMemoryQuestionCommentsRepository)
  })

  it('should be able to fetch question comments', async () => {
    inMemoryQuestionCommentsRepository.create(
      await makeQuestionComment({
        questionId: new UniqueEntityID('question-1'),
        createdAt: new Date(2026, 0, 20),
      }),
    )

    inMemoryQuestionCommentsRepository.create(
      await makeQuestionComment({
        questionId: new UniqueEntityID('question-1'),
        createdAt: new Date(2026, 0, 22),
      }),
    )

    inMemoryQuestionCommentsRepository.create(
      await makeQuestionComment({
        questionId: new UniqueEntityID('question-1'),
        createdAt: new Date(2026, 0, 18),
      }),
    )

    const result = await sut.execute({
      page: 1,
      questionId: 'question-1',
    })

    expect(result.value?.questionComments).toEqual([
      expect.objectContaining({ createdAt: new Date(2026, 0, 22) }),
      expect.objectContaining({ createdAt: new Date(2026, 0, 20) }),
      expect.objectContaining({ createdAt: new Date(2026, 0, 18) }),
    ])
  })

  it('should be able to fetch pagination question comments', async () => {
    for (let i = 1; i <= 22; i++) {
      inMemoryQuestionCommentsRepository.create(
        await makeQuestionComment({
          questionId: new UniqueEntityID('question-1'),
        }),
      )
    }

    const result = await sut.execute({
      page: 2,
      questionId: 'question-1',
    })

    expect(result.value?.questionComments).toHaveLength(2)
  })
})
