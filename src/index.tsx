import { Hono } from 'hono'
import { cors } from 'hono/cors'

type Bindings = {
  DB: D1Database;
}

const app = new Hono<{ Bindings: Bindings }>()

// Enable CORS for API routes
app.use('/api/*', cors())

// ============ API Routes ============

// 모든 카테고리 조회
app.get('/api/categories', async (c) => {
  const { results } = await c.env.DB.prepare(
    'SELECT * FROM categories ORDER BY name'
  ).all()
  return c.json(results)
})

// 특정 카테고리의 주제 조회
app.get('/api/categories/:id/topics', async (c) => {
  const categoryId = c.req.param('id')
  const { results } = await c.env.DB.prepare(
    'SELECT * FROM topics WHERE category_id = ? ORDER BY name'
  ).bind(categoryId).all()
  return c.json(results)
})

// 특정 주제의 소주제 조회
app.get('/api/topics/:id/subtopics', async (c) => {
  const topicId = c.req.param('id')
  const { results } = await c.env.DB.prepare(
    'SELECT * FROM subtopics WHERE topic_id = ? ORDER BY name'
  ).bind(topicId).all()
  return c.json(results)
})

// 특정 소주제의 구분 조회
app.get('/api/subtopics/:id/subsections', async (c) => {
  const subtopicId = c.req.param('id')
  const { results } = await c.env.DB.prepare(
    'SELECT * FROM subsections WHERE subtopic_id = ? ORDER BY name'
  ).bind(subtopicId).all()
  return c.json(results)
})

// 특정 구분의 구분2 조회
app.get('/api/subsections/:id/subsections2', async (c) => {
  const subsectionId = c.req.param('id')
  const { results } = await c.env.DB.prepare(
    'SELECT * FROM subsections2 WHERE subsection_id = ? ORDER BY name'
  ).bind(subsectionId).all()
  return c.json(results)
})

// 특정 구분2의 지표 조회 (필터링 지원)
app.get('/api/subsections2/:id/metrics', async (c) => {
  const subsection2Id = c.req.param('id')
  const startDate = c.req.query('start_date')
  const endDate = c.req.query('end_date')
  
  let query = 'SELECT * FROM metrics WHERE subsection2_id = ?'
  const params: any[] = [subsection2Id]
  
  if (startDate) {
    query += ' AND metric_date >= ?'
    params.push(startDate)
  }
  
  if (endDate) {
    query += ' AND metric_date <= ?'
    params.push(endDate)
  }
  
  query += ' ORDER BY metric_date ASC'
  
  const { results } = await c.env.DB.prepare(query).bind(...params).all()
  return c.json(results)
})

// 대시보드 데이터 조회 (카테고리별 요약)
app.get('/api/dashboard', async (c) => {
  const { results } = await c.env.DB.prepare(`
    SELECT 
      c.id,
      c.name,
      c.description,
      c.icon,
      COUNT(DISTINCT t.id) as topic_count,
      COUNT(DISTINCT st.id) as subtopic_count,
      COUNT(DISTINCT ss.id) as subsection_count,
      COUNT(DISTINCT ss2.id) as subsection2_count,
      COUNT(m.id) as metric_count
    FROM categories c
    LEFT JOIN topics t ON c.id = t.category_id
    LEFT JOIN subtopics st ON t.id = st.topic_id
    LEFT JOIN subsections ss ON st.id = ss.subtopic_id
    LEFT JOIN subsections2 ss2 ON ss.id = ss2.subsection_id
    LEFT JOIN metrics m ON ss2.id = m.subsection2_id
    GROUP BY c.id, c.name, c.description, c.icon
    ORDER BY c.name
  `).all()
  
  return c.json(results)
})

// 지표 데이터 추가
app.post('/api/metrics', async (c) => {
  const { subtopic_id, metric_name, metric_value, metric_unit, metric_date } = await c.req.json()
  
  const result = await c.env.DB.prepare(`
    INSERT INTO metrics (subtopic_id, metric_name, metric_value, metric_unit, metric_date)
    VALUES (?, ?, ?, ?, ?)
  `).bind(subtopic_id, metric_name, metric_value, metric_unit, metric_date).run()
  
  return c.json({ id: result.meta.last_row_id, success: true })
})

