import { beforeEach, describe, expect, it } from 'vitest'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryAnswerCommentsRepository } from '@/../test/repositories/in-memory-answer-comments-repository'
import { makeAnswerComment } from '@/../test/factories/make-answer-comment'
import { FetchAnswerCommentsUseCase } from './fetch-answers-comments'
import { InMemoryStudentRepository } from '@/../test/repositories/in-memory-student-repository'
import { makeStudent } from '@/../test/factories/make-student'

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let inMemoryStudentRepository: InMemoryStudentRepository
let sut: FetchAnswerCommentsUseCase

describe('Fetch answer comments', () => {
  beforeEach(async () => {
    inMemoryStudentRepository = new InMemoryStudentRepository()
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository(
      inMemoryStudentRepository,
    )
    sut = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentsRepository)
  })

  it('should be able to fetch answer comments', async () => {
    const author1 = await makeStudent(
      { name: 'John Doe' },
      new UniqueEntityID('author-1'),
    )
    const author2 = await makeStudent(
      { name: 'Jane Doe' },
      new UniqueEntityID('author-2'),
    )
    const author3 = await makeStudent(
      { name: 'Paul Doe' },
      new UniqueEntityID('author-3'),
    )

    await inMemoryStudentRepository.create(author1)
    await inMemoryStudentRepository.create(author2)
    await inMemoryStudentRepository.create(author3)

    inMemoryAnswerCommentsRepository.create(
      await makeAnswerComment({
        authorId: new UniqueEntityID('author-1'),
        answerId: new UniqueEntityID('answer-1'),
        createdAt: new Date(2026, 0, 20),
      }),
    )

    inMemoryAnswerCommentsRepository.create(
      await makeAnswerComment({
        authorId: new UniqueEntityID('author-2'),
        answerId: new UniqueEntityID('answer-1'),
        createdAt: new Date(2026, 0, 22),
      }),
    )

    inMemoryAnswerCommentsRepository.create(
      await makeAnswerComment({
        authorId: new UniqueEntityID('author-3'),
        answerId: new UniqueEntityID('answer-1'),
        createdAt: new Date(2026, 0, 18),
      }),
    )

    const result = await sut.execute({
      page: 1,
      answerId: 'answer-1',
    })

    expect(result.value?.comments).toEqual([
      expect.objectContaining({
        createdAt: new Date(2026, 0, 22),
        author: 'Jane Doe',
      }),
      expect.objectContaining({
        createdAt: new Date(2026, 0, 20),
        author: 'John Doe',
      }),
      expect.objectContaining({
        createdAt: new Date(2026, 0, 18),
        author: 'Paul Doe',
      }),
    ])
  })

  it('should be able to fetch pagination answer comments', async () => {
    const author = await makeStudent(
      { name: 'John Doe' },
      new UniqueEntityID('author-1'),
    )

    await inMemoryStudentRepository.create(author)

    for (let i = 1; i <= 22; i++) {
      inMemoryAnswerCommentsRepository.create(
        await makeAnswerComment({
          authorId: new UniqueEntityID('author-1'),
          answerId: new UniqueEntityID('answer-1'),
        }),
      )
    }

    const result = await sut.execute({
      page: 2,
      answerId: 'answer-1',
    })

    expect(result.value?.comments).toHaveLength(2)
  })
})
