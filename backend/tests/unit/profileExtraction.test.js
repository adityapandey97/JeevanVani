import assert from 'assert';
import ProfileExtractionService from '../../src/services/profileExtractionService.js';

export async function runProfileExtractionTests() {
  console.log('--- Running Profile Extraction & Self-Correction Unit Tests ---');

  // Test 1: Self-correction (Section 8: "My qualification is 12th... actually graduation")
  const text1 = 'My qualification is 12th... actually graduation';
  const edu1 = ProfileExtractionService.extractEducation(text1);
  assert.strictEqual(edu1, 'Graduate', `Expected Graduate but got ${edu1}`);
  console.log('  ✓ Test 1 Passed: Self-correction from 12th to graduation handled correctly');

  // Test 2: Reverse self-correction ("I am a graduate... actually 10th pass")
  const text2 = 'I am a graduate... actually 10th pass';
  const edu2 = ProfileExtractionService.extractEducation(text2);
  assert.strictEqual(edu2, '10th Pass', `Expected 10th Pass but got ${edu2}`);
  console.log('  ✓ Test 2 Passed: Reverse self-correction from graduate to 10th pass handled correctly');

  // Test 3: Hindi self-correction with age
  const text3 = 'मेरी उम्र 20 साल है नहीं बल्कि 22 साल';
  const age3 = ProfileExtractionService.extractAge(text3);
  assert.strictEqual(age3, 22, `Expected 22 but got ${age3}`);
  console.log('  ✓ Test 3 Passed: Hindi self-correction for age ("नहीं बल्कि 22 साल") handled correctly');

  // Test 4: Hindi number words
  const text4 = 'मेरी उम्र बाईस साल है';
  const age4 = ProfileExtractionService.extractAge(text4);
  assert.strictEqual(age4, 22, `Expected 22 from word "बाईस" but got ${age4}`);
  console.log('  ✓ Test 4 Passed: Hindi number word "बाईस" extracted to 22');

  // Test 5: Field extraction with confidence (Section 10)
  const confResult = ProfileExtractionService.extractFieldWithConfidence('education', 'I have completed 10th class');
  assert.strictEqual(confResult.value, '10th Pass');
  assert.ok(confResult.confidence >= 0.85, `Confidence score should be >= 0.85, got ${confResult.confidence}`);
  assert.strictEqual(confResult.needsConfirmation, false);
  console.log(`  ✓ Test 5 Passed: Confidence score evaluated (${confResult.confidence}) with zero hallucination`);

  // Test 6: Low confidence trigger and clarification prompt
  const lowConfResult = ProfileExtractionService.extractFieldWithConfidence('education', 'kuchh padha likha hai thoda bahut');
  assert.ok(lowConfResult.needsConfirmation === true, 'Low confidence utterance should flag needsConfirmation');
  assert.ok(lowConfResult.clarificationPrompt !== null, 'Clarification prompt should be present for low confidence');
  console.log('  ✓ Test 6 Passed: Low-confidence input safely flagged for user confirmation');

  // Test 7: Profile completeness calculation (Section 6)
  const fullProfile = {
    education: '10th Pass',
    preferred_location: 'Varanasi',
    age: 23,
    employment_status: 'Unemployed',
    work_experience: '1 year helper',
    preferred_sector: 'Green Jobs',
    training_preference: 'Full-Time',
    employment_preference: 'Job'
  };
  const comp = ProfileExtractionService.calculateCompleteness(fullProfile, [{ name: 'Wiring' }], ['Solar']);
  assert.ok(comp.percent >= 85, `Completeness should be >= 85%, got ${comp.percent}%`);
  assert.strictEqual(comp.isComplete, true);
  console.log(`  ✓ Test 7 Passed: Profile completeness calculated accurately (${comp.percent}%)`);

  console.log('✓ All Profile Extraction Unit Tests Passed Successfully!\n');
}

if (process.argv[1] && process.argv[1].endsWith('profileExtraction.test.js')) {
  runProfileExtractionTests().catch(err => {
    console.error('Test failed:', err);
    process.exit(1);
  });
}
