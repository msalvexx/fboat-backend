import { MySQLConnectionManager } from '@/repositories'
import { MySqlContainer, StartedMySqlContainer } from 'testcontainers'

describe('MySQLConnectionManager', () => {
  jest.setTimeout(240_000)

  let container: StartedMySqlContainer
  let config: any
  let sut: MySQLConnectionManager

  beforeAll(async () => {
    container = await new MySqlContainer().withCmd(['--default-authentication-plugin=mysql_native_password']).start()
    config = {
      database: container.getDatabase(),
      host: container.getHost(),
      port: container.getPort(),
      username: container.getUsername(),
      password: container.getUserPassword()
    }
    sut = MySQLConnectionManager.getInstance()
  })

  afterAll(async () => {
    await container.stop()
  })

  test('Should return same instance when getInstance is called', () => {
    const sut2 = MySQLConnectionManager.getInstance()

    expect(sut).toBe(sut2)
  })

  test('Should connect to database', async () => {
    await sut.connect(config)

    await expect(sut.isConnected()).resolves.toBeTruthy()
  })

  test('Should disconnect to database', async () => {
    await sut.connect(config)
    await sut.disconnect()

    await expect(sut.isConnected()).resolves.toBeFalsy()
  })
})