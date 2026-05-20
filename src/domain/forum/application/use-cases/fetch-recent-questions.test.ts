import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryQuestionsRepository } from '@/../test/repositories/in-memory-questions-repository'
import { makeQuestion } from '@/../test/factories/make-question'
import { FetchRecentQuestionsUseCase } from './fetch-recent-questions'
import { InMemoryQuestionAttachmentsRepository } from '@/../test/repositories/in-memory-question-attachments-repository'
import { InMemoryStudentRepository } from '@/../test/repositories/in-memory-student-repository'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let inMemoryStudentRepository: InMemoryStudentRepository
let sut: FetchRecentQuestionsUseCase

describe('Fetch recent questions', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()
    inMemoryStudentRepository = new InMemoryStudentRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
      inMemoryStudentRepository,
    )
    sut = new FetchRecentQuestionsUseCase(inMemoryQuestionsRepository)
  })

  it('should be able to fetch recent questions', async () => {
    inMemoryQuestionsRepository.create(
      await makeQuestion({ createdAt: new Date(2026, 0, 20) }),
    )
    inMemoryQuestionsRepository.create(
      await makeQuestion({ createdAt: new Date(2026, 0, 18) }),
    )
    inMemoryQuestionsRepository.create(
      await makeQuestion({ createdAt: new Date(2026, 0, 23) }),
    )

    const result = await sut.execute({ page: 1 })

    expect(result.value?.questions).toEqual([
      expect.objectContaining({ createdAt: new Date(2026, 0, 23) }),
      expect.objectContaining({ createdAt: new Date(2026, 0, 20) }),
      expect.objectContaining({ createdAt: new Date(2026, 0, 18) }),
    ])
  })

  it('should be able to fetch pagination recent questions', async () => {
    for (let i = 1; i <= 22; i++) {
      inMemoryQuestionsRepository.create(await makeQuestion())
    }

    const result = await sut.execute({ page: 2 })

    expect(result.value?.questions).toHaveLength(2)
  })
})
