// State
let chart = null;
let categories = [];
let topics = [];
let subtopics = [];
let subsections = [];
let subsections2 = [];
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
        <div class="grid grid-cols-2 gap-2 text-center text-xs">
          <div>
            <div class="text-xl font-bold text-blue-600">${cat.topic_count}</div>
            <div class="text-xs text-gray-500">주제</div>
          </div>
          <div>
            <div class="text-xl font-bold text-green-600">${cat.subtopic_count}</div>
            <div class="text-xs text-gray-500">소주제</div>
          </div>
          <div>
            <div class="text-xl font-bold text-orange-600">${cat.subsection_count}</div>
            <div class="text-xs text-gray-500">구분1</div>
          </div>
          <div>
            <div class="text-xl font-bold text-purple-600">${cat.subsection2_count}</div>
            <div class="text-xs text-gray-500">구분2</div>
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
    
    resetSubtopicSelect();
    resetSubsectionSelect();
    resetSubsection2Select();
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
    
    resetSubsectionSelect();
    resetSubsection2Select();
  } catch (error) {
    console.error('Subtopics load error:', error);
  }
}

// Load subsections (구분1)
async function loadSubsections(subtopicId) {
  try {
    const response = await axios.get(`/api/subtopics/${subtopicId}/subsections`);
    subsections = response.data;
    
    const subsectionSelect = document.getElementById('subsectionSelect');
    subsectionSelect.disabled = false;
    subsectionSelect.innerHTML = '<option value="">선택하세요</option>' + 
      subsections.map(sub => `<option value="${sub.id}">${sub.name}</option>`).join('');
    
    resetSubsection2Select();
  } catch (error) {
    console.error('Subsections load error:', error);
  }
}

// Load subsections2 (구분2)
async function loadSubsections2(subsectionId) {
  try {
    const response = await axios.get(`/api/subsections/${subsectionId}/subsections2`);
    subsections2 = response.data;
    
    const subsection2Select = document.getElementById('subsection2Select');
    subsection2Select.disabled = false;
    subsection2Select.innerHTML = '<option value="">선택하세요</option>' + 
      subsections2.map(sub => `<option value="${sub.id}">${sub.name}</option>`).join('');
  } catch (error) {
    console.error('Subsections2 load error:', error);
  }
}

// Load metrics
async function loadMetrics(subsection2Id) {
  try {
    const response = await axios.get(`/api/subsections2/${subsection2Id}/metrics`);
    metrics = response.data;
    
    updateChart();
    updateTable();
  } catch (error) {
    console.error('Metrics load error:', error);
  }
}

// Update chart
function updateChart() {
  const ctx = document.getElementById('metricsChart').getContext('2d');
  
  if (chart) {
    chart.destroy();
  }
  
  if (metrics.length === 0) {
    return;
  }
  
  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: metrics.map(m => m.metric_date),
      datasets: [{
        label: metrics[0]?.metric_name || '지표',
        data: metrics.map(m => m.value),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true
        }
      },
      scales: {
        y: {
          beginAtZero: false
        }
      }
    }
  });
}

// Update table
function updateTable() {
  const tbody = document.getElementById('metricsTable');
  
  if (metrics.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" class="text-center py-4 text-gray-500">데이터가 없습니다</td></tr>';
    return;
  }
  
  tbody.innerHTML = metrics.map(m => `
    <tr class="hover:bg-gray-50">
      <td class="px-6 py-3 border-b">${m.metric_date}</td>
      <td class="px-6 py-3 border-b">${m.metric_name}</td>
      <td class="px-6 py-3 border-b text-right font-semibold">${formatNumber(m.value)}</td>
      <td class="px-6 py-3 border-b text-gray-600">${m.unit}</td>
    </tr>
  `).join('');
}

// Format number
function formatNumber(num) {
  return new Intl.NumberFormat('ko-KR').format(num);
}

// Reset select boxes
function resetTopicSelect() {
  const topicSelect = document.getElementById('topicSelect');
  topicSelect.disabled = true;
  topicSelect.innerHTML = '<option value="">먼저 카테고리를 선택하세요</option>';
}

function resetSubtopicSelect() {
  const subtopicSelect = document.getElementById('subtopicSelect');
  subtopicSelect.disabled = true;
  subtopicSelect.innerHTML = '<option value="">먼저 주제를 선택하세요</option>';
}

function resetSubsectionSelect() {
  const subsectionSelect = document.getElementById('subsectionSelect');
  subsectionSelect.disabled = true;
  subsectionSelect.innerHTML = '<option value="">먼저 소주제를 선택하세요</option>';
}

