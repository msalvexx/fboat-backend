import { Permission } from '@/iam/domain/model'
import { Controller } from '@/shared/domain/protocols/controller'
import { AccountToAuthorMapperController, AuthorizationController, MethodHandler, ServiceHandlerController, TokenCertifierController, FileUploadController } from '@/shared/controllers'

import { makeAuthenticationService } from '@/main/factories'

export class ControllerBuilder {
  private instance: Controller
  private next: Controller
  private statusCode: number = 200

  private constructor (private readonly context: Object) {}

  static of (service: Object): ControllerBuilder {
    return new ControllerBuilder(service)
  }

  service (method: MethodHandler): Controller {
    this.addHandler(new ServiceHandlerController(method, this.context, this.statusCode))
    return this.instance
  }

  tokenCertifier (): ControllerBuilder {
    this.addHandler(new TokenCertifierController(makeAuthenticationService()))
    return this
  }

  authorization (permission: Permission): ControllerBuilder {
    this.addHandler(new AuthorizationController(permission))
    return this
  }

  fileUpload (): ControllerBuilder {
    this.addHandler(new FileUploadController())
    return this
  }

  accountToAuthor (): ControllerBuilder {
    this.addHandler(new AccountToAuthorMapperController())
    return this
  }

  onSuccess (statusCode: number): ControllerBuilder {
    this.statusCode = statusCode
    return this
  }

  private addHandler (handler: Controller): void {
    if (this.instance === undefined) this.instance = handler
    else this.next.setNext(handler)
    this.next = handler
  }
}
