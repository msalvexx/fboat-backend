import { stopMySQLTestContainer, refreshDatabase, startTestDatabase } from '@/tests/integration/configs/helpers.integration'
import { MySQLConnectionManager } from '@/shared/infra'
import { StartedMySqlContainer } from 'testcontainers'
import { MySQLArticle, MySQLArticleRepository } from '@/content-system/infra'
import { Repository } from 'typeorm'
import { Article } from '@/content-system'

describe('ArticleRepository', () => {
  let sut: MySQLArticleRepository
  let connectionManager: MySQLConnectionManager
  let container: StartedMySqlContainer
  let repository: Repository<MySQLArticle>
  const params: Article = new Article({
    articleId: '123',
    author: {
      accountId: '8f5aaf39-d388-4e00-8bd4-440f6c5d2e85',
      name: 'any name',
      occupation: 'any occupation',
      defaultPhoto: 'any photo'
    },
    content: '<html></html>',
    coverPhoto: 'any cover',
    summary: 'any summary',
    title: 'any title',
    isPublished: false,
    slug: 'any-title'
  })

  beforeAll(async () => {
    ({ container, connectionManager } = await startTestDatabase())
    repository = connectionManager.getRepository(MySQLArticle)
    sut = new MySQLArticleRepository(connectionManager)
  })

  beforeEach(async () => await refreshDatabase(connectionManager))
  afterAll(async () => await stopMySQLTestContainer(container))

  test('Can create article successfully', async () => {
    await sut.save(params)

    const retrievedArticle = await repository.findOne({ where: { articleId: '123' } })
    expect(retrievedArticle).toBeDefined()
    expect(retrievedArticle?.accountId).toBe(params.author.accountId)
    expect(retrievedArticle?.content).toBe(params.content)
    expect(retrievedArticle?.photo).toBe(params.coverPhoto)
    expect(retrievedArticle?.summary).toBe(params.summary)
    expect(retrievedArticle?.title).toBe(params.title)
    expect(retrievedArticle?.isPublished).toBe(params.isPublished)
    expect(retrievedArticle?.slug).toBe(params.slug)
  })

  test('Can update article successfully', async () => {
    await repository.save({
      articleId: params.articleId,
      accountId: params.author.accountId,
      title: params.title,
      summary: params.summary,
      content: params.content,
      slug: params.slug,
      photo: params.coverPhoto,
      isPublished: params.isPublished,
      publishDate: params.publishDate,
      creationDate: params.creationDate,
      revisionDate: params.revisionDate
    })
    params.changeArticle({
      title: 'other title',
      slug: 'other-title'
    })

    await sut.save(params)

    const retrievedArticle = await repository.findOne({ where: { articleId: '123' } })
    expect(retrievedArticle).toBeDefined()
    expect(retrievedArticle?.title).toBe(params.title)
    expect(retrievedArticle?.slug).toBe(params.slug)
  })
})
