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
    PrismaQuestionCommentsRepository,
    PrismaQuestionAttachmentsRepository,
    PrismaAswersRepository,
    PrismaAswerCommentsRepository,
    PrismaAnswerAttachmentsRepository,
  ],
  exports: [
    PrismaService,
    QuestionsRepository,
    PrismaQuestionCommentsRepository,
    PrismaQuestionAttachmentsRepository,
    PrismaAswersRepository,
    PrismaAswerCommentsRepository,
    PrismaAnswerAttachmentsRepository,
    StudentRepository,
  ],
})
export class DatabaseModule {}
