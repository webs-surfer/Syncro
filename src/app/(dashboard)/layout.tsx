import Sidebar from '@/components/layout/Sidebar'
import { TaskStoreProvider } from '@/lib/taskStore'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <TaskStoreProvider>
      <div className="flex h-screen overflow-hidden bg-background text-foreground">
        <Sidebar />
        <div className="flex flex-col flex-1 min-w-0 h-full overflow-y-auto">
          {children}
        </div>
      </div>
    </TaskStoreProvider>
  )
}