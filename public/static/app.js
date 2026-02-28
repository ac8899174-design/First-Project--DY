// State
let chart = null;
let categories = [];
let topics = [];
let subtopics = [];
let subsections = [];
let metrics = [];

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  await loadDashboard();
  await loadCategories();
  setupEventListeners();
});

// Load dashboard summary
async function loadDashboard() {
  try {
    const response = await axios.get('/api/dashboard');
    const data = response.data;
    
    const dashboardEl = document.getElementById('dashboard');
    dashboardEl.innerHTML = data.map(cat => `
      <div class="bg-white rounded-lg shadow p-6 hover:shadow-lg transition cursor-pointer" onclick="selectCategory(${cat.id})">
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <i class="fas fa-${cat.icon} text-2xl text-blue-600"></i>
          </div>
        </div>
        <h3 class="text-lg font-semibold text-gray-800 mb-2">${cat.name}</h3>
        <p class="text-sm text-gray-600 mb-4">${cat.description}</p>
        <div class="grid grid-cols-2 gap-2 text-center">
          <div>
            <div class="text-2xl font-bold text-blue-600">${cat.topic_count}</div>
            <div class="text-xs text-gray-500">주제</div>
          </div>
          <div>
            <div class="text-2xl font-bold text-green-600">${cat.subtopic_count}</div>
            <div class="text-xs text-gray-500">소주제</div>
          </div>
          <div>
            <div class="text-2xl font-bold text-orange-600">${cat.subsection_count}</div>
            <div class="text-xs text-gray-500">구분</div>
          </div>
          <div>
            <div class="text-2xl font-bold text-purple-600">${cat.metric_count}</div>
            <div class="text-xs text-gray-500">지표</div>
          </div>
        </div>
      </div>
    `).join('');
  } catch (error) {
    console.error('Dashboard load error:', error);
  }
}

// Load categories
async function loadCategories() {
  try {
    const response = await axios.get('/api/categories');
    categories = response.data;
    
    const categorySelect = document.getElementById('categorySelect');
    categorySelect.innerHTML = '<option value="">전체</option>' + 
      categories.map(cat => `<option value="${cat.id}">${cat.name}</option>`).join('');
  } catch (error) {
    console.error('Categories load error:', error);
  }
}

// Load topics
async function loadTopics(categoryId) {
  try {
    const response = await axios.get(`/api/categories/${categoryId}/topics`);
    topics = response.data;
    
    const topicSelect = document.getElementById('topicSelect');
    topicSelect.disabled = false;
    topicSelect.innerHTML = '<option value="">선택하세요</option>' + 
      topics.map(topic => `<option value="${topic.id}">${topic.name}</option>`).join('');
    
    // Reset subtopic and subsection select
    resetSubtopicSelect();
    resetSubsectionSelect();
  } catch (error) {
    console.error('Topics load error:', error);
  }
}

// Load subtopics
async function loadSubtopics(topicId) {
  try {
    const response = await axios.get(`/api/topics/${topicId}/subtopics`);
    subtopics = response.data;
    
    const subtopicSelect = document.getElementById('subtopicSelect');
    subtopicSelect.disabled = false;
    subtopicSelect.innerHTML = '<option value="">선택하세요</option>' + 
      subtopics.map(sub => `<option value="${sub.id}">${sub.name}</option>`).join('');
    
    // Reset subsection select
    resetSubsectionSelect();
  } catch (error) {
    console.error('Subtopics load error:', error);
  }
}

// Load subsections
async function loadSubsections(subtopicId) {
  try {
    const response = await axios.get(`/api/subtopics/${subtopicId}/subsections`);
    subsections = response.data;
    
    const subsectionSelect = document.getElementById('subsectionSelect');
    subsectionSelect.disabled = false;
    subsectionSelect.innerHTML = '<option value="">선택하세요</option>' + 
      subsections.map(subsec => `<option value="${subsec.id}">${subsec.name}</option>`).join('');
  } catch (error) {
    console.error('Subsections load error:', error);
  }
}

// Load metrics
async function loadMetrics(subsectionId) {
  try {
    const response = await axios.get(`/api/subsections/${subsectionId}/metrics`);
    metrics = response.data;
    
    updateTable();
    updateChart();
  } catch (error) {
    console.error('Metrics load error:', error);
  }
}

// Update table
function updateTable() {
  const tableEl = document.getElementById('metricsTable');
  
  if (metrics.length === 0) {
    tableEl.innerHTML = '<tr><td colspan="4" class="px-6 py-4 text-center text-gray-500">데이터가 없습니다</td></tr>';
    return;
  }
  
  tableEl.innerHTML = metrics.map(metric => `
    <tr class="hover:bg-gray-50">
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${metric.metric_date}</td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${metric.metric_name}</td>
      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">${formatNumber(metric.metric_value)}</td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${metric.metric_unit || '-'}</td>
    </tr>
  `).join('');
}

