/**
 * DEMO / SAMPLE DATA FOR JEEVANVANI (PM-AJAY GIA)
 * 
 * NOTE: These are sample NSQF-aligned roles modeled after the National Skills Qualification Framework (NSQF)
 * guidelines published by the National Skill Development Corporation (NSDC) and Ministry of Skill Development
 * & Entrepreneurship (MSDE). They can be directly updated or replaced with verified official QP-NOS data via
 * the Admin Portal or by updating this seed file.
 */

export const sampleSkills = [
  // Electrical & Electronics
  { name: 'Basic Wiring', category: 'Electrical', description: 'Handling domestic single-phase and three-phase wiring connections' },
  { name: 'Tool Handling', category: 'General Technical', description: 'Proficiency in pliers, screwdrivers, strippers, and power drill tools' },
  { name: 'Electrical Safety', category: 'Electrical', description: 'Knowledge of earthing, circuit breakers, fuses, and personal protective equipment (PPE)' },
  { name: 'Multimeter & Testing Equipment', category: 'Electrical', description: 'Testing voltage, current, continuity, and diagnosing line faults' },
  { name: 'PCB Assembly & Soldering', category: 'Electronics', description: 'Assembling components on circuit boards and safe de-soldering' },
  { name: 'Appliance Repair', category: 'Electronics', description: 'Diagnosing motors, compressors, thermostats in home appliances' },

  // Solar & Green Jobs
  { name: 'Solar PV Module Mounting', category: 'Green Jobs', description: 'Mounting solar panels securely on rooftop and ground tilt structures' },
  { name: 'Inverter & Battery Wiring', category: 'Green Jobs', description: 'Connecting off-grid/hybrid inverters, charge controllers, and battery banks' },
  { name: 'Site Survey & Shading Analysis', category: 'Green Jobs', description: 'Measuring sun angles, azimuth, and identifying shadow-free rooftop space' },
  { name: 'Solar System Maintenance', category: 'Green Jobs', description: 'Periodic cleaning, thermal inspection, and connection tightening' },

  // Healthcare
  { name: 'Vital Signs Monitoring', category: 'Healthcare', description: 'Measuring blood pressure, pulse, temperature, and SpO2 levels' },
  { name: 'Patient Hygiene & Mobility', category: 'Healthcare', description: 'Assisting bedridden patients, wheelchair transfers, and grooming' },
  { name: 'First Aid & CPR', category: 'Healthcare', description: 'Emergency basic life support and wound dressing techniques' },
  { name: 'Infection Control', category: 'Healthcare', description: 'Sterilization, bio-medical waste segregation, and sanitization' },

  // IT & Digital Skills
  { name: 'Typing Speed (30+ WPM)', category: 'IT/ITeS', description: 'Fast and accurate alphanumeric touch-typing in English or Hindi' },
  { name: 'MS Office & Google Docs', category: 'IT/ITeS', description: 'Creating spreadsheets, basic formulas, tables, and formatted letters' },
  { name: 'Data Entry & Verification', category: 'IT/ITeS', description: 'Entering records into software systems and verifying data accuracy' },
  { name: 'Internet Navigation & Email', category: 'IT/ITeS', description: 'Composing formal emails, downloading attachments, and web portal submissions' },

  // Retail & Customer Service
  { name: 'Customer Greeting & Communication', category: 'Retail', description: 'Friendly customer interaction, addressing inquiries, and active listening' },
  { name: 'Point of Sale (POS) Billing', category: 'Retail', description: 'Operating barcode scanners, cash registers, card terminals, and digital payments' },
  { name: 'Inventory & Stock Display', category: 'Retail', description: 'Arranging shelves, checking expiry dates, stock replenishing, and visual merchandising' },
  { name: 'Cash Handling & Reconciliation', category: 'Retail', description: 'Counting daily drawer cash, tallying receipts, and deposit records' },

  // Automotive
  { name: '2-Wheeler Engine Servicing', category: 'Automotive', description: 'Oil change, carburetor cleaning, spark plug check, valve tuning' },
  { name: 'Brake & Suspension Overhaul', category: 'Automotive', description: 'Drum and disc brake pad replacement, fork oil change' },
  { name: 'Auto Electrical Diagnostics', category: 'Automotive', description: 'Battery testing, horn/headlight wiring, stator coil diagnostics' },

  // Construction
  { name: 'Bricklaying & Masonry', category: 'Construction', description: 'Laying standard brick courses with plumb-line and level accuracy' },
  { name: 'Cement Mortar Mixing', category: 'Construction', description: 'Proportioning sand, cement, and water for structural durability' },
  { name: 'Plastering & Surface Finishing', category: 'Construction', description: 'Applying uniform base and smooth top coats on masonry walls' },

  // Agriculture
  { name: 'Drip & Sprinkler Installation', category: 'Agriculture', description: 'Laying mainlines, sub-mains, lateral tubes, and drippers' },
  { name: 'Pump & Filter Maintenance', category: 'Agriculture', description: 'Cleaning disc/screen filters, venturi injector upkeep, and motor priming' },
  { name: 'Soil & Moisture Assessment', category: 'Agriculture', description: 'Testing soil moisture tension and scheduling optimal water cycles' },

  // Beauty & Wellness
  { name: 'Skin Care & Facials', category: 'Beauty', description: 'Cleansing, exfoliating, steam application, and face massage techniques' },
  { name: 'Hair Styling & Basic Cutting', category: 'Beauty', description: 'Hair washing, blow-drying, basic trims, and conditioning treatments' },
  { name: 'Threading & Waxing', category: 'Beauty', description: 'Facial hair threading, arm/leg waxing with hygiene protocols' },

  // Apparel / Handicrafts / Self-Employment
  { name: 'Garment Stitching & Tailoring', category: 'Apparel', description: 'Cutting fabric patterns and operating domestic/industrial sewing machines' },
  { name: 'Hand Embroidery & Traditional Crafts', category: 'Handicrafts', description: 'Traditional motif stitching, sequin work, and artisan detailing' },
  { name: 'Small Business Bookkeeping', category: 'Entrepreneurship', description: 'Basic ledger keeping, cost calculation, pricing, and profit margin analysis' },
];

