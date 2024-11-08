const mongoose = require('mongoose');

// Define the FinancialEvent schema
const financialEventSchema = new mongoose.Schema({
    title: { type: String, required: true }, // Title of the financial event
    budget: { type: Number, required: true, default: 0 }, // This will be the balance (budget)
    totalExpenses: { type: Number, required: true, default: 0 }, // Total expenses
    totalDonations: { type: Number, required: true, default: 0 }, // Total donations
    expenses: [{
        date: { type: Date, required: true }, // Date of expense
        store: { type: String, required: true }, // Store name
        particulars: { type: String, required: true }, // Description of the expense
        cost: { type: Number, required: true }, // Cost of the expense
    }], // Array of expense objects
    donations: [{
        date: { type: Date, required: true }, // Date of donation
        receivedFrom: { type: String, required: true }, // Name or organization donating
        amount: { type: Number, required: true }, // Amount donated
    }], // Array of donation objects
    distributions: [{
        date: { type: Date, required: true }, // Date of distribution
        location: { type: String, required: true }, // Location of distribution
        goodsDistributed: { type: String, required: true }, // Description of goods distributed
        quantity: { type: Number, required: true }, // Quantity of goods distributed
    }], // Array of distribution objects
}, {
    timestamps: true, // Automatically manage createdAt and updatedAt timestamps
    toJSON: { virtuals: true }, // Enable virtual fields for JSON output
    toObject: { virtuals: true } // Enable virtual fields for plain object output
});

// Add pre-save middleware to update totalExpenses, totalDonations and budget (balance)
financialEventSchema.pre('save', function(next) {
    // Sum up the total expenses
    this.totalExpenses = this.expenses.reduce((sum, expense) => sum + expense.cost, 0);

    // Sum up the total donations
    this.totalDonations = this.donations.reduce((sum, donation) => sum + donation.amount, 0);

    // Set the budget (balance) to be total donations - total expenses
    this.budget = this.totalDonations - this.totalExpenses;

    next();
});

// Create the FinancialEvent model
const FinancialEvent = mongoose.model('FinancialEvent', financialEventSchema);

module.exports = FinancialEvent;