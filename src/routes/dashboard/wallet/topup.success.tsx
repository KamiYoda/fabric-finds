import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/wallet/topup/success')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/wallet/topup/success"!</div>
}