export const sampleJobRoles = [
  {
    role_name: 'Assistant Electrician',
    sector: 'Construction & Electrical',
    nsqf_level: 3,
    description: 'Assists senior electricians in laying conduits, pulling wires, installing switchboards, fixtures, and conducting routine electrical safety checks on residential and commercial sites.',
    required_education: '10th Pass',
    training_duration: '350 Hours (approx. 3 months)',
    career_path: JSON.stringify([
      { title: 'Helper / Trainee', experience: '0 months', wage_range: '₹8,000 - ₹10,000/mo' },
      { title: 'Assistant Electrician', experience: '3 - 6 months', wage_range: '₹12,000 - ₹15,000/mo' },
      { title: 'Certified Electrician', experience: '1 - 3 years', wage_range: '₹18,000 - ₹24,000/mo' },
      { title: 'Electrical Supervisor', experience: '3 - 5 years', wage_range: '₹28,000 - ₹38,000/mo' },
      { title: 'Independent Contractor / Enterprise Owner', experience: '5+ years', wage_range: '₹50,000+/mo (Self-Employed)' }
    ]),
    skills: [
      { name: 'Basic Wiring', weight: 1.0, required_level: 'Intermediate' },
      { name: 'Tool Handling', weight: 0.9, required_level: 'Intermediate' },
      { name: 'Electrical Safety', weight: 1.0, required_level: 'Intermediate' },
      { name: 'Multimeter & Testing Equipment', weight: 0.8, required_level: 'Basic' }
    ]
  },
  {
    role_name: 'Solar PV Installer (Suryamitra)',
    sector: 'Solar / Green Jobs',
    nsqf_level: 4,
    description: 'Installs, tests, commissions, and maintains grid-tied and off-grid rooftop solar photovoltaic power plants in compliance with MNRE safety guidelines.',
    required_education: '10th Pass + ITI or 12th Pass',
    training_duration: '400 Hours (approx. 3.5 months)',
    career_path: JSON.stringify([
      { title: 'Solar Rooftop Trainee', experience: '0 months', wage_range: '₹10,000 - ₹12,000/mo' },
      { title: 'Solar PV Installer (Suryamitra)', experience: '6 months', wage_range: '₹15,000 - ₹20,000/mo' },
      { title: 'Solar Site In-charge / Lead Technician', experience: '2 - 3 years', wage_range: '₹25,000 - ₹35,000/mo' },
      { title: 'Project Engineer / Quality Auditor', experience: '4 - 6 years', wage_range: '₹40,000 - ₹55,000/mo' },
      { title: 'Solar EPC Contractor & Vendor', experience: '5+ years', wage_range: '₹75,000+/mo (Self-Employed)' }
    ]),
    skills: [
      { name: 'Solar PV Module Mounting', weight: 1.0, required_level: 'Intermediate' },
      { name: 'Inverter & Battery Wiring', weight: 1.0, required_level: 'Intermediate' },
      { name: 'Site Survey & Shading Analysis', weight: 0.8, required_level: 'Basic' },
      { name: 'Electrical Safety', weight: 0.9, required_level: 'Intermediate' },
      { name: 'Solar System Maintenance', weight: 0.7, required_level: 'Basic' }
    ]
  },
  {
    role_name: 'General Duty Assistant (Healthcare GDA)',
    sector: 'Healthcare',
    nsqf_level: 4,
    description: 'Provides direct patient care support in hospitals, nursing homes, and home healthcare, including measuring vital signs, mobility assistance, hygiene, and emergency support.',
    required_education: '10th Pass / 12th Pass',
    training_duration: '480 Hours (approx. 4 months)',
    career_path: JSON.stringify([
      { title: 'GDA Trainee / Ward Attendant', experience: '0 months', wage_range: '₹9,000 - ₹12,000/mo' },
      { title: 'General Duty Assistant', experience: '6 months - 1 year', wage_range: '₹14,000 - ₹18,000/mo' },
      { title: 'Senior GDA / Floor Team Lead', experience: '2 - 4 years', wage_range: '₹22,000 - ₹30,000/mo' },
      { title: 'Patient Care Coordinator', experience: '4 - 6 years', wage_range: '₹32,000 - ₹45,000/mo' },
      { title: 'Home Healthcare Agency Founder', experience: '6+ years', wage_range: '₹60,000+/mo (Self-Employed)' }
    ]),
    skills: [
      { name: 'Vital Signs Monitoring', weight: 1.0, required_level: 'Intermediate' },
      { name: 'Patient Hygiene & Mobility', weight: 1.0, required_level: 'Intermediate' },
      { name: 'First Aid & CPR', weight: 0.9, required_level: 'Intermediate' },
      { name: 'Infection Control', weight: 0.8, required_level: 'Basic' }
    ]
  },
  {
    role_name: 'Domestic Data Entry Operator (DDEO)',
    sector: 'IT / ITeS',
    nsqf_level: 4,
    description: 'Collects, prepares, enters, and manages data accurately into enterprise software, digital portals, and administrative databases with high keystroke speed and confidentiality.',
    required_education: '10th Pass or 12th Pass',
    training_duration: '400 Hours (approx. 3.5 months)',
    career_path: JSON.stringify([
      { title: 'Junior Data Operator', experience: '0 months', wage_range: '₹10,000 - ₹13,000/mo' },
      { title: 'Data Entry Operator', experience: '6 months - 2 years', wage_range: '₹15,000 - ₹20,000/mo' },
      { title: 'MIS Executive / Data Coordinator', experience: '2 - 4 years', wage_range: '₹24,000 - ₹32,000/mo' },
      { title: 'Operations Supervisor / Team Lead', experience: '4 - 6 years', wage_range: '₹35,000 - ₹48,000/mo' },
      { title: 'CSC (Common Service Center) Owner', experience: '3+ years', wage_range: '₹40,000 - ₹70,000/mo (Self-Employed)' }
    ]),
    skills: [
      { name: 'Typing Speed (30+ WPM)', weight: 1.0, required_level: 'Advanced' },
      { name: 'MS Office & Google Docs', weight: 0.9, required_level: 'Intermediate' },
      { name: 'Data Entry & Verification', weight: 1.0, required_level: 'Intermediate' },
      { name: 'Internet Navigation & Email', weight: 0.7, required_level: 'Intermediate' }
    ]
  },
  {
    role_name: 'Retail Sales Associate',
    sector: 'Retail',
    nsqf_level: 4,
    description: 'Operates on retail sales floors, assists shoppers with product information, handles cash/card billing terminals, and maintains stock visibility and visual merchandising.',
    required_education: '10th Pass or 12th Pass',
    training_duration: '320 Hours (approx. 2.5 months)',
    career_path: JSON.stringify([
      { title: 'Store Assistant', experience: '0 months', wage_range: '₹9,000 - ₹12,000/mo' },
      { title: 'Retail Sales Associate', experience: '6 months - 2 years', wage_range: '₹14,000 - ₹18,000/mo' },
      { title: 'Senior Sales Executive / Department Head', experience: '2 - 4 years', wage_range: '₹22,000 - ₹28,000/mo' },
      { title: 'Assistant Store Manager', experience: '4 - 6 years', wage_range: '₹32,000 - ₹45,000/mo' },
      { title: 'Franchise / Retail Store Owner', experience: '5+ years', wage_range: '₹50,000+/mo (Self-Employed)' }
    ]),
    skills: [
      { name: 'Customer Greeting & Communication', weight: 1.0, required_level: 'Intermediate' },
      { name: 'Point of Sale (POS) Billing', weight: 0.9, required_level: 'Intermediate' },
      { name: 'Inventory & Stock Display', weight: 0.8, required_level: 'Basic' },
      { name: 'Cash Handling & Reconciliation', weight: 0.7, required_level: 'Basic' }
    ]
  },
  {
    role_name: 'Automotive Service Technician (2 & 3 Wheeler)',
    sector: 'Automotive',
    nsqf_level: 4,
    description: 'Diagnoses, repairs, tunes, and overhauls two and three-wheeler internal combustion and EV vehicles, including engine systems, brakes, transmission, and wiring.',
    required_education: '8th Pass or 10th Pass',
    training_duration: '450 Hours (approx. 4 months)',
    career_path: JSON.stringify([
      { title: 'Garage Assistant / Mechanic Trainee', experience: '0 months', wage_range: '₹8,000 - ₹11,000/mo' },
      { title: '2-Wheeler Service Technician', experience: '1 - 2 years', wage_range: '₹14,000 - ₹20,000/mo' },
      { title: 'Senior Diagnostic Mechanic', experience: '2 - 4 years', wage_range: '₹22,000 - ₹30,000/mo' },
      { title: 'Workshop Service In-Charge', experience: '4 - 6 years', wage_range: '₹32,000 - ₹45,000/mo' },
      { title: 'Independent Auto Service Center Owner', experience: '4+ years', wage_range: '₹50,000 - ₹90,000/mo (Self-Employed)' }
    ]),
    skills: [
      { name: '2-Wheeler Engine Servicing', weight: 1.0, required_level: 'Intermediate' },
      { name: 'Brake & Suspension Overhaul', weight: 0.9, required_level: 'Intermediate' },
      { name: 'Auto Electrical Diagnostics', weight: 0.8, required_level: 'Basic' },
      { name: 'Tool Handling', weight: 0.8, required_level: 'Intermediate' }
    ]
  },
  {
    role_name: 'Mason General',
    sector: 'Construction',
    nsqf_level: 3,
    description: 'Carries out brick masonry, block work, random rubble masonry, mortar batching, floor screeding, and plastering with structural safety compliance.',
    required_education: '5th / 8th Pass',
    training_duration: '350 Hours (approx. 3 months)',
    career_path: JSON.stringify([
      { title: 'Beldar / Helper', experience: '0 months', wage_range: '₹8,000 - ₹10,000/mo' },
      { title: 'Mason General (Junior)', experience: '6 months - 1 year', wage_range: '₹13,000 - ₹17,000/mo' },
      { title: 'Master Mason / Lead Artisan', experience: '2 - 4 years', wage_range: '₹20,000 - ₹28,000/mo' },
      { title: 'Construction Site Supervisor', experience: '4 - 7 years', wage_range: '₹30,000 - ₹42,000/mo' },
      { title: 'Civil Contractor / Subcontractor', experience: '5+ years', wage_range: '₹50,000 - ₹1,00,000/mo (Self-Employed)' }
    ]),
    skills: [
      { name: 'Bricklaying & Masonry', weight: 1.0, required_level: 'Intermediate' },
      { name: 'Cement Mortar Mixing', weight: 0.9, required_level: 'Intermediate' },
      { name: 'Plastering & Surface Finishing', weight: 0.9, required_level: 'Intermediate' },
      { name: 'Tool Handling', weight: 0.7, required_level: 'Basic' }
    ]
  },
  {
    role_name: 'Micro Irrigation Technician',
    sector: 'Agriculture',
    nsqf_level: 4,
    description: 'Designs layout, installs pipelines, drippers, micro-sprinklers, filters, and automated fertigation systems to conserve water and maximize farm crop yields.',
    required_education: '10th Pass',
    training_duration: '320 Hours (approx. 2.5 months)',
    career_path: JSON.stringify([
      { title: 'Field Helper', experience: '0 months', wage_range: '₹8,000 - ₹11,000/mo' },
      { title: 'Micro Irrigation Technician', experience: '6 months - 2 years', wage_range: '₹14,000 - ₹19,000/mo' },
      { title: 'Senior Irrigation Field Supervisor', experience: '2 - 4 years', wage_range: '₹22,000 - ₹30,000/mo' },
      { title: 'Farm Automation Consultant', experience: '4 - 6 years', wage_range: '₹35,000 - ₹50,000/mo' },
      { title: 'Agri-Equipment Dealership & Service Owner', experience: '4+ years', wage_range: '₹60,000+/mo (Self-Employed)' }
    ]),
    skills: [
      { name: 'Drip & Sprinkler Installation', weight: 1.0, required_level: 'Intermediate' },
      { name: 'Pump & Filter Maintenance', weight: 0.9, required_level: 'Intermediate' },
      { name: 'Soil & Moisture Assessment', weight: 0.8, required_level: 'Basic' },
      { name: 'Tool Handling', weight: 0.7, required_level: 'Basic' }
    ]
  },
  {
    role_name: 'Assistant Beauty Therapist',
    sector: 'Beauty & Wellness',
    nsqf_level: 3,
    description: 'Provides salon skin care, waxing, bleaching, manicures, pedicures, makeup assistance, and salon hygiene under guidance of senior cosmetologists.',
    required_education: '8th Pass or 10th Pass',
    training_duration: '350 Hours (approx. 3 months)',
    career_path: JSON.stringify([
      { title: 'Salon Assistant', experience: '0 months', wage_range: '₹8,000 - ₹10,000/mo' },
      { title: 'Assistant Beauty Therapist', experience: '6 months - 1.5 years', wage_range: '₹13,000 - ₹18,000/mo' },
      { title: 'Senior Aesthetician / Hair Stylist', experience: '2 - 4 years', wage_range: '₹22,000 - ₹32,000/mo' },
      { title: 'Salon Manager', experience: '4 - 6 years', wage_range: '₹32,000 - ₹45,000/mo' },
      { title: 'Beauty Parlour / Bridal Studio Owner', experience: '3+ years', wage_range: '₹40,000 - ₹80,000/mo (Self-Employed)' }
    ]),
    skills: [
      { name: 'Skin Care & Facials', weight: 1.0, required_level: 'Intermediate' },
      { name: 'Hair Styling & Basic Cutting', weight: 0.8, required_level: 'Basic' },
      { name: 'Threading & Waxing', weight: 0.9, required_level: 'Intermediate' },
      { name: 'Customer Greeting & Communication', weight: 0.7, required_level: 'Basic' }
    ]
  },
  {
    role_name: 'Field Technician - Home Appliances',
    sector: 'Electronics',
    nsqf_level: 4,
    description: 'Visits customer premises to install, troubleshoot, repair, and service consumer home appliances like refrigerators, washing machines, and microwave ovens.',
    required_education: '10th Pass + ITI or 12th Pass',
    training_duration: '400 Hours (approx. 3.5 months)',
    career_path: JSON.stringify([
      { title: 'Apprentice Technician', experience: '0 months', wage_range: '₹9,000 - ₹12,000/mo' },
      { title: 'Field Service Technician', experience: '6 months - 2 years', wage_range: '₹15,000 - ₹22,000/mo' },
      { title: 'Senior Appliance Specialist', experience: '2 - 4 years', wage_range: '₹25,000 - ₹34,000/mo' },
      { title: 'Authorized Service Center Lead', experience: '4 - 6 years', wage_range: '₹36,000 - ₹50,000/mo' },
      { title: 'Multi-Brand Service Franchisee', experience: '4+ years', wage_range: '₹60,000 - ₹1,20,000/mo (Self-Employed)' }
    ]),
    skills: [
      { name: 'Appliance Repair', weight: 1.0, required_level: 'Intermediate' },
      { name: 'Multimeter & Testing Equipment', weight: 0.9, required_level: 'Intermediate' },
      { name: 'PCB Assembly & Soldering', weight: 0.8, required_level: 'Basic' },
      { name: 'Electrical Safety', weight: 0.9, required_level: 'Intermediate' },
      { name: 'Customer Greeting & Communication', weight: 0.6, required_level: 'Basic' }
    ]
  },
  {
    role_name: 'Handicraft Artisan & Garment Tailor',
    sector: 'Apparel & Handicrafts (Self-Employment)',
    nsqf_level: 4,
    description: 'Creates customized ethnic apparel, uniforms, and hand-embroidered artisanal goods for local markets, SHGs (Self-Help Groups), and direct e-commerce sales.',
    required_education: '8th Pass or 10th Pass',
    training_duration: '350 Hours (approx. 3 months)',
    career_path: JSON.stringify([
      { title: 'Tailoring Apprentice', experience: '0 months', wage_range: '₹7,000 - ₹10,000/mo' },
      { title: 'Skilled Artisan / Pattern Cutter', experience: '6 months - 2 years', wage_range: '₹14,000 - ₹18,000/mo' },
      { title: 'Master Tailor & SHG Production Leader', experience: '2 - 4 years', wage_range: '₹22,000 - ₹30,000/mo' },
      { title: 'Boutique / Apparel Unit Owner', experience: '3+ years', wage_range: '₹35,000 - ₹75,000/mo (Self-Employed)' },
      { title: 'Export Artisan & Handloom Enterprise Founder', experience: '5+ years', wage_range: '₹80,000+/mo (Self-Employed)' }
    ]),
    skills: [
      { name: 'Garment Stitching & Tailoring', weight: 1.0, required_level: 'Intermediate' },
      { name: 'Hand Embroidery & Traditional Crafts', weight: 0.9, required_level: 'Intermediate' },
      { name: 'Small Business Bookkeeping', weight: 0.8, required_level: 'Basic' },
      { name: 'Customer Greeting & Communication', weight: 0.6, required_level: 'Basic' }
    ]
  }
];

