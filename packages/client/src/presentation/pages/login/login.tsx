import React, { useEffect } from 'react'
import Styles from './login-styles.scss'
import { useRecoilState, useRecoilValue } from 'recoil'
import { useNavigate } from 'react-router-dom'

import { Validator } from '@/client/presentation/protocols'
import { AuthenticateUser } from '@fboat/core/iam/protocols'

import { Input, SubmitButton, FormStatus, Footer, Header, currentAccountState } from '@/client/presentation/components'
import { ForgotPassword, loginState } from './components'

type Props = {
  validator: Validator
  service: AuthenticateUser
}

const Login: React.FC<Props> = ({ validator, service }) => {
  const [state, setState] = useRecoilState(loginState)
  const { setCurrentAccount } = useRecoilValue(currentAccountState)

  const navigate = useNavigate()

  useEffect(() => validate(), [state.email])
  useEffect(() => validate(), [state.password])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    setState({ ...state, wasSubmitted: true })
    if (state.isFormInvalid || state.isLoading) return
    setState({ ...state, isLoading: true })
    const { email, password } = state
    let newState = {}
    try {
      const account = await service?.authenticate({ email, password })
      setCurrentAccount({
        ...account,
        email,
        name: account.personName
      })
      navigate('/')
    } catch (error) {
      newState = { mainError: error.message, isLoading: false }
    } finally {
      setState(old => ({ ...old, ...newState }))
    }
  }

  const validate = (): void => {
    const { email, password } = state
    const errors = validator({ email, password })
    const newState: any = { emailError: '', passwordError: '' }
    errors?.forEach(({ field, message }) => (newState[`${field}Error`] = message))
    const isFormInvalid = !!newState.emailError || !!newState.passwordError
    setState(old => ({ ...old, ...newState, isFormInvalid }))
  }

  return (
    <>
    <div className={Styles.login}>
      <Header/>
      <section>
       <div>
        <div>
          <h3>Bem vindo de volta!</h3>
          <form data-testid='form' className={Styles.form} onSubmit={handleSubmit}>
            <Input state={state} setState={setState} type='text' name='email' placeholder='e-mail'/>
            <Input state={state} setState={setState} type='password' name='password' placeholder='senha'/>
            <SubmitButton text='Entrar'></SubmitButton>
            <FormStatus state={state}/>
            <ForgotPassword/>
          </form>
        </div>
       </div>
      </section>
    </div>
    <Footer/>
    </>
  )
}

export default Login
