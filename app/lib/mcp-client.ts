/**
 * MCP Client for UpTax Flow
 * Baseado na análise do thomasgpeters/mcp-client
 */

export interface MCPServer {
  name: string;
  endpoint: string;
  status: 'connected' | 'disconnected' | 'error';
  tools: MCPTool[];
}

export interface MCPTool {
  name: string;
  description: string;
  category: string;
  parameters: Record<string, any>;
}

export interface MCPResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export class MCPClient {
  private servers: Map<string, MCPServer> = new Map();
  
  // Configuração dos servidores MCP da UpTax
  private readonly serverConfigs = {
    omie: { endpoint: 'http://localhost:3000', name: 'Omie FastMCP' },
    nibo: { endpoint: 'http://localhost:3001', name: 'Nibo MCP' },
    unified: { endpoint: 'http://localhost:3000', name: 'UpTax Unified MCP' }
  };
  
  constructor() {}

  /**
   * Descobrir e conectar com servidores MCP
   */
  async discoverServers(): Promise<MCPServer[]> {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      const data = await response.json();
      
      if (data.status === 'healthy') {
        const server: MCPServer = {
          name: 'UpTax Unified MCP',
          endpoint: this.baseUrl,
          status: 'connected',
          tools: []
        };
        
        // Buscar ferramentas disponíveis
        server.tools = await this.getServerTools();
        this.servers.set('unified', server);
        
        return [server];
      }
      
      return [];
    } catch (error) {
      console.error('Erro ao descobrir servidores MCP:', error);
      return [];
    }
  }

  /**
   * Obter ferramentas de um servidor MCP
   */
  async getServerTools(): Promise<MCPTool[]> {
    try {
      const response = await fetch(`${this.baseUrl}/tools`);
      const data = await response.json();
      
      return data.tools?.map((tool: any) => ({
        name: tool.name,
        description: tool.description,
        category: tool.category || 'general',
        parameters: tool.parameters || {}
      })) || [];
    } catch (error) {
      console.error('Erro ao buscar ferramentas:', error);
      return [];
    }
  }

  /**
   * Executar uma ferramenta MCP
   */
  async executeToolCall(toolName: string, parameters: Record<string, any>): Promise<MCPResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tool: toolName,
          parameters
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        data
      };
    } catch (error) {
      console.error(`Erro ao executar ferramenta ${toolName}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  }

  /**
   * Obter status de conectividade
   */
  async getConnectionStatus(): Promise<Record<string, 'connected' | 'disconnected' | 'error'>> {
    const status: Record<string, 'connected' | 'disconnected' | 'error'> = {};
    
    for (const [name, server] of this.servers) {
      try {
        const response = await fetch(`${server.endpoint}/health`);
        status[name] = response.ok ? 'connected' : 'error';
      } catch {
        status[name] = 'disconnected';
      }
    }
    
    return status;
  }

  /**
   * Obter servidor por nome
   */
  getServer(name: string): MCPServer | undefined {
    return this.servers.get(name);
  }

  /**
   * Listar todos os servidores
   */
  getAllServers(): MCPServer[] {
    return Array.from(this.servers.values());
  }
}

// Instância singleton
export const mcpClient = new MCPClient();