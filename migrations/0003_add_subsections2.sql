-- 구분2 테이블 추가 (구분1 하위)
CREATE TABLE IF NOT EXISTS subsections2 (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  subsection_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (subsection_id) REFERENCES subsections(id) ON DELETE CASCADE
);

-- 기존 metrics 테이블 수정: subsection2_id 컬럼 추가
CREATE TABLE metrics_new (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  subsection2_id INTEGER NOT NULL,
  metric_name TEXT NOT NULL,
  metric_value REAL NOT NULL,
  metric_unit TEXT,
  metric_date DATE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (subsection2_id) REFERENCES subsections2(id) ON DELETE CASCADE
);

-- 기존 metrics 테이블 삭제 및 새 테이블로 교체
DROP TABLE IF EXISTS metrics;
ALTER TABLE metrics_new RENAME TO metrics;

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_subsections2_subsection ON subsections2(subsection_id);
CREATE INDEX IF NOT EXISTS idx_metrics_subsection2 ON metrics(subsection2_id);
CREATE INDEX IF NOT EXISTS idx_metrics_date ON metrics(metric_date);
