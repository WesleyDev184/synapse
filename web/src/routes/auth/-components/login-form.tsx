import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/hooks/use-auth'
import { loginSchema, type LoginFormData } from '@/http/auth/dto/auth.dto'
import { cn } from '@/utils/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from '@tanstack/react-router'
import { parseAsBoolean, parseAsString, useQueryState } from 'nuqs'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useQueryState(
    'isLoading',
    parseAsBoolean.withDefault(false),
  )
  const [error, setError] = useQueryState('error', parseAsString)
  const [postRegister] = useQueryState('postRegister')

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    await setIsLoading(true)
    await setError(null)

    try {
      await login(data)
      reset()
      toast.success('Login successful!')
      navigate({
        to: '/',
      })
    } catch (err) {
      await setError('Login failed. Please check your credentials.')
      await setIsLoading(false)
    }
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader className='text-center'>
          <CardTitle className='text-xl'>
            {postRegister === 'true'
              ? 'Conta criada com sucesso!'
              : 'Bem-vindo de volta'}
          </CardTitle>
          <CardDescription>
            {postRegister === 'true'
              ? 'Faça seu primeiro login para continuar'
              : 'Entre com sua conta para continuar'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <FieldSeparator className='*:data-[slot=field-separator-content]:bg-card'>
                Coloque o login abaixo
              </FieldSeparator>
              <Field>
                <FieldLabel htmlFor='email'>Email</FieldLabel>
                <Input
                  id='email'
                  type='email'
                  placeholder='m@example.com'
                  {...register('email')}
                />
                {errors.email && (
                  <FieldDescription className='text-red-500'>
                    {errors.email.message}
                  </FieldDescription>
                )}
              </Field>
              <Field>
                <div className='flex items-center'>
                  <FieldLabel htmlFor='password'>Senha</FieldLabel>
                  <a
                    href='#'
                    className='ml-auto text-sm underline-offset-4 hover:underline'
                  >
                    Esqueceu sua senha?
                  </a>
                </div>
                <Input
                  id='password'
                  type='password'
                  placeholder='*********'
                  {...register('password')}
                />
                {errors.password && (
                  <FieldDescription className='text-red-500'>
                    {errors.password.message}
                  </FieldDescription>
                )}
              </Field>
              {error && (
                <FieldDescription className='text-red-500'>
                  {error}
                </FieldDescription>
              )}
              <Field>
                <Button type='submit' className='w-full' disabled={isLoading}>
                  {isLoading ? 'Logging in...' : 'Login'}
                </Button>
                <FieldDescription className='text-center'>
                  Não tem uma conta?{' '}
                  <Link
                    to='/auth/application'
                    className='underline underline-offset-4'
                  >
                    Cadastre-se
                  </Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className='px-6 text-center'>
        Ao clicar em continuar, você concorda com nossos{' '}
        <a href='#' className='underline underline-offset-4'>
          Termos de Serviço
        </a>{' '}
        e{' '}
        <a href='#' className='underline underline-offset-4'>
          Política de Privacidade
        </a>
        .
      </FieldDescription>
    </div>
  )
}
