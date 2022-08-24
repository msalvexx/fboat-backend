import { FastifyInstance, RouteOptions } from 'fastify'

import { loginSchema } from '@/shared/infra/gateways/schemas/iam'

import { makeLogin } from '@/main/factories'
import adapt from '@/main/adapters/service-handler'

export const loginRoute = async (router: FastifyInstance, _: RouteOptions): Promise<void> => {
  router.post('/login', { schema: loginSchema }, adapt(makeLogin()))
}