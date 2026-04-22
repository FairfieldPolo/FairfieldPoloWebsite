import { requireAdminSession } from '@/lib/match-session'

export default async function AdminConsoleLayout({ children }: { children: React.ReactNode }) {
  await requireAdminSession()
  return <>{children}</>
}
