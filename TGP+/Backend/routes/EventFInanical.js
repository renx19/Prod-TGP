const express = require('express');
const FinancialEvent = require('../models/EventFInancial'); // Ensure this path is correct
const router = express.Router();

// Route to create a new financial event (POST)
router.post('/financial-event', async(req, res) => {
    const { title, budget, expenses, donations, distributions } = req.body;

    try {
        const financialEvent = new FinancialEvent({
            title,
            budget,
            expenses,
            donations,
            distributions,
        });

        await financialEvent.save();

        res.status(201).json({
            message: 'Financial Event created successfully',
            financialEvent,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Failed to create financial event',
            error: error.message,
        });
    }
});

// Route to get all financial events (GET)
router.get('/financial-event', async(req, res) => {
    try {
        const financialEvents = await FinancialEvent.find()
            .populate('expenses')
            .populate('donations')
            .populate('distributions');

        res.status(200).json(financialEvents);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Failed to retrieve financial events',
            error: error.message,
        });
    }
});

// Route to get a financial event by ID (GET)
router.get('/financial-event/:id', async(req, res) => {
    const { id } = req.params;

    try {
        const financialEvent = await FinancialEvent.findById(id)
            .populate('expenses')
            .populate('donations')
            .populate('distributions');

        if (!financialEvent) {
            return res.status(404).json({
                message: 'Financial Event not found',
            });
        }

        res.status(200).json(financialEvent);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Failed to retrieve financial event',
            error: error.message,
        });
    }
});

// Route to update a financial event (PUT)
router.put('/financial-event/:id', async(req, res) => {
    const { id } = req.params;
    const { title, budget, expenses, donations, distributions } = req.body;

    try {
        const financialEvent = await FinancialEvent.findByIdAndUpdate(
            id, { title, budget, expenses, donations, distributions }, { new: true, runValidators: true } // Returns the updated document and validates fields
        );

        if (!financialEvent) {
            return res.status(404).json({ message: 'Financial Event not found' });
        }

        res.status(200).json({
            message: 'Financial Event updated successfully',
            financialEvent,
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({
            message: 'Failed to update financial event',
            error: error.message,
        });
    }
});


// Route to delete a financial event (DELETE)
router.delete('/financial-event/:id', async(req, res) => {
    const { id } = req.params;

    try {
        const financialEvent = await FinancialEvent.findByIdAndDelete(id);

        if (!financialEvent) {
            return res.status(404).json({ message: 'Financial Event not found' });
        }

        // Optionally, remove references from related models (if applicable)
        // await Expense.deleteMany({ financialEvent: financialEvent._id });
        // await Donation.deleteMany({ financialEvent: financialEvent._id });
        // await Distribution.deleteMany({ financialEvent: financialEvent._id });

        res.status(204).send(); // No content to send back
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Failed to delete financial event',
            error: error.message,
        });
    }
});


// POST route to add a new expense
router.post('/:eventId/expenses', async(req, res) => {
    const { eventId } = req.params;
    const { date, store, particulars, cost } = req.body;

    try {
        const event = await FinancialEvent.findById(eventId);
        if (!event) return res.status(404).send('Financial event not found');

        // Add the new expense to the array
        event.expenses.push({ date, store, particulars, cost });

        // Recalculate the total expenses and donations, and update the budget
        event.totalExpenses = event.expenses.reduce((sum, expense) => sum + expense.cost, 0);
        event.totalDonations = event.donations.reduce((sum, donation) => sum + donation.amount, 0);
        event.budget = event.totalDonations - event.totalExpenses;

        // Save the updated event
        await event.save();

        res.status(200).json(event);
    } catch (error) {
        res.status(500).send('Error updating financial event');
    }
});

// POST route to add a new donation
router.post('/:eventId/donations', async(req, res) => {
    const { eventId } = req.params;
    const { date, receivedFrom, amount } = req.body;

    try {
        const event = await FinancialEvent.findById(eventId);
        if (!event) return res.status(404).send('Financial event not found');

        // Add the new donation to the array
        event.donations.push({ date, receivedFrom, amount });

        // Recalculate the totals
        event.totalDonations = event.donations.reduce((sum, donation) => sum + donation.amount, 0);
        event.totalExpenses = event.expenses.reduce((sum, expense) => sum + expense.cost, 0);
        event.budget = event.totalDonations - event.totalExpenses;

        // Save the updated event
        await event.save();

        res.status(200).json(event);
    } catch (error) {
        res.status(500).send('Error updating financial event');
    }
});



// POST route to add a new distribution
router.post('/:eventId/distributions', async(req, res) => {
    const { eventId } = req.params;
    const { date, distributedTo, quantity } = req.body;

    try {
        const event = await FinancialEvent.findById(eventId);
        if (!event) return res.status(404).send('Financial event not found');

        // Add the new distribution to the array
        event.distributions.push({ date, distributedTo, quantity });

        // Save the updated event
        await event.save();

        res.status(200).json(event);
    } catch (error) {
        res.status(500).send('Error updating financial event');
    }
});


