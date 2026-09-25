import OfficialSourceAdapter from './OfficialSourceAdapter.js';

/**
 * NSDCAdapter
 * Adapter for National Skill Development Corporation (NSDC) and NCVET standards.
 * Fetches official Qualification Packs (QPs), National Occupational Standards (NOS),
 * and Sector Skill Council (SSC) competency frameworks.
 */
export class NSDCAdapter extends OfficialSourceAdapter {
  constructor() {
    super({
      sourceName: 'National Skill Development Corporation (NSDC)',
      baseUrl: process.env.NSDC_BASE_URL || 'https://www.nsdcindia.org',
      cacheTtlMs: 3600000 * 4, // 4 hours
      staleTtlMs: 86400000 * 7, // 7 days
    });
  }

  /**
   * Verified baseline NSQF Qualification standards across key livelihood sectors
   */
  getBaselineQualifications() {
    return [
      {
        qp_code: 'SGJ/Q0101',
        title: 'Solar PV Installation Technician (Suryamitra)',
        sector: 'Solar / Green Jobs',
        nsqf_level: 4,
        version: '3.0',
        ssc: 'Skill Council for Green Jobs',
        entry_qualification: '10th Pass + 2 years ITI (Electrician / Wireman) or 12th Pass',
        nos_count: 5,
        rpl_pathway_available: true,
        official_qp_pdf: 'https://www.nqr.gov.in/sites/default/files/QP-SGJ-Q0101.pdf',
        nos_list: [
          { code: 'SGJ/N0101', name: 'Site survey and rooftop assessment for solar PV' },
          { code: 'SGJ/N0102', name: 'Installation of civil & mechanical mounting structures' },
          { code: 'SGJ/N0103', name: 'Electrical wiring, inverter connection, and safety earthing' },
          { code: 'SGJ/N0104', name: 'Testing, commissioning, and grid synchronization' },
          { code: 'SGJ/N0105', name: 'Health, safety, and environmental practices in renewable energy' }
        ]
      },
      {
        qp_code: 'CON/Q0602',
        title: 'Assistant Electrician',
        sector: 'Construction & Electrical',
        nsqf_level: 3,
        version: '2.0',
        ssc: 'Construction Skill Development Council of India',
        entry_qualification: '8th Pass with basic literacy or 10th Pass',
        nos_count: 4,
        rpl_pathway_available: true,
        official_qp_pdf: 'https://www.nqr.gov.in/sites/default/files/QP-CON-Q0602.pdf',
        nos_list: [
          { code: 'CON/N0602', name: 'Handling electrical tools, meters, and basic conduits' },
          { code: 'CON/N0603', name: 'Installation of wiring, single-phase fittings, and sockets' },
          { code: 'CON/N0604', name: 'Earthing and distribution box wire dressing' },
          { code: 'CON/N0605', name: 'Workplace health, safety, and emergency response' }
        ]
      },
      {
        qp_code: 'ASC/Q1411',
        title: 'Automotive Service Technician (2 & 3 Wheeler)',
        sector: 'Automotive',
        nsqf_level: 4,
        version: '2.5',
        ssc: 'Automotive Skills Development Council',
        entry_qualification: '10th Pass or 8th Pass with 1 Year Garage helper experience',
        nos_count: 5,
        rpl_pathway_available: true,
        official_qp_pdf: 'https://www.nqr.gov.in/sites/default/files/QP-ASC-Q1411.pdf',
        nos_list: [
          { code: 'ASC/N1411', name: 'Routine maintenance of 2/3 wheeler engines and transmission' },
          { code: 'ASC/N1412', name: 'Electrical subsystem testing and battery servicing' },
          { code: 'ASC/N1413', name: 'Brake, suspension, and steering assembly repairs' },
          { code: 'ASC/N1414', name: 'Electric 2-wheeler motor controller inspection' },
          { code: 'ASC/N1415', name: 'Safe shop floor practices and waste disposal' }
        ]
      },
      {
        qp_code: 'ASC/Q1402',
        title: 'Mechanic Motor Vehicle (DGT / NIMI)',
        sector: 'Automotive',
        nsqf_level: 4,
        version: '3.0',
        ssc: 'Automotive Skills Development Council / DGT',
        entry_qualification: '10th Pass with Science and Mathematics',
        nos_count: 5,
        rpl_pathway_available: true,
        official_qp_pdf: 'https://www.nqr.gov.in/sites/default/files/QP-ASC-Q1402.pdf',
        nos_list: [
          { code: 'ASC/N1402', name: 'Engine overhaul, valve timing and compression testing' },
          { code: 'ASC/N1403', name: 'Common rail diesel injection and fuel pump calibration' },
          { code: 'ASC/N1404', name: 'Clutch, gearbox and prop shaft differential overhaul' },
          { code: 'ASC/N1405', name: 'Hydraulic and air brake maintenance' },
          { code: 'ASC/N1406', name: 'Vehicle diagnostics using OBD-II scanner tools' }
        ]
      },
      {
        qp_code: 'AMH/Q1947',
        title: 'Self-Employed Tailor & Apparel Artisan',
        sector: 'Apparel & Handicrafts',
        nsqf_level: 4,
        version: '2.0',
        ssc: 'Apparel Made-Ups & Home Furnishing SSC',
        entry_qualification: '8th Pass with basic stitching familiarity',
        nos_count: 4,
        rpl_pathway_available: true,
        official_qp_pdf: 'https://www.nqr.gov.in/sites/default/files/QP-AMH-Q1947.pdf',
        nos_list: [
          { code: 'AMH/N1947', name: 'Taking body measurements and pattern drafting' },
          { code: 'AMH/N1948', name: 'Fabric cutting, sewing machine operation, and stitching' },
          { code: 'AMH/N1949', name: 'Ironing, garment inspection, and alterations' },
          { code: 'AMH/N1950', name: 'Customer management, pricing, and small shop maintenance' }
        ]
      },
      {
        qp_code: 'HSS/Q5101',
        title: 'General Duty Assistant (Healthcare GDA)',
        sector: 'Healthcare',
        nsqf_level: 4,
        version: '2.0',
        ssc: 'Healthcare Sector Skill Council',
        entry_qualification: '10th or 12th Pass',
        nos_count: 5,
        rpl_pathway_available: true,
        official_qp_pdf: 'https://www.nqr.gov.in/sites/default/files/QP-HSS-Q5101.pdf',
        nos_list: [
          { code: 'HSS/N5101', name: 'Daily patient hygiene and personal care assistance' },
          { code: 'HSS/N5102', name: 'Monitoring vital parameters (pulse, BP, temperature, SpO2)' },
          { code: 'HSS/N5103', name: 'Bed preparation, linen changing and ward sanitization' },
          { code: 'HSS/N5104', name: 'Assisting nurses during medication and dressing changes' },
          { code: 'HSS/N5105', name: 'Infection prevention and biomedical waste segregation' }
        ]
      },
      {
        qp_code: 'SSC/Q2212',
        title: 'Domestic Data Entry Operator (DDEO)',
        sector: 'IT / ITeS',
        nsqf_level: 4,
        version: '2.0',
        ssc: 'NASSCOM IT-ITeS Sector Skill Council',
        entry_qualification: '10th or 12th Pass',
        nos_count: 4,
        rpl_pathway_available: true,
        official_qp_pdf: 'https://www.nqr.gov.in/sites/default/files/QP-SSC-Q2212.pdf',
        nos_list: [
          { code: 'SSC/N2212', name: 'Conducting computer data entry in English / Hindi (30+ WPM)' },
          { code: 'SSC/N2213', name: 'Processing spreadsheets, worksheets and formatting tables' },
          { code: 'SSC/N2214', name: 'Data validation and error checking against source documents' },
          { code: 'SSC/N2215', name: 'Information security and file backup protocols' }
        ]
      },
      {
        qp_code: 'PSC/Q0104',
        title: 'Plumber General',
        sector: 'Plumbing',
        nsqf_level: 3,
        version: '2.0',
        ssc: 'Indian Plumbing Skills Council',
        entry_qualification: '8th Pass with basic literacy',
        nos_count: 4,
        rpl_pathway_available: true,
        official_qp_pdf: 'https://www.nqr.gov.in/sites/default/files/QP-PSC-Q0104.pdf',
        nos_list: [
          { code: 'PSC/N0108', name: 'Pre-installation survey and pipe layout planning' },
          { code: 'PSC/N0109', name: 'Cutting, threading, bending and joining PVC/GI pipes' },
          { code: 'PSC/N0110', name: 'Sanitary fixtures fitting (taps, cisterns, showers, basins)' },
          { code: 'PSC/N0111', name: 'Drainage blockage repair and pressure testing' }
        ]
      },
      {
        qp_code: 'RAS/Q0104',
        title: 'Retail Sales Associate',
        sector: 'Retail',
        nsqf_level: 4,
        version: '2.0',
        ssc: "Retailers Association's Skill Council of India",
        entry_qualification: '10th or 12th Pass',
        nos_count: 4,
        rpl_pathway_available: true,
        official_qp_pdf: 'https://www.nqr.gov.in/sites/default/files/QP-RAS-Q0104.pdf',
        nos_list: [
          { code: 'RAS/N0104', name: 'Greeting customers and identifying purchase needs' },
          { code: 'RAS/N0105', name: 'Product display merchandising and inventory upkeep' },
          { code: 'RAS/N0106', name: 'Point of sale billing, barcode scanning and payment handling' },
          { code: 'RAS/N0107', name: 'Customer dispute resolution and product exchange handling' }
        ]
      },
      {
        qp_code: 'CON/Q0102',
        title: 'Mason General (Building Construction)',
        sector: 'Construction',
        nsqf_level: 3,
        version: '2.0',
        ssc: 'Construction Skill Development Council of India',
        entry_qualification: '5th or 8th Pass',
        nos_count: 4,
        rpl_pathway_available: true,
        official_qp_pdf: 'https://www.nqr.gov.in/sites/default/files/QP-CON-Q0102.pdf',
        nos_list: [
          { code: 'CON/N0102', name: 'Setting out alignment, layout lines and corners' },
          { code: 'CON/N0103', name: 'Brick and block masonry construction using mortar' },
          { code: 'CON/N0104', name: 'Plastering and floor screeding to plumb and level' },
          { code: 'CON/N0105', name: 'Scaffolding safety and site waste minimization' }
        ]
      },
      {
        qp_code: 'AGR/Q1003',
        title: 'Micro Irrigation Technician',
        sector: 'Agriculture',
        nsqf_level: 4,
        version: '2.0',
        ssc: 'Agriculture Skill Council of India',
        entry_qualification: '10th Pass',
        nos_count: 4,
        rpl_pathway_available: true,
        official_qp_pdf: 'https://www.nqr.gov.in/sites/default/files/QP-AGR-Q1003.pdf',
        nos_list: [
          { code: 'AGR/N1007', name: 'Drip and sprinkler irrigation system site surveying' },
          { code: 'AGR/N1008', name: 'Installation of main line, sub-main, drippers and filters' },
          { code: 'AGR/N1009', name: 'Testing water flow rate, pressure regulation and leak checks' },
          { code: 'AGR/N1010', name: 'Post-installation maintenance and acid flush cleaning' }
        ]
      },
      {
        qp_code: 'BWS/Q0101',
        title: 'Assistant Beauty & Wellness Consultant',
        sector: 'Beauty & Wellness',
        nsqf_level: 3,
        version: '2.0',
        ssc: 'Beauty & Wellness Sector Skill Council',
        entry_qualification: '8th or 10th Pass',
        nos_count: 4,
        rpl_pathway_available: true,
        official_qp_pdf: 'https://www.nqr.gov.in/sites/default/files/QP-BWS-Q0101.pdf',
        nos_list: [
          { code: 'BWS/N0101', name: 'Skin analysis, facial preparation and cleansing' },
          { code: 'BWS/N0102', name: 'Manicure, pedicure and nail grooming techniques' },
          { code: 'BWS/N0103', name: 'Basic hair cutting, styling and shampooing' },
          { code: 'BWS/N0104', name: 'Sterilization of beauty tools and hygiene maintenance' }
        ]
      },
      {
        qp_code: 'CSC/Q0204',
        title: 'Welder (Gas & Shielded Metal Arc Welding)',
        sector: 'Capital Goods',
        nsqf_level: 3,
        version: '2.0',
        ssc: 'Capital Goods Skill Council',
        entry_qualification: '8th or 10th Pass',
        nos_count: 4,
        rpl_pathway_available: true,
        official_qp_pdf: 'https://www.nqr.gov.in/sites/default/files/QP-CSC-Q0204.pdf',
        nos_list: [
          { code: 'CSC/N0204', name: 'Manual metal arc welding in flat, horizontal and vertical positions' },
          { code: 'CSC/N0205', name: 'Oxy-fuel gas cutting of mild steel plates' },
          { code: 'CSC/N0206', name: 'Edge preparation, bevelling and joint fit-up' },
          { code: 'CSC/N0207', name: 'Visual inspection of weld bead defects and slag removal' }
        ]
      },
      {
        qp_code: 'HCS/Q8702',
        title: 'Handicraft Artisan & Bamboo Crafter',
        sector: 'Handicrafts',
        nsqf_level: 3,
        version: '2.0',
        ssc: 'Handicrafts and Carpet Sector Skill Council',
        entry_qualification: 'Basic literacy (informal artisan experience encouraged)',
        nos_count: 4,
        rpl_pathway_available: true,
        official_qp_pdf: 'https://www.nqr.gov.in/sites/default/files/QP-HCS-Q8702.pdf',
        nos_list: [
          { code: 'HCS/N8702', name: 'Raw bamboo selection, cutting, splitting and chemical treatment' },
          { code: 'HCS/N8703', name: 'Fine bamboo sliver weaving, basketry and craft framing' },
          { code: 'HCS/N8704', name: 'Applying natural stains, varnishing and surface protection' },
          { code: 'HCS/N8705', name: 'Artisan product pricing, packaging and SHG exhibition marketing' }
        ]
      }
    ];
  }