// Update chart
function updateChart() {
  const ctx = document.getElementById('metricsChart');
  
  if (chart) {
    chart.destroy();
  }
  
  if (metrics.length === 0) {
    return;
  }
  
  // Group metrics by name
  const groupedMetrics = {};
  metrics.forEach(metric => {
    if (!groupedMetrics[metric.metric_name]) {
      groupedMetrics[metric.metric_name] = {
        labels: [],
        data: []
      };
    }
    groupedMetrics[metric.metric_name].labels.push(metric.metric_date);
    groupedMetrics[metric.metric_name].data.push(metric.metric_value);
  });
  
  const datasets = Object.entries(groupedMetrics).map(([name, data], index) => {
    const colors = [
      'rgb(59, 130, 246)',
      'rgb(16, 185, 129)',
      'rgb(245, 158, 11)',
      'rgb(239, 68, 68)',
      'rgb(139, 92, 246)'
    ];
    const color = colors[index % colors.length];
    
    return {
      label: name,
      data: data.data,
      borderColor: color,
      backgroundColor: color.replace('rgb', 'rgba').replace(')', ', 0.1)'),
      tension: 0.4
    };
  });
  
  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: groupedMetrics[Object.keys(groupedMetrics)[0]].labels,
      datasets: datasets
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

// Reset subtopic select
function resetSubtopicSelect() {
  const subtopicSelect = document.getElementById('subtopicSelect');
  subtopicSelect.disabled = true;
  subtopicSelect.innerHTML = '<option value="">주제를 먼저 선택하세요</option>';
}

// Reset subsection select
function resetSubsectionSelect() {
  const subsectionSelect = document.getElementById('subsectionSelect');
  subsectionSelect.disabled = true;
  subsectionSelect.innerHTML = '<option value="">소주제를 먼저 선택하세요</option>';
}

// Setup event listeners
function setupEventListeners() {
  document.getElementById('categorySelect').addEventListener('change', async (e) => {
    const categoryId = e.target.value;
    
    if (categoryId) {
      await loadTopics(categoryId);
    } else {
      document.getElementById('topicSelect').disabled = true;
      document.getElementById('topicSelect').innerHTML = '<option value="">카테고리를 먼저 선택하세요</option>';
      resetSubtopicSelect();
      resetSubsectionSelect();
      clearData();
    }
  });
  
  document.getElementById('topicSelect').addEventListener('change', async (e) => {
    const topicId = e.target.value;
    
    if (topicId) {
      await loadSubtopics(topicId);
    } else {
      resetSubtopicSelect();
      resetSubsectionSelect();
      clearData();
    }
  });
  
  document.getElementById('subtopicSelect').addEventListener('change', async (e) => {
    const subtopicId = e.target.value;
    
    if (subtopicId) {
      await loadSubsections(subtopicId);
    } else {
      resetSubsectionSelect();
      clearData();
    }
  });
  
  document.getElementById('subsectionSelect').addEventListener('change', async (e) => {
    const subsectionId = e.target.value;
    
    if (subsectionId) {
      await loadMetrics(subsectionId);
    } else {
      clearData();
    }
  });
  
  document.getElementById('exportBtn').addEventListener('click', exportToCSV);
}

// Select category from dashboard
async function selectCategory(categoryId) {
  const categorySelect = document.getElementById('categorySelect');
  categorySelect.value = categoryId;
  categorySelect.dispatchEvent(new Event('change'));
}

// Clear data
function clearData() {
  metrics = [];
  updateTable();
  if (chart) {
    chart.destroy();
    chart = null;
  }
}

// Export to CSV
async function exportToCSV() {
  const categoryId = document.getElementById('categorySelect').value;
  const topicId = document.getElementById('topicSelect').value;
  const subtopicId = document.getElementById('subtopicSelect').value;
  const subsectionId = document.getElementById('subsectionSelect').value;
  
  let url = '/api/export/metrics?';
  if (categoryId) url += `category_id=${categoryId}&`;
  if (topicId) url += `topic_id=${topicId}&`;
  if (subtopicId) url += `subtopic_id=${subtopicId}&`;
  if (subsectionId) url += `subsection_id=${subsectionId}&`;
  
  try {
    const response = await axios.get(url, { responseType: 'blob' });
    const blob = new Blob([response.data], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'metrics_export.csv';
    link.click();
  } catch (error) {
    console.error('Export error:', error);
    alert('CSV 내보내기에 실패했습니다.');
  }
}

// Format number
function formatNumber(num) {
  return new Intl.NumberFormat('ko-KR').format(num);
}
