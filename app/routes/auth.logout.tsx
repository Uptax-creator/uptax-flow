import type { ActionFunctionArgs } from '@remix-run/cloudflare'
import { createSessionStorage, logout } from '~/lib/auth/session'

export async function action({ request, context }: ActionFunctionArgs) {
  const sessionStorage = createSessionStorage(context.cloudflare.env.AUTH_SECRET)
  return logout(sessionStorage, request)
}

export async function loader() {
  return new Response(null, {
    status: 302,
    headers: {
      Location: '/',
    },
  })
}