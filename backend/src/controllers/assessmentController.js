import db from '../config/db.js';
import AIService, { ASSESSMENT_QUESTIONS } from '../services/aiService.js';
import RecommendationService from '../services/recommendationService.js';
import { User, BeneficiaryProfile, AssessmentSession, Skill } from '../models/index.js';

export async function startAssessment(req, res, next) {
  try {
    const userId = req.user.id;
    const { restart = false } = req.body;
    const reqLang = req.body?.language || req.headers['x-language'];

    if (db.getDriver() === 'mongodb') {
      let user = await User.findById(userId);
      let lang = reqLang || user?.preferred_language || 'hi';

      if (reqLang && user && user.preferred_language !== reqLang) {
        user.preferred_language = reqLang;
        await user.save();
      }

      let session = await AssessmentSession.findOne({ user: userId });

      if (!session || restart) {
        if (session && restart) {
          session.current_question_index = 0;
          session.answers = new Map();
          session.transcript = [];
          session.status = 'in_progress';
          await session.save();
        } else {
          session = await AssessmentSession.create({
            user: userId,
            current_question_index: 0,
            answers: new Map(),
            transcript: [],
            status: 'in_progress',
          });
        }
      }

      const currentIndex = session.current_question_index || 0;
      const totalQuestions = ASSESSMENT_QUESTIONS.length;
      const currentQuestion = AIService.getQuestion(currentIndex);

      return res.json({
        success: true,
        sessionId: session._id,
        currentIndex,
        totalQuestions,
        status: session.status,
        question: currentQuestion
          ? {
              id: currentQuestion.id,
              index: currentQuestion.index,
              prompt: lang === 'hi' ? currentQuestion.hi : currentQuestion.en,
              quickReplies: currentQuestion.quickReplies[lang] || currentQuestion.quickReplies.en,
              language: lang,
            }
          : null,
      });
    }

    // SQL Mode (PostgreSQL / SQLite fallback)
    let lang = reqLang;
    if (lang) {
      await db.query('UPDATE users SET preferred_language = $1 WHERE id = $2', [lang, userId]);
    } else {
      const userRes = await db.query('SELECT preferred_language FROM users WHERE id = $1', [userId]);
      lang = userRes.rows[0]?.preferred_language || 'hi';
    }

    let session;
    const existing = await db.query('SELECT * FROM assessment_sessions WHERE user_id = $1', [userId]);

    if (existing.rows.length === 0 || restart) {
      if (existing.rows.length > 0 && restart) {
        await db.query(
          `UPDATE assessment_sessions
           SET current_question_index = 0, answers = '{}', transcript = '[]', status = 'in_progress', updated_at = CURRENT_TIMESTAMP
           WHERE user_id = $1`,
          [userId]
        );
      } else {
        await db.query(
          `INSERT INTO assessment_sessions (user_id, current_question_index, answers, transcript, status)
           VALUES ($1, 0, '{}', '[]', 'in_progress')`,
          [userId]
        );
      }
      const updated = await db.query('SELECT * FROM assessment_sessions WHERE user_id = $1', [userId]);
      session = updated.rows[0];
    } else {
      session = existing.rows[0];
    }

    const currentIndex = Number(session.current_question_index) || 0;
    const totalQuestions = ASSESSMENT_QUESTIONS.length;
    const currentQuestion = AIService.getQuestion(currentIndex);

    res.json({
      success: true,
      sessionId: session.id,
      currentIndex,
      totalQuestions,
      status: session.status,
      question: currentQuestion
        ? {
            id: currentQuestion.id,
            index: currentQuestion.index,
            prompt: lang === 'hi' ? currentQuestion.hi : currentQuestion.en,
            quickReplies: currentQuestion.quickReplies[lang] || currentQuestion.quickReplies.en,
            language: lang,
          }
        : null,
    });
  } catch (error) {
    next(error);
  }
}

