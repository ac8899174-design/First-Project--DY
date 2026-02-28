-- 구분 테이블 추가 (소주제 하위)
CREATE TABLE IF NOT EXISTS subsections (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  subtopic_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (subtopic_id) REFERENCES subtopics(id) ON DELETE CASCADE
);

-- 기존 metrics 테이블 수정: subsection_id 컬럼 추가
-- SQLite는 ALTER TABLE로 외래키를 추가할 수 없으므로 새 테이블 생성 후 데이터 이전
CREATE TABLE metrics_new (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  subsection_id INTEGER NOT NULL,
  metric_name TEXT NOT NULL,
  metric_value REAL NOT NULL,
  metric_unit TEXT,
  metric_date DATE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (subsection_id) REFERENCES subsections(id) ON DELETE CASCADE
);

-- 기존 데이터는 마이그레이션 후 수동으로 이전 필요
-- 기존 metrics 테이블 삭제 및 새 테이블로 교체
DROP TABLE IF EXISTS metrics;
ALTER TABLE metrics_new RENAME TO metrics;

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_subsections_subtopic ON subsections(subtopic_id);
CREATE INDEX IF NOT EXISTS idx_metrics_subsection ON metrics(subsection_id);
CREATE INDEX IF NOT EXISTS idx_metrics_date ON metrics(metric_date);
