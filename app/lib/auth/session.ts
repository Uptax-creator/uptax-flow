/**
 * Session management for UpTax Flow
 */

import { createCookieSessionStorage } from '@remix-run/cloudflare'
import { defaultAuthConfig } from './config'

export interface User {
  id: string
  email: string
  name?: string
  avatar?: string
  role: 'admin' | 'user' | 'viewer'
  createdAt: Date
  lastLogin: Date
}

export interface SessionData {
  user: User
  accessToken?: string
  refreshToken?: string
}

export function createSessionStorage(secret?: string) {
  return createCookieSessionStorage({
    cookie: {
      name: '__session',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: defaultAuthConfig.sessionDuration,
      secrets: [secret || defaultAuthConfig.sessionSecret],
    }
  })
}

export async function createUserSession(
  sessionStorage: ReturnType<typeof createSessionStorage>,
  user: User,
  redirectTo: string
) {
  const session = await sessionStorage.getSession()
  session.set('user', user)
  
  return new Response(null, {
    status: 302,
    headers: {
      Location: redirectTo,
      'Set-Cookie': await sessionStorage.commitSession(session),
    },
  })
}

export async function getUserFromSession(
  sessionStorage: ReturnType<typeof createSessionStorage>,
  request: Request
): Promise<User | null> {
  const session = await sessionStorage.getSession(
    request.headers.get('Cookie')
  )
  
  const user = session.get('user')
  if (!user) return null
  
  return user
}

export async function requireUser(
  sessionStorage: ReturnType<typeof createSessionStorage>,
  request: Request,
  redirectTo: string = '/login'
): Promise<User> {
  const user = await getUserFromSession(sessionStorage, request)
  
  if (!user) {
    throw new Response(null, {
      status: 302,
      headers: {
        Location: `${redirectTo}?from=${encodeURIComponent(
          new URL(request.url).pathname
        )}`,
      },
    })
  }
  
  return user
}

export async function logout(
  sessionStorage: ReturnType<typeof createSessionStorage>,
  request: Request
) {
  const session = await sessionStorage.getSession(
    request.headers.get('Cookie')
  )
  
  return new Response(null, {
    status: 302,
    headers: {
      Location: '/',
      'Set-Cookie': await sessionStorage.destroySession(session),
    },
  })
}