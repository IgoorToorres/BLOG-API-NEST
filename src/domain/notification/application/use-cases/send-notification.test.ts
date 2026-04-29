import { beforeEach, describe, expect, it } from 'vitest'
import { SendNotificationUseCase } from './send-notification'
import { InMemoryNotificationsRepository } from '@/../test/repositories/in-memory-notifications-repository'

let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sut: SendNotificationUseCase

describe('Create notification', () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sut = new SendNotificationUseCase(inMemoryNotificationsRepository)
  })

  it('should be able to send a notification', async () => {
    const notification = await sut.execute({
      recipientId: '1',
      title: 'Nova notificação',
      content: 'conteudo da notificação',
    })

    expect(notification.isRight()).toBe(true)
    expect(inMemoryNotificationsRepository.items[0]).toEqual(
      notification.value?.notification,
    )
  })
})
