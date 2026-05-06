import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { PrismaQuestionRepository } from './prisma/repositories/prisma-questions.repository'
import { PrismaQuestionCommentsRepository } from './prisma/repositories/prisma-question-comments.repository'
import { PrismaQuestionAttachmentsRepository } from './prisma/repositories/prisma-question-attachments.repository'
import { PrismaAswersRepository } from './prisma/repositories/prisma-aswers.repository'
import { PrismaAswerCommentsRepository } from './prisma/repositories/prisma-aswer-comments.repository'
import { PrismaAnswerAttachmentsRepository } from './prisma/repositories/prisma-answer-attachments.repository'
import { QuestionsRepository } from '@/domain/forum/application/repository/questions-repository'
import { StudentRepository } from '@/domain/forum/application/repository/student-repository'
import { PrismaStudentRepository } from './prisma/repositories/prisma-student.repository'
import { QuestionCommentsRepository } from '@/domain/forum/application/repository/question-comments-repository'
import { QuestionAttachmentsRepository } from '@/domain/forum/application/repository/question-attachments-repository'
import { AnswerRepository } from '@/domain/forum/application/repository/answer-repository'
import { AnswerCommentsRepository } from '@/domain/forum/application/repository/answer-comments-repository'
import { AnswerAttachmentsRepository } from '@/domain/forum/application/repository/answer-attachments-repository copy'

@Module({
  providers: [
    PrismaService,
    {
      provide: QuestionsRepository,
      useClass: PrismaQuestionRepository,
    },
    {
      provide: StudentRepository,
      useClass: PrismaStudentRepository,
    },

    {
      provide: QuestionCommentsRepository,
      useClass: PrismaQuestionCommentsRepository,
    },
    {
      provide: QuestionAttachmentsRepository,
      useClass: PrismaQuestionAttachmentsRepository,
    },
    {
      provide: AnswerRepository,
      useClass: PrismaAswersRepository,
    },
    {
      provide: AnswerCommentsRepository,
      useClass: PrismaAswerCommentsRepository,
    },
    {
      provide: AnswerAttachmentsRepository,
      useClass: PrismaAnswerAttachmentsRepository,
    },
  ],
  exports: [
    PrismaService,
    QuestionsRepository,
    QuestionCommentsRepository,
    QuestionAttachmentsRepository,
    AnswerRepository,
    AnswerCommentsRepository,
    AnswerAttachmentsRepository,
    StudentRepository,
  ],
})
export class DatabaseModule {}
