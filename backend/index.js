const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const Expense = require("./models/Expense");

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// ================= CONNECT TO MONGODB =================

mongoose.connect("mongodb+srv://aiswarya:aishu2005cluster0.dw7rdin.mongodb.net/expenseDB?appName=Cluster0")

//mongoose.connect("mongodb://localhost:27017/expenseDB")
.then(() => {
    console.log("✅ MongoDB Connected");
})
.catch(err => {
    console.log("❌ MongoDB Error:", err);
});

// ================= GET ALL EXPENSES =================
app.get("/expenses", async (req, res) => {
    try {
        const expenses = await Expense.find();
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ error: "Error fetching expenses" });
    }
});

// ================= GET SUMMARY =================
app.get("/summary", async (req, res) => {
    try {
        const expenses = await Expense.find();

        const totalExpenses = expenses.length;
        const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);
        const paidCount = expenses.filter(exp => exp.paid).length;

        res.json({
            totalExpenses,
            totalAmount,
            paidCount
        });

    } catch (error) {
        res.status(500).json({ error: "Error calculating summary" });
    }
});

// ================= ADD EXPENSE =================
app.post("/expenses", async (req, res) => {
    try {
        const newExpense = new Expense({
            name: req.body.name,
            amount: req.body.amount,
            category: req.body.category,
            paid: false
        });

        await newExpense.save();
        res.json(newExpense);

    } catch (error) {
        res.status(500).json({ error: "Error adding expense" });
    }
});

// ================= UPDATE PAID STATUS =================
app.put("/expenses/:id", async (req, res) => {
    try {
        const updated = await Expense.findByIdAndUpdate(
            req.params.id,
            { paid: req.body.paid },
            { new: true }
        );

        res.json(updated);

    } catch (error) {
        res.status(500).json({ error: "Error updating expense" });
    }
});

// ================= DELETE EXPENSE =================
app.delete("/expenses/:id", async (req, res) => {
    try {
        await Expense.findByIdAndDelete(req.params.id);
        res.json({ message: "Expense Deleted" });

    } catch (error) {
        res.status(500).json({ error: "Error deleting expense" });
    }
});

// ================= START SERVER =================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:3000`);
});