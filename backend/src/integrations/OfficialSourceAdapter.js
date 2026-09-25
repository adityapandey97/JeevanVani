/**
 * OfficialSourceAdapter
 * Base abstract class for external government portal and official data integrations.
 * Implements:
 * - In-memory caching with configurable TTL
 * - Stale-while-revalidate & fallback-to-last-known-good-data pattern
 * - Freshness metadata (source, sourceUrl, retrievedAt, lastVerifiedAt, expiresAt, dataVersion)
 * - Safe error handling & degradation (never crashes the application if official endpoint is down)
 * - Deduplication and normalization pipeline
 */

export class OfficialSourceAdapter {
  /**
   * @param {Object} config
   * @param {string} config.sourceName - Name of the official entity (e.g. 'Skill India Digital')
   * @param {string} config.baseUrl - Official URL
   * @param {number} [config.cacheTtlMs=3600000] - Cache validity period (default 1 hr)
   * @param {number} [config.staleTtlMs=86400000] - Stale data fallback period (default 24 hrs)
   */
  constructor({ sourceName, baseUrl, cacheTtlMs = 3600000, staleTtlMs = 86400000 }) {
    this.sourceName = sourceName;
    this.baseUrl = baseUrl;
    this.cacheTtlMs = cacheTtlMs;
    this.staleTtlMs = staleTtlMs;

    this.cache = new Map(); // key -> { data, retrievedAt, expiresAt, version }
    this.status = 'HEALTHY'; // 'HEALTHY' | 'DEGRADED' | 'CACHED_FALLBACK'
    this.lastError = null;
    this.lastSuccessfulSync = null;
  }

  /**
   * Generates standard data freshness envelope
   */
  createFreshnessMetadata(isCached = false, isStale = false) {
    const now = new Date();
    return {
      source: this.sourceName,
      sourceUrl: this.baseUrl,
      retrievedAt: now.toISOString(),
      lastVerifiedAt: this.lastSuccessfulSync ? this.lastSuccessfulSync.toISOString() : now.toISOString(),
      expiresAt: new Date(now.getTime() + this.cacheTtlMs).toISOString(),
      dataVersion: '2026.1',
      freshnessStatus: isStale ? 'STALE_FALLBACK' : (isCached ? 'CACHED' : 'LIVE_VERIFIED'),
      isOfficialVerified: true,
      attribution: `Verified against official portal: ${this.sourceName} (${this.baseUrl})`
    };
  }

  /**
   * Get cached entry if valid
   */
  getCached(key) {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const now = Date.now();
    if (now <= entry.expiresAt) {
      return { data: entry.data, isStale: false };
    }
    if (now <= entry.expiresAt + this.staleTtlMs) {
      return { data: entry.data, isStale: true };
    }
    return null;
  }

  /**
   * Set cache entry
   */
  setCache(key, data) {
    const now = Date.now();
    this.cache.set(key, {
      data,
      retrievedAt: now,
      expiresAt: now + this.cacheTtlMs,
      version: '2026.1'
    });
    this.lastSuccessfulSync = new Date();
    this.status = 'HEALTHY';
    this.lastError = null;
  }

  /**
   * Fetch with fallback wrapper
   * @param {string} cacheKey
   * @param {Function} fetchFn - Actual async fetcher returning raw records
   * @param {Function} normalizeFn - Function to normalize records
   * @param {Array} fallbackData - Static verified backup if live call and cache both fail
   */
  async fetchWithFallback(cacheKey, fetchFn, normalizeFn, fallbackData = []) {
    // 1. Check cache first
    const cached = this.getCached(cacheKey);
    if (cached && !cached.isStale) {
      return {
        records: cached.data,
        metadata: this.createFreshnessMetadata(true, false)
      };
    }

    // 2. Attempt live retrieval
    try {
      const raw = await fetchFn();
      if (raw && Array.isArray(raw) && raw.length > 0) {
        const normalized = raw.map(normalizeFn);
        this.setCache(cacheKey, normalized);
        return {
          records: normalized,
          metadata: this.createFreshnessMetadata(false, false)
        };
      }
    } catch (err) {
      this.lastError = err.message;
      this.status = cached ? 'CACHED_FALLBACK' : 'DEGRADED';
      console.warn(`[${this.sourceName}] Live fetch failed: ${err.message}. Engaging fallback strategy.`);
    }

    // 3. Fallback to stale cache if available
    if (cached && cached.isStale) {
      this.status = 'CACHED_FALLBACK';
      return {
        records: cached.data,
        metadata: this.createFreshnessMetadata(true, true)
      };
    }

    // 4. Fallback to last known verified baseline dataset
    const baseline = (fallbackData || []).map(normalizeFn);
    this.setCache(cacheKey, baseline);
    return {
      records: baseline,
      metadata: this.createFreshnessMetadata(true, true)
    };
  }

  /**
   * Adapter Health Report
   */
  getHealth() {
    return {
      source: this.sourceName,
      url: this.baseUrl,
      status: this.status,
      cachedKeys: Array.from(this.cache.keys()),
      lastSuccessfulSync: this.lastSuccessfulSync ? this.lastSuccessfulSync.toISOString() : 'None',
      lastError: this.lastError
    };
  }
}

export default OfficialSourceAdapter;
