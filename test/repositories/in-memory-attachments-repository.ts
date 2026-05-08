import { AttachmentsRepository } from '@/domain/forum/application/repository/attachments-repository'
import { Attachment } from '@/domain/forum/enterprise/entities/attachment'

export class InMemoryAttachmentsRepository implements AttachmentsRepository {
  async create(attachment: Attachment) {
    this.items.push(attachment)
  }

  public items: Attachment[] = []
}