export const sampleAdminUser = {
  name: 'PM-AJAY State Administrator',
  mobile: '9876543210',
  email: 'admin@pmajay.gov.in',
  password: 'Admin@123',
  preferred_language: 'hi',
  role: 'admin'
};

export const sampleBeneficiaryUser = {
  name: 'Rahul Kumar',
  mobile: '9812345678',
  email: 'rahul.kumar@gmail.com',
  password: 'User@123',
  preferred_language: 'hi',
  role: 'beneficiary'
};

// =================================================================
// VERIFIED LIVELIHOOD OPPORTUNITIES (PM-AJAY / NCS / GOVT PORTALS)
// =================================================================
export const sampleJobs = [
  {
    title: 'Assistant Electrician (Rooftop & Facility Wiring)',
    organization: 'Schneider Electric Infrastructure / NCS Partner',
    sector: 'Construction & Electrical',
    job_role_name: 'Assistant Electrician',
    location: 'Kanpur / Lucknow, UP',
    eligibility: '10th Pass with vocational electrical training or 6 months helper experience',
    salary: '₹14,000 - ₹18,000/mo',
    application_url: 'https://www.ncs.gov.in/job-seeker/pages/search.aspx',
    source: 'National Career Service (NCS)',
    source_id: 'NCS-2026-EL4901',
    required_skills: JSON.stringify(['Basic Wiring', 'Tool Handling', 'Electrical Safety', 'Multimeter & Testing Equipment']),
    is_verified: 1,
    posted_at: '2026-08-15',
    expires_at: '2026-12-31',
    last_verified_at: '2026-09-01'
  },
  {
    title: 'Solar PV Rooftop Installer (Suryamitra)',
    organization: 'Tata Power Solar Systems / PM-AJAY Green Energy Partner',
    sector: 'Solar / Green Jobs',
    job_role_name: 'Solar PV Installer (Suryamitra)',
    location: 'Varanasi / Prayagraj, UP',
    eligibility: '10th Pass + ITI or 12th Pass with Suryamitra certification',
    salary: '₹16,000 - ₹22,000/mo',
    application_url: 'https://www.ncs.gov.in/job-seeker/pages/search.aspx',
    source: 'PM-AJAY District Livelihood Cell',
    source_id: 'PMAJAY-SOLAR-092',
    required_skills: JSON.stringify(['Solar PV Module Mounting', 'Inverter & Battery Wiring', 'Electrical Safety', 'Site Survey & Shading Analysis']),
    is_verified: 1,
    posted_at: '2026-08-20',
    expires_at: '2026-12-31',
    last_verified_at: '2026-09-01'
  },
  {
    title: 'General Duty Assistant (Healthcare GDA)',
    organization: 'Max Healthcare Care At Home / PM-AJAY GIA Partner',
    sector: 'Healthcare',
    job_role_name: 'General Duty Assistant (Healthcare GDA)',
    location: 'Lucknow / Kanpur, UP',
    eligibility: '10th Pass with certified GDA training',
    salary: '₹13,000 - ₹17,000/mo',
    application_url: 'https://www.ncs.gov.in/job-seeker/pages/search.aspx',
    source: 'National Career Service (NCS)',
    source_id: 'NCS-2026-GDA102',
    required_skills: JSON.stringify(['Vital Signs Monitoring', 'Patient Hygiene & Mobility', 'First Aid & CPR', 'Infection Control']),
    is_verified: 1,
    posted_at: '2026-08-10',
    expires_at: '2026-12-15',
    last_verified_at: '2026-09-01'
  },
  {
    title: 'Domestic Data Entry Operator (DDEO)',
    organization: 'CSC e-Governance Services India Ltd',
    sector: 'IT / ITeS',
    job_role_name: 'Domestic Data Entry Operator (DDEO)',
    location: 'Kanpur Dehat / Unnao, UP',
    eligibility: '10th Pass or 12th Pass with touch-typing skills (30+ WPM)',
    salary: '₹12,000 - ₹16,000/mo',
    application_url: 'https://www.ncs.gov.in/job-seeker/pages/search.aspx',
    source: 'National Career Service (NCS)',
    source_id: 'NCS-2026-DDEO55',
    required_skills: JSON.stringify(['Typing Speed (30+ WPM)', 'Data Entry & Verification', 'MS Office & Google Docs']),
    is_verified: 1,
    posted_at: '2026-08-25',
    expires_at: '2026-11-30',
    last_verified_at: '2026-09-01'
  },
  {
    title: 'Two-Wheeler Service & Maintenance Technician',
    organization: 'Hero MotoCorp Authorized Service Partner',
    sector: 'Automotive',
    job_role_name: 'Automotive Service Technician (2 & 3 Wheeler)',
    location: 'Agra / Aligarh, UP',
    eligibility: '8th Pass or 10th Pass with automotive mechanical aptitude',
    salary: '₹13,000 - ₹19,000/mo',
    application_url: 'https://www.ncs.gov.in/job-seeker/pages/search.aspx',
    source: 'Automotive Skills Development Council (ASDC)',
    source_id: 'ASDC-2026-2W88',
    required_skills: JSON.stringify(['2-Wheeler Engine Servicing', 'Brake & Suspension Overhaul', 'Tool Handling', 'Auto Electrical Diagnostics']),
    is_verified: 1,
    posted_at: '2026-08-18',
    expires_at: '2026-12-31',
    last_verified_at: '2026-09-01'
  },
  {
    title: 'Garment Production Artisan & Tailor',
    organization: 'FabIndia Crafts & Artisans Producer Company',
    sector: 'Apparel & Handicrafts',
    job_role_name: 'Handicraft Artisan & Garment Tailor',
    location: 'Bareilly / Moradabad, UP',
    eligibility: '8th Pass with garment stitching experience or PM-AJAY skill certificate',
    salary: '₹15,000 - ₹24,000/mo + Production Incentive',
    application_url: 'https://www.ncs.gov.in/job-seeker/pages/search.aspx',
    source: 'PM-AJAY Cluster Enterprise Support',
    source_id: 'PMAJAY-CLUST-712',
    required_skills: JSON.stringify(['Garment Stitching & Tailoring', 'Hand Embroidery & Traditional Crafts', 'Small Business Bookkeeping']),
    is_verified: 1,
    posted_at: '2026-08-28',
    expires_at: '2026-12-31',
    last_verified_at: '2026-09-01'
  },
  {
    title: 'Field Technician - Home Appliances',
    organization: 'Voltas Customer Service & Care Ltd',
    sector: 'Electronics',
    job_role_name: 'Field Technician - Home Appliances',
    location: 'Noida / Ghaziabad, UP',
    eligibility: '10th Pass with Electronics training or Appliance repair experience',
    salary: '₹14,000 - ₹20,000/mo',
    application_url: 'https://www.ncs.gov.in/job-seeker/pages/search.aspx',
    source: 'National Career Service (NCS)',
    source_id: 'NCS-2026-FT62',
    required_skills: JSON.stringify(['Appliance Repair', 'Electrical Safety', 'Multimeter & Testing Equipment', 'Tool Handling']),
    is_verified: 1,
    posted_at: '2026-08-22',
    expires_at: '2026-12-31',
    last_verified_at: '2026-09-01'
  },
  {
    title: 'Micro-Irrigation Field Technician',
    organization: 'Jain Irrigation Systems / FPO Livelihood Cell',
    sector: 'Agriculture',
    job_role_name: 'Micro Irrigation Technician',
    location: 'Jhansi / Bundelkhand, UP',
    eligibility: '10th Pass or 12th Pass with agricultural mechanics interest',
    salary: '₹14,000 - ₹18,000/mo + Field Allowance',
    application_url: 'https://www.ncs.gov.in/job-seeker/pages/search.aspx',
    source: 'Agriculture Skill Council of India (ASCI)',
    source_id: 'ASCI-2026-IRR41',
    required_skills: JSON.stringify(['Drip & Sprinkler Installation', 'Pump & Filter Maintenance', 'Soil & Moisture Assessment']),
    is_verified: 1,
    posted_at: '2026-08-12',
    expires_at: '2026-12-31',
    last_verified_at: '2026-09-01'
  }
];

