import { Validation } from '@/client/presentation/protocols'

import { ValidateFunction } from 'ajv'

export const customErrorMessages = {
  required: 'Este é um campo obrigatório',
  properties: {
    email: 'Este e-mail é inválido'
  }
}

export const validate: Validation = (ajvValidate: ValidateFunction<unknown>) => fields => {
  ajvValidate(fields)
  if (!ajvValidate.errors) return undefined
  const messages = ajvValidate.errors
    .filter(error => error.keyword === 'errorMessage')
    .map(error => {
      const keyword = error.params.errors[0].keyword
      const message = error.message ?? ''
      return { keyword, message }
    })
  return ajvValidate.errors
    .filter(error => error.keyword !== 'errorMessage')
    .map(error => {
      const params = error.params
      const keyword = error.keyword
      const message = messages.find(x => x.keyword === keyword)?.message ?? ''
      switch (keyword) {
        case 'format':
          return { field: params.format, message }
        default:
          return { field: params.missingProperty, message }
      }
    })
}