// Update Expenses
router.put('/financial-event/:id/expenses', async(req, res) => {
    const { id } = req.params;
    const { expenses } = req.body;

    try {
        const financialEvent = await FinancialEvent.findById(id);
        if (!financialEvent) {
            return res.status(404).json({ message: 'Financial Event not found' });
        }

        if (Array.isArray(expenses)) {
            expenses.forEach(expense => {
                const existingExpense = financialEvent.expenses.find(e => e._id.toString() === expense._id.toString());
                if (existingExpense) {
                    // Update existing expense fields
                    existingExpense.date = expense.date || existingExpense.date;
                    existingExpense.store = expense.store || existingExpense.store;
                    existingExpense.particulars = expense.particulars || existingExpense.particulars;
                    existingExpense.cost = expense.cost || existingExpense.cost;
                } else {
                    // Add a new expense if it doesn't exist
                    financialEvent.expenses.push(expense);
                }
            });
        } else {
            return res.status(400).json({ message: 'Expenses must be an array' });
        }

        await financialEvent.save();
        res.status(200).json({
            message: 'Expenses updated successfully',
            financialEvent,
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({
            message: 'Failed to update expenses',
            error: error.message,
        });
    }
});

// Update Donations
router.put('/financial-event/:id/donations', async(req, res) => {
    const { id } = req.params;
    const { donations } = req.body;

    try {
        const financialEvent = await FinancialEvent.findById(id);
        if (!financialEvent) {
            return res.status(404).json({ message: 'Financial Event not found' });
        }

        if (Array.isArray(donations)) {
            donations.forEach(donation => {
                const existingDonation = financialEvent.donations.find(d => d._id.toString() === donation._id.toString());
                if (existingDonation) {
                    // Update existing donation fields
                    existingDonation.date = donation.date || existingDonation.date;
                    existingDonation.receivedFrom = donation.receivedFrom || existingDonation.receivedFrom;
                    existingDonation.amount = donation.amount || existingDonation.amount;
                } else {
                    // Add a new donation if it doesn't exist
                    financialEvent.donations.push(donation);
                }
            });
        } else {
            return res.status(400).json({ message: 'Donations must be an array' });
        }

        await financialEvent.save();
        res.status(200).json({
            message: 'Donations updated successfully',
            financialEvent,
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({
            message: 'Failed to update donations',
            error: error.message,
        });
    }
});

// Update Distributions
router.put('/financial-event/:id/distributions', async(req, res) => {
    const { id } = req.params;
    const { distributions } = req.body;

    try {
        const financialEvent = await FinancialEvent.findById(id);
        if (!financialEvent) {
            return res.status(404).json({ message: 'Financial Event not found' });
        }

        if (Array.isArray(distributions)) {
            distributions.forEach(distribution => {
                const existingDistribution = financialEvent.distributions.find(d => d._id.toString() === distribution._id.toString());
                if (existingDistribution) {
                    // Update existing distribution fields
                    existingDistribution.date = distribution.date || existingDistribution.date;
                    existingDistribution.location = distribution.location || existingDistribution.location;
                    existingDistribution.goodsDistributed = distribution.goodsDistributed || existingDistribution.goodsDistributed;
                    existingDistribution.quantity = distribution.quantity || existingDistribution.quantity;
                } else {
                    // Add a new distribution if it doesn't exist
                    financialEvent.distributions.push(distribution);
                }
            });
        } else {
            return res.status(400).json({ message: 'Distributions must be an array' });
        }

        await financialEvent.save();
        res.status(200).json({
            message: 'Distributions updated successfully',
            financialEvent,
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({
            message: 'Failed to update distributions',
            error: error.message,
        });
    }
});

// Delete Expense
router.delete('/financial-event/:id/expenses/:expenseId', async(req, res) => {
    const { id, expenseId } = req.params;

    try {
        const financialEvent = await FinancialEvent.findById(id);
        if (!financialEvent) {
            return res.status(404).json({ message: 'Financial Event not found' });
        }

        // Remove the specific expense from the expenses array
        financialEvent.expenses = financialEvent.expenses.filter(expense => expense._id.toString() !== expenseId);

        await financialEvent.save();
        res.status(200).json({
            message: 'Expense deleted successfully',
            financialEvent,
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({
            message: 'Failed to delete expense',
            error: error.message,
        });
    }
});

// Delete Donation
router.delete('/financial-event/:id/donations/:donationId', async(req, res) => {
    const { id, donationId } = req.params;

    try {
        const financialEvent = await FinancialEvent.findById(id);
        if (!financialEvent) {
            return res.status(404).json({ message: 'Financial Event not found' });
        }

        // Remove the specific donation from the donations array
        financialEvent.donations = financialEvent.donations.filter(donation => donation._id.toString() !== donationId);

        await financialEvent.save();
        res.status(200).json({
            message: 'Donation deleted successfully',
            financialEvent,
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({
            message: 'Failed to delete donation',
            error: error.message,
        });
    }
});

// Delete Distribution
router.delete('/financial-event/:id/distributions/:distributionId', async(req, res) => {
    const { id, distributionId } = req.params;

    try {
        const financialEvent = await FinancialEvent.findById(id);
        if (!financialEvent) {
            return res.status(404).json({ message: 'Financial Event not found' });
        }

        // Remove the specific distribution from the distributions array
        financialEvent.distributions = financialEvent.distributions.filter(distribution => distribution._id.toString() !== distributionId);

        await financialEvent.save();
        res.status(200).json({
            message: 'Distribution deleted successfully',
            financialEvent,
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({
            message: 'Failed to delete distribution',
            error: error.message,
        });
    }

});

// Export the router
module.exports = router;