// 엑셀 데이터 내보내기용 CSV 생성
app.get('/api/export/metrics', async (c) => {
  const categoryId = c.req.query('category_id')
  const topicId = c.req.query('topic_id')
  const subtopicId = c.req.query('subtopic_id')
  const subsectionId = c.req.query('subsection_id')
  
  let query = `
    SELECT 
      c.name as category,
      t.name as topic,
      st.name as subtopic,
      ss.name as subsection1,
      ss2.name as subsection2,
      m.metric_name,
      m.value,
      m.unit,
      m.metric_date
    FROM metrics m
    JOIN subsections2 ss2 ON m.subsection2_id = ss2.id
    JOIN subsections ss ON ss2.subsection_id = ss.id
    JOIN subtopics st ON ss.subtopic_id = st.id
    JOIN topics t ON st.topic_id = t.id
    JOIN categories c ON t.category_id = c.id
    WHERE 1=1
  `
  
  const params: any[] = []
  
  if (categoryId) {
    query += ' AND c.id = ?'
    params.push(categoryId)
  }
  
  if (topicId) {
    query += ' AND t.id = ?'
    params.push(topicId)
  }
  
  if (subtopicId) {
    query += ' AND st.id = ?'
    params.push(subtopicId)
  }
  
  if (subsectionId) {
    query += ' AND ss.id = ?'
    params.push(subsectionId)
  }
  
  const subsection2Id = c.req.query('subsection2_id')
  if (subsection2Id) {
    query += ' AND ss2.id = ?'
    params.push(subsection2Id)
  }
  
  query += ' ORDER BY m.metric_date ASC, c.name, t.name, st.name, ss.name, ss2.name'
  
  const { results } = await c.env.DB.prepare(query).bind(...params).all()
  
  // CSV 형식으로 변환
  const csv = [
    ['카테고리', '주제', '소주제', '구분1', '구분2', '지표명', '값', '단위', '날짜'].join(','),
    ...results.map((row: any) => 
      [row.category, row.topic, row.subtopic, row.subsection1, row.subsection2, row.metric_name, row.value, row.unit, row.metric_date].join(',')
    )
  ].join('\n')
  
  return c.text(csv, 200, {
    'Content-Type': 'text/csv; charset=utf-8',
    'Content-Disposition': 'attachment; filename="metrics_export.csv"'
  })
})

// ============ Frontend ============

app.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="ko">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>지표 분석 대시보드</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    </head>
    <body class="bg-gray-50">
        <div class="min-h-screen">
            <!-- Header -->
            <header class="bg-white shadow-sm">
                <div class="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-3">
                            <i class="fas fa-chart-line text-3xl text-blue-600"></i>
                            <h1 class="text-2xl font-bold text-gray-900">지표 분석 대시보드</h1>
                        </div>
                        <button id="exportBtn" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition">
                            <i class="fas fa-download"></i>
                            <span>CSV 내보내기</span>
                        </button>
                    </div>
                </div>
            </header>

            <!-- Main Content -->
            <main class="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                <!-- Dashboard Cards -->
                <div id="dashboard" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <!-- Dashboard cards will be loaded here -->
                </div>

                <!-- Filters -->
                <div class="bg-white rounded-lg shadow p-6 mb-8">
                    <h2 class="text-xl font-semibold text-gray-800 mb-4">
                        <i class="fas fa-filter mr-2"></i>필터
                    </h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">카테고리</label>
                            <select id="categorySelect" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                <option value="">전체</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">주제</label>
                            <select id="topicSelect" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" disabled>
                                <option value="">카테고리를 먼저 선택하세요</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">소주제</label>
                            <select id="subtopicSelect" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" disabled>
                                <option value="">주제를 먼저 선택하세요</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">구분1</label>
                            <select id="subsectionSelect" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" disabled>
                                <option value="">소주제를 먼저 선택하세요</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">구분2</label>
                            <select id="subsection2Select" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" disabled>
                                <option value="">구분1을 먼저 선택하세요</option>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- Chart -->
                <div class="bg-white rounded-lg shadow p-6 mb-8">
                    <h2 class="text-xl font-semibold text-gray-800 mb-4">
                        <i class="fas fa-chart-bar mr-2"></i>지표 시각화
                    </h2>
                    <div class="h-96">
                        <canvas id="metricsChart"></canvas>
                    </div>
                </div>

                <!-- Data Table -->
                <div class="bg-white rounded-lg shadow p-6">
                    <h2 class="text-xl font-semibold text-gray-800 mb-4">
                        <i class="fas fa-table mr-2"></i>상세 데이터
                    </h2>
                    <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">날짜</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">지표명</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">값</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">단위</th>
                                </tr>
                            </thead>
                            <tbody id="metricsTable" class="bg-white divide-y divide-gray-200">
                                <!-- Table rows will be loaded here -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>

        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <script src="/static/app.js"></script>
    </body>
    </html>
  `)
})

export default app
