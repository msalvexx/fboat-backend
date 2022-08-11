import { PersistDataChangeError } from '@/iam'
import { mockAccount, mockChangePasswordParams } from '../mocks'
import { AccountServiceSut } from './factory'

describe('When change password', () => {
  test('will change user password correctly', async () => {
    const { sut, repo, hasher } = AccountServiceSut.makeSut()
    const params = mockChangePasswordParams()
    const hashedPassword = `hashed${params.newPassword}`
    repo.readResult = mockAccount({ user: { email: params.email } })
    hasher.generateResult = hashedPassword

    await sut.changePassword(params)

    expect(repo.account.user.password).toBe(hashedPassword)
  })

  test('Will return error if save fails', async () => {
    const { sut, repo, hasher } = AccountServiceSut.makeSut()
    const params = mockChangePasswordParams()
    repo.readResult = mockAccount({ user: { email: params.email } })
    repo.saveResult = false
    hasher.compareResult = true

    const promise = sut.changePassword(params)

    await expect(promise).rejects.toThrowError(new PersistDataChangeError('Account'))
  })
})
