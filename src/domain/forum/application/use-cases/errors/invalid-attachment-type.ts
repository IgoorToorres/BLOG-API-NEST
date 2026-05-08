import { UseCasesError } from '@/core/errors/use-cases-error'

export class InvalidAttachmentType extends Error implements UseCasesError {
  constructor(type: string) {
    super(`File ${type} is not valid`)
  }
}
