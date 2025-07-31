import { json, type MetaFunction } from '@remix-run/cloudflare';
import { Link } from '@remix-run/react';

export const meta: MetaFunction = () => {
  return [
    { title: 'UpTax Flow - AI-Powered Workflow Automation' }, 
    { name: 'description', content: 'UpTax Flow - Create and manage AI-powered business workflows' }
  ];
};

export const loader = () => json({});

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-6">
            UpTax Flow
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            AI-Powered Workflow Automation Platform
          </p>
          <p className="text-lg text-gray-500 mb-12 max-w-3xl mx-auto">
            Create, deploy, and manage intelligent business workflows with our visual programming interface. 
            Connect to your favorite business systems and let AI help automate your processes.
          </p>
          
          <div className="flex justify-center space-x-4 mb-16">
            <Link
              to="/chat"
              className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              🤖 Try Chat
            </Link>
            <Link
              to="/dashboard"
              className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold border border-indigo-600 hover:bg-indigo-50 transition-colors"
            >
              Dashboard
            </Link>
            <Link
              to="/integrations"
              className="bg-gray-100 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              Integrations
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="text-indigo-600 text-3xl mb-4">🤖</div>
              <h3 className="text-xl font-semibold mb-2">AI-Powered</h3>
              <p className="text-gray-600">
                Intelligent workflows that learn and adapt to your business needs
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="text-indigo-600 text-3xl mb-4">🔗</div>
              <h3 className="text-xl font-semibold mb-2">MCP Integration</h3>
              <p className="text-gray-600">
                Connect to Omie, Nibo, and other business systems seamlessly
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="text-indigo-600 text-3xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold mb-2">Real-time</h3>
              <p className="text-gray-600">
                Deploy workflows instantly to Cloudflare's global edge network
              </p>
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <p className="text-sm text-gray-500 mb-4">Demo Credentials for Testing:</p>
            <div className="bg-gray-100 p-4 rounded-lg inline-block">
              <p className="font-mono text-sm">
                Email: <strong>demo@uptax.com.br</strong><br />
                Password: <strong>demo123</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
