import { UserRoundIcon } from 'lucide-react'

import { useAuth } from '@/hooks/use-auth'
import { ROLE_LABELS, USER_STATUS_LABELS } from '@/utils/label-convert'
import { Link } from '@tanstack/react-router'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

export default function AuthDropdown() {
  const { logout, user } = useAuth()

  if (!user) {
    return null
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='outline'
          size='icon'
          className='h-8 w-8 sm:h-10 sm:w-10'
        >
          <UserRoundIcon
            className='h-4 w-4 sm:h-5 sm:w-5 text-primary'
            aria-hidden='true'
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='end'>
        <DropdownMenuLabel className='text-sm'>
          Conta de {user.name}
        </DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem disabled>
            <div className='flex flex-col'>
              <span className='font-medium'>E-mail</span>
              <span className='text-sm text-muted-foreground'>
                {user.email}
              </span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem disabled>
            <div className='flex flex-col'>
              <span className='font-medium'>Nome</span>
              <span className='text-sm text-muted-foreground'>{user.name}</span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem disabled>
            <div className='flex flex-col'>
              <span className='font-medium'>Empresa</span>
              <span className='text-sm text-muted-foreground'>
                {user.company}
              </span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem disabled>
            <div className='flex flex-col'>
              <span className='font-medium'>Cargo</span>
              <span className='text-sm text-muted-foreground'>
                {ROLE_LABELS[user.role]}
              </span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem disabled>
            <div className='flex flex-col'>
              <span className='font-medium'>Status</span>
              <span className='text-sm text-muted-foreground'>
                {USER_STATUS_LABELS[user.status]}
              </span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem disabled>
            <div className='flex flex-col'>
              <span className='font-medium'>Membro desde</span>
              <span className='text-sm text-muted-foreground'>
                {formatDate(user.createdAt)}
              </span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem disabled>
            <div className='flex flex-col'>
              <span className='font-medium'>Última atualização</span>
              <span className='text-sm text-muted-foreground'>
                {formatDate(user.updatedAt)}
              </span>
            </div>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link
            to='.'
            href='https://github.com/WesleyDev184/fullstack-challenge'
          >
            GitHub
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link to='.' href='https://wadev.com.br'>
            Suporte
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Button
            variant='outline'
            size='default'
            className='w-full text-destructive'
            onClick={logout}
          >
            Sair
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
