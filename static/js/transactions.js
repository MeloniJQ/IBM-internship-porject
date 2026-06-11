// ==================== TRANSACTIONS PAGE ====================

let currentEditingId = null;
let allCategories = [];

// Initialize Transactions Page
document.addEventListener('DOMContentLoaded', function() {
    setMonthInputDefault('filterMonth');
    loadCategories();
    loadTransactions();
    attachEventListeners();
});

// Attach Event Listeners
function attachEventListeners() {
    // Filter events
    document.getElementById('filterMonth').addEventListener('change', applyFilters);
    document.getElementById('filterType').addEventListener('change', applyFilters);
    document.getElementById('filterCategory').addEventListener('change', applyFilters);
    document.getElementById('clearFiltersBtn').addEventListener('click', clearFilters);
    
    // Form submissions
    document.getElementById('submitAddBtn').addEventListener('click', handleAddTransaction);
    document.getElementById('submitEditBtn').addEventListener('click', handleEditTransaction);
    document.getElementById('deleteEditBtn').addEventListener('click', handleDeleteTransaction);
    
    // Type change to update categories
    document.getElementById('addType').addEventListener('change', updateAddCategoriesByType);
    document.getElementById('editType').addEventListener('change', updateEditCategoriesByType);
    
    // Set today's date
    document.getElementById('addDate').valueAsDate = new Date();
}

// Load Categories
async function loadCategories() {
    try {
        allCategories = await apiCall('/api/categories');
        populateCategorySelects();
    } catch (error) {
        log.error('Failed to load categories: ' + error.message);
    }
}

// Populate Category Selects
function populateCategorySelects() {
    const selects = [
        'filterCategory',
        'addCategory',
        'editCategory'
    ];
    
    selects.forEach(selectId => {
        const select = document.getElementById(selectId);
        if (select) {
            const currentValue = select.value;
            const categories = allCategories.map(c => c.name);
            const html = '<option value="">All Categories</option>' +
                categories.map(cat => `<option value="${cat}">${cat}</option>`).join('');
            select.innerHTML = html;
            select.value = currentValue;
        }
    });
}

// Update Categories by Type (Add Form)
function updateAddCategoriesByType() {
    const type = document.getElementById('addType').value;
    updateCategorySelect('addCategory', type);
}

// Update Categories by Type (Edit Form)
function updateEditCategoriesByType() {
    const type = document.getElementById('editType').value;
    updateCategorySelect('editCategory', type);
}

// Update Category Select
function updateCategorySelect(selectId, type) {
    const select = document.getElementById(selectId);
    const currentValue = select.value;
    
    let categories = [];
    if (type) {
        categories = allCategories
            .filter(c => c.type === type)
            .map(c => c.name);
    } else {
        categories = allCategories.map(c => c.name);
    }
    
    const html = '<option value="">Select Category</option>' +
        categories.map(cat => `<option value="${cat}">${cat}</option>`).join('');
    select.innerHTML = html;
    select.value = currentValue;
}

// Load Transactions
async function loadTransactions() {
    try {
        const params = new URLSearchParams();
        
        const month = document.getElementById('filterMonth').value;
        const type = document.getElementById('filterType').value;
        const category = document.getElementById('filterCategory').value;
        
        if (month) params.append('month', month);
        if (type) params.append('type', type);
        if (category) params.append('category', category);
        
        const transactions = await apiCall(`/api/transactions?${params}`);
        displayTransactions(transactions);
    } catch (error) {
        log.error('Failed to load transactions: ' + error.message);
    }
}

