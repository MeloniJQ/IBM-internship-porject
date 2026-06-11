// ==================== DASHBOARD PAGE ====================

let dashboardCharts = {
    category: null,
    monthly: null
};

// Initialize Dashboard
document.addEventListener('DOMContentLoaded', function() {
    setMonthInputDefault('dashboardMonth');
    
    const monthInput = document.getElementById('dashboardMonth');
    if (monthInput) {
        monthInput.addEventListener('change', loadDashboardData);
    }
    
    loadDashboardData();
});

// Load Dashboard Data
async function loadDashboardData() {
    const month = document.getElementById('dashboardMonth').value;
    
    try {
        // Load summary
        const summary = await apiCall(`/api/summary?month=${month}`);
        updateSummaryCards(summary);
        displayCategoryChart(summary.category_breakdown);
        
        // Load monthly stats
        const monthlyStats = await apiCall('/api/monthly-stats');
        displayMonthlyChart(monthlyStats);
        
        // Load recent transactions
        const transactions = await apiCall(`/api/transactions?month=${month}`);
        displayRecentTransactions(transactions.slice(0, 5));
        
        log.success('Dashboard data loaded');
    } catch (error) {
        log.error('Failed to load dashboard data: ' + error.message);
    }
}

// Update Summary Cards
function updateSummaryCards(summary) {
    document.getElementById('totalCredited').textContent = formatCurrency(summary.total_credited);
    document.getElementById('totalDebited').textContent = formatCurrency(summary.total_debited);
    
    const balanceEl = document.getElementById('netBalance');
    const balance = summary.balance;
    balanceEl.textContent = formatCurrency(Math.abs(balance));
    balanceEl.style.color = balance >= 0 ? '#28a745' : '#dc3545';
}

// Display Category Chart
function displayCategoryChart(categoryBreakdown) {
    const ctx = document.getElementById('categoryChart');
    if (!ctx) return;
    
    destroyChart(dashboardCharts.category);
    
    const isDarkMode = document.body.classList.contains('dark-mode');
    const colors = getChartColors(isDarkMode);
    
    const categories = Object.keys(categoryBreakdown);
    const amounts = Object.values(categoryBreakdown);
    
    if (categories.length === 0) {
        ctx.parentElement.innerHTML = '<p class="text-muted text-center py-5">No data available</p>';
        return;
    }
    
    const chartConfig = {
        type: 'doughnut',
        data: {
            labels: categories,
            datasets: [{
                data: amounts,
                backgroundColor: getColorArray(categories.length),
                borderColor: isDarkMode ? '#2d2d2d' : '#fff',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: colors.text,
                        font: { size: 12, weight: 'bold' },
                        padding: 15
                    }
                }
            }
        }
    };
    
    dashboardCharts.category = new Chart(ctx, chartConfig);
}

// Display Monthly Chart
function displayMonthlyChart(stats) {
    const ctx = document.getElementById('monthlyChart');
    if (!ctx) return;
    
    destroyChart(dashboardCharts.monthly);
    
    const isDarkMode = document.body.classList.contains('dark-mode');
    const colors = getChartColors(isDarkMode);
    
    const months = stats.map(s => s.month.split(' ')[0]);
    const credited = stats.map(s => s.credited);
    const debited = stats.map(s => s.debited);
    
    const chartConfig = {
        type: 'bar',
        data: {
            labels: months,
            datasets: [
                {
                    label: 'Credited (Income)',
                    data: credited,
                    backgroundColor: colors.credited,
                    borderColor: '#1e7e34',
                    borderWidth: 2,
                    borderRadius: 6
                },
                {
                    label: 'Debited (Expense)',
                    data: debited,
                    backgroundColor: colors.debited,
                    borderColor: '#bd2130',
                    borderWidth: 2,
                    borderRadius: 6
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: colors.text,
                        callback: function(value) {
                            return '₹' + value;
                        }
                    },
                    grid: { color: colors.grid }
                },
                x: {
                    ticks: { color: colors.text },
                    grid: { color: colors.grid }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: colors.text,
                        font: { size: 12, weight: 'bold' },
                        padding: 15
                    }
                }
            }
        }
    };
    
    dashboardCharts.monthly = new Chart(ctx, chartConfig);
}

// Display Recent Transactions
function displayRecentTransactions(transactions) {
    const tbody = document.getElementById('recentTransactions');
    
    if (transactions.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center text-muted py-5">
                    <i class="fas fa-inbox fa-2x mb-2 d-block"></i>
                    No transactions this month
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = transactions.map(t => `
        <tr>
            <td>
                <small class="text-muted">${formatDate(t.date)}</small>
            </td>
            <td>
                <span class="badge bg-info">${t.category}</span>
            </td>
            <td>
                <small>${t.description || '-'}</small>
            </td>
            <td>
                <span class="badge ${t.type === 'credited' ? 'bg-success' : 'bg-danger'}">
                    ${t.type === 'credited' ? '↓ Credited' : '↑ Debited'}
                </span>
            </td>
            <td class="text-end">
                <strong class="${t.type === 'credited' ? 'text-success' : 'text-danger'}">
                    ${t.type === 'credited' ? '+' : '-'}${formatCurrency(t.amount)}
                </strong>
            </td>
        </tr>
    `).join('');
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Refresh dashboard every 30 seconds
    setInterval(loadDashboardData, 30000);
});
