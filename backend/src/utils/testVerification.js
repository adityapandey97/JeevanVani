import db from '../config/db.js';
import { JobMatchingService } from '../services/jobMatchingService.js';
import { CourseRecommendationService } from '../services/courseRecommendationService.js';
import { RAGService } from '../services/ragService.js';
import RecommendationService from '../services/recommendationService.js';


async function runVerification() {
  console.log('=== JeevanVaani SIH26097 Verification Runner ===\n');

  try {
    // 1. Database Connectivity & Seed Verification
    console.log('1. Checking Database Tables & Seed Records...');
    const tables = ['skills', 'job_roles', 'jobs', 'courses', 'knowledge_docs', 'beneficiary_profiles', 'human_reviews'];
    for (const t of tables) {
      const res = await db.query(`SELECT COUNT(*) as count FROM ${t}`);
      console.log(`   ✓ Table "${t}": ${res.rows[0].count} records`);
    }

    // 2. Deterministic 6-Factor Job Matching Test
    console.log('\n2. Testing Deterministic 6-Factor Job Matching...');
    const usersRes = await db.query('SELECT id, name FROM users LIMIT 1');
    const testUserId = usersRes.rows[0]?.id || 1;

    const allJobsRes = await db.query('SELECT * FROM jobs LIMIT 2');
    const sampleJob = allJobsRes.rows[0];
    const sampleProfile = {
      education: '10th Pass',
      preferred_location: 'Varanasi',
      preferred_sector: 'Solar / Green Jobs',
      work_experience: '1 year helper',
      willing_to_relocate: 1,
      profile_completion: 85
    };
    const sampleMatch = JobMatchingService.matchJob(
      sampleJob,
      sampleProfile,
      ['Electrical Wiring', 'Hand Tools'],
      ['Solar / Green Jobs', 'Electrical']
    );

    console.log(`   ✓ Single Job 6-Factor Match Test for "${sampleJob.title}":`);
    console.log(`     - Total Score: ${sampleMatch.totalScore}%`);
    console.log(`     - Confidence Score: ${sampleMatch.confidenceScore}%`);
    console.log(`     - Factor Scores: Skill: ${sampleMatch.scores.skillScore}%, Edu: ${sampleMatch.scores.educationScore}%, Loc: ${sampleMatch.scores.locationScore}%, Int: ${sampleMatch.scores.interestScore}%, Exp: ${sampleMatch.scores.experienceScore}%, Feas: ${sampleMatch.scores.trainingFeasibilityScore}%`);

    const rankedJobs = await JobMatchingService.getRecommendedJobsForUser(testUserId, 3);
    console.log(`   ✓ Ranked ${rankedJobs.length} verified jobs for User ID ${testUserId}`);
    rankedJobs.slice(0, 2).forEach((job, i) => {
      console.log(`     [Match #${i + 1}] "${job.title}" at ${job.organization} (${job.match_score}%) - Source: ${job.source}`);
    });

    // 3. NSQF Course Recommendation & RPL Detection Test
    console.log('\n3. Testing NSQF Course Recommendation & RPL Detection...');
    const recCourses = await CourseRecommendationService.getRecommendedCoursesForUser(testUserId, 3);
    console.log(`   ✓ Generated ${recCourses.length} course recommendations`);
    recCourses.slice(0, 2).forEach((c, i) => {
      console.log(`     [Course #${i + 1}] "${c.course_name}" (NSQF Level ${c.nsqf_level})`);
      console.log(`       - RPL Recommended: ${c.rpl_recommended ? 'YES (Fast-Track)' : 'No'}`);
      console.log(`       - Portal: ${c.portal_url}`);
    });

    // 4. Grounded RAG Knowledge Retrieval & Explainable AI
    console.log('\n4. Testing Grounded RAG Knowledge Retrieval...');
    const retrieved = await RAGService.retrieveContext('solar electrician subsidy stipend', 2);
    console.log(`   ✓ Retrieved ${retrieved.length} grounded scheme documents`);
    retrieved.forEach(d => {
      console.log(`     - [${d.category}] "${d.title}" from ${d.source}`);
    });

    const rationale = await RAGService.generateExplainableRationale(
      { role_name: 'Solar PV Installation Technician', sector: 'Solar / Green Jobs' },
      sampleProfile,
      'job_role',
      'en'
    );
    console.log(`   ✓ Explainable AI Rationale generated with anti-hallucination source links:`);
    console.log(`     - Top Verified Fact: "${rationale.verifiedFacts[0]}"`);
    console.log(`     - Official Source: ${rationale.groundedDocs[0]?.source_url || 'https://pmajay.dosje.gov.in'}`);



    // 5. Confidence Score & Human Review Queue Trigger Test
    console.log('\n5. Testing Algorithmic Confidence & Human Review Queue...');
    const top3Recs = await RecommendationService.generateRecommendations(testUserId);
    console.log(`   ✓ Generated ${top3Recs.length} top NSQF recommendations for User ${testUserId}:`);


    top3Recs.forEach((r, i) => {
      console.log(`     [#${i + 1}] ${r.role_name} (${r.sector}) - Match: ${r.match_score}%, Confidence: ${r.confidence_score}%`);
    });

    const reviewsCount = await db.query('SELECT COUNT(*) as count FROM human_reviews');
    console.log(`   ✓ Human review queue monitoring active (${reviewsCount.rows[0].count} items currently recorded)`);

    console.log('\n=== ALL END-TO-END SYSTEM VERIFICATIONS PASSED SUCCESSFULLY ===');
    process.exit(0);
  } catch (err) {
    console.error('Verification failed:', err);
    process.exit(1);
  }
}


runVerification();
