import { Account, EmailAlreadyInUseError, PersistDataChangeError } from '@/iam'
import { mockAccount, mockCreateAccountParams } from '@/tests/mocks'
import { AccountServiceSut } from '@/tests/services/factory'

describe('Db Create account', () => {
  test('Should return EmailAlreadyInUseError if email already in use', async () => {
    const { sut, repo } = AccountServiceSut.makeSut()
    const invalidEmail = 'test@mail.com'
    const params = mockCreateAccountParams(invalidEmail)
    repo.readResult = mockAccount(invalidEmail)

    const promise = sut.createAccount(params)

    await expect(promise).rejects.toThrowError(new EmailAlreadyInUseError(invalidEmail))
  })

  test('Should call save account on repository', async () => {
    const { sut, repo } = AccountServiceSut.makeSut()
    const params = mockCreateAccountParams()

    const account = await sut.createAccount(params)

    expect(repo.account).toStrictEqual(account)
  })

  test('Should hash password', async () => {
    const { sut } = AccountServiceSut.makeSut()
    const params = mockCreateAccountParams()

    const account = await sut.createAccount(params) as Account

    const expectedAccount = mockAccount('valid@mail.com', 'hashedPassword')
    expect(account.user.password).toStrictEqual(expectedAccount.user.password)
  })

  test('Should return PersistDataChangeError if save account on repository fails', async () => {
    const { sut, repo } = AccountServiceSut.makeSut()
    const params = mockCreateAccountParams()
    repo.saveResult = false

    const promise = sut.createAccount(params)

    await expect(promise).rejects.toThrowError(new PersistDataChangeError('Account'))
  })
})
