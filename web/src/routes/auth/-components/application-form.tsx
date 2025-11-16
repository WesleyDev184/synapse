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
import { Textarea } from '@/components/ui/textarea'
import { useApplicationIntentionMutation } from '@/http/application/application.query'
import {
  applicationIntentionSchema,
  type ApplicationIntentionFormData,
} from '@/http/application/dto/application.dto'
import { cn } from '@/utils/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

export function ApplicationIntentionForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const navigate = useNavigate()
  const applicationMutation = useApplicationIntentionMutation()

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ApplicationIntentionFormData>({
    resolver: zodResolver(applicationIntentionSchema),
  })

  const onSubmit = async (data: ApplicationIntentionFormData) => {
    try {
      await applicationMutation.mutateAsync(data)
      toast.success('Solicitação enviada com sucesso!')
      reset()
      navigate({ to: '/auth/login' })
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || 'Erro ao enviar solicitação')
      } else {
        toast.error('Erro desconhecido ao enviar solicitação')
      }
    }
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader className='text-center'>
          <CardTitle className='text-2xl'>Solicitação de Acesso</CardTitle>
          <CardDescription>
            Preencha o formulário abaixo para solicitar acesso ao Synapse
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
                  disabled={isSubmitting}
                  {...register('email')}
                />
                {errors.email && (
                  <FieldDescription className='text-destructive'>
                    {errors.email.message}
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

            <FieldGroup>
              <Field>
                <FieldLabel htmlFor='reason'>Motivo da Solicitação</FieldLabel>
                <Textarea
                  id='reason'
                  placeholder='Descreva por que gostaria de usar o Synapse (mínimo 10 caracteres)'
                  disabled={isSubmitting}
                  className='min-h-24'
                  {...register('reason')}
                />
                {errors.reason && (
                  <FieldDescription className='text-destructive'>
                    {errors.reason.message}
                  </FieldDescription>
                )}
              </Field>
            </FieldGroup>

            <Button
              type='submit'
              className='w-full'
              disabled={isSubmitting || applicationMutation.isPending}
            >
              {isSubmitting || applicationMutation.isPending
                ? 'Enviando...'
                : 'Enviar Solicitação'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
