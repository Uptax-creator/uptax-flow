/**
 * Neo4j Integration for Business Integration Graph
 * Maps MCP servers, tools, and relationships for intelligent discovery
 */

export interface Neo4jNode {
  id: string
  labels: string[]
  properties: Record<string, any>
}

export interface Neo4jRelationship {
  id: string
  type: string
  startNode: string
  endNode: string
  properties: Record<string, any>
}

export interface Neo4jQuery {
  cypher: string
  parameters?: Record<string, any>
}

export class Neo4jMCPGraph {
  
  // Create Cypher queries for MCP ecosystem
  static generateMCPGraphQueries(): Neo4jQuery[] {
    return [
      // Create MCP Server nodes
      {
        cypher: `
          MERGE (server:MCPServer {id: $serverId})
          SET server.name = $name,
              server.category = $category,
              server.priority = $priority,
              server.endpoint = $endpoint,
              server.businessValue = $businessValue,
              server.complianceLevel = $complianceLevel,
              server.lastUpdated = datetime()
        `,
        parameters: {} // Will be populated dynamically
      },
      
      // Create Tool nodes and relationships
      {
        cypher: `
          MATCH (server:MCPServer {id: $serverId})
          MERGE (tool:MCPTool {id: $toolId})
          SET tool.name = $toolName,
              tool.description = $description,
              tool.category = $category,
              tool.businessImpact = $businessImpact,
              tool.storyPoints = $storyPoints
          MERGE (server)-[:PROVIDES]->(tool)
        `
      },
      
      // Create Tag nodes and relationships
      {
        cypher: `
          MATCH (entity) WHERE entity:MCPServer OR entity:MCPTool
          WITH entity, $tags as tagList
          UNWIND tagList as tagName
          MERGE (tag:Tag {name: tagName})
          MERGE (entity)-[:TAGGED_WITH]->(tag)
        `
      },
      
      // Create integration relationships
      {
        cypher: `
          MATCH (source:MCPServer {id: $sourceId})
          MATCH (target:MCPServer {id: $targetId})
          MERGE (source)-[rel:INTEGRATES_WITH]->(target)
          SET rel.type = $integrationType,
              rel.confidence = $confidence,
              rel.dataFlow = $dataFlow,
              rel.businessReason = $businessReason
        `
      }
    ]
  }
  
  // Discovery queries for intelligent MCP selection
  static getDiscoveryQueries(): Record<string, Neo4jQuery> {
    return {
      
      // Find servers by business capability
      findByCapability: {
        cypher: `
          MATCH (server:MCPServer)-[:TAGGED_WITH]->(tag:Tag)
          WHERE tag.name IN $capabilities
          RETURN server, COUNT(tag) as relevance
          ORDER BY relevance DESC, server.priority DESC
          LIMIT 5
        `
      },
      
      // Find integration paths between domains
      findIntegrationPath: {
        cypher: `
          MATCH path = (source:MCPServer)-[:INTEGRATES_WITH*1..3]->(target:MCPServer)
          WHERE source.category = $sourceCategory 
            AND target.category = $targetCategory
          RETURN path, 
                 LENGTH(path) as pathLength,
                 REDUCE(conf = 1.0, rel in relationships(path) | conf * rel.confidence) as pathConfidence
          ORDER BY pathLength ASC, pathConfidence DESC
          LIMIT 3
        `
      },
      
      // Recommend related tools based on current usage
      recommendTools: {
        cypher: `
          MATCH (usedTool:MCPTool)-[:TAGGED_WITH]->(commonTag:Tag)<-[:TAGGED_WITH]-(recommendedTool:MCPTool)
          WHERE usedTool.id IN $usedToolIds
            AND NOT recommendedTool.id IN $usedToolIds
          WITH recommendedTool, COUNT(commonTag) as commonTags
          MATCH (recommendedTool)<-[:PROVIDES]-(server:MCPServer)
          RETURN recommendedTool, server, commonTags
          ORDER BY commonTags DESC, recommendedTool.businessImpact DESC
          LIMIT 5
        `
      },
      
      // Find servers that complement each other
      findComplementaryServers: {
        cypher: `
          MATCH (server1:MCPServer)-[:INTEGRATES_WITH]->(server2:MCPServer)
          WHERE server1.id = $serverId
          MATCH (server2)-[:TAGGED_WITH]->(tag:Tag)<-[:TAGGED_WITH]-(server3:MCPServer)
          WHERE server3.id <> server1.id AND server3.id <> server2.id
          RETURN server3, COUNT(tag) as sharedTags, server2.name as viaServer
          ORDER BY sharedTags DESC
          LIMIT 3
        `
      },
      
      // Analyze business impact paths
      analyzeBusinessImpact: {
        cypher: `
          MATCH (server:MCPServer)-[:PROVIDES]->(tool:MCPTool)
          WHERE server.category IN $categories
          WITH server, 
               AVG(tool.storyPoints) as avgComplexity,
               COUNT(CASE WHEN tool.businessImpact = 'critical' THEN 1 END) as criticalTools,
               COUNT(tool) as totalTools
          RETURN server.name as serverName,
                 server.category as category,
                 avgComplexity,
                 criticalTools,
                 totalTools,
                 (criticalTools * 1.0 / totalTools) as criticalRatio
          ORDER BY criticalRatio DESC, avgComplexity DESC
        `
      }
    }
  }
  
