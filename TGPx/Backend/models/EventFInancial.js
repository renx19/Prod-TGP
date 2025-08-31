const mongoose = require('mongoose');

// Define the FinancialEvent schema
const financialEventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    budget: { type: Number, default: 0 }, // Auto-calculated
    totalExpenses: { type: Number, default: 0 },
    totalDonations: { type: Number, default: 0 },

    expenses: [{
        date: { type: Date, required: true },
        store: { type: String, required: true },
        particulars: { type: String, required: true },
        cost: { type: Number, required: true },
    }, ],

    donations: [{
        date: { type: Date, required: true },
        receivedFrom: { type: String, required: true },
        amount: { type: Number, required: true },
    }, ],

    distributions: [{
        date: { type: Date, required: true },
        location: { type: String, required: true },
        goodsDistributed: { type: String, required: true },
        quantity: { type: Number, required: true },
    }, ],
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});

// Automatically calculate totals before saving
financialEventSchema.pre('save', function(next) {
    this.totalExpenses = this.expenses.reduce((sum, e) => sum + e.cost, 0);
    this.totalDonations = this.donations.reduce((sum, d) => sum + d.amount, 0);
    this.budget = this.totalDonations - this.totalExpenses;
    next();
});

const FinancialEvent = mongoose.model('FinancialEvent', financialEventSchema);
module.exports = FinancialEvent;