// =================================================================
// VERIFIED NSQF SKILLING COURSES (SKILL INDIA DIGITAL / PMKVY 4.0)
// =================================================================
export const sampleCourses = [
  {
    course_name: 'Assistant Electrician - NSQF Level 3',
    qualification_pack_id: 'ELE/Q0105',
    job_role_name: 'Assistant Electrician',
    nsqf_level: 3,
    duration: '350 Hours (approx. 3 months)',
    eligibility: '10th Pass',
    skills_covered: JSON.stringify(['Basic Wiring', 'Tool Handling', 'Electrical Safety', 'Multimeter & Testing Equipment']),
    training_provider: 'National Skill Training Institute (NSTI) / PMKVY Partner',
    training_center_location: 'District Skill Center, Kanpur / Lucknow',
    mode: 'Offline / Practical Workshop',
    certification_body: 'NCVET / Electronics Sector Skills Council of India',
    rpl_available: 1,
    enrollment_url: 'https://www.skillindiadigital.gov.in/courses',
    is_verified: 1,
    source: 'Skill India Digital / PMKVY 4.0 Special Project',
    stipend_info: '100% Free under PM-AJAY GIA + Free Tool-Kit on Certification',
    last_verified_at: '2026-09-01'
  },
  {
    course_name: 'Solar PV Installer (Suryamitra) - NSQF Level 4',
    qualification_pack_id: 'SGJ/Q0101',
    job_role_name: 'Solar PV Installer (Suryamitra)',
    nsqf_level: 4,
    duration: '400 Hours (approx. 3.5 months)',
    eligibility: '10th Pass + ITI or 12th Pass',
    skills_covered: JSON.stringify(['Solar PV Module Mounting', 'Inverter & Battery Wiring', 'Site Survey & Shading Analysis', 'Solar System Maintenance']),
    training_provider: 'National Institute of Solar Energy (NISE) Partner Center',
    training_center_location: 'Regional Solar Training Center, Varanasi / Lucknow',
    mode: 'Offline / Practical Rooftop Lab',
    certification_body: 'Skill Council for Green Jobs (SCGJ)',
    rpl_available: 1,
    enrollment_url: 'https://www.skillindiadigital.gov.in/courses',
    is_verified: 1,
    source: 'Skill India Digital / MNRE Suryamitra',
    stipend_info: '100% Subsidized under PM-AJAY GIA + Free Safety PPE Kit',
    last_verified_at: '2026-09-01'
  },
  {
    course_name: 'General Duty Assistant (GDA) - NSQF Level 4',
    qualification_pack_id: 'HSS/Q5101',
    job_role_name: 'General Duty Assistant (Healthcare GDA)',
    nsqf_level: 4,
    duration: '450 Hours (includes 150 hrs Hospital Internship)',
    eligibility: '10th Pass',
    skills_covered: JSON.stringify(['Vital Signs Monitoring', 'Patient Hygiene & Mobility', 'First Aid & CPR', 'Infection Control']),
    training_provider: 'Healthcare Sector Skill Council (HSSC) Training Partner',
    training_center_location: 'Civil Hospital Campus / Authorized Skill Academy, Lucknow',
    mode: 'Hybrid (Classroom + Hospital Internship)',
    certification_body: 'Health Sector Skill Council (HSSC) / NCVET',
    rpl_available: 1,
    enrollment_url: 'https://www.skillindiadigital.gov.in/courses',
    is_verified: 1,
    source: 'Skill India Digital / PMKVY 4.0',
    stipend_info: 'Free Course + Hospital Uniform & Medical Kit provided',
    last_verified_at: '2026-09-01'
  },
  {
    course_name: 'Domestic Data Entry Operator - NSQF Level 4',
    qualification_pack_id: 'SSC/Q2212',
    job_role_name: 'Domestic Data Entry Operator (DDEO)',
    nsqf_level: 4,
    duration: '400 Hours',
    eligibility: '10th Pass',
    skills_covered: JSON.stringify(['Typing Speed (30+ WPM)', 'MS Office & Google Docs', 'Data Entry & Verification', 'Internet Navigation & Email']),
    training_provider: 'NIELIT / CSC Academy Regional Center',
    training_center_location: 'CSC Digital Training Center, Kanpur',
    mode: 'Computer Lab Classroom',
    certification_body: 'IT-ITeS SSC (NASSCOM) / NCVET',
    rpl_available: 1,
    enrollment_url: 'https://www.skillindiadigital.gov.in/courses',
    is_verified: 1,
    source: 'Skill India Digital / PMKVY',
    stipend_info: '100% Free under PM-AJAY GIA Component',
    last_verified_at: '2026-09-01'
  },
  {
    course_name: 'Automotive Service Technician (2 & 3 Wheeler) - NSQF Level 4',
    qualification_pack_id: 'ASC/Q1411',
    job_role_name: 'Automotive Service Technician (2 & 3 Wheeler)',
    nsqf_level: 4,
    duration: '450 Hours',
    eligibility: '10th Pass or 8th Pass with 1 yr experience',
    skills_covered: JSON.stringify(['2-Wheeler Engine Servicing', 'Brake & Suspension Overhaul', 'Auto Electrical Diagnostics', 'Tool Handling']),
    training_provider: 'Automotive Training Center (ASDC Partner)',
    training_center_location: 'Industrial Estate Workshop, Agra',
    mode: 'Workshop Practical',
    certification_body: 'Automotive Skills Development Council (ASDC)',
    rpl_available: 1,
    enrollment_url: 'https://www.skillindiadigital.gov.in/courses',
    is_verified: 1,
    source: 'Skill India Digital / ASDC',
    stipend_info: 'Tool-kit subsidy linked with PM-AJAY on completion',
    last_verified_at: '2026-09-01'
  },
  {
    course_name: 'Self Employed Tailor - NSQF Level 4',
    qualification_pack_id: 'AMH/Q1947',
    job_role_name: 'Handicraft Artisan & Garment Tailor',
    nsqf_level: 4,
    duration: '340 Hours',
    eligibility: '8th Pass',
    skills_covered: JSON.stringify(['Garment Stitching & Tailoring', 'Hand Embroidery & Traditional Crafts', 'Small Business Bookkeeping']),
    training_provider: 'Apparel Made-Ups & Home Furnishing Sector Skill Council Center',
    training_center_location: 'Artisan Hub, Bareilly',
    mode: 'Practical Sewing Lab',
    certification_body: 'AMHSSC / NCVET',
    rpl_available: 1,
    enrollment_url: 'https://www.skillindiadigital.gov.in/courses',
    is_verified: 1,
    source: 'Skill India Digital / PM-AJAY GIA',
    stipend_info: 'Eligible for ₹50,000 PM-AJAY enterprise tool-kit subsidy',
    last_verified_at: '2026-09-01'
  }
];

