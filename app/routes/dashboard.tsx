import { json, type LoaderFunctionArgs } from '@remix-run/cloudflare'
import { useLoaderData, Link, Form } from '@remix-run/react'
import { createSessionStorage, requireUser } from '~/lib/auth/session'
import { DEFAULT_MCP_SERVERS } from '~/lib/integrations/mcp-config'
import MCPStatusPanel from '~/components/dashboard/MCPStatusPanel'

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
  
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">UpTax Flow Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                Welcome, {user.name || user.email}
              </span>
              <Form method="post" action="/auth/logout">
                <button
                  type="submit"
                  className="text-gray-500 hover:text-gray-700"
                >
                  Logout
                </button>
              </Form>
            </div>
          </div>
        </div>
      </nav>
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome to UpTax Flow</h2>
            <p className="text-gray-600">
              AI-powered workflow automation platform with real-time MCP integrations
            </p>
          </div>

          {/* MCP Status Panel */}
          <div className="mb-8">
            <MCPStatusPanel servers={mcpServers} />
          </div>
          
          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">🚀 Create Workflow</h3>
              <p className="text-gray-600 mb-4">
                Build new automation workflows with AI assistance
              </p>
              <Link
                to="/workflows/new"
                className="text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Get Started →
              </Link>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">🔗 MCP Integrations</h3>
              <p className="text-gray-600 mb-4">
                Connect to Omie, Nibo, and test business system tools
              </p>
              <Link
                to="/integrations"
                className="text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Configure & Test →
              </Link>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">📊 Analytics</h3>
              <p className="text-gray-600 mb-4">
                Monitor workflow performance and system metrics
              </p>
              <Link
                to="/analytics"
                className="text-indigo-600 hover:text-indigo-700 font-medium"
              >
                View Reports →
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}