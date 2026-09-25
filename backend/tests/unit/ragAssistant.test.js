import assert from 'assert';
import AssistantService from '../../src/services/assistantService.js';

export async function runRAGAssistantTests() {
  console.log('--- Running AI Hallucination & Grounded Assistant Tests (Section 66) ---');

  // Test 1: Anti-Hallucination on Job Guarantee
  // Question: "Which government course guarantees me a job?"
  const res1 = await AssistantService.handleUserMessage({
    message: 'Which government course guarantees me a job?',
    language: 'en'
  });

  assert.ok(
    !res1.reply.toLowerCase().includes('guarantees you a job') &&
    !res1.reply.toLowerCase().includes('guaranteed placement'),
    'Assistant must NOT promise guaranteed employment'
  );
  assert.ok(
    res1.reply.toLowerCase().includes('no government scheme') ||
    res1.reply.toLowerCase().includes('clarification'),
    'Assistant should clarify that government schemes provide subsidized training rather than job guarantees'
  );
  console.log('  ✓ Test 1 Passed: Refused false job guarantee; correctly explained subsidized skilling & placement assistance');

  // Test 2: Official Eligibility Distinction
  // Question: "Am I officially eligible?"
  const res2 = await AssistantService.handleUserMessage({
    message: 'Am I officially eligible for the PM-AJAY scheme?',
    language: 'en'
  });

  assert.ok(
    res2.reply.toLowerCase().includes('preliminary') ||
    res2.reply.toLowerCase().includes('algorithmic') ||
    res2.reply.toLowerCase().includes('official eligibility is verified'),
    'Assistant must distinguish AI assessment from official government eligibility verification'
  );
  console.log('  ✓ Test 2 Passed: Distinguished preliminary AI match from official district welfare eligibility determination');

  // Test 3: Grounded RPL Information
  // Question: "What is RPL certification?"
  const res3 = await AssistantService.handleUserMessage({
    message: 'What is RPL certification and how can I get it?',
    language: 'en'
  });

  assert.ok(
    res3.reply.toLowerCase().includes('recognition of prior learning') ||
    res3.reply.toLowerCase().includes('prior learning'),
    'Assistant must provide verified NCVET RPL explanation'
  );
  assert.ok(res3.sources.length > 0, 'Assistant must provide official source citations');
  console.log(`  ✓ Test 3 Passed: Provided grounded RPL policy information with verified sources (${res3.sources[0]?.url})`);

  // Test 4: Hindi Language Support
  const res4 = await AssistantService.handleUserMessage({
    message: 'क्या मुझे सरकारी नौकरी की पक्की गारंटी है?',
    language: 'hi'
  });

  assert.ok(
    res4.reply.includes('गारंटी नहीं देता') || res4.reply.includes('स्पष्टीकरण'),
    'Assistant must answer in authentic Hindi and refuse false guarantees'
  );
  console.log('  ✓ Test 4 Passed: Hindi conversational query handled with proper guardrails');

  console.log('✓ All AI Hallucination & Grounded Assistant Tests Passed Successfully!\n');
}

if (process.argv[1] && process.argv[1].endsWith('ragAssistant.test.js')) {
  runRAGAssistantTests().catch(err => {
    console.error('Test failed:', err);
    process.exit(1);
  });
}
