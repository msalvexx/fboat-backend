export class User {
  private readonly roles: Set<Role> = new Set<Role>()

  constructor (
    private readonly name: string,
    private readonly email: string,
    private readonly login: string,
    private readonly password: string
  ) {}

  addRole (role: Role): void {
    this.roles.add(role)
  }

  hasRole (role: Role): boolean {
    return this.roles.has(role)
  }

  hasFeature (feature: Feature): boolean {
    const features = Array.from(this.roles).flatMap(x => x.features)
    return features.includes(feature)
  }
}

type Feature = string

export class Role {
  features: string[] = []

  constructor (private readonly name: string) {}

  addFeature (feature: Feature): void {
    this.features.push(feature)
  }
}

describe('When add role to user', () => {
  test('Should add role if user not have role yet', () => {
    const user = new User('user', 'user@mail.com', 'teste123', '123')
    const role = new Role('Author')

    user.addRole(role)

    expect(user.hasRole(role)).toBeTruthy()
  })

  test('User should has feature if user has role that contains feature', () => {
    const user = new User('user', 'user@mail.com', 'teste123', '123')
    const role1 = new Role('Author')
    const role2 = new Role('Maintainer')
    const feature = 'WriteArticle'
    role1.addFeature(feature)
    role2.addFeature(feature)

    user.addRole(role1)
    user.addRole(role2)

    expect(user.hasFeature(feature)).toBeTruthy()
  })

  test('User should not has feature if user not has any role that contains feature', () => {
    const user = new User('user', 'user@mail.com', 'teste123', '123')
    const role1 = new Role('Author')
    const role2 = new Role('Maintainer')
    const feature = 'WriteArticle'
    role1.addFeature(feature)
    role2.addFeature(feature)

    user.addRole(role1)
    user.addRole(role2)

    expect(user.hasFeature('ReadArticle')).toBeFalsy()
  })
})
