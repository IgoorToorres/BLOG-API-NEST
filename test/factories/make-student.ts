import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Student,
  StudentProps,
} from '@/domain/forum/enterprise/entities/student'
import { PrismaStudentMapper } from '@/infra/http/database/prisma/mappers/prisma-student-mapper'
import { PrismaService } from '@/infra/http/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'

export async function makeStudent(
  override: Partial<StudentProps> = {},
  id?: UniqueEntityID,
) {
  const { faker } = await import('@faker-js/faker')

  const student = Student.create(
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      ...override,
    },
    id,
  )

  return student
}

@Injectable()
export class StudentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaStudent(data: Partial<StudentProps> = {}): Promise<Student> {
    const student = await makeStudent(data)

    await this.prisma.user.create({
      data: PrismaStudentMapper.toPrisma(student),
    })

    return student
  }
}