export async function submitAnswer(req, res, next) {
  try {
    const userId = req.user.id;
    let { questionIndex, answerText } = req.body;
    const reqLang = req.body?.language || req.headers['x-language'];

    if (questionIndex === undefined || answerText === undefined) {
      return res.status(400).json({ success: false, message: 'Both questionIndex and answerText are required.' });
    }

    questionIndex = Number(questionIndex);

    if (db.getDriver() === 'mongodb') {
      const user = await User.findById(userId);
      const lang = reqLang || user?.preferred_language || 'hi';
      if (reqLang && user && user.preferred_language !== reqLang) {
        user.preferred_language = reqLang;
        await user.save();
      }

      const allSkills = await Skill.find({});

      const { updates, nextQuestionIndex, isComplete } = AIService.processAnswer(
        questionIndex,
        answerText,
        {},
        allSkills
      );

      const completionPercent = Math.min(100, Math.round(((questionIndex + 1) / ASSESSMENT_QUESTIONS.length) * 100));

      // Update BeneficiaryProfile
      const profileUpdates = { profile_completion: completionPercent };
      if (updates.age !== undefined) profileUpdates.age = updates.age;
      if (updates.education !== undefined) profileUpdates.education = updates.education;
      if (updates.employment_status !== undefined) profileUpdates.employment_status = updates.employment_status;
      if (updates.work_experience !== undefined) profileUpdates.work_experience = updates.work_experience;
      if (updates.preferred_location !== undefined) profileUpdates.preferred_location = updates.preferred_location;
      if (updates.willing_to_relocate !== undefined) profileUpdates.willing_to_relocate = updates.willing_to_relocate;
      if (updates.employment_preference !== undefined) profileUpdates.employment_preference = updates.employment_preference;

      const profile = await BeneficiaryProfile.findOne({ user: userId });
      if (profile) {
        Object.assign(profile, profileUpdates);
        if (updates.skills && updates.skills.length > 0) {
          for (const newSkill of updates.skills) {
            if (!profile.skills.some((s) => s.name.toLowerCase() === newSkill.name.toLowerCase())) {
              profile.skills.push(newSkill);
            }
          }
        }
        if (updates.interests && updates.interests.length > 0) {
          for (const interest of updates.interests) {
            if (!profile.interests.includes(interest)) {
              profile.interests.push(interest);
            }
          }
        }
        await profile.save();
      }

      const acknowledgement = AIService.generateAcknowledgement(questionIndex, answerText, lang);

      // Update AssessmentSession
      const session = await AssessmentSession.findOne({ user: userId });
      if (session) {
        session.current_question_index = isComplete ? ASSESSMENT_QUESTIONS.length : nextQuestionIndex;
        session.status = isComplete ? 'completed' : 'in_progress';
        if (!session.answers) session.answers = new Map();
        session.answers.set(String(questionIndex), answerText);
        session.transcript.push({
          questionPrompt: AIService.getQuestion(questionIndex)?.[lang] || '',
          userAnswer: answerText,
          acknowledgement,
        });
        await session.save();
      }

      let recommendations = null;
      if (isComplete) {
        recommendations = await RecommendationService.generateRecommendations(userId);
      }

      const nextQuestionDef = isComplete ? null : AIService.getQuestion(nextQuestionIndex);

      return res.json({
        success: true,
        currentIndex: nextQuestionIndex,
        isComplete,
        acknowledgement,
        profileCompletion: completionPercent,
        nextQuestion: nextQuestionDef
          ? {
              id: nextQuestionDef.id,
              index: nextQuestionDef.index,
              prompt: lang === 'hi' ? nextQuestionDef.hi : nextQuestionDef.en,
              quickReplies: nextQuestionDef.quickReplies[lang] || nextQuestionDef.quickReplies.en,
              language: lang,
            }
          : null,
        recommendations,
      });
    }

    // SQL Mode (PostgreSQL / SQLite fallback)
    let lang = reqLang;
    if (lang) {
      await db.query('UPDATE users SET preferred_language = $1 WHERE id = $2', [lang, userId]);
    } else {
      const userRes = await db.query('SELECT preferred_language FROM users WHERE id = $1', [userId]);
      lang = userRes.rows[0]?.preferred_language || 'hi';
    }

    const skillsRes = await db.query('SELECT id, name, category FROM skills');
    const allSkills = skillsRes.rows;

    const { updates, nextQuestionIndex, isComplete } = AIService.processAnswer(
      questionIndex,
      answerText,
      {},
      allSkills
    );

    const profileFields = [];
    const profileValues = [];
    let paramCounter = 1;

    if (updates.age !== undefined) {
      profileFields.push(`age = $${paramCounter++}`);
      profileValues.push(updates.age);
    }
    if (updates.education !== undefined) {
      profileFields.push(`education = $${paramCounter++}`);
      profileValues.push(updates.education);
    }
    if (updates.employment_status !== undefined) {
      profileFields.push(`employment_status = $${paramCounter++}`);
      profileValues.push(updates.employment_status);
    }
    if (updates.work_experience !== undefined) {
      profileFields.push(`work_experience = $${paramCounter++}`);
      profileValues.push(updates.work_experience);
    }
    if (updates.preferred_location !== undefined) {
      profileFields.push(`preferred_location = $${paramCounter++}`);
      profileValues.push(updates.preferred_location);
    }
    if (updates.willing_to_relocate !== undefined) {
      profileFields.push(`willing_to_relocate = $${paramCounter++}`);
      profileValues.push(updates.willing_to_relocate);
    }
    if (updates.employment_preference !== undefined) {
      profileFields.push(`employment_preference = $${paramCounter++}`);
      profileValues.push(updates.employment_preference);
    }

    const completionPercent = Math.min(100, Math.round(((questionIndex + 1) / ASSESSMENT_QUESTIONS.length) * 100));
    profileFields.push(`profile_completion = $${paramCounter++}`);
    profileValues.push(completionPercent);

    if (profileFields.length > 0) {
      profileValues.push(userId);
      await db.query(
        `UPDATE beneficiary_profiles
         SET ${profileFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
         WHERE user_id = $${paramCounter}`,
        profileValues
      );
    }

    if (updates.skills && updates.skills.length > 0) {
      for (const sk of updates.skills) {
        const existingSkill = await db.query('SELECT id FROM skills WHERE LOWER(name) = LOWER($1)', [sk.name]);
        let skillId = existingSkill.rows[0]?.id;

        if (!skillId) {
          const newSkillRes = await db.query(
            'INSERT INTO skills (name, category) VALUES ($1, $2) RETURNING id',
            [sk.name, sk.category || 'General']
          );
          skillId = newSkillRes.rows[0]?.id;
        }

        if (skillId) {
          const userSkillExists = await db.query(
            'SELECT id FROM user_skills WHERE user_id = $1 AND skill_id = $2',
            [userId, skillId]
          );
          if (userSkillExists.rows.length === 0) {
            await db.query(
              'INSERT INTO user_skills (user_id, skill_id, proficiency_level) VALUES ($1, $2, $3)',
              [userId, skillId, sk.proficiency_level || 'Beginner']
            );
          }
        }
      }
    }

    if (updates.interests && updates.interests.length > 0) {
      for (const interest of updates.interests) {
        await db.query(
          'INSERT INTO interests (user_id, interest_name) VALUES ($1, $2)',
          [userId, interest]
        );
      }
    }

    const sessionRes = await db.query('SELECT answers, transcript FROM assessment_sessions WHERE user_id = $1', [userId]);
    let currentAnswers = {};
    let currentTranscript = [];

    if (sessionRes.rows.length > 0) {
      try { currentAnswers = typeof sessionRes.rows[0].answers === 'string' ? JSON.parse(sessionRes.rows[0].answers) : (sessionRes.rows[0].answers || {}); } catch {}
      try { currentTranscript = typeof sessionRes.rows[0].transcript === 'string' ? JSON.parse(sessionRes.rows[0].transcript) : (sessionRes.rows[0].transcript || []); } catch {}
    }

    currentAnswers[questionIndex] = answerText;
    const currentQ = AIService.getQuestion(questionIndex);
    currentTranscript.push({
      questionIndex,
      question: currentQ ? currentQ.en : '',
      answer: answerText,
      timestamp: new Date().toISOString()
    });

    const newStatus = isComplete ? 'completed' : 'in_progress';

    await db.query(
      `UPDATE assessment_sessions
       SET current_question_index = $1, answers = $2, transcript = $3, status = $4, updated_at = CURRENT_TIMESTAMP
       WHERE user_id = $5`,
      [
        isComplete ? ASSESSMENT_QUESTIONS.length : nextQuestionIndex,
        JSON.stringify(currentAnswers),
        JSON.stringify(currentTranscript),
        newStatus,
        userId
      ]
    );

    const acknowledgement = AIService.generateAcknowledgement(questionIndex, answerText, lang);
    const nextQuestionDef = isComplete ? null : AIService.getQuestion(nextQuestionIndex);

    let recommendations = null;
    if (isComplete) {
      recommendations = await RecommendationService.generateRecommendations(userId);
    }

    res.json({
      success: true,
      currentIndex: nextQuestionIndex,
      isComplete,
      acknowledgement,
      profileCompletion: completionPercent,
      nextQuestion: nextQuestionDef ? {
        id: nextQuestionDef.id,
        index: nextQuestionDef.index,
        prompt: lang === 'hi' ? nextQuestionDef.hi : nextQuestionDef.en,
        quickReplies: nextQuestionDef.quickReplies[lang] || nextQuestionDef.quickReplies.en,
        language: lang
      } : null,
      recommendations
    });
  } catch (error) {
    next(error);
  }
}

