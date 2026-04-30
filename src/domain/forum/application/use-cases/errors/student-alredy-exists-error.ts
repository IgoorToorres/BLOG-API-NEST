import { UseCasesError } from '@/core/errors/use-cases-error'

export class StudentAlredyExistsError extends Error implements UseCasesError {
  constructor(identifier: string) {
    super(`Student ${identifier} alredy exists`)
  }
}
