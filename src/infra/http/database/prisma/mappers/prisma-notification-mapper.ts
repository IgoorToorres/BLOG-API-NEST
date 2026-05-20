import type {
  NotificationModel as PrismaNotification,
  NotificationUncheckedCreateInput,
} from '@/../generated/prisma/models'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Notification } from '@/domain/notification/enterprise/entities/notification'

export class PrismaNotificationMapper {
  static toDomain(raw: PrismaNotification): Notification {
    return Notification.create(
      {
        title: raw.title,
        content: raw.content,
        recipientId: new UniqueEntityID(raw.recipientId),
        createdAt: raw.createdAt,
        readAt: raw.readAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(
    notification: Notification,
  ): NotificationUncheckedCreateInput {
    return {
      id: notification.id.toString(),
      content: notification.content,
      recipientId: notification.recipientId.toString(),
      title: notification.title,
      readAt: notification.readAt,
      createdAt: notification.createdAt,
    }
  }
}
