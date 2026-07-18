// ==================== SETTINGS PAGE ====================

// Initialize Settings Page
document.addEventListener('DOMContentLoaded', function() {
    loadUserProfile();
    loadCategories();
    attachSettingsEventListeners();
});

// Attach Event Listeners
function attachSettingsEventListeners() {
    // Profile form
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', handleProfileUpdate);
    }
    
    // Password form
    const passwordForm = document.getElementById('passwordForm');
    if (passwordForm) {
        passwordForm.addEventListener('submit', handlePasswordChange);
    }
    
    // Category form
    const addCategoryForm = document.getElementById('addCategoryForm');
    if (addCategoryForm) {
        document.getElementById('submitAddCategoryBtn').addEventListener('click', handleAddCategory);
    }
    
    // Danger zone
    document.getElementById('deleteDataBtn').addEventListener('click', handleDeleteAllData);
    document.getElementById('deleteAccountBtn').addEventListener('click', handleDeleteAccount);
    
}

// Load User Profile
async function loadUserProfile() {
    try {
        const user = await apiCall('/api/user');
        
        document.getElementById('profileUsername').value = user.username;
        document.getElementById('profileEmail').value = user.email;
        document.getElementById('profileFullName').value = user.full_name || '';
        
        const createdDate = new Date(user.created_at).toLocaleDateString('en-IN');
        document.getElementById('profileCreated').value = createdDate;
        
        log.success('User profile loaded');
    } catch (error) {
        log.error('Failed to load user profile: ' + error.message);
    }
}

// Handle Profile Update
async function handleProfileUpdate(e) {
    e.preventDefault();
    
    const data = {
        email: document.getElementById('profileEmail').value,
        full_name: document.getElementById('profileFullName').value
    };
    
    if (!data.email) {
        showAlert('Email is required', 'warning');
        return;
    }
    
    try {
        await apiCall('/api/user', 'PUT', data);
        showAlert('Profile updated successfully!', 'success');
        log.success('Profile updated');
    } catch (error) {
        log.error('Failed to update profile: ' + error.message);
    }
}

// Handle Password Change (placeholder)
async function handlePasswordChange(e) {
    e.preventDefault();
    
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmNewPassword').value;
    
    if (!currentPassword || !newPassword || !confirmPassword) {
        showAlert('All fields are required', 'warning');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        showAlert('New passwords do not match', 'error');
        return;
    }
    
    if (newPassword.length < 6) {
        showAlert('Password must be at least 6 characters', 'warning');
        return;
    }
    
    try {
        // Note: This endpoint would need to be created in app.py
        // For now, we'll show a placeholder
        showAlert('Password change feature coming soon!', 'info');
        document.getElementById('passwordForm').reset();
    } catch (error) {
        log.error('Failed to change password: ' + error.message);
    }
}

// Load Categories
async function loadCategories() {
    try {
        const categories = await apiCall('/api/categories');
        displayCategories(categories);
    } catch (error) {
        log.error('Failed to load categories: ' + error.message);
    }
}

// Display Categories
function displayCategories(categories) {
    const container = document.getElementById('categoriesList');
    
    if (categories.length === 0) {
        container.innerHTML = '<p class="text-muted text-center py-5">No custom categories</p>';
        return;
    }
    
    // Group by type
    const credited = categories.filter(c => c.type === 'credited');
    const debited = categories.filter(c => c.type === 'debited');
    
    let html = '<h6 class="mb-3 fw-bold">Credited Categories</h6>';
    html += '<div class="row g-2 mb-4">';
    credited.forEach(cat => {
        html += createCategoryCard(cat);
    });
    html += '</div>';
    
    html += '<h6 class="mb-3 fw-bold">Debited Categories</h6>';
    html += '<div class="row g-2">';
    debited.forEach(cat => {
        html += createCategoryCard(cat);
    });
    html += '</div>';
    
    container.innerHTML = html;
}

// Create Category Card
function createCategoryCard(category) {
    return `
        <div class="col-sm-6 col-md-4">
            <div class="card border-0 shadow-sm h-100">
                <div class="card-body p-3">
                    <div class="d-flex align-items-center justify-content-between">
                        <div>
                            <div class="d-flex align-items-center gap-2 mb-2">
                                <div style="width: 20px; height: 20px; background-color: ${category.color}; border-radius: 4px;"></div>
                                <strong>${category.name}</strong>
                            </div>
                            <small class="text-muted">${category.type}</small>
                        </div>
                        <button class="btn btn-sm btn-outline-danger" onclick="deleteCategory(${category.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Handle Add Category
async function handleAddCategory() {
    const name = document.getElementById('categoryName').value;
    const type = document.getElementById('categoryType').value;
    const color = document.getElementById('categoryColor').value;
    
    if (!name || !type) {
        showAlert('Please fill in all fields', 'warning');
        return;
    }
    
    try {
        const data = { name, type, color };
        await apiCall('/api/categories', 'POST', data);
        
        // Reset form
        document.getElementById('addCategoryForm').reset();
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('addCategoryModal'));
        modal.hide();
        
        // Reload categories
        loadCategories();
        showAlert('Category added successfully!', 'success');
        log.success('Category added');
    } catch (error) {
        log.error('Failed to add category: ' + error.message);
    }
}

// Delete Category
async function deleteCategory(id) {
    if (!confirmAction('Delete this category?')) {
        return;
    }
    
    try {
        await apiCall(`/api/categories/${id}`, 'DELETE');
        loadCategories();
        showAlert('Category deleted!', 'success');
    } catch (error) {
        log.error('Failed to delete category: ' + error.message);
    }
}

// Handle Delete All Data
async function handleDeleteAllData() {
    if (!confirmAction('⚠️ WARNING: Delete ALL transactions? This cannot be undone!')) {
        return;
    }
    
    const confirmText = prompt('Type "DELETE ALL" to confirm:');
    if (confirmText !== 'DELETE ALL') {
        showAlert('Cancelled', 'info');
        return;
    }
    
    try {
        const transactions = await apiCall('/api/transactions');
        
        let deleted = 0;
        for (const t of transactions) {
            try {
                await apiCall(`/api/transactions/${t.id}`, 'DELETE');
                deleted++;
            } catch (error) {
                log.error(`Failed to delete transaction ${t.id}`);
            }
        }
        
        showAlert(`Deleted ${deleted} transactions!`, 'success');
        log.success(`All data deleted`);
    } catch (error) {
        log.error('Failed to delete data: ' + error.message);
    }
}

// Handle Delete Account
async function handleDeleteAccount() {
    if (!confirmAction('⚠️ WARNING: Delete your account? This cannot be undone!')) {
        return;
    }
    
    const confirmText = prompt('Type your username to confirm:');
    const username = document.getElementById('profileUsername').value;
    
    if (confirmText !== username) {
        showAlert('Username does not match. Cancelled.', 'error');
        return;
    }
    
    try {
        showAlert('Account deletion endpoint not yet implemented', 'info');
        log.info('Account deletion would proceed');
    } catch (error) {
        log.error('Failed to delete account: ' + error.message);
    }
}

// Export button
const exportBtn = document.querySelector('a[href="/api/export-csv"]');
if (exportBtn) {
    exportBtn.addEventListener('click', function(e) {
        showAlert('Download started!', 'success');
    });
}
