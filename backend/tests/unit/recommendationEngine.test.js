import assert from 'assert';
import { RecommendationService } from '../../src/services/recommendationService.js';
import { JobMatchingService } from '../../src/services/jobMatchingService.js';
import ProfileExtractionService from '../../src/services/profileExtractionService.js';

export async function runRecommendationEngineTests() {
  console.log('--- Running Recommendation Engine Unit Tests (Section 65 Scenarios) ---');

  // USER A: 10th pass, basic electrical, technical interest, 2 years experience
  const sampleElectricianJob = {
    title: 'Assistant Electrician (Facility Wiring)',
    sector: 'Construction & Electrical',
    eligibility: '10th Pass',
    required_skills: ['Electrical Wiring', 'Hand Tools', 'Safety Precautions'],
    location: 'Kanpur, UP'
  };

  const userAProfile = {
    education: '10th Pass',
    preferred_location: 'Kanpur',
    preferred_sector: 'Construction & Electrical',
    work_experience: '2 years electrician assistant',
    willing_to_relocate: true,
    employment_preference: 'Job'
  };

  const userASkills = ['Electrical Wiring', 'Hand Tools'];
  const userAInterests = ['Electrical', 'Technical Work'];

  const matchA = JobMatchingService.matchJob(sampleElectricianJob, userAProfile, userASkills, userAInterests);
  assert.ok(matchA.totalScore >= 70, `User A should have strong match score >= 70%, got ${matchA.totalScore}%`);
  assert.ok(matchA.matchedSkills.includes('Electrical Wiring'), 'Should match Electrical Wiring');
  console.log(`  ✓ Test Case User A Passed: 10th Pass electrician assistant matched at ${matchA.totalScore}%`);

  // USER B: Graduate, computer, communication, office work interest
  const sampleOfficeJob = {
    title: 'Junior Data & Operations Associate',
    sector: 'Digital Services & IT',
    eligibility: 'Graduate',
    required_skills: ['Computer & Typing', 'Communication Skills', 'Basic MS Office'],
    location: 'Lucknow, UP'
  };

  const userBProfile = {
    education: 'Graduate',
    preferred_location: 'Lucknow',
    preferred_sector: 'Digital Services & IT',
    work_experience: '1 year back office',
    willing_to_relocate: false,
    employment_preference: 'Job'
  };

  const userBSkills = ['Computer & Typing', 'Communication Skills'];
  const userBInterests = ['Digital Services', 'Office Work'];

  const matchB = JobMatchingService.matchJob(sampleOfficeJob, userBProfile, userBSkills, userBInterests);
  assert.ok(matchB.totalScore >= 70, `User B should match office role >= 70%, got ${matchB.totalScore}%`);
  assert.strictEqual(matchB.scores.educationScore, 100, 'Graduate should receive 100% education score');
  console.log(`  ✓ Test Case User B Passed: Graduate digital profile matched at ${matchB.totalScore}%`);

  // USER C: Incomplete profile, no skills, no experience
  const userCProfile = {
    education: null,
    preferred_location: null,
    work_experience: null,
    employment_status: null
  };

  const completenessC = ProfileExtractionService.calculateCompleteness(userCProfile, [], []);
  assert.ok(completenessC.percent < 40, `User C completeness should be < 40%, got ${completenessC.percent}%`);
  assert.ok(completenessC.missingFields.includes('skills'), 'User C should be missing skills');
  assert.ok(completenessC.missingFields.includes('education'), 'User C should be missing education');
  console.log(`  ✓ Test Case User C Passed: Incomplete profile properly identified (Completeness: ${completenessC.percent}%, missing: ${completenessC.missingFields.length} fields)`);

  // USER D: Tailoring, self-employment interest
  const sampleTailoringJob = {
    title: 'Garment Production Artisan & Tailor',
    sector: 'Apparel & Handicrafts',
    eligibility: '8th Pass',
    required_skills: ['Fabric Cutting', 'Sewing Machine Operation'],
    location: 'Varanasi, UP'
  };

  const userDProfile = {
    education: '8th Pass',
    preferred_location: 'Varanasi',
    preferred_sector: 'Apparel & Handicrafts',
    work_experience: '3 years home tailoring',
    willing_to_relocate: false,
    employment_preference: 'Self-employment'
  };

  const userDSkills = ['Fabric Cutting', 'Sewing Machine Operation'];
  const userDInterests = ['Tailoring', 'Handicrafts'];

  const matchD = JobMatchingService.matchJob(sampleTailoringJob, userDProfile, userDSkills, userDInterests);
  assert.ok(matchD.totalScore >= 70, `User D should match tailoring role >= 70%, got ${matchD.totalScore}%`);
  console.log(`  ✓ Test Case User D Passed: Tailoring self-employment profile matched at ${matchD.totalScore}%`);

  console.log('✓ All Recommendation Engine Unit Tests Passed Successfully!\n');
}

if (process.argv[1] && process.argv[1].endsWith('recommendationEngine.test.js')) {
  runRecommendationEngineTests().catch(err => {
    console.error('Test failed:', err);
    process.exit(1);
  });
}
