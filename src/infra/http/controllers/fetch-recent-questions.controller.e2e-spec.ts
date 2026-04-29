import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Fetch question (E2E)', async () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /questions', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'fulano1',
        email: 'fulano1@teste.com',
        password: '123456',
      },
    })

    const accessToken = jwt.sign({ sub: user.id })

    for (let i = 1; i <= 3; i++) {
      await request(app.getHttpServer())
        .post('/questions')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: `Question${i}`,
          content: `new Content of a question${i}`,
        })
    }

    const response = await request(app.getHttpServer())
      .get('/questions')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      questions: expect.arrayContaining([
        expect.objectContaining({
          title: 'Question1',
          content: 'new Content of a question1',
        }),
        expect.objectContaining({
          title: 'Question2',
          content: 'new Content of a question2',
        }),
        expect.objectContaining({
          title: 'Question3',
          content: 'new Content of a question3',
        }),
      ]),
    })
  })
})
