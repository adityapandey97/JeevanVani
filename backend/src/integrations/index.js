import skillIndiaAdapter from './SkillIndiaAdapter.js';
import nsdcAdapter from './NSDCAdapter.js';
import pmajayAdapter, { PMAJAYSourceConfig } from './PMAJAYAdapter.js';
import dgtAdapter from './DGTAdapter.js';

export {
  skillIndiaAdapter,
  nsdcAdapter,
  pmajayAdapter,
  dgtAdapter,
  PMAJAYSourceConfig
};

/**
 * Unified health and freshness checker across all government integrations
 */
export function getAllAdaptersHealth() {
  return {
    skillIndia: skillIndiaAdapter.getHealth(),
    nsdc: nsdcAdapter.getHealth(),
    pmajay: pmajayAdapter.getHealth(),
    dgt: dgtAdapter.getHealth(),
    timestamp: new Date().toISOString()
  };
}

export default {
  skillIndia: skillIndiaAdapter,
  nsdc: nsdcAdapter,
  pmajay: pmajayAdapter,
  dgt: dgtAdapter,
  getAllHealth: getAllAdaptersHealth,
  PMAJAYSourceConfig
};
