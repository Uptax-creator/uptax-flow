import { json, type LoaderFunctionArgs } from '@remix-run/cloudflare'
import { useLoaderData, Link, Form } from '@remix-run/react'
import { createSessionStorage, requireUser } from '~/lib/auth/session'
import { DEFAULT_MCP_SERVERS } from '~/lib/integrations/mcp-config'
import MCPStatusPanel from '~/components/dashboard/MCPStatusPanel'
import ModernDashboard from '~/components/ui/ModernDashboard'

export async function loader({ request, context }: LoaderFunctionArgs) {
  const sessionStorage = createSessionStorage(context.cloudflare.env.AUTH_SECRET)
  const user = await requireUser(sessionStorage, request)
  
  return json({ 
    user,
    mcpServers: DEFAULT_MCP_SERVERS
  })
}

export default function Dashboard() {
  const { user, mcpServers } = useLoaderData<typeof loader>()
  
  // Check if OpenRouter is configured (from credentials.json)
  const openRouterApiKey = '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' // From credentials.json
  
  return <ModernDashboard openRouterApiKey={openRouterApiKey} />
}