  // Generate visualization data for frontend
  static getVisualizationQuery(): Neo4jQuery {
    return {
      cypher: `
        MATCH (server:MCPServer)
        OPTIONAL MATCH (server)-[:PROVIDES]->(tool:MCPTool)
        OPTIONAL MATCH (server)-[:INTEGRATES_WITH]->(targetServer:MCPServer)
        OPTIONAL MATCH (server)-[:TAGGED_WITH]->(tag:Tag)
        
        RETURN {
          servers: COLLECT(DISTINCT {
            id: server.id,
            name: server.name,
            category: server.category,
            priority: server.priority,
            x: rand() * 800 + 100,
            y: rand() * 600 + 100,
            size: COUNT(DISTINCT tool) * 5 + 20,
            color: CASE server.category
              WHEN 'business' THEN '#10b981'
              WHEN 'automation' THEN '#3b82f6'
              WHEN 'development' THEN '#8b5cf6'
              WHEN 'projectMgmt' THEN '#f59e0b'
              ELSE '#6b7280'
            END
          }),
          
          relationships: COLLECT(DISTINCT {
            source: server.id,
            target: targetServer.id,
            type: 'INTEGRATES_WITH',
            strength: 1.0
          }),
          
          tags: COLLECT(DISTINCT {
            name: tag.name,
            servers: COUNT(DISTINCT server)
          })
        } as graphData
      `
    }
  }
  
  // Performance optimization queries
  static getPerformanceQueries(): Record<string, Neo4jQuery> {
    return {
      
      // Create indexes for better performance
      createIndexes: {
        cypher: `
          CREATE INDEX server_id_index IF NOT EXISTS FOR (s:MCPServer) ON (s.id);
          CREATE INDEX tool_id_index IF NOT EXISTS FOR (t:MCPTool) ON (t.id);
          CREATE INDEX tag_name_index IF NOT EXISTS FOR (tag:Tag) ON (tag.name);
          CREATE INDEX server_category_index IF NOT EXISTS FOR (s:MCPServer) ON (s.category);
        `
      },
      
      // Cleanup old data
      cleanupOldData: {
        cypher: `
          MATCH (n) 
          WHERE n.lastUpdated < datetime() - duration('P7D')
          DETACH DELETE n
        `
      },
      
      // Update performance metrics
      updateMetrics: {
        cypher: `
          MATCH (server:MCPServer {id: $serverId})
          SET server.avgResponseTime = $responseTime,
              server.successRate = $successRate,
              server.healthStatus = $healthStatus,
              server.lastMetricUpdate = datetime()
        `
      }
    }
  }
  