// =================================================================
// GROUNDED KNOWLEDGE DOCUMENTS FOR NSQF & PM-AJAY RAG
// =================================================================
export const sampleKnowledgeDocs = [
  {
    title: 'PM-AJAY Grant-in-Aid (GIA) Component Guidelines',
    document_type: 'PM_AJAY_SCHEME',
    nsqf_level: null,
    sector: 'Multi-Sector',
    content: 'The Grant-in-Aid (GIA) component of Pradhan Mantri Anusuchit Jaati Abhyuday Yojana (PM-AJAY) provides 100% financial assistance for skill development and livelihood generation for Scheduled Caste (SC) beneficiaries. It includes free NSQF-aligned vocational training, financial assistance up to ₹50,000 for purchasing tool-kits for self-employment, and soft credit linkages through NSFDC and PMMY Mudra loans.',
    source: 'Ministry of Social Justice & Empowerment, Govt. of India',
    source_url: 'https://pmajay.dosje.gov.in/',
    keywords: 'PM-AJAY, GIA, Scheduled Caste, SC, tool-kit subsidy, free skilling, Mudra loan, NSFDC',
    last_verified_at: '2026-09-01'
  },
  {
    title: 'Recognition of Prior Learning (RPL) Policy under NCVET / MSDE',
    document_type: 'RPL_PATHWAY',
    nsqf_level: 3,
    sector: 'All NSQF Sectors',
    content: 'Recognition of Prior Learning (RPL) certifies skills acquired informally by artisans, craftspersons, and informal wage workers. Candidates undergo a 12-hour orientation, domain bridge learning, and formal assessment. Certified candidates receive a government-recognized NSQF certificate, digital ID card, ₹500 DBT stipend, and 3-year free accidental insurance under PMKVY.',
    source: 'National Council for Vocational Education and Training (NCVET)',
    source_url: 'https://www.skillindiadigital.gov.in/',
    keywords: 'RPL, Recognition of Prior Learning, informal skills, orientation, stipend, NCVET',
    last_verified_at: '2026-09-01'
  },
  {
    title: 'NSQF Level 3 and Level 4 Competency Descriptors',
    document_type: 'NSQF_GUIDELINE',
    nsqf_level: 4,
    sector: 'National Skills Qualification Framework',
    content: 'NSQF Level 3 prepares individuals to carry out job roles requiring limited range of activities, predictable routines, and basic understanding of safety and tools. NSQF Level 4 prepares technicians for work that requires a wide range of practical skills, recall of technical knowledge, understanding of quality parameters, and ability to handle independent tasks with minimal supervision.',
    source: 'Ministry of Skill Development and Entrepreneurship (MSDE)',
    source_url: 'https://www.msde.gov.in/',
    keywords: 'NSQF Level 3, NSQF Level 4, descriptors, qualification packs, competencies',
    last_verified_at: '2026-09-01'
  },
  {
    title: 'NSFDC Concessional Credit Linkages for SC Beneficiaries',
    document_type: 'CREDIT_LINKAGE',
    nsqf_level: null,
    sector: 'Enterprise & Self-Employment',
    content: 'National Scheduled Castes Finance and Development Corporation (NSFDC) provides term loans, micro-credit finance, and Mahila Samriddhi Yojana loans for SC entrepreneurs who complete NSQF-aligned skilling. Interest rates range from 4% to 6% per annum with repayment periods of up to 5 years, facilitating capital for tool purchase, equipment, and shop setup.',
    source: 'National Scheduled Castes Finance and Development Corporation (NSFDC)',
    source_url: 'https://nsfdc.nic.in/',
    keywords: 'NSFDC, loan, concessional credit, self-employment, interest subsidy, SC finance',
    last_verified_at: '2026-09-01'
  }
];
