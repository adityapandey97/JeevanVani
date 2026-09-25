import { runProfileExtractionTests } from './unit/profileExtraction.test.js';
import { runRecommendationEngineTests } from './unit/recommendationEngine.test.js';
import { runGovernmentAdaptersTests } from './unit/governmentAdapters.test.js';
import { runRAGAssistantTests } from './unit/ragAssistant.test.js';
import { runAPIIntegrationTests } from './api/apiIntegration.test.js';

async function runAllSuites() {
  console.log('================================================================');
  console.log('🚀 JeevanVani SIH26097 Comprehensive Automated Test Runner');
  console.log('================================================================\n');

  const startTime = Date.now();
  let passedSuites = 0;
  const totalSuites = 5;

  try {
    // Suite 1: Profile Extraction
    await runProfileExtractionTests();
    passedSuites++;

    // Suite 2: Recommendation Engine
    await runRecommendationEngineTests();
    passedSuites++;

    // Suite 3: Government Adapters
    await runGovernmentAdaptersTests();
    passedSuites++;

    // Suite 4: RAG Assistant
    await runRAGAssistantTests();
    passedSuites++;

    // Suite 5: Live API Integration
    await runAPIIntegrationTests();
    passedSuites++;

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log('================================================================');
    console.log(`✅ ALL ${passedSuites}/${totalSuites} TEST SUITES PASSED IN ${duration}s`);
    console.log('   - Profile Extraction & Self-Correction: PASSED');
    console.log('   - 6-Factor Recommendation & Section 65 Scenarios: PASSED');
    console.log('   - Government Adapters & Data Freshness Layer: PASSED');
    console.log('   - Grounded RAG Assistant & Anti-Hallucination: PASSED');
    console.log('   - End-to-End Live REST API Integration: PASSED');
    console.log('================================================================\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ Test Suite Execution Failed:', err);
    process.exit(1);
  }
}

runAllSuites();
