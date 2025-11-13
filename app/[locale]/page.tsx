import { redirect } from '@/i18n/routing'

export default function LocaleHomePage() {
  // Redirect to the nerd game which is our main feature
  redirect({ href: '/nerd', locale: 'en' })
}
