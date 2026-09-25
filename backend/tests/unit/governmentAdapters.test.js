import assert from 'assert';
import { skillIndiaAdapter, nsdcAdapter, pmajayAdapter, dgtAdapter } from '../../src/integrations/index.js';

export async function runGovernmentAdaptersTests() {
  console.log('--- Running Government Data Adapter & Freshness Unit Tests ---');

  // Test 1: Skill India Adapter caching and freshness metadata
  const { records: courses, metadata: courseMeta } = await skillIndiaAdapter.getVerifiedCourses();
  assert.ok(courses.length > 0, 'Skill India adapter should return verified courses');
  assert.strictEqual(courseMeta.isOfficialVerified, true);
  assert.ok(courseMeta.sourceUrl.includes('skillindiadigital.gov.in'));
  assert.ok(courseMeta.retrievedAt);
  console.log(`  ✓ Test 1 Passed: Skill India adapter retrieved ${courses.length} courses with official metadata`);

  // Test 2: In-memory cache hit
  const cachedCourses = await skillIndiaAdapter.getVerifiedCourses();
  assert.strictEqual(cachedCourses.records.length, courses.length);
  assert.strictEqual(cachedCourses.metadata.freshnessStatus, 'CACHED');
  console.log('  ✓ Test 2 Passed: In-memory cache hit verified (Status: CACHED, no redundant network hit)');

  // Test 3: NSDC Adapter QP & NOS standards
  const { records: quals, metadata: qualMeta } = await nsdcAdapter.getQualifications();
  assert.ok(quals.length > 0, 'NSDC adapter should return qualifications');
  const solarQP = quals.find(q => q.qp_code === 'SGJ/Q0101');
  assert.ok(solarQP, 'Should contain Solar PV Installer QP (SGJ/Q0101)');
  assert.strictEqual(solarQP.nsqf_level, 4);
  assert.ok(solarQP.nos_list.length > 0, 'Should contain detailed NOS breakdown');
  console.log(`  ✓ Test 3 Passed: NSDC QP-NOS mapping verified for "${solarQP.title}" (NSQF Level ${solarQP.nsqf_level})`);

  // Test 4: PM-AJAY GIA Component Adapter & Guideline Freshness
  const { records: rules } = await pmajayAdapter.getSchemeGuidelines();
  assert.ok(rules.length > 0, 'PM-AJAY adapter should return scheme rules');
  assert.ok(rules[0].target_beneficiaries.includes('Scheduled Caste'));
  console.log('  ✓ Test 4 Passed: PM-AJAY GIA component guidelines and target criteria verified');

  // Test 5: DGT Craftsmen Training Adapter
  const { records: trades } = await dgtAdapter.getTrades();
  assert.ok(trades.length > 0, 'DGT adapter should return verified CTS trades');
  console.log(`  ✓ Test 5 Passed: DGT vocational trades verified (${trades.length} trades listed)`);

  console.log('✓ All Government Adapter Unit Tests Passed Successfully!\n');
}

if (process.argv[1] && process.argv[1].endsWith('governmentAdapters.test.js')) {
  runGovernmentAdaptersTests().catch(err => {
    console.error('Test failed:', err);
    process.exit(1);
  });
}
