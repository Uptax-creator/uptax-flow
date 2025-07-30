/**
 * Authentication configuration for UpTax Flow
 */

export interface AuthConfig {
  providers: AuthProvider[]
  sessionSecret: string
  sessionDuration: number
  redirectUrl: string
}

export interface AuthProvider {
  id: string
  name: string
  type: 'oauth' | 'email' | 'credentials'
  enabled: boolean
  config?: Record<string, any>
}

export const defaultAuthConfig: AuthConfig = {
  providers: [
    {
      id: 'google',
      name: 'Google',
      type: 'oauth',
      enabled: false,
      config: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      }
    },
    {
      id: 'github',
      name: 'GitHub',
      type: 'oauth',
      enabled: false,
      config: {
        clientId: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
      }
    },
    {
      id: 'email',
      name: 'Email',
      type: 'email',
      enabled: true,
      config: {
        sendVerificationEmail: true,
      }
    }
  ],
  sessionSecret: process.env.AUTH_SECRET || 'default-secret-change-in-production',
  sessionDuration: 7 * 24 * 60 * 60 * 1000, // 7 days
  redirectUrl: '/dashboard'
}