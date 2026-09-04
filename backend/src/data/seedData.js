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
