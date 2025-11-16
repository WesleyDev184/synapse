import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { useQueryState } from 'nuqs'

interface FiltersProps {
  onSearchSubmit: (value: string) => void
  onSizeChange: (size: number) => void
}

export function Filters({ onSearchSubmit, onSizeChange }: FiltersProps) {
  const [search, setSearch] = useQueryState('search', {
    defaultValue: '',
    parse: value => value,
    serialize: value => value,
  })

  const [size, setSize] = useQueryState('size', {
    defaultValue: 10,
    parse: value => Number(value),
    serialize: value => String(value),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Submitting search:', search)
    onSearchSubmit(search)
  }

  const handleSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = Number(e.target.value)
    setSize(newSize)
    onSizeChange(newSize)
  }

  return (
    <Card className='p-6 mb-6 border border-border'>
      <div className='space-y-4'>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-foreground mb-2'>
              Pesquisar
            </label>
            <div className='flex gap-2'>
              <Input
                type='text'
                placeholder='Buscar por nome, email ou empresa...'
                value={search}
                onChange={e => setSearch(e.target.value)}
                className='flex-1 bg-background text-foreground border-border placeholder:text-muted-foreground'
              />
              <Button type='submit' size='sm' className='gap-2'>
                <Search className='w-4 h-4' />
                Buscar
              </Button>
            </div>
          </div>
        </form>

        <div className='flex gap-4'>
          <div>
            <label className='block text-sm font-medium text-foreground mb-2'>
              Itens por página
            </label>
            <select
              value={size}
              onChange={handleSizeChange}
              className='px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors'
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
      </div>
    </Card>
  )
}
