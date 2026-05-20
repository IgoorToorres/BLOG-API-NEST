import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryQuestionsRepository } from '@/../test/repositories/in-memory-questions-repository'
import { GetQuestionBySlug } from './get-question-by-slug'
import { makeQuestion } from '@/../test/factories/make-question'
import { Slug } from '../../enterprise/entities/value-objects/slug'
import { InMemoryQuestionAttachmentsRepository } from '@/../test/repositories/in-memory-question-attachments-repository'
import { InMemoryStudentRepository } from '@/../test/repositories/in-memory-student-repository'
import { makeStudent } from '@/../test/factories/make-student'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let inMemoryStudentRepository: InMemoryStudentRepository
let sut: GetQuestionBySlug

describe('Get question by slug', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()
    inMemoryStudentRepository = new InMemoryStudentRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
      inMemoryStudentRepository,
    )
    sut = new GetQuestionBySlug(inMemoryQuestionsRepository)
  })

  it('should be able to get a question by slug', async () => {
    const author = await makeStudent()
    await inMemoryStudentRepository.create(author)

    const newQuestion = await makeQuestion({
      authorId: author.id,
      slug: Slug.create('example-question'),
    })

    await inMemoryQuestionsRepository.create(newQuestion)

    const result = await sut.execute({ slug: 'example-question' })

    expect(result.isRight()).toBeTruthy()

    if (result.isRight()) {
      expect(result.value.question.slug).toBe('example-question')
      expect(result.value.question.questionId).toEqual(newQuestion.id)
      expect(result.value.question.authorId).toEqual(author.id)
      expect(result.value.question.author).toBe(author.name)
    }
  })

  it('should not be able to get a question with a non-existing slug', async () => {
    const result = await sut.execute({ slug: 'non-existing-slug' })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
