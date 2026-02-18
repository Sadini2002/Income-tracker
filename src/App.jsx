import { useState, useEffect } from "react";

const CATEGORIES_INCOME = ["Salary", "Freelance", "Investment", "Gift", "Other"];
const CATEGORIES_EXPENSE = ["Food", "Transport", "Housing", "Shopping", "Health", "Entertainment", "Utilities", "Other"];

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);

const getTodayStr = () => new Date().toISOString().split("T")[0];

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Crimson+Pro:ital,wght@0,300;0,400;0,600;1,300&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body { background: #0f0e0b; }

  .app {
    min-height: 100vh;
    background: #0f0e0b;
    color: #e8e0d0;
    font-family: 'Crimson Pro', serif;
    position: relative;
    overflow-x: hidden;
  }

  .app::before {
    content: '';
    position: fixed;
    inset: 0;
    background: 
      radial-gradient(ellipse 80% 50% at 20% 10%, rgba(180,140,80,0.08) 0%, transparent 60%),
      radial-gradient(ellipse 60% 40% at 80% 90%, rgba(120,80,160,0.06) 0%, transparent 60%);
    pointer-events: none;
    z-index: 0;
  }

  .grain {
    position: fixed;
    inset: 0;
    opacity: 0.03;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 1;
  }

  .container {
    max-width: 900px;
    margin: 0 auto;
    padding: 48px 24px;
    position: relative;
    z-index: 2;
  }

  .header {
    text-align: center;
    margin-bottom: 56px;
  }

  .header-eyebrow {
    font-size: 11px;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: #b8965a;
    margin-bottom: 16px;
    font-weight: 300;
  }

  .header h1 {
    font-family: 'Playfair Display', serif;
    font-size: clamp(42px, 6vw, 72px);
    font-weight: 900;
    line-height: 1;
    color: #f0e8d8;
    letter-spacing: -0.02em;
  }

  .header h1 span {
    display: block;
    color: #b8965a;
    font-style: italic;
  }

  .date-selector {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    margin-top: 28px;
  }

  .date-selector input {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(184,150,90,0.3);
    color: #e8e0d0;
    padding: 10px 20px;
    font-family: 'Crimson Pro', serif;
    font-size: 16px;
    border-radius: 2px;
    cursor: pointer;
    outline: none;
    transition: border-color 0.2s;
  }

  .date-selector input:focus {
    border-color: #b8965a;
  }

  .summary-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 2px;
    margin-bottom: 48px;
    background: rgba(184,150,90,0.15);
    border: 1px solid rgba(184,150,90,0.15);
  }

  .summary-card {
    background: #0f0e0b;
    padding: 32px 24px;
    text-align: center;
    transition: background 0.2s;
  }

  .summary-card:hover { background: #161510; }

  .summary-label {
    font-size: 10px;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: #786050;
    margin-bottom: 12px;
  }

  .summary-amount {
    font-family: 'Playfair Display', serif;
    font-size: 28px;
    font-weight: 700;
  }

  .summary-amount.income { color: #7ab87a; }
  .summary-amount.expense { color: #c87070; }
  .summary-amount.balance.positive { color: #b8965a; }
  .summary-amount.balance.negative { color: #c87070; }

  .panels {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 32px;
    margin-bottom: 48px;
  }

  @media (max-width: 640px) {
    .panels { grid-template-columns: 1fr; }
    .summary-grid { grid-template-columns: 1fr; }
  }

  .panel {
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.06);
    padding: 28px;
    border-radius: 2px;
  }

  .panel-title {
    font-family: 'Playfair Display', serif;
    font-size: 22px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .panel-title.income-title { color: #7ab87a; }
  .panel-title.expense-title { color: #c87070; }

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .dot-income { background: #7ab87a; }
  .dot-expense { background: #c87070; }

  .form-group {
    margin-bottom: 12px;
  }

  .form-group input,
  .form-group select {
    width: 100%;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    color: #e8e0d0;
    padding: 10px 14px;
    font-family: 'Crimson Pro', serif;
    font-size: 15px;
    border-radius: 2px;
    outline: none;
    transition: border-color 0.2s;
  }

  .form-group input:focus,
  .form-group select:focus {
    border-color: rgba(184,150,90,0.5);
  }

  .form-group select option { background: #1a1915; }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }

  .btn {
    width: 100%;
    padding: 12px;
    border: none;
    cursor: pointer;
    font-family: 'Crimson Pro', serif;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    border-radius: 2px;
    margin-top: 8px;
    transition: opacity 0.2s, transform 0.1s;
  }

  .btn:active { transform: scale(0.98); }

  .btn-income {
    background: rgba(122,184,122,0.15);
    color: #7ab87a;
    border: 1px solid rgba(122,184,122,0.3);
  }

  .btn-income:hover { background: rgba(122,184,122,0.25); }

  .btn-expense {
    background: rgba(200,112,112,0.15);
    color: #c87070;
    border: 1px solid rgba(200,112,112,0.3);
  }

  .btn-expense:hover { background: rgba(200,112,112,0.25); }

  .transactions-section {
    border-top: 1px solid rgba(255,255,255,0.06);
    padding-top: 40px;
  }

  .section-title {
    font-family: 'Playfair Display', serif;
    font-size: 28px;
    margin-bottom: 24px;
    color: #f0e8d8;
  }

  .filter-tabs {
    display: flex;
    gap: 2px;
    margin-bottom: 24px;
    background: rgba(255,255,255,0.03);
    padding: 4px;
    width: fit-content;
    border-radius: 2px;
  }

  .tab {
    padding: 8px 20px;
    border: none;
    background: transparent;
    color: #786050;
    font-family: 'Crimson Pro', serif;
    font-size: 14px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    cursor: pointer;
    border-radius: 2px;
    transition: all 0.2s;
  }

  .tab.active {
    background: rgba(184,150,90,0.15);
    color: #b8965a;
  }

  .transaction-list {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .transaction-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.04);
    border-radius: 2px;
    transition: background 0.15s;
    animation: fadeIn 0.3s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-6px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .transaction-item:hover { background: rgba(255,255,255,0.04); }

  .transaction-left {
    display: flex;
    align-items: center;
    gap: 14px;
    flex: 1;
    min-width: 0;
  }

  .transaction-icon {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    flex-shrink: 0;
  }

  .transaction-icon.income { background: rgba(122,184,122,0.1); color: #7ab87a; }
  .transaction-icon.expense { background: rgba(200,112,112,0.1); color: #c87070; }

  .transaction-info { min-width: 0; }

  .transaction-desc {
    font-size: 16px;
    color: #e8e0d0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .transaction-cat {
    font-size: 12px;
    color: #786050;
    letter-spacing: 0.05em;
  }

  .transaction-right {
    display: flex;
    align-items: center;
    gap: 16px;
    flex-shrink: 0;
  }

  .transaction-amount {
    font-family: 'Playfair Display', serif;
    font-size: 18px;
    font-weight: 700;
  }

  .transaction-amount.income { color: #7ab87a; }
  .transaction-amount.expense { color: #c87070; }

  .delete-btn {
    background: none;
    border: none;
    color: #3a3530;
    cursor: pointer;
    font-size: 16px;
    padding: 4px;
    transition: color 0.2s;
    line-height: 1;
  }

  .delete-btn:hover { color: #c87070; }

  .empty-state {
    text-align: center;
    padding: 60px 20px;
    color: #3a3530;
    font-size: 18px;
    font-style: italic;
  }

  .progress-bar-wrap {
    margin-top: 28px;
    padding: 20px;
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.05);
    border-radius: 2px;
  }

  .progress-label {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #786050;
    margin-bottom: 10px;
  }

  .progress-track {
    height: 4px;
    background: rgba(255,255,255,0.06);
    border-radius: 2px;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    border-radius: 2px;
    transition: width 0.5s ease;
  }
`;

export default function App() {
  const [selectedDate, setSelectedDate] = useState(getTodayStr());
  const [transactions, setTransactions] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("txns") || "[]");
    } catch { return []; }
  });
  const [filter, setFilter] = useState("all");

  const [incomeForm, setIncomeForm] = useState({ desc: "", amount: "", category: "Salary" });
  const [expenseForm, setExpenseForm] = useState({ desc: "", amount: "", category: "Food" });

  useEffect(() => {
    localStorage.setItem("txns", JSON.stringify(transactions));
  }, [transactions]);

  const dayTxns = transactions.filter(t => t.date === selectedDate);
  const filtered = filter === "all" ? dayTxns : dayTxns.filter(t => t.type === filter);

  const totalIncome = dayTxns.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const totalExpense = dayTxns.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const balance = totalIncome - totalExpense;
  const spendRatio = totalIncome > 0 ? Math.min((totalExpense / totalIncome) * 100, 100) : 0;

  const addTransaction = (type) => {
    const form = type === "income" ? incomeForm : expenseForm;
    if (!form.amount || isNaN(form.amount) || +form.amount <= 0) return;
    const newTxn = {
      id: Date.now(),
      type,
      desc: form.desc || (type === "income" ? "Income" : "Expense"),
      amount: parseFloat(form.amount),
      category: form.category,
      date: selectedDate,
    };
    setTransactions(prev => [newTxn, ...prev]);
    if (type === "income") setIncomeForm({ desc: "", amount: "", category: "Salary" });
    else setExpenseForm({ desc: "", amount: "", category: "Food" });
  };

  const deleteTransaction = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const categoryIcons = {
    Salary: "💼", Freelance: "💻", Investment: "📈", Gift: "🎁",
    Food: "🍜", Transport: "🚌", Housing: "🏠", Shopping: "🛍",
    Health: "💊", Entertainment: "🎬", Utilities: "⚡", Other: "•"
  };

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        <div className="grain" />
        <div className="container">
          <header className="header">
            <p className="header-eyebrow">Personal Finance Journal</p>
            <h1>Track Your<span>Money Flow</span></h1>
            <div className="date-selector">
              <input
                type="date"
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
              />
            </div>
          </header>

          <div className="summary-grid">
            <div className="summary-card">
              <div className="summary-label">Income</div>
              <div className="summary-amount income">{formatCurrency(totalIncome)}</div>
            </div>
            <div className="summary-card">
              <div className="summary-label">Expense</div>
              <div className="summary-amount expense">{formatCurrency(totalExpense)}</div>
            </div>
            <div className="summary-card">
              <div className="summary-label">Balance</div>
              <div className={`summary-amount balance ${balance >= 0 ? "positive" : "negative"}`}>
                {formatCurrency(balance)}
              </div>
            </div>
          </div>

          {totalIncome > 0 && (
            <div className="progress-bar-wrap">
              <div className="progress-label">
                <span>Spending Ratio</span>
                <span>{spendRatio.toFixed(1)}% of income spent</span>
              </div>
              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{
                    width: `${spendRatio}%`,
                    background: spendRatio > 80 ? "#c87070" : spendRatio > 50 ? "#b8965a" : "#7ab87a"
                  }}
                />
              </div>
            </div>
          )}

          <div className="panels" style={{ marginTop: "40px" }}>
            {/* Income Panel */}
            <div className="panel">
              <h2 className="panel-title income-title">
                <span className="dot dot-income" />
                Add Income
              </h2>
              <div className="form-group">
                <input
                  placeholder="Description"
                  value={incomeForm.desc}
                  onChange={e => setIncomeForm(p => ({ ...p, desc: e.target.value }))}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <input
                    type="number"
                    placeholder="Amount"
                    value={incomeForm.amount}
                    onChange={e => setIncomeForm(p => ({ ...p, amount: e.target.value }))}
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <select
                    value={incomeForm.category}
                    onChange={e => setIncomeForm(p => ({ ...p, category: e.target.value }))}
                  >
                    {CATEGORIES_INCOME.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <button className="btn btn-income" onClick={() => addTransaction("income")}>
                + Add Income
              </button>
            </div>

            {/* Expense Panel */}
            <div className="panel">
              <h2 className="panel-title expense-title">
                <span className="dot dot-expense" />
                Add Expense
              </h2>
              <div className="form-group">
                <input
                  placeholder="Description"
                  value={expenseForm.desc}
                  onChange={e => setExpenseForm(p => ({ ...p, desc: e.target.value }))}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <input
                    type="number"
                    placeholder="Amount"
                    value={expenseForm.amount}
                    onChange={e => setExpenseForm(p => ({ ...p, amount: e.target.value }))}
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <select
                    value={expenseForm.category}
                    onChange={e => setExpenseForm(p => ({ ...p, category: e.target.value }))}
                  >
                    {CATEGORIES_EXPENSE.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <button className="btn btn-expense" onClick={() => addTransaction("expense")}>
                − Add Expense
              </button>
            </div>
          </div>

          {/* Transactions */}
          <div className="transactions-section">
            <h2 className="section-title">Transactions</h2>
            <div className="filter-tabs">
              {["all", "income", "expense"].map(f => (
                <button key={f} className={`tab ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>
                  {f}
                </button>
              ))}
            </div>
            <div className="transaction-list">
              {filtered.length === 0 ? (
                <div className="empty-state">No transactions for this day yet.</div>
              ) : (
                filtered.map(t => (
                  <div key={t.id} className="transaction-item">
                    <div className="transaction-left">
                      <div className={`transaction-icon ${t.type}`}>
                        {categoryIcons[t.category] || "•"}
                      </div>
                      <div className="transaction-info">
                        <div className="transaction-desc">{t.desc}</div>
                        <div className="transaction-cat">{t.category}</div>
                      </div>
                    </div>
                    <div className="transaction-right">
                      <span className={`transaction-amount ${t.type}`}>
                        {t.type === "income" ? "+" : "−"}{formatCurrency(t.amount)}
                      </span>
                      <button className="delete-btn" onClick={() => deleteTransaction(t.id)}>✕</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}