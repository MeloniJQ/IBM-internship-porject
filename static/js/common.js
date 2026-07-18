// ==================== COMMON UTILITIES ====================

// ==================== COMMON UTILITIES ====

// Show Alert Message
function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.innerHTML = `
        <i class="fas fa-${getAlertIcon(type)} me-2"></i>
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    const container = document.querySelector('.container-fluid') || document.body;
    container.insertBefore(alertDiv, container.firstChild);
    
    setTimeout(() => {
        const bsAlert = new bootstrap.Alert(alertDiv);
        bsAlert.close();
    }, 5000);
}

function getAlertIcon(type) {
    const icons = {
        'danger': 'exclamation-circle',
        'error': 'exclamation-circle',
        'success': 'check-circle',
        'warning': 'exclamation-triangle',
        'info': 'info-circle'
    };
    return icons[type] || icons['info'];
}

// Format Currency
function formatCurrency(amount) {
    return '₹' + parseFloat(amount).toFixed(2);
}

// Format Date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
}

// Get Chart Colors
function getChartColors(isDarkMode = false) {
    return {
        primary: '#667eea',
        secondary: '#764ba2',
        success: '#28a745',
        danger: '#dc3545',
        warning: '#ffc107',
        info: '#17a2b8',
        light: isDarkMode ? '#2d2d2d' : '#f8f9fa',
        dark: isDarkMode ? '#e0e0e0' : '#212529',
        credited: '#28a745',
        debited: '#dc3545',
        balance: '#007bff',
        grid: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
        text: isDarkMode ? '#e0e0e0' : '#212529'
    };
}

// Set Month Input Default
function setMonthInputDefault(elementId) {
    const monthInput = document.getElementById(elementId);
    if (monthInput) {
        monthInput.valueAsDate = new Date();
    }
}

// API Helper
async function apiCall(endpoint, method = 'GET', data = null) {
    try {
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };
        
        if (data) {
            options.body = JSON.stringify(data);
        }
        
        const response = await fetch(endpoint, options);
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || `HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        showAlert(error.message, 'error');
        throw error;
    }
}

// Chart Configuration
function getChartConfig(type, labels, datasets, title = '') {
    const isDarkMode = document.body.classList.contains('dark-mode');
    const colors = getChartColors(isDarkMode);
    
    const commonOptions = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                labels: {
                    color: colors.text,
                    font: { size: 12, weight: 'bold' },
                    padding: 15
                }
            }
        }
    };
    
    if (type === 'doughnut') {
        return {
            type: 'doughnut',
            data: { labels, datasets },
            options: commonOptions
        };
    } else if (type === 'pie') {
        return {
            type: 'pie',
            data: { labels, datasets },
            options: commonOptions
        };
    } else if (type === 'bar') {
        return {
            type: 'bar',
            data: { labels, datasets },
            options: {
                ...commonOptions,
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
                }
            }
        };
    } else if (type === 'line') {
        return {
            type: 'line',
            data: { labels, datasets },
            options: {
                ...commonOptions,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { color: colors.text },
                        grid: { color: colors.grid }
                    },
                    x: {
                        ticks: { color: colors.text },
                        grid: { color: colors.grid }
                    }
                }
            }
        };
    }
}

// Destroy Chart
function destroyChart(chartInstance) {
    if (chartInstance) {
        chartInstance.destroy();
    }
}

// Currency Input Formatter
function formatCurrencyInput(input) {
    input.addEventListener('blur', function() {
        const value = parseFloat(this.value);
        if (!isNaN(value)) {
            this.value = value.toFixed(2);
        }
    });
}

// Confirm Dialog
function confirmAction(message) {
    return confirm(message);
}

// Export CSV Download
async function downloadCSV() {
    try {
        window.location.href = '/api/export-csv';
        showAlert('Download started!', 'success');
    } catch (error) {
        showAlert('Error downloading file', 'error');
    }
}

// Get Chart Colors Array
function getColorArray(count) {
    const colors = [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
        '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0', '#FF6384',
        '#00FF7F', '#FFB6C1', '#87CEEB', '#DDA0DD', '#F0E68C'
    ];
    return colors.slice(0, count);
}

// Loading Spinner
function showLoader(element) {
    element.innerHTML = `
        <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    `;
}

// Initialize Tooltips (Bootstrap)
function initializeTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

// Initialize Popovers (Bootstrap)
function initializePopovers() {
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map(function(popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });
}

// Debounce Function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    initializeTooltips();
    initializePopovers();
    
    // Format all currency inputs
    document.querySelectorAll('input[type="number"][min="0"]').forEach(input => {
        formatCurrencyInput(input);
    });
});

// Console Logging
const log = {
    info: (msg) => console.log('ℹ️ ' + msg),
    success: (msg) => console.log('✅ ' + msg),
    error: (msg) => console.error('❌ ' + msg),
    warn: (msg) => console.warn('⚠️ ' + msg)
};
