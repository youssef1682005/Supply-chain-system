// Data Models
const MOCK_ORDERS = [
    { id: 'ORD-7392', customer: 'Acme Corp', date: 'Oct 24, 2026', total: '$1,240.00', status: 'delivered' },
    { id: 'ORD-7393', customer: 'Stark Industries', date: 'Oct 24, 2026', total: '$3,400.00', status: 'shipped' },
    { id: 'ORD-7394', customer: 'Wayne Enterprises', date: 'Oct 25, 2026', total: '$850.00', status: 'processing' },
    { id: 'ORD-7395', customer: 'LexCorp', date: 'Oct 25, 2026', total: '$5,120.00', status: 'pending' },
    { id: 'ORD-7396', customer: 'Cyberdyne Systems', date: 'Oct 26, 2026', total: '$9,200.00', status: 'pending' },
    { id: 'ORD-7397', customer: 'Umbrella Corp', date: 'Oct 26, 2026', total: '$14,500.00', status: 'delivered' },
    { id: 'ORD-7398', customer: 'Massive Dynamic', date: 'Oct 27, 2026', total: '$2,100.00', status: 'processing' },
];

const MOCK_INVENTORY = [
    { name: 'Industrial Robot Arm Model X', sku: 'ROB-X-001', stock: 145, max: 200, status: 'good' },
    { name: 'Titanium Fasteners (Box of 1000)', sku: 'FAS-T-1K', stock: 85, max: 500, status: 'warning' },
    { name: 'Lithium-Ion Battery Pack V2', sku: 'BAT-V2-100', stock: 12, max: 150, status: 'danger' },
    { name: 'Carbon Fiber Panels (2x2m)', sku: 'CFP-2X2', stock: 320, max: 400, status: 'good' },
    { name: 'Proximity Sensor Module', sku: 'SEN-P-05', stock: 5, max: 200, status: 'danger' },
    { name: 'Hydraulic Actuator H-Series', sku: 'HYD-H-10', stock: 45, max: 100, status: 'warning' },
];

let chartInstance = null;

