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
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  completeRegistrationSchema,
  type CompleteRegistrationFormData,
} from '@/http/invites/dto/invites.dto'
import {
  inviteDataQueryOptions,
  useCompleteRegistrationMutation,
} from '@/http/invites/invites.query'
import { cn } from '@/utils/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

interface CompleteRegistrationFormProps {
  token: string
  className?: string
}

export function CompleteRegistrationForm({
  token,
  className,
  ...props
}: CompleteRegistrationFormProps & React.ComponentProps<'div'>) {
  const navigate = useNavigate()
  const completeRegistrationMutation = useCompleteRegistrationMutation()
  const { data: inviteData } = useSuspenseQuery(inviteDataQueryOptions(token))

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CompleteRegistrationFormData>({
    resolver: zodResolver(completeRegistrationSchema),
    defaultValues: {
      name: inviteData.application.name,
      email: inviteData.email,
      company: inviteData.application.company,
      password: '',
    },
  })

  const onSubmit = async (data: CompleteRegistrationFormData) => {
    try {
      await completeRegistrationMutation.mutateAsync({
        token,
        data,
      })
      toast.success('Cadastro finalizado com sucesso!')
      navigate({ to: '/auth/login' })
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || 'Erro ao finalizar cadastro')
      } else {
        toast.error('Erro desconhecido ao finalizar cadastro')
      }
    }
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader className='text-center'>
          <CardTitle className='text-2xl'>Finalizar Cadastro</CardTitle>
          <CardDescription>
            Complete seu cadastro preenchendo os dados abaixo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='flex flex-col gap-4'
          >
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor='name'>Nome</FieldLabel>
                <Input
                  id='name'
                  type='text'
                  placeholder='João Silva'
                  autoComplete='name'
                  disabled={isSubmitting}
                  {...register('name')}
                />
                {errors.name && (
                  <FieldDescription className='text-destructive'>
                    {errors.name.message}
                  </FieldDescription>
                )}
              </Field>
            </FieldGroup>

            <FieldGroup>
              <Field>
                <FieldLabel htmlFor='email'>Email</FieldLabel>
                <Input
                  id='email'
                  type='email'
                  placeholder='exemplo@empresa.com'
                  autoComplete='email'
                  disabled={true}
                  {...register('email')}
                />
                <FieldDescription>Email não pode ser alterado</FieldDescription>
              </Field>
            </FieldGroup>

            <FieldGroup>
              <Field>
                <FieldLabel htmlFor='password'>Senha</FieldLabel>
                <Input
                  id='password'
                  type='password'
                  placeholder='Crie uma senha segura'
                  autoComplete='new-password'
                  disabled={isSubmitting}
                  {...register('password')}
                />
                {errors.password && (
                  <FieldDescription className='text-destructive'>
                    {errors.password.message}
                  </FieldDescription>
                )}
                {!errors.password && (
                  <FieldDescription className='text-xs text-muted-foreground'>
                    A senha deve conter pelo menos 8 caracteres, incluindo
                    maiúscula, minúscula, número e caractere especial (@$!%*?&)
                  </FieldDescription>
                )}
              </Field>
            </FieldGroup>

            <FieldGroup>
              <Field>
                <FieldLabel htmlFor='company'>Empresa</FieldLabel>
                <Input
                  id='company'
                  type='text'
                  placeholder='Nome da sua empresa'
                  disabled={isSubmitting}
                  {...register('company')}
                />
                {errors.company && (
                  <FieldDescription className='text-destructive'>
                    {errors.company.message}
                  </FieldDescription>
                )}
              </Field>
            </FieldGroup>

            <Button
              type='submit'
              className='w-full'
              disabled={isSubmitting || completeRegistrationMutation.isPending}
            >
              {isSubmitting || completeRegistrationMutation.isPending
                ? 'Finalizando cadastro...'
                : 'Finalizar Cadastro'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
