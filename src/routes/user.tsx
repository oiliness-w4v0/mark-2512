import { createFileRoute } from '@tanstack/react-router'
import UserInfo from '@/components/UserInfo'

export const Route = createFileRoute('/user')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>
    <UserInfo />
  </div>
}