const VIEWS = {
    loading: () => `
        <div class="page-header">
            <div class="page-title" style="width: 300px;">
                <div class="skeleton skeleton-title"></div>
                <div class="skeleton skeleton-text"></div>
            </div>
        </div>
        <div class="kpi-grid">
            ${[1,2,3,4].map(() => `
                <div class="card kpi-card">
                    <div style="width: 100%">
                        <div class="skeleton skeleton-text" style="width: 40%"></div>
                        <div class="skeleton skeleton-title" style="width: 70%; height: 32px; margin-top: 12px;"></div>
                    </div>
                </div>
            `).join('')}
        </div>
        <div class="card">
            <div class="skeleton skeleton-title"></div>
            <div class="skeleton skeleton-text" style="height: 200px;"></div>
        </div>
    `,
    dashboard: () => `
        <div class="page-header fade-in">
            <div class="page-title">
                <h1>Overview</h1>
                <p>Welcome back, Alex. Here's what's happening today.</p>
            </div>
            <button class="btn-primary">
                <span class="material-symbols-outlined">add</span> Create Order
            </button>
        </div>

        <div class="kpi-grid fade-in" style="animation-delay: 0.05s">
            <div class="card kpi-card">
                <div class="kpi-content">
                    <span class="kpi-title">Total Orders</span>
                    <span class="kpi-value">1,248</span>
                    <span class="kpi-trend positive">
                        <span class="material-symbols-outlined" style="font-size: 16px;">trending_up</span> 
                        +12% this month
                    </span>
                </div>
                <div class="kpi-icon blue">
                    <span class="material-symbols-outlined">shopping_cart</span>
                </div>
            </div>
            <div class="card kpi-card">
                <div class="kpi-content">
                    <span class="kpi-title">Active Shipments</span>
                    <span class="kpi-value">342</span>
                    <span class="kpi-trend positive">
                        <span class="material-symbols-outlined" style="font-size: 16px;">trending_up</span> 
                        +5% this month
                    </span>
                </div>
                <div class="kpi-icon orange">
                    <span class="material-symbols-outlined">local_shipping</span>
                </div>
            </div>
            <div class="card kpi-card">
                <div class="kpi-content">
                    <span class="kpi-title">Total Inventory</span>
                    <span class="kpi-value">45,231</span>
                    <span class="kpi-trend negative">
                        <span class="material-symbols-outlined" style="font-size: 16px;">trending_down</span> 
                        -2% this month
                    </span>
                </div>
                <div class="kpi-icon purple">
                    <span class="material-symbols-outlined">inventory_2</span>
                </div>
            </div>
            <div class="card kpi-card">
                <div class="kpi-content">
                    <span class="kpi-title">Monthly Revenue</span>
                    <span class="kpi-value">$2.4M</span>
                    <span class="kpi-trend positive">
                        <span class="material-symbols-outlined" style="font-size: 16px;">trending_up</span> 
                        +18% this month
                    </span>
                </div>
                <div class="kpi-icon green">
                    <span class="material-symbols-outlined">payments</span>
                </div>
            </div>
        </div>

        <div class="charts-grid fade-in" style="animation-delay: 0.1s">
            <div class="card chart-card">
                <div class="card-header">
                    <span class="card-title">Orders & Revenue Trend</span>
                    <button class="btn-secondary" style="padding: 6px 12px; font-size: 0.8rem;">This Year <span class="material-symbols-outlined" style="font-size: 16px;">expand_more</span></button>
                </div>
                <div class="chart-container">
                    <canvas id="dashboardChart"></canvas>
                </div>
            </div>
            <div class="card chart-card">
                <div class="card-header">
                    <span class="card-title">Recent Activity</span>
                </div>
                <div class="activity-list">
                    <div class="activity-item">
                        <div class="activity-icon"><span class="material-symbols-outlined">check_circle</span></div>
                        <div class="activity-content">
                            <span class="activity-text">Order <strong>#ORD-7392</strong> was delivered to Acme Corp.</span>
                            <span class="activity-time">2 hours ago</span>
                        </div>
                    </div>
                    <div class="activity-item">
                        <div class="activity-icon" style="background: var(--warning-bg); color: var(--warning); border-color: var(--card-bg);"><span class="material-symbols-outlined">warning</span></div>
                        <div class="activity-content">
                            <span class="activity-text">Low stock alert for <strong>Lithium-Ion Battery</strong>.</span>
                            <span class="activity-time">5 hours ago</span>
                        </div>
                    </div>
                    <div class="activity-item">
                        <div class="activity-icon" style="background: var(--info-bg); color: var(--info); border-color: var(--card-bg);"><span class="material-symbols-outlined">flight_takeoff</span></div>
                        <div class="activity-content">
                            <span class="activity-text">Shipment <strong>#SHP-8831</strong> departed from HK hub.</span>
                            <span class="activity-time">Yesterday at 4:30 PM</span>
                        </div>
                    </div>
                    <div class="activity-item">
                        <div class="activity-icon" style="background: var(--purple-bg); color: var(--purple); border-color: var(--card-bg);"><span class="material-symbols-outlined">person_add</span></div>
                        <div class="activity-content">
                            <span class="activity-text">New supplier <strong>GlobalTech</strong> registered.</span>
                            <span class="activity-time">Oct 24, 2026</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="card fade-in" style="animation-delay: 0.15s">
            <div class="card-header" style="margin-bottom: 0;">
                <span class="card-title">Recent Orders</span>
                <a href="#orders" style="color: var(--primary); text-decoration: none; font-size: 0.9rem; font-weight: 600;">View All</a>
            </div>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Date</th>
                            <th>Total</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${MOCK_ORDERS.slice(0,5).map(renderOrderRow).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `,
    orders: () => `
        <div class="page-header fade-in">
            <div class="page-title">
                <h1>Orders Management</h1>
                <p>View, track, and manage customer orders.</p>
            </div>
            <div style="display: flex; gap: 12px;">
                <button class="btn-secondary">
                    <span class="material-symbols-outlined">filter_list</span> Filter
                </button>
                <button class="btn-primary">
                    <span class="material-symbols-outlined">add</span> Create Order
                </button>
            </div>
        </div>

        <div class="card fade-in" style="animation-delay: 0.05s" style="padding: 0;">
            <div class="table-container" style="margin: 0; padding: 0;">
                <table style="margin-bottom: 0;">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Date</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th style="text-align: right;">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${MOCK_ORDERS.map(order => `
                            <tr class="interactive-row">
                                <td style="font-weight: 600; color: #000;">${order.id}</td>
                                <td style="font-weight: 500;">${order.customer}</td>
                                <td>${order.date}</td>
                                <td style="font-weight: 600;">${order.total}</td>
                                <td>
                                    <span class="status-badge ${order.status}">${capitalize(order.status)}</span>
                                </td>
                                <td style="text-align: right;">
                                    <button class="icon-btn" style="display: inline-flex;"><span class="material-symbols-outlined" style="font-size: 20px;">more_horiz</span></button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `,
    inventory: () => `
        <div class="page-header fade-in">
            <div class="page-title">
                <h1>Inventory & Warehouse</h1>
                <p>Monitor stock levels and warehouse capacity.</p>
            </div>
            <div style="display: flex; gap: 12px;">
                <button class="btn-secondary">
                    <span class="material-symbols-outlined">download</span> Export
                </button>
                <button class="btn-primary">
                    <span class="material-symbols-outlined">add</span> Add Item
                </button>
            </div>
        </div>

        <div class="inventory-grid fade-in" style="animation-delay: 0.05s">
            ${MOCK_INVENTORY.map(item => {
                const percent = Math.round((item.stock / item.max) * 100);
                return `
                <div class="card inventory-item">
                    <div class="item-header">
                        <div class="item-info">
                            <h3>${item.name}</h3>
                            <span class="item-sku">SKU: ${item.sku}</span>
                        </div>
                        <button class="icon-btn"><span class="material-symbols-outlined" style="font-size: 20px;">more_vert</span></button>
                    </div>
                    <div class="stock-level">
                        <div class="stock-info">
                            <span>Available Stock</span>
                            <span style="font-weight: 700; color: var(--${item.status === 'good' ? 'text-main' : item.status === 'warning' ? 'warning-text' : 'danger-text'})">
                                ${item.stock} <span style="font-weight: 500; color: var(--text-muted); font-size: 0.8rem;">/ ${item.max}</span>
                            </span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill ${item.status}" style="width: 0%" data-target-width="${percent}%"></div>
                        </div>
                        ${item.status === 'danger' ? `<div style="color: var(--danger); font-size: 0.8rem; margin-top: 12px; display: flex; align-items: center; gap: 6px; font-weight: 500;"><span class="material-symbols-outlined" style="font-size: 16px;">error</span> Critical stock level</div>` : ''}
                        ${item.status === 'warning' ? `<div style="color: var(--warning-text); font-size: 0.8rem; margin-top: 12px; display: flex; align-items: center; gap: 6px; font-weight: 500;"><span class="material-symbols-outlined" style="font-size: 16px;">warning</span> Reorder recommended</div>` : ''}
                    </div>
                    <div class="item-actions">
                        <button class="btn-secondary"><span class="material-symbols-outlined" style="font-size: 18px;">edit</span> Edit</button>
                        <button class="btn-secondary"><span class="material-symbols-outlined" style="font-size: 18px;">shopping_cart</span> Reorder</button>
                    </div>
                </div>
                `
            }).join('')}
        </div>
    `,
    generic: (title) => `
        <div class="page-header fade-in">
            <div class="page-title">
                <h1>${title}</h1>
                <p>Manage your ${title.toLowerCase()} settings and data.</p>
            </div>
            <button class="btn-primary">
                <span class="material-symbols-outlined">add</span> New Entry
            </button>
        </div>
        <div class="card empty-state fade-in" style="animation-delay: 0.05s">
            <span class="material-symbols-outlined">inventory_2</span>
            <h3>No data available</h3>
            <p>Get started by creating a new entry for your ${title.toLowerCase()} module.</p>
            <button class="btn-primary" style="margin-top: 8px;">Get Started</button>
        </div>
    `
};

// Utilities
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function renderOrderRow(order) {
    return `
        <tr class="interactive-row">
            <td style="font-weight: 600; color: #000;">${order.id}</td>
            <td style="font-weight: 500;">${order.customer}</td>
            <td>${order.date}</td>
            <td style="font-weight: 600;">${order.total}</td>
            <td>
                <span class="status-badge ${order.status}">${capitalize(order.status)}</span>
            </td>
        </tr>
    `;
}

function initDashboardChart() {
    const ctx = document.getElementById('dashboardChart');
    if (!ctx) return;
    
    if (chartInstance) {
        chartInstance.destroy();
    }

    Chart.defaults.font.family = "'Inter', sans-serif";
    Chart.defaults.color = '#64748b';

    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
            datasets: [
                {
                    label: 'Revenue ($)',
                    data: [12000, 19000, 15000, 22000, 18000, 28000, 24000, 32000, 29000, 36000],
                    borderColor: '#2563eb',
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#ffffff',
                    pointBorderColor: '#2563eb',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6
                },
                {
                    label: 'Orders',
                    data: [150, 230, 180, 290, 240, 350, 300, 410, 380, 450],
                    borderColor: '#10b981',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    fill: false,
                    tension: 0.4,
                    pointBackgroundColor: '#ffffff',
                    pointBorderColor: '#10b981',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: '#0f172a',
                    titleColor: '#ffffff',
                    bodyColor: '#e2e8f0',
                    padding: 12,
                    cornerRadius: 8,
                    displayColors: true,
                    boxPadding: 4
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false,
                        drawBorder: false
                    }
                },
                y: {
                    grid: {
                        color: '#f1f5f9',
                        drawBorder: false
                    },
                    ticks: {
                        callback: function(value) {
                            return '$' + value / 1000 + 'k';
                        }
                    }
                },
                y1: {
                    position: 'right',
                    grid: {
                        display: false,
                        drawBorder: false
                    },
                    ticks: {
                        callback: function(value) {
                            return value;
                        }
                    }
                }
            }
        }
    });
}

// App Logic
document.addEventListener('DOMContentLoaded', () => {
    const viewContainer = document.getElementById('view-container');
    const navItems = document.querySelectorAll('.nav-item');

    function renderView(viewName) {
        // Show loading skeleton
        viewContainer.innerHTML = VIEWS.loading();
        
        // Update active nav immediately
        navItems.forEach(item => {
            if (item.dataset.view === viewName) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        // Simulate network delay for realistic SaaS feel
        setTimeout(() => {
            if (VIEWS[viewName]) {
                viewContainer.innerHTML = VIEWS[viewName]();
            } else {
                viewContainer.innerHTML = VIEWS.generic(capitalize(viewName));
            }
            
            // Post-render specific logic
            if (viewName === 'dashboard') {
                initDashboardChart();
            }
            
            // Trigger animations for progress bars
            setTimeout(() => {
                document.querySelectorAll('.progress-fill').forEach(fill => {
                    if (fill.dataset.targetWidth) {
                        fill.style.width = fill.dataset.targetWidth;
                    }
                });
            }, 50);
            
        }, 400); // 400ms loading simulation
    }

    // Handle hash routing
    function handleHashChange() {
        const hash = window.location.hash.replace('#', '') || 'dashboard';
        renderView(hash);
    }

    window.addEventListener('hashchange', handleHashChange);
    
    // Initial render
    handleHashChange();
});