export async function getAssessmentStatus(req, res, next) {
  try {
    const userId = req.user.id;

    if (db.getDriver() === 'mongodb') {
      const session = await AssessmentSession.findOne({ user: userId });
      const profile = await BeneficiaryProfile.findOne({ user: userId });

      if (!session) {
        return res.json({
          success: true,
          currentIndex: 0,
          totalQuestions: ASSESSMENT_QUESTIONS.length,
          status: 'not_started',
          profileCompletion: 0,
        });
      }

      return res.json({
        success: true,
        sessionId: session._id,
        currentIndex: session.current_question_index,
        totalQuestions: ASSESSMENT_QUESTIONS.length,
        status: session.status,
        profileCompletion: profile?.profile_completion || 0,
      });
    }

    // SQL Mode
    const sessionRes = await db.query('SELECT * FROM assessment_sessions WHERE user_id = $1', [userId]);

    if (sessionRes.rows.length === 0) {
      return res.json({
        success: true,
        currentIndex: 0,
        totalQuestions: ASSESSMENT_QUESTIONS.length,
        status: 'not_started',
        profileCompletion: 0
      });
    }

    const session = sessionRes.rows[0];
    const profileRes = await db.query('SELECT profile_completion FROM beneficiary_profiles WHERE user_id = $1', [userId]);

    res.json({
      success: true,
      sessionId: session.id,
      currentIndex: Number(session.current_question_index),
      totalQuestions: ASSESSMENT_QUESTIONS.length,
      status: session.status,
      profileCompletion: profileRes.rows[0]?.profile_completion || 0
    });
  } catch (error) {
    next(error);
  }
}