  // Workflow analysis queries
  static getWorkflowAnalysisQueries(): Record<string, Neo4jQuery> {
    return {
      
      // Find optimal workflow paths
      findOptimalWorkflow: {
        cypher: `
          MATCH (startServer:MCPServer)-[:TAGGED_WITH]->(startTag:Tag)
          WHERE startTag.name IN $startCapabilities
          
          MATCH (endServer:MCPServer)-[:TAGGED_WITH]->(endTag:Tag)
          WHERE endTag.name IN $endCapabilities
          
          MATCH path = shortestPath((startServer)-[:INTEGRATES_WITH*1..4]->(endServer))
          
          WITH path, startServer, endServer,
               REDUCE(totalStoryPoints = 0, rel in relationships(path) | 
                 totalStoryPoints + rel.complexity) as workflowComplexity,
               REDUCE(totalConfidence = 1.0, rel in relationships(path) | 
                 totalConfidence * rel.confidence) as workflowConfidence
          
          RETURN startServer.name as startPoint,
                 endServer.name as endPoint,
                 [node in nodes(path) | node.name] as workflowPath,
                 workflowComplexity,
                 workflowConfidence,
                 LENGTH(path) as steps
          
          ORDER BY workflowConfidence DESC, steps ASC
          LIMIT 3
        `
      },
      
      // Analyze workflow performance patterns
      analyzeWorkflowPatterns: {
        cypher: `
          MATCH (server:MCPServer)-[rel:INTEGRATES_WITH]->(target:MCPServer)
          WITH rel.type as integrationType, 
               COUNT(*) as frequency,
               AVG(rel.confidence) as avgConfidence,
               COLLECT(DISTINCT server.category + '->' + target.category) as categoryPairs
          
          RETURN integrationType,
                 frequency,
                 avgConfidence,
                 categoryPairs
          ORDER BY frequency DESC, avgConfidence DESC
        `
      }
    }
  }
}

// Export utility functions for graph operations
export class MCPGraphUtils {
  
  // Convert MCP server data to Neo4j format
  static serverToNeo4jNode(server: any): Neo4jNode {
    return {
      id: server.id,
      labels: ['MCPServer', `Category_${server.category}`],
      properties: {
        id: server.id,
        name: server.name,
        category: server.category,
        priority: server.priority,
        endpoint: server.endpoint,
        businessValue: server.dailyContext?.businessContext?.businessValue || '',
        complianceLevel: server.dailyContext?.businessContext?.complianceLevel || 'basic',
        avgResponseTime: server.dailyContext?.performanceMetrics?.averageResponseTime || 0,
        successRate: server.dailyContext?.performanceMetrics?.successRate || 0,
        lastUpdated: new Date().toISOString()
      }
    }
  }
  
  // Convert tool data to Neo4j format
  static toolToNeo4jNode(tool: any, serverId: string): Neo4jNode {
    return {
      id: `${serverId}_${tool.name}`,
      labels: ['MCPTool', `Category_${tool.category}`],
      properties: {
        id: `${serverId}_${tool.name}`,
        name: tool.name,
        description: tool.description,
        category: tool.category,
        businessImpact: tool.businessImpact || 'medium',
        storyPoints: tool.storyPoints || 3,
        serverId: serverId,
        lastUpdated: new Date().toISOString()
      }
    }
  }
  
  // Generate Cypher query for bulk import
  static generateBulkImportQuery(servers: any[]): string {
    const serverNodes = servers.map(server => this.serverToNeo4jNode(server))
    
    let cypher = `
      // Create server nodes
      UNWIND $servers as serverData
      MERGE (server:MCPServer {id: serverData.properties.id})
      SET server += serverData.properties
      SET server:Category_{category}
      
      // Create tool nodes and relationships  
      UNWIND $tools as toolData
      MERGE (tool:MCPTool {id: toolData.properties.id})
      SET tool += toolData.properties
      WITH tool, toolData
      MATCH (server:MCPServer {id: toolData.properties.serverId})
      MERGE (server)-[:PROVIDES]->(tool)
      
      // Create tag relationships
      UNWIND $tagRelationships as tagRel
      MATCH (entity) WHERE entity.id = tagRel.entityId
      MERGE (tag:Tag {name: tagRel.tagName})
      MERGE (entity)-[:TAGGED_WITH]->(tag)
      
      // Create integration relationships
      UNWIND $integrations as integration
      MATCH (source:MCPServer {id: integration.sourceId})
      MATCH (target:MCPServer {id: integration.targetId})
      MERGE (source)-[rel:INTEGRATES_WITH]->(target)
      SET rel += integration.properties
    `
    
    return cypher
  }
}