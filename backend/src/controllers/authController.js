import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db, { dbDriver } from '../config/db.js';
import { User, BeneficiaryProfile } from '../models/index.js';

const JWT_SECRET = process.env.JWT_SECRET || 'jeevanvani_pmajay_super_secret_jwt_key_2026';

export async function register(req, res, next) {
  try {
    const { name, mobile, email, password, preferred_language = 'hi' } = req.body;

    if (!name || !mobile || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields (Name, Mobile, Email, Password) are required.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanMobile = mobile.trim();
    const cleanName = name.trim();

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    if (db.getDriver() === 'mongodb') {
      const existing = await User.findOne({ email: cleanEmail });
      if (existing) {
        return res.status(409).json({ success: false, message: 'An account with this email address already exists.' });
      }

      const user = await User.create({
        name: cleanName,
        mobile: cleanMobile,
        email: cleanEmail,
        password: hashedPassword,
        preferred_language,
        role: 'beneficiary',
      });

      await BeneficiaryProfile.create({
        user: user._id,
        profile_completion: 0,
      });

      const token = jwt.sign(
        { id: user._id, email: user.email, name: user.name, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.status(201).json({
        success: true,
        message: 'Beneficiary registered successfully.',
        token,
        user: {
          id: user._id,
          name: user.name,
          mobile: user.mobile,
          email: user.email,
          preferred_language: user.preferred_language,
          role: user.role,
          created_at: user.createdAt,
        },
      });
    }

    // SQL Mode (PostgreSQL / SQLite fallback)
    const existing = await db.query('SELECT id FROM users WHERE email = $1', [cleanEmail]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ success: false, message: 'An account with this email address already exists.' });
    }

    const userRes = await db.query(
      `INSERT INTO users (name, mobile, email, password, preferred_language, role)
       VALUES ($1, $2, $3, $4, $5, 'beneficiary') RETURNING id, name, mobile, email, preferred_language, role, created_at`,
      [cleanName, cleanMobile, cleanEmail, hashedPassword, preferred_language]
    );
    const user = userRes.rows[0];

    await db.query(
      `INSERT INTO beneficiary_profiles (user_id, profile_completion)
       VALUES ($1, 0)`,
      [user.id]
    );

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Beneficiary registered successfully.',
      token,
      user,
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide both email/mobile and password.' });
    }

    const queryStr = email.toLowerCase().trim();

    if (db.getDriver() === 'mongodb') {
      const user = await User.findOne({
        $or: [{ email: queryStr }, { mobile: queryStr }],
      });

      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid login credentials. Please check and try again.' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid login credentials. Please check and try again.' });
      }

      const token = jwt.sign(
        { id: user._id, email: user.email, name: user.name, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.json({
        success: true,
        message: 'Login successful.',
        token,
        user: {
          id: user._id,
          name: user.name,
          mobile: user.mobile,
          email: user.email,
          preferred_language: user.preferred_language,
          role: user.role,
          created_at: user.createdAt,
        },
      });
    }

    // SQL Mode (PostgreSQL / SQLite fallback)
    const userRes = await db.query(
      `SELECT * FROM users WHERE email = $1 OR mobile = $1`,
      [queryStr]
    );

    if (userRes.rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid login credentials. Please check and try again.' });
    }

    const user = userRes.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid login credentials. Please check and try again.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    delete user.password;

    res.json({
      success: true,
      message: 'Login successful.',
      token,
      user,
    });
  } catch (error) {
    next(error);
  }
}

export async function getMe(req, res, next) {
  try {
    const userId = req.user.id;

    if (db.getDriver() === 'mongodb') {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }

      const profile = await BeneficiaryProfile.findOne({ user: userId });

      return res.json({
        success: true,
        user: {
          id: user._id,
          name: user.name,
          mobile: user.mobile,
          email: user.email,
          preferred_language: user.preferred_language,
          role: user.role,
          created_at: user.createdAt,
        },
        profile: profile || {},
        skills: profile?.skills || [],
      });
    }

    // SQL Mode
    const userRes = await db.query(
      'SELECT id, name, mobile, email, preferred_language, role, created_at FROM users WHERE id = $1',
      [userId]
    );

    if (userRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const profileRes = await db.query(
      'SELECT * FROM beneficiary_profiles WHERE user_id = $1',
      [userId]
    );

    const skillsRes = await db.query(
      `SELECT s.id, s.name, s.category, us.proficiency_level
       FROM user_skills us
       JOIN skills s ON us.skill_id = s.id
       WHERE us.user_id = $1`,
      [userId]
    );

    res.json({
      success: true,
      user: userRes.rows[0],
      profile: profileRes.rows[0] || {},
      skills: skillsRes.rows,
    });
  } catch (error) {
    next(error);
  }
}

export default { register, login, getMe };
