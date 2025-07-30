import { json, type ActionFunctionArgs, type LoaderFunctionArgs } from '@remix-run/cloudflare'
import { Form, useActionData, useSearchParams } from '@remix-run/react'
import { createSessionStorage, createUserSession, getUserFromSession } from '~/lib/auth/session'
import { defaultAuthConfig } from '~/lib/auth/config'

export async function loader({ request, context }: LoaderFunctionArgs) {
  const sessionStorage = createSessionStorage(context.cloudflare.env.AUTH_SECRET)
  const user = await getUserFromSession(sessionStorage, request)
  
  if (user) {
    return new Response(null, {
      status: 302,
      headers: {
        Location: defaultAuthConfig.redirectUrl,
      },
    })
  }
  
  return json({})
}

export async function action({ request, context }: ActionFunctionArgs) {
  const sessionStorage = createSessionStorage(context.cloudflare.env.AUTH_SECRET)
  const formData = await request.formData()
  const email = formData.get('email')
  const password = formData.get('password')
  
  // TODO: Implement actual authentication logic
  // For now, we'll create a mock user for demonstration
  if (email === 'demo@uptax.com.br' && password === 'demo123') {
    const user = {
      id: '1',
      email: 'demo@uptax.com.br',
      name: 'Demo User',
      role: 'user' as const,
      createdAt: new Date(),
      lastLogin: new Date(),
    }
    
    const searchParams = new URL(request.url).searchParams
    const redirectTo = searchParams.get('from') || defaultAuthConfig.redirectUrl
    
    return createUserSession(sessionStorage, user, redirectTo)
  }
  
  return json(
    { error: 'Invalid email or password' } as const,
    { status: 400 }
  )
}

export default function LoginPage() {
  const actionData = useActionData<typeof action>()
  const [searchParams] = useSearchParams()
  const from = searchParams.get('from') || defaultAuthConfig.redirectUrl
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to UpTax Flow
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Use demo@uptax.com.br / demo123 for testing
          </p>
        </div>
        
        <Form method="post" className="mt-8 space-y-6">
          <input type="hidden" name="redirectTo" value={from} />
          
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>
          
          {(actionData as any)?.error && (
            <div className="text-red-600 text-sm text-center">
              {(actionData as any).error}
            </div>
          )}
          
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign in
            </button>
          </div>
        </Form>
      </div>
    </div>
  )
}