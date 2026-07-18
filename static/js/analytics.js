// ==================== ANALYTICS PAGE ====================

let analyticsCharts = {
    distribution: null,
    comparison: null
};

// Initialize Analytics Page
document.addEventListener('DOMContentLoaded', function() {
    setMonthInputDefault('analyticsMonth');
    
    const monthInput = document.getElementById('analyticsMonth');
    if (monthInput) {
        monthInput.addEventListener('change', loadAnalyticsData);
    }
    
    loadAnalyticsData();
});

// Load Analytics Data
async function loadAnalyticsData() {
    const month = document.getElementById('analyticsMonth').value;
    
    try {
        // Load summary
        const summary = await apiCall(`/api/summary?month=${month}`);
        updateAnalyticsSummary(summary);
        displayDistributionChart(summary.category_breakdown);
        displayComparisonChart(summary);
        displayCategoryBreakdown(summary.category_breakdown);
        
        // Load recent transactions
        const transactions = await apiCall(`/api/transactions?month=${month}`);
        displayTopTransactions(transactions);
        
        log.success('Analytics data loaded');
    } catch (error) {
        log.error('Failed to load analytics data: ' + error.message);
    }
}

// Update Analytics Summary
function updateAnalyticsSummary(summary) {
    document.getElementById('analyticsCredited').textContent = formatCurrency(summary.total_credited);
    document.getElementById('analyticsDebited').textContent = formatCurrency(summary.total_debited);
    
    const balanceEl = document.getElementById('analyticsBalance');
    const balance = summary.balance;
    balanceEl.textContent = formatCurrency(Math.abs(balance));
    balanceEl.style.color = balance >= 0 ? '#28a745' : '#dc3545';
    
    document.getElementById('transactionCount').textContent = 
        (summary.total_credited + summary.total_debited).toString();
}

// Display Distribution Chart
function displayDistributionChart(categoryBreakdown) {
    const ctx = document.getElementById('distributionChart');
    if (!ctx) return;
    
    destroyChart(analyticsCharts.distribution);
    
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
    
    analyticsCharts.distribution = new Chart(ctx, chartConfig);
}

// Display Comparison Chart
function displayComparisonChart(summary) {
    const ctx = document.getElementById('comparisonChart');
    if (!ctx) return;
    
    destroyChart(analyticsCharts.comparison);
    
    const isDarkMode = document.body.classList.contains('dark-mode');
    const colors = getChartColors(isDarkMode);
    
    const chartConfig = {
        type: 'pie',
        data: {
            labels: ['Credited (Income)', 'Debited (Expense)'],
            datasets: [{
                data: [summary.total_credited, summary.total_debited],
                backgroundColor: [colors.credited, colors.debited],
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
    
    analyticsCharts.comparison = new Chart(ctx, chartConfig);
}

// Display Category Breakdown
function displayCategoryBreakdown(categoryBreakdown) {
    const tbody = document.getElementById('categoryBreakdown');
    
    const categories = Object.entries(categoryBreakdown)
        .sort((a, b) => b[1] - a[1]);
    
    const total = Object.values(categoryBreakdown).reduce((a, b) => a + b, 0) || 1;
    
    if (categories.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4" class="text-center text-muted py-5">
                    No data available
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = categories.map(([category, amount]) => {
        const percentage = ((amount / total) * 100).toFixed(1);
        return `
            <tr>
                <td>
                    <strong>${category}</strong>
                </td>
                <td class="text-end">
                    <strong>${formatCurrency(amount)}</strong>
                </td>
                <td class="text-end">
                    <span class="badge bg-info">${percentage}%</span>
                </td>
                <td>
                    <div class="progress" style="height: 20px;">
                        <div class="progress-bar bg-success" style="width: ${percentage}%"></div>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// Display Top Transactions
function displayTopTransactions(transactions) {
    const tbody = document.getElementById('topTransactions');
    
    // Sort by amount descending
    const sorted = transactions
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 10);
    
    if (sorted.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center text-muted py-5">
                    No transactions
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = sorted.map(t => `
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

// Refresh analytics every 60 seconds
document.addEventListener('DOMContentLoaded', function() {
    setInterval(loadAnalyticsData, 60000);
});
