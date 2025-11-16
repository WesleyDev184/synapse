import { useThemeStore } from '@/stores/theme-store'
import { useEffect } from 'react'

/**
 * Componente para inicializar o tema na montagem da aplicação
 * Aplica o tema salvo no Zustand persist ao DOM
 */
export function ThemeInitializer() {
  const theme = useThemeStore(state => state.theme)

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
  }, [theme])

  return null
}
