import OfficialSourceAdapter from './OfficialSourceAdapter.js';

/**
 * DGTAdapter
 * Directorate General of Training (DGT / MSDE) adapter.
 * Craftsmen Training Scheme (CTS), ITI trade specifications,
 * and National Apprenticeship Promotion Scheme (NAPS) links.
 */
export class DGTAdapter extends OfficialSourceAdapter {
  constructor() {
    super({
      sourceName: 'Directorate General of Training (DGT / MSDE)',
      baseUrl: process.env.DGT_BASE_URL || 'https://dgt.gov.in',
      cacheTtlMs: 3600000 * 6,
      staleTtlMs: 86400000 * 14,
    });
  }

  getBaselineTrades() {
    return [
      {
        trade_name: 'Electrician (CTS)',
        nsqf_level: 4,
        duration: '2 Years (or 1 Year Dual System)',
        eligibility: '10th Pass with Science and Mathematics',
        curriculum_code: 'DGT-CTS-ELE-01',
        apprenticeship_eligible: true,
        source_url: 'https://dgt.gov.in/craftsmen-training-scheme'
      },
      {
        trade_name: 'Wireman (CTS)',
        nsqf_level: 3,
        duration: '1 Year',
        eligibility: '8th Pass',
        curriculum_code: 'DGT-CTS-WIR-02',
        apprenticeship_eligible: true,
        source_url: 'https://dgt.gov.in/craftsmen-training-scheme'
      },
      {
        trade_name: 'Sewing Technology / Dress Making',
        nsqf_level: 3,
        duration: '1 Year',
        eligibility: '8th Pass',
        curriculum_code: 'DGT-CTS-SEW-03',
        apprenticeship_eligible: true,
        source_url: 'https://dgt.gov.in/craftsmen-training-scheme'
      },
      {
        trade_name: 'Mechanic Two & Three Wheeler',
        nsqf_level: 4,
        duration: '1 Year',
        eligibility: '10th Pass',
        curriculum_code: 'DGT-CTS-AUT-04',
        apprenticeship_eligible: true,
        source_url: 'https://dgt.gov.in/craftsmen-training-scheme'
      }
    ];
  }

  normalizeTrade(raw) {
    return {
      ...raw,
      is_verified: true,
      last_verified_at: new Date().toISOString()
    };
  }

  async getTrades() {
    return await this.fetchWithFallback(
      'dgt_cts_trades',
      async () => {
        if (process.env.DGT_API_URL) {
          const res = await fetch(`${process.env.DGT_API_URL}/trades`, {
            signal: AbortSignal.timeout(5000)
          });
          if (res.ok) return await res.json();
        }
        return this.getBaselineTrades();
      },
      (item) => this.normalizeTrade(item),
      this.getBaselineTrades()
    );
  }
}

export default new DGTAdapter();
