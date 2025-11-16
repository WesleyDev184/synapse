import { useAuth } from '@/hooks/use-auth'
import { UserRole } from '@/http/auth/dto/auth.dto'
import { Link } from '@tanstack/react-router'
import AuthDropdown from './auth-dropdpwn'
import { ModeToggle } from './mode-toggle'
import { Notifications } from './notifications'

export default function Header() {
  const { user } = useAuth()

  return (
    <header className='px-3 sm:px-6 flex gap-2 bg-muted justify-between border-b border-border h-14 sm:h-16 rounded-md'>
      <nav className='font-bold text-primary flex flex-row items-center gap-2'>
        <div className='flex items-center gap-1 sm:gap-2 font-bold bg-linear-to-r from-blue-400 to-primary bg-clip-text text-transparent'>
          <Link to='/' className='flex gap-1 sm:gap-2 items-center'>
            <img
              src='/logo.png'
              alt='Logo'
              className='inline w-8 sm:w-10 rounded-full'
            />
            <span className='text-sm sm:text-base'>Synapse</span>
          </Link>
        </div>
      </nav>
      {user?.role === UserRole.ADMIN && (
        <div className='flex items-center justify-center gap-4'>
          <Link
            to='/admin'
            className='text-sm sm:text-base font-medium text-primary hover:underline'
          >
            Solicitações
          </Link>
          <Link
            to='/admin/invites'
            className='text-sm sm:text-base font-medium text-primary hover:underline'
          >
            Convites
          </Link>
          <Link
            to='/admin/users'
            className='text-sm sm:text-base font-medium text-primary hover:underline'
          >
            Usuários
          </Link>
        </div>
      )}
      <div className='flex items-center justify-center gap-1 sm:gap-2'>
        <ModeToggle />
        <Notifications />
        <AuthDropdown />
      </div>
    </header>
  )
}
