import type { InvoiceData } from '../types';
import * as XLSX from 'xlsx';

const AR_CUSTOMERS = [
  'AETHER_DYNAMICS', 'NEURAL_NETWORKS_INC', 'ORBITAL_CARGO_CO', 'BIO_SYNTH_LABS',
  'ZENITH_SYSTEMS', 'STELLAR_FINANCE', 'QUANTUM_CORE', 'NOVA_LOGISTICS',
  'CYBERDYNE_TECH', 'PULSAR_ENERGY', 'HELIX_CORP', 'NEXUS_INNOVATIONS',
  'APEX_DIGITAL', 'TITAN_ROBOTICS', 'VORTEX_MEDIA', 'SYNAPSE_AI',
  'KRYPTON_VENTURES', 'OMEGA_SECURITY', 'PRISM_ANALYTICS', 'FUSION_LABS'
];

const AP_VENDORS = [
  'NEXUS_SUPPLY', 'AURORA_MATERIALS', 'PHOENIX_HARDWARE', 'ECLIPSE_SOFTWARE',
  'STRATUM_SERVICES', 'VERTEX_CONSULTING', 'HORIZON_LOGISTICS', 'MERIDIAN_CLOUD',
  'CASCADE_SOLUTIONS', 'IGNITE_HOSTING', 'SPECTRUM_TELECOM', 'FLUX_UTILITIES',
  'POLARIS_RENTALS', 'ECHO_MARKETING', 'RADIX_HARDWARE', 'TYCHO_SHIPPING',
  'LUMEN_ENERGY', 'AXIS_FINANCIAL', 'NEBULA_INSURANCE', 'DYNAMO_RECRUIT'
];

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function generateDummyData(count: number = 80): InvoiceData[] {
  const data: InvoiceData[] = [];
  const today = new Date();
  const thirtyDaysAgo = addDays(today, -90);
  let arIndex = 0;
  let apIndex = 0;

  for (let i = 0; i < count; i++) {
    const type = Math.random() > 0.45 ? 'AR' : 'AP';
    const isAR = type === 'AR';
    const entityPool = isAR ? AR_CUSTOMERS : AP_VENDORS;
    const entity = entityPool[Math.floor(Math.random() * entityPool.length)];

    const invoice_date = randomDate(thirtyDaysAgo, today);
    const dueDaysOffset = Math.floor(Math.random() * 90) + 1;
    const due_date = addDays(invoice_date, dueDaysOffset);

    const daysDiff = Math.floor((today.getTime() - due_date.getTime()) / (1000 * 60 * 60 * 24));

    let status: 'Current' | 'Overdue' | 'Paid';
    if (daysDiff > 0) {
      status = Math.random() > 0.3 ? 'Overdue' : 'Paid';
    } else {
      status = Math.random() > 0.15 ? 'Current' : 'Paid';
    }

    const amount = Math.floor(Math.random() * 450000) + 15000;
    const paid_amount = status === 'Paid' ? amount : Math.random() > 0.6 ? Math.floor(amount * (0.2 + Math.random() * 0.5)) : 0;

    const index = isAR ? ++arIndex : ++apIndex;
    const prefix = isAR ? 'AR' : 'AP';

    data.push({
      invoice_id: `${prefix}-${2024}${String(index).padStart(4, '0')}`,
      customer_vendor: entity,
      type,
      invoice_date,
      due_date,
      amount,
      paid_amount,
      status,
    });
  }

  return data.sort((a, b) => b.invoice_date.getTime() - a.invoice_date.getTime());
}

export function exportDummyDataToExcel(): void {
  const data = generateDummyData(80);
  const worksheet = XLSX.utils.json_to_sheet(data.map(row => ({
    invoice_id: row.invoice_id,
    customer_vendor: row.customer_vendor,
    type: row.type,
    invoice_date: row.invoice_date.toISOString().split('T')[0],
    due_date: row.due_date.toISOString().split('T')[0],
    amount: row.amount,
    paid_amount: row.paid_amount,
    status: row.status,
  })));

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'AR_AP_Data');
  XLSX.writeFile(workbook, 'neon_ledger_dummy_data.xlsx');
}
