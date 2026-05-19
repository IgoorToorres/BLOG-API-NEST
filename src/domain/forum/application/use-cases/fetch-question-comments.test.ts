import { beforeEach, describe, expect, it } from 'vitest'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryQuestionCommentsRepository } from '@/../test/repositories/in-memory-question-comments-repository'
import { FetchQuestionCommentsUseCase } from './fetch-question-comments'
import { makeQuestionComment } from '@/../test/factories/make-question-comment'
import { InMemoryStudentRepository } from '@/../test/repositories/in-memory-student-repository'
import { makeStudent } from '@/../test/factories/make-student'

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let inMemoryStudentRepository: InMemoryStudentRepository
let sut: FetchQuestionCommentsUseCase

describe('Fetch question comments', () => {
  beforeEach(async () => {
    inMemoryStudentRepository = new InMemoryStudentRepository()
    inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository(
      inMemoryStudentRepository,
    )
    sut = new FetchQuestionCommentsUseCase(inMemoryQuestionCommentsRepository)
  })

  it('should be able to fetch question comments', async () => {
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

    inMemoryQuestionCommentsRepository.create(
      await makeQuestionComment({
        authorId: new UniqueEntityID('author-1'),
        questionId: new UniqueEntityID('question-1'),
        createdAt: new Date(2026, 0, 20),
      }),
    )

    inMemoryQuestionCommentsRepository.create(
      await makeQuestionComment({
        authorId: new UniqueEntityID('author-2'),
        questionId: new UniqueEntityID('question-1'),
        createdAt: new Date(2026, 0, 22),
      }),
    )

    inMemoryQuestionCommentsRepository.create(
      await makeQuestionComment({
        authorId: new UniqueEntityID('author-3'),
        questionId: new UniqueEntityID('question-1'),
        createdAt: new Date(2026, 0, 18),
      }),
    )

    const result = await sut.execute({
      page: 1,
      questionId: 'question-1',
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

  it('should be able to fetch pagination question comments', async () => {
    const author = await makeStudent(
      { name: 'John Doe' },
      new UniqueEntityID('author-1'),
    )

    await inMemoryStudentRepository.create(author)

    for (let i = 1; i <= 22; i++) {
      inMemoryQuestionCommentsRepository.create(
        await makeQuestionComment({
          authorId: new UniqueEntityID('author-1'),
          questionId: new UniqueEntityID('question-1'),
        }),
      )
    }

    const result = await sut.execute({
      page: 2,
      questionId: 'question-1',
    })

    expect(result.value?.comments).toHaveLength(2)
  })
})
