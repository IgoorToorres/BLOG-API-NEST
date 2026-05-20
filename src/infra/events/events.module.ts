import { OnAswerCreated } from '@/domain/notification/application/subscribers/on-answer-created'
import { OnAnswerNewComment } from '@/domain/notification/application/subscribers/on-answer-new-comment'
import { OnQuestionBestAnswerChosen } from '@/domain/notification/application/subscribers/on-question-best-answer-chosen'
import { OnQuestionNewComment } from '@/domain/notification/application/subscribers/on-question-new-comment'
import { SendNotificationUseCase } from '@/domain/notification/application/use-cases/send-notification'
import { DatabaseModule } from '../http/database/database.module'
import { Module } from '@nestjs/common'

@Module({
  imports: [DatabaseModule],
  providers: [
    OnAswerCreated,
    OnQuestionBestAnswerChosen,
    OnAnswerNewComment,
    OnQuestionNewComment,
    SendNotificationUseCase,
  ],
})
export class EventsModule {}