// Display Transactions
function displayTransactions(transactions) {
    const tbody = document.getElementById('transactionTableBody');
    const countBadge = document.getElementById('transactionCount');
    
    countBadge.textContent = transactions.length;
    
    if (transactions.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center text-muted py-5">
                    <i class="fas fa-inbox fa-2x mb-2 d-block"></i>
                    No transactions found
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
            <td class="text-center">
                <button class="btn btn-sm btn-outline-primary" onclick="openEditModal(${t.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="quickDelete(${t.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Handle Add Transaction
async function handleAddTransaction() {
    const form = document.getElementById('addTransactionForm');
    
    const data = {
        amount: parseFloat(document.getElementById('addAmount').value),
        type: document.getElementById('addType').value,
        category: document.getElementById('addCategory').value,
        date: document.getElementById('addDate').value,
        description: document.getElementById('addDescription').value,
        is_recurring: document.getElementById('addRecurring').checked
    };
    
    // Validation
    if (!data.amount || !data.type || !data.category || !data.date) {
        showAlert('Please fill in all required fields', 'warning');
        return;
    }
    
    try {
        await apiCall('/api/transactions', 'POST', data);
        
        // Reset form
        form.reset();
        document.getElementById('addDate').valueAsDate = new Date();
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('addTransactionModal'));
        modal.hide();
        
        // Reload data
        loadTransactions();
        showAlert('Transaction added successfully!', 'success');
        log.success('Transaction added');
    } catch (error) {
        log.error('Failed to add transaction: ' + error.message);
    }
}

// Open Edit Modal
async function openEditModal(id) {
    try {
        const transaction = await apiCall(`/api/transactions/${id}`);
        
        document.getElementById('editTransactionId').value = transaction.id;
        document.getElementById('editAmount').value = transaction.amount;
        document.getElementById('editType').value = transaction.type;
        document.getElementById('editDate').value = transaction.date;
        document.getElementById('editDescription').value = transaction.description || '';
        
        updateEditCategoriesByType();
        document.getElementById('editCategory').value = transaction.category;
        
        currentEditingId = transaction.id;
        
        const modal = new bootstrap.Modal(document.getElementById('editTransactionModal'));
        modal.show();
        
        log.info('Edit modal opened for transaction ' + id);
    } catch (error) {
        log.error('Failed to open edit modal: ' + error.message);
    }
}

// Handle Edit Transaction
async function handleEditTransaction() {
    const id = parseInt(document.getElementById('editTransactionId').value);
    
    const data = {
        amount: parseFloat(document.getElementById('editAmount').value),
        type: document.getElementById('editType').value,
        category: document.getElementById('editCategory').value,
        date: document.getElementById('editDate').value,
        description: document.getElementById('editDescription').value
    };
    
    try {
        await apiCall(`/api/transactions/${id}`, 'PUT', data);
        
        const modal = bootstrap.Modal.getInstance(document.getElementById('editTransactionModal'));
        modal.hide();
        
        loadTransactions();
        showAlert('Transaction updated successfully!', 'success');
        log.success('Transaction updated');
    } catch (error) {
        log.error('Failed to update transaction: ' + error.message);
    }
}

// Handle Delete Transaction
async function handleDeleteTransaction() {
    if (!confirmAction('Are you sure you want to delete this transaction?')) {
        return;
    }
    
    const id = parseInt(document.getElementById('editTransactionId').value);
    
    try {
        await apiCall(`/api/transactions/${id}`, 'DELETE');
        
        const modal = bootstrap.Modal.getInstance(document.getElementById('editTransactionModal'));
        modal.hide();
        
        loadTransactions();
        showAlert('Transaction deleted successfully!', 'success');
        log.success('Transaction deleted');
    } catch (error) {
        log.error('Failed to delete transaction: ' + error.message);
    }
}

// Quick Delete
async function quickDelete(id) {
    if (!confirmAction('Delete this transaction?')) {
        return;
    }
    
    try {
        await apiCall(`/api/transactions/${id}`, 'DELETE');
        loadTransactions();
        showAlert('Transaction deleted!', 'success');
    } catch (error) {
        log.error('Failed to delete: ' + error.message);
    }
}

// Apply Filters
function applyFilters() {
    loadTransactions();
}

// Clear Filters
function clearFilters() {
    document.getElementById('filterMonth').valueAsDate = new Date();
    document.getElementById('filterType').value = '';
    document.getElementById('filterCategory').value = '';
    
    loadTransactions();
    showAlert('Filters cleared', 'info');
}