function resetSubsection2Select() {
  const subsection2Select = document.getElementById('subsection2Select');
  subsection2Select.disabled = true;
  subsection2Select.innerHTML = '<option value="">먼저 구분1을 선택하세요</option>';
}

// Select category from dashboard
function selectCategory(categoryId) {
  const categorySelect = document.getElementById('categorySelect');
  categorySelect.value = categoryId;
  categorySelect.dispatchEvent(new Event('change'));
}

// Event listeners
function setupEventListeners() {
  document.getElementById('categorySelect').addEventListener('change', (e) => {
    const categoryId = e.target.value;
    if (categoryId) {
      loadTopics(categoryId);
    } else {
      resetTopicSelect();
      resetSubtopicSelect();
      resetSubsectionSelect();
      resetSubsection2Select();
    }
  });
  
  document.getElementById('topicSelect').addEventListener('change', (e) => {
    const topicId = e.target.value;
    if (topicId) {
      loadSubtopics(topicId);
    } else {
      resetSubtopicSelect();
      resetSubsectionSelect();
      resetSubsection2Select();
    }
  });
  
  document.getElementById('subtopicSelect').addEventListener('change', (e) => {
    const subtopicId = e.target.value;
    if (subtopicId) {
      loadSubsections(subtopicId);
    } else {
      resetSubsectionSelect();
      resetSubsection2Select();
    }
  });
  
  document.getElementById('subsectionSelect').addEventListener('change', (e) => {
    const subsectionId = e.target.value;
    if (subsectionId) {
      loadSubsections2(subsectionId);
    } else {
      resetSubsection2Select();
    }
  });
  
  document.getElementById('subsection2Select').addEventListener('change', (e) => {
    const subsection2Id = e.target.value;
    if (subsection2Id) {
      loadMetrics(subsection2Id);
    }
  });
  
  document.getElementById('exportBtn').addEventListener('click', exportData);
  document.getElementById('excelUpload').addEventListener('change', handleExcelUpload);
}

// Export data
async function exportData() {
  try {
    const categoryId = document.getElementById('categorySelect').value;
    const topicId = document.getElementById('topicSelect').value;
    const subtopicId = document.getElementById('subtopicSelect').value;
    const subsectionId = document.getElementById('subsectionSelect').value;
    const subsection2Id = document.getElementById('subsection2Select').value;
    
    let url = '/api/export/metrics?';
    if (categoryId) url += `category_id=${categoryId}&`;
    if (topicId) url += `topic_id=${topicId}&`;
    if (subtopicId) url += `subtopic_id=${subtopicId}&`;
    if (subsectionId) url += `subsection_id=${subsectionId}&`;
    if (subsection2Id) url += `subsection2_id=${subsection2Id}`;
    
    window.location.href = url;
  } catch (error) {
    console.error('Export error:', error);
    alert('데이터 내보내기 중 오류가 발생했습니다.');
  }
}

// Handle Excel upload
async function handleExcelUpload(e) {
  const file = e.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = async function(e) {
    try {
      // Parse Excel file
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      
      // Get first sheet
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      
      // Convert to JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      
      // Expected Excel format:
      // subsection2_id | metric_name | value | unit | metric_date
      // 1 | 생산량 | 125000 | 개 | 2024-01-01
      
      // Validate and prepare data
      const metricsData = jsonData.map(row => ({
        subsection2_id: row['subsection2_id'] || row['구분2_ID'],
        metric_name: row['metric_name'] || row['지표명'],
        value: row['value'] || row['값'],
        unit: row['unit'] || row['단위'],
        metric_date: row['metric_date'] || row['날짜']
      }));
      
      // Show upload progress
      const confirmed = confirm(`${metricsData.length}개의 데이터를 업로드하시겠습니까?`);
      if (!confirmed) {
        e.target.value = ''; // Reset file input
        return;
      }
      
      // Upload to server
      const response = await axios.post('/api/upload/excel', {
        data: metricsData
      });
      
      if (response.data.success) {
        alert(`업로드 완료!\n성공: ${response.data.inserted}개\n실패: ${response.data.errors}개`);
        
        // Reload dashboard
        await loadDashboard();
        
        // Reload metrics if filter is selected
        const subsection2Id = document.getElementById('subsection2Select').value;
        if (subsection2Id) {
          await loadMetrics(subsection2Id);
        }
      } else {
        alert('업로드 실패: ' + response.data.error);
      }
      
      // Reset file input
      e.target.value = '';
      
    } catch (error) {
      console.error('Excel upload error:', error);
      alert('Excel 파일 처리 중 오류가 발생했습니다: ' + error.message);
      e.target.value = '';
    }
  };
  
  reader.readAsArrayBuffer(file);
}