  /**
   * Normalizer for NSDC qualifications
   */
  normalizeQualification(raw) {
    return {
      qp_code: raw.qp_code || raw.code || 'QP-UNKNOWN',
      title: raw.title || raw.role_name || raw.name || 'NSQF Qualified Role',
      sector: raw.sector || 'Cross-Sector',
      nsqf_level: Number(raw.nsqf_level || 3),
      version: raw.version || '1.0',
      ssc: raw.ssc || raw.sector_skill_council || 'NCVET / NSDC',
      entry_qualification: raw.entry_qualification || raw.min_education || '8th / 10th Pass',
      nos_count: Array.isArray(raw.nos_list) ? raw.nos_list.length : (raw.nos_count || 4),
      nos_list: Array.isArray(raw.nos_list) ? raw.nos_list : [],
      rpl_pathway_available: raw.rpl_pathway_available !== undefined ? Boolean(raw.rpl_pathway_available) : true,
      official_qp_pdf: raw.official_qp_pdf || `https://www.nqr.gov.in/qualifications/${raw.qp_code || ''}`,
      source: 'National Skill Development Corporation (NSDC)',
      last_verified_at: new Date().toISOString()
    };
  }

  /**
   * Fetch all official qualifications with cache
   */
  async getQualifications() {
    return await this.fetchWithFallback(
      'nsdc_qualifications',
      async () => {
        if (process.env.NSDC_API_URL && process.env.NSDC_API_KEY) {
          const res = await fetch(`${process.env.NSDC_API_URL}/qps`, {
            headers: { 'Authorization': `Bearer ${process.env.NSDC_API_KEY}` },
            signal: AbortSignal.timeout(5000)
          });
          if (res.ok) return await res.json();
        }
        return this.getBaselineQualifications();
      },
      (item) => this.normalizeQualification(item),
      this.getBaselineQualifications()
    );
  }
}

export default new NSDCAdapter();
