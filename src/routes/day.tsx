import { createFileRoute } from '@tanstack/react-router'
import Day from '@/components/day/index'

export const Route = createFileRoute('/day')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>
    <Day />
  </div>
}
