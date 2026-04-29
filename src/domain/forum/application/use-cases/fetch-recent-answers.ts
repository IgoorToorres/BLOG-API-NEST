import { Either, right } from '@/core/either'
import { Answer } from '../../enterprise/entities/answer'
import { AnswerRepository } from '../repository/answer-repository'

interface FetchRecentAnswersUseCaseRequest {
  page: number
  questionId: string
}
type FetchRecentAnswersUseCaseResponse = Either<
  null,
  {
    answers: Answer[]
  }
>

export class FetchRecentAnswersUseCase {
  constructor(private answerRepository: AnswerRepository) {}

  async execute({
    page,
    questionId,
  }: FetchRecentAnswersUseCaseRequest): Promise<FetchRecentAnswersUseCaseResponse> {
    const answers = await this.answerRepository.findManyByQuestionId(
      questionId,
      { page },
    )

    return right({
      answers,
    })
  }
}
