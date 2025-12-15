import { createFileRoute } from '@tanstack/react-router'
import Day from '@/components/day/index'
import dayCss from '@/components/day/index.css?url'

export const Route = createFileRoute('/day')({
  loader: () => {
    return {
      today: new Date().toISOString(),
    }
  },
  head: () => ({
    links: [
      {
        rel: 'stylesheet',
        href: dayCss,
      },
    ],
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const { today } = Route.useLoaderData()
  return (
    <div>
      <Day today={new Date(today)} />
    </div>
  )
}
