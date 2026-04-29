// =====================================================
// BhatLedger — unified ledger for INCOME (paid by candidates)
// and EXPENSE (paid by us to banks/agents/vendors).
//
// direction = 'in'  : money coming in (advance, service fee, etc.)
// direction = 'out' : money going out (agent commission, bank transfer,
//                     visa fee paid to embassy, etc.)
//
// Refunds are still represented as a paired entry (same direction as the
// original, negative amount) so net balances reconcile naturally.
// =====================================================
import mongoose from 'mongoose';

const BhatLedgerSchema = new mongoose.Schema({
  // Optional client link — expenses may not be linked to a specific candidate
  client:      { type: mongoose.Schema.Types.ObjectId, ref: 'BhatClient', default: null, index: true },

  direction: {
    type: String,
    enum: ['in', 'out'],
    default: 'in',
    index: true,
  },

  type: {
    type: String,
    enum: [
      // INCOME types
      'advance', 'service_fee', 'medical', 'visa_fee_in', 'other_in', 'refund',
      // EXPENSE types
      'agent_commission', 'bank_transfer', 'visa_fee_out', 'medical_out',
      'training', 'flight', 'office_expense', 'salary', 'other_out',
    ],
    default: 'advance',
  },

  amount:      { type: Number, required: true },         // positive number
  currency:    { type: String, default: 'NPR' },         // NPR / INR / EUR / USD / TRY
  description: { type: String },
  paidAt:      { type: Date, default: Date.now },

  status: {
    type: String,
    enum: ['active', 'refunded', 'void'],
    default: 'active',
  },
  refundedBy:  { type: mongoose.Schema.Types.ObjectId, ref: 'BhatLedger', default: null },

  // ---- EXPENSE-only fields (filled when direction = 'out') ----
  bankAccountHolder: { type: String },                // name on the receiving bank account
  bankName:          { type: String },                // bank name
  bankAccountNumber: { type: String },                // last 4 digits or full (sensitive)
  vendor:            { type: String },                // who we paid (agent, hospital, embassy, etc.)

  recordedBy:  { type: mongoose.Schema.Types.ObjectId, ref: 'BhatUser' },
}, { timestamps: true });

BhatLedgerSchema.index({ direction: 1, paidAt: -1 });
BhatLedgerSchema.index({ client: 1, status: 1 });

export default mongoose.models.BhatLedger || mongoose.model('BhatLedger', BhatLedgerSchema);
