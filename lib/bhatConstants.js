// =====================================================
// BHAT OVERSEAS — Shared constants
// =====================================================

export const PIPELINE_STAGES = [
  // Active workflow (14 stages)
  { key: 'doc_collection',       label: 'Doc Collection' },
  { key: 'advance_paid',         label: 'Advance Paid' },
  { key: 'pcc_apply',            label: 'PCC Apply' },
  { key: 'vfs_appointment',      label: 'VFS Appointment' },
  { key: 'reference_agent_info', label: 'Reference (Agent Info)' },
  { key: 'amount_paid',          label: 'Amount Paid' },
  { key: 'entry_approval',       label: 'Entry Approval' },
  { key: 'kimlik_fee_paid',      label: 'Kimlik Fee Paid' },
  { key: 'client_money_paid',    label: 'Client Money Paid' },
  { key: 'second_vfs',           label: 'Second VFS' },
  { key: 'passport_collection',  label: 'Passport Collection' },
  { key: 'sharam',               label: 'Sharam' },
  { key: 'flight_ticket',        label: 'Flight Ticket' },
  { key: 'flight_status',        label: 'Flight Status' },
  // Terminal / exit stages (won't count toward "Active" stats)
  { key: 'rejected',             label: 'Rejected',  terminal: true, color: 'red' },
  { key: 'refunded',             label: 'Refunded',  terminal: true, color: 'orange' },
  { key: 'departed',             label: 'Departed',  terminal: true, color: 'green' },
];

// Active stages = the first 14, used for stats and progress
export const ACTIVE_PIPELINE_STAGES = PIPELINE_STAGES.filter(s => !s.terminal);
export const TERMINAL_STAGE_KEYS = new Set(PIPELINE_STAGES.filter(s => s.terminal).map(s => s.key));

export const STAGE_BY_KEY = Object.fromEntries(
  PIPELINE_STAGES.map((s, i) => [s.key, { ...s, index: i }])
);

export const COUNTRIES = {
  RO: { code: 'RO', name: 'Romania', flag: '🇷🇴' },
  TR: { code: 'TR', name: 'Turkey',  flag: '🇹🇷' },
};

export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN:       'admin',
  SUB_ADMIN:   'sub_admin',
};

export const ROLE_LABELS = {
  super_admin: 'Super Admin',
  admin:       'Admin',
  sub_admin:   'Sub-Admin',
};

export const DOC_TYPES = [
  { key: 'passport',         label: 'Passport',           hasExpiry: true,  warningDays: 180 },
  { key: 'citizenship',      label: 'Citizenship',        hasExpiry: false },
  { key: 'photographs',      label: 'Photographs',        hasExpiry: false },
  { key: 'police_report',    label: 'Police Report (PCC)',hasExpiry: true,  warningDays: 30 },
  { key: 'medical_report',   label: 'Medical Report',     hasExpiry: true,  warningDays: 90 },
  { key: 'vfs_receipt',      label: 'VFS Receipt',        hasExpiry: false },
  { key: 'kimlik_receipt',   label: 'Kimlik Payment',     hasExpiry: false },
  { key: 'flight_ticket',    label: 'Flight Ticket',      hasExpiry: false },
  { key: 'electricity_bill', label: 'Electricity Bill',   hasExpiry: false },
  { key: 'water_bill',       label: 'Water Bill',         hasExpiry: false },
];

// Auto-advance rules: when a document is uploaded, advance pipeline to this stage.
export const DOC_STAGE_TRIGGERS = {
  passport:           'advance_paid',
  police_report:      'vfs_appointment',
  vfs_receipt:        'reference_agent_info',
  kimlik_receipt:     'client_money_paid',
  flight_ticket:      'flight_status',
};
