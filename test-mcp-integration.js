#!/usr/bin/env node

/**
 * UpTax Flow - MCP Integration Test
 * 
 * Este script testa se os servidores MCP estão rodando e acessíveis
 * Deve ser executado após iniciar os servidores Omie e Nibo MCP
 */

const fetch = require('node-fetch');

const MCP_SERVERS = [
  {
    name: 'Omie FastMCP',
    endpoint: 'http://localhost:3000',
    tools: ['consultar_categorias', 'listar_clientes', 'consultar_contas_pagar']
  },
  {
    name: 'Nibo MCP', 
    endpoint: 'http://localhost:3001',
    tools: ['listar_empresas', 'consultar_financeiro']
  }
];

async function testHealthCheck(server) {
  try {
    console.log(`🔍 Testing ${server.name} health...`);
    const response = await fetch(`${server.endpoint}/health`, {
      method: 'GET',
      timeout: 5000
    });
    
    if (response.ok) {
      console.log(`✅ ${server.name} is healthy (${response.status})`);
      return true;
    } else {
      console.log(`❌ ${server.name} health check failed (${response.status})`);
      return false;
    }
  } catch (error) {
    console.log(`❌ ${server.name} connection failed: ${error.message}`);
    return false;
  }
}

async function testToolExecution(server, toolName) {
  try {
    console.log(`🧪 Testing ${server.name} tool: ${toolName}`);
    
    // Basic test parameters for different tools
    const testParams = {
      consultar_categorias: { pagina: 1, registros_por_pagina: 5 },
      listar_clientes: { filtro: "" },
      consultar_contas_pagar: { status_titulo: "todos" },
      listar_empresas: {},
      consultar_financeiro: { empresa_id: "1" }
    };
    
    const response = await fetch(`${server.endpoint}/tools/${toolName}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testParams[toolName] || {}),
      timeout: 10000
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log(`✅ Tool ${toolName} executed successfully`);
      console.log(`   📊 Response: ${JSON.stringify(result).substring(0, 100)}...`);
      return true;
    } else {
      const errorText = await response.text();
      console.log(`❌ Tool ${toolName} failed (${response.status}): ${errorText.substring(0, 100)}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Tool ${toolName} execution failed: ${error.message}`);
    return false;
  }
}

async function runTests() {
  console.log('\n🚀 UpTax Flow - MCP Integration Test');
  console.log('=====================================\n');
  
  let healthyServers = 0;
  let totalTools = 0;
  let workingTools = 0;
  
  for (const server of MCP_SERVERS) {
    console.log(`\n📡 Testing ${server.name}`);
    console.log('─'.repeat(40));
    
    const isHealthy = await testHealthCheck(server);
    if (isHealthy) {
      healthyServers++;
      
      // Test a few key tools
      const toolsToTest = server.tools.slice(0, 2); // Test first 2 tools
      
      for (const tool of toolsToTest) {
        totalTools++;
        const toolWorking = await testToolExecution(server, tool);
        if (toolWorking) {
          workingTools++;
        }
        
        // Wait between tool tests
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  // Summary
  console.log('\n📋 Test Summary');
  console.log('================');
  console.log(`🖥️  Healthy Servers: ${healthyServers}/${MCP_SERVERS.length}`);
  console.log(`🔧 Working Tools: ${workingTools}/${totalTools}`);
  console.log(`📊 Success Rate: ${totalTools > 0 ? Math.round((workingTools / totalTools) * 100) : 0}%`);
  
  if (healthyServers === MCP_SERVERS.length && workingTools === totalTools) {
    console.log('\n🎉 All systems operational! UpTax Flow is ready to use.');
    process.exit(0);
  } else {
    console.log('\n⚠️  Some issues detected. Check your MCP servers:');
    console.log('   • Make sure Omie MCP is running on localhost:3000');
    console.log('   • Make sure Nibo MCP is running on localhost:3001');
    console.log('   • Check credentials.json configuration');
    console.log('   • Verify network connectivity');
    process.exit(1);
  }
}

// Run the tests
runTests().catch(error => {
  console.error('\n💥 Test execution failed:', error);
  process.exit(1);
});