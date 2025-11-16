import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Theme = 'dark' | 'light' | 'system'
type ResolvedTheme = 'dark' | 'light'

interface ThemeState {
  theme: ResolvedTheme
  setTheme: (theme: Theme) => void
}

function applyTheme(theme: Theme) {
  const root = window.document.documentElement
  root.classList.remove('light', 'dark')

  if (theme === 'system') {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
      .matches
      ? 'dark'
      : 'light'
    root.classList.add(systemTheme)
  } else {
    root.classList.add(theme)
  }
}

export const useThemeStore = create<ThemeState>()(
  persist(
    set => ({
      theme: getInitialTheme(),
      setTheme: (theme: Theme) => {
        const resolvedTheme = theme === 'system' ? getSystemTheme() : theme
        applyTheme(theme)
        set({ theme: resolvedTheme })
      },
    }),
    {
      name: 'vite-ui-theme',
      onRehydrateStorage: () => state => {
        // Aplica o tema quando o estado é restaurado do localStorage
        if (state) {
          applyTheme(state.theme)
        }
      },
    },
  ),
)

function getSystemTheme(): 'dark' | 'light' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

function getInitialTheme(): 'dark' | 'light' {
  return getSystemTheme()
}
