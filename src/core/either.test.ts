import { expect, test } from 'vitest'
import { Either, left, right } from './either'

function doSomething(shouldSuccess: boolean): Either<string, number> {
  if (shouldSuccess) {
    return right(10)
  } else {
    return left('error')
  }
}

test('success result', () => {
  const result = doSomething(true)

  expect(result.value).toEqual(10)
})

test('error result', () => {
  const result = doSomething(false)

  expect(result.value).toEqual('error')
})
