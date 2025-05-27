let db;
let editingId = null;
let currentFilter = 'all';

async function initDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('VillaOrdersDB', 1);
        
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
            db = request.result;
            resolve();
        };
    });
}

async function loadInventory() {
    const transaction = db.transaction(['inventory'], 'readonly');
    const store = transaction.objectStore('inventory');
    const request = store.getAll();
    
    return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

async function displayInventory() {
    const inventory = await loadInventory();
    const container = document.getElementById('inventory-list');
    
    // Fade out
    container.style.opacity = '0';
    
    setTimeout(() => {
        container.innerHTML = '';
        
        const filteredItems = currentFilter === 'all' 
            ? inventory 
            : inventory.filter(item => item.category === currentFilter);
        
        filteredItems.forEach((item, index) => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'inventory-item';
            itemDiv.style.animationDelay = `${index * 0.05}s`;
            
            itemDiv.innerHTML = `
                <div class="inventory-item-header">
                    <div class="inventory-item-info">
                        <div class="inventory-item-name">${item.name}</div>
                        <div class="inventory-item-price">${item.priceEUR} EUR / ${item.priceCZK} CZK</div>
                        <div class="inventory-item-meta">
                            <span class="category-badge">${item.category}</span>
                            <span class="status-badge ${item.active ? 'active' : 'inactive'}">
                                ${item.active ? 'Active' : 'Hidden'}
                            </span>
                        </div>
                    </div>
                    <div class="inventory-item-actions">
                        <button class="item-action-btn edit-btn" onclick="editItem(${item.id})" title="Edit">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.43741 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                        <button class="item-action-btn toggle-btn" onclick="toggleItem(${item.id})" title="${item.active ? 'Hide' : 'Show'}">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                ${item.active ? 
                                    `<path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                     <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>` :
                                    `<path d="M17.94 17.94C16.2306 19.243 14.1491 19.9649 12 20C5 20 1 12 1 12C2.24389 9.68192 3.96914 7.65661 6.06 6.06003M9.9 4.24002C10.5883 4.0789 11.2931 3.99836 12 4.00003C19 4.00003 23 12 23 12C22.393 13.1356 21.6691 14.2048 20.84 15.19M14.12 14.12C13.8454 14.4148 13.5141 14.6512 13.1462 14.8151C12.7782 14.9791 12.3809 15.0673 11.9781 15.0744C11.5753 15.0815 11.1752 15.0074 10.8016 14.8565C10.4281 14.7056 10.0887 14.4811 9.80385 14.1962C9.51897 13.9113 9.29439 13.572 9.14351 13.1984C8.99262 12.8249 8.91853 12.4247 8.92563 12.0219C8.93274 11.6191 9.02091 11.2219 9.18488 10.8539C9.34884 10.4859 9.58525 10.1547 9.88 9.88003" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                     <path d="M1 1L23 23" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`
                                }
                            </svg>
                        </button>
                        <button class="item-action-btn delete-btn" onclick="deleteItem(${item.id})" title="Delete">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path d="M3 6H5H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                    </div>
                </div>
            `;
            
            container.appendChild(itemDiv);
        });
        
        // Fade in
        container.style.opacity = '1';
    }, 200);
}

function filterInventory(filter) {
    currentFilter = filter;
    
    // Update active tab and indicator
    document.querySelectorAll('.tab').forEach((tab, index) => {
        tab.classList.remove('active');
        if (tab.textContent.toLowerCase().includes(filter) || (filter === 'all' && index === 0)) {
            tab.classList.add('active');
            updateTabIndicator(index);
        }
    });
    
    displayInventory();
}

function updateTabIndicator(index) {
    const indicator = document.querySelector('.tab-indicator');
    const tabs = document.querySelectorAll('.tab');
    if (tabs[index] && indicator) {
        const tab = tabs[index];
        indicator.style.width = `${tab.offsetWidth}px`;
        indicator.style.left = `${tab.offsetLeft}px`;
    }
}

function showAddForm() {
    editingId = null;
    document.getElementById('item-name').value = '';
    document.getElementById('item-price-czk').value = '';
    document.getElementById('item-price-eur').value = '';
    document.getElementById('item-category').value = 'drinks';
    document.getElementById('item-active').checked = true;
    document.getElementById('add-form').style.display = 'flex';
}

async function editItem(id) {
    editingId = id;
    const transaction = db.transaction(['inventory'], 'readonly');
    const store = transaction.objectStore('inventory');
    const request = store.get(id);
    
    request.onsuccess = () => {
        const item = request.result;
        document.getElementById('item-name').value = item.name;
        document.getElementById('item-price-czk').value = item.priceCZK;
        document.getElementById('item-price-eur').value = item.priceEUR;
        document.getElementById('item-category').value = item.category;
        document.getElementById('item-active').checked = item.active;
        document.getElementById('add-form').style.display = 'flex';
    };
}

async function saveItem() {
    const item = {
        name: document.getElementById('item-name').value,
        priceCZK: parseFloat(document.getElementById('item-price-czk').value) || 0,
        priceEUR: parseFloat(document.getElementById('item-price-eur').value) || 0,
        category: document.getElementById('item-category').value,
        active: document.getElementById('item-active').checked
    };
    
    if (!item.name) return;
    
    const transaction = db.transaction(['inventory'], 'readwrite');
    const store = transaction.objectStore('inventory');
    
    if (editingId) {
        item.id = editingId;
        await store.put(item);
    } else {
        await store.add(item);
    }
    
    closeForm();
    displayInventory();
}

async function toggleItem(id) {
    const transaction = db.transaction(['inventory'], 'readwrite');
    const store = transaction.objectStore('inventory');
    const request = store.get(id);
    
    request.onsuccess = async () => {
        const item = request.result;
        item.active = !item.active;
        await store.put(item);
        displayInventory();
    };
}

async function deleteItem(id) {
    if (confirm('Opravdu smazat tuto položku? / Really delete this item?')) {
        const transaction = db.transaction(['inventory'], 'readwrite');
        const store = transaction.objectStore('inventory');
        await store.delete(id);
        displayInventory();
    }
}

function closeForm() {
    document.getElementById('add-form').style.display = 'none';
}

async function exportInventory() {
    const inventory = await loadInventory();
    const dataStr = JSON.stringify(inventory, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `villa-orders-inventory-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
}

async function importInventory(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = async (e) => {
        try {
            const items = JSON.parse(e.target.result);
            
            const transaction = db.transaction(['inventory'], 'readwrite');
            const store = transaction.objectStore('inventory');
            
            const clearRequest = store.clear();
            
            clearRequest.onsuccess = () => {
                items.forEach(item => {
                    delete item.id;
                    store.add(item);
                });
                
                displayInventory();
            };
        } catch (error) {
            alert('Chyba při importu / Import error');
        }
    };
    
    reader.readAsText(file);
}

initDB().then(() => {
    displayInventory();
});