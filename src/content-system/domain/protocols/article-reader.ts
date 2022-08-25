import { ArticleResult } from '@/content-system/domain/protocols'

export namespace GetArticle {
  export type Params = { idOrSlug: string }
  export type Result = ArticleResult
}

export interface GetArticle {
  get: (idOrSlug: GetArticle.Params) => Promise<GetArticle.Result>
}
