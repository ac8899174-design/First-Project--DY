-- 수삽라인 카테고리 주제의 구분1, 구분2, 지표 추가

-- 구분1: 재고 관리 → 원자재 재고 (subtopic_id = 7)
INSERT INTO subsections (subtopic_id, name, description) VALUES
  (7, '월별', '월별 원자재 재고'),
  (7, '주별', '주별 원자재 재고'),
  (7, '일별', '일별 원자재 재고');

-- 구분2: 월별 원자재 재고 (subsection_id는 생성 후 확인 필요)
-- 예시: subsection_id = 16이라고 가정
INSERT INTO subsections2 (subsection_id, name, description) VALUES
  (16, '철강', '철강 원자재'),
  (16, '플라스틱', '플라스틱 원자재'),
  (16, '전자부품', '전자부품 원자재');

-- 지표: 월별 철강 원자재 (subsection2_id는 생성 후 확인 필요)
-- 예시: subsection2_id = 67이라고 가정
INSERT INTO metrics (subsection2_id, metric_name, value, unit, metric_date) VALUES
  (67, '재고량', 2500, '톤', '2024-01-01'),
  (67, '재고량', 2650, '톤', '2024-02-01'),
  (67, '재고량', 2800, '톤', '2024-03-01'),
  (67, '재고량', 2700, '톤', '2024-04-01'),
  (67, '재고량', 2900, '톤', '2024-05-01'),
  (67, '재고량', 3100, '톤', '2024-06-01');