export async function completeAssessment(req, res, next) {
  try {
    const userId = req.user.id;

    if (db.getDriver() === 'mongodb') {
      await AssessmentSession.findOneAndUpdate(
        { user: userId },
        { status: 'completed', current_question_index: ASSESSMENT_QUESTIONS.length }
      );
      await BeneficiaryProfile.findOneAndUpdate(
        { user: userId },
        { profile_completion: 100 }
      );
      const recommendations = await RecommendationService.generateRecommendations(userId);
      return res.json({
        success: true,
        message: 'Assessment marked as complete.',
        recommendations,
      });
    }

    // SQL Mode
    await db.query(
      `UPDATE assessment_sessions
       SET status = 'completed', current_question_index = $1, updated_at = CURRENT_TIMESTAMP
       WHERE user_id = $2`,
      [ASSESSMENT_QUESTIONS.length, userId]
    );

    await db.query(
      'UPDATE beneficiary_profiles SET profile_completion = 100 WHERE user_id = $1',
      [userId]
    );

    const recommendations = await RecommendationService.generateRecommendations(userId);

    res.json({
      success: true,
      message: 'Assessment marked as complete.',
      recommendations
    });
  } catch (error) {
    next(error);
  }
}

export default {
  startAssessment,
  submitAnswer,
  getAssessmentStatus,
  completeAssessment
};
