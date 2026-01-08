
import { OperationMode, GroundingLink } from "../types";

const MOCK_RESPONSES: Record<OperationMode, string[]> = {
  [OperationMode.OMNI_ARCHITECT]: [
    "STRUCTURAL_ANALYSIS_COMPLETE: The proposed hyper-converged architecture demonstrates a 14% improvement in data throughput. Recommendation: Deploy redundant kernel nodes with automated failover sharding.",
    "ARCHITECTURE_MODEL_V3: Successfully mapped the microservices mesh. Latency bottleneck identified at the ingress gateway. Suggested fix: Implement a decentralized auth-relay for token validation.",
    "SIMULATION_RESULT: The multi-layered defense mesh successfully mitigated a Tier-4 hypothetical breach. Integrity remains at 99.8%. No architectural drift detected."
  ],
  [OperationMode.QUANTUM_INTEL]: [
    "NEURAL_SYNTHESIS: Cross-referencing public data streams... Found 3 correlating architectural patterns in recent open-source repository snapshots. Intelligence confidence: 94%.",
    "INTEL_LOG: Historical trend analysis suggests a shift towards edge-native deployment patterns. Current public vectors indicate rising demand for high-latency-tolerant data models.",
    "DATA_STREAM_SYNC: Analyzing public cloud infrastructure benchmarks. Result: Standard provisioned throughput for Tier-1 storage is currently matching the predicted V32 curve."
  ],
  [OperationMode.REALITY_MAPPING]: [
    "SPATIAL_VECTOR_LOCK: Modeling environmental constraints for the specified coordinates. Public geospatial data confirms a 12m elevation gradient within the zone of interest.",
    "MAPPING_DYNAMICS: Simulated dependency paths for local utility grids (Public Record) indicate a potential single-point-of-failure in the Northwest quadrant.",
    "GEOSPATIAL_SYNCHRONIZATION: Correlating map tiles with public traffic flow models. Simulation suggests optimal node placement at Grid-Sector-7 for maximum coverage density."
  ]
};

const MOCK_LINKS: GroundingLink[] = [
  { uri: "https://simulation.arise-v32.local/docs", title: "Local Architectural Reference", source: 'search' },
  { uri: "https://maps.arise.local/sector-7", title: "Mock Geospatial Buffer", source: 'maps' }
];

export class MockDataService {
  async execute(
    prompt: string, 
    mode: OperationMode
  ): Promise<{ text: string; links: GroundingLink[] }> {
    // Simulate thinking/network latency
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));
    
    const responses = MOCK_RESPONSES[mode];
    const text = responses[Math.floor(Math.random() * responses.length)];
    
    return {
      text: `[LOCAL_HYPERCACHE_SIMULATION]\n\n${text}\n\nNOTE: This output is generated from the local simulation buffer and does not represent live neural sync data.`,
      links: Math.random() > 0.5 ? MOCK_LINKS : []
    };
  }
}

export const mockService = new MockDataService();
