import { UnauthorizedError } from '@/iam'

import { AuthenticationSut } from '@/tests/services/factory'
import { mockAuthenticateUserParams, mockAccount } from '@/tests/mocks'

describe('When Authenticating user', () => {
  test('Should return UnauthorizedError if account was not found', async () => {
    const { sut } = AuthenticationSut.makeSut()
    const params = mockAuthenticateUserParams()

    const promise = sut.authenticate(params)

    await expect(promise).rejects.toThrowError(new UnauthorizedError())
  })

  test('Should return UnauthorizedError if password not match', async () => {
    const { sut, repo, hasher } = AuthenticationSut.makeSut()
    repo.readResult = mockAccount()
    hasher.compareResult = false
    const params = mockAuthenticateUserParams()

    const promise = sut.authenticate(params)

    await expect(promise).rejects.toThrowError(new UnauthorizedError())
  })

  test('Should return response correctly if authentication succeeds', async () => {
    const { sut, repo } = AuthenticationSut.makeSut()
    repo.readResult = mockAccount()
    const params = mockAuthenticateUserParams()

    const result = await sut.authenticate(params)

    expect(result).toStrictEqual({
      personName: 'any any',
      token: 'validToken'
    })
  })
})
