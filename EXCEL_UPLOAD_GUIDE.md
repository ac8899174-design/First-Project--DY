# Excel 업로드 가이드

## 📊 Excel 파일 형식

Excel 파일은 다음 컬럼을 포함해야 합니다:

| subsection2_id | metric_name | value | unit | metric_date |
|---------------|-------------|-------|------|-------------|
| 1 | 생산량 | 125000 | 개 | 2024-01-01 |
| 1 | 생산량 | 132000 | 개 | 2024-02-01 |
| 2 | 생산량 | 45000 | 개 | 2024-01-01 |

**또는 한글 컬럼명:**

| 구분2_ID | 지표명 | 값 | 단위 | 날짜 |
|---------|--------|-----|-----|------|
| 1 | 생산량 | 125000 | 개 | 2024-01-01 |

---

## 🔢 subsection2_id 찾는 방법

### 방법 1: 대시보드에서 확인
1. 대시보드에서 원하는 카테고리/주제/소주제/구분1/구분2를 선택
2. 브라우저 개발자 도구(F12) → Console 탭
3. 다음 명령어 입력:
```javascript
console.log(subsections2)
```

### 방법 2: API로 직접 확인
```bash
# 모든 구분2 목록 확인
curl https://manufacturing-dashboard.pages.dev/api/subtopics/1/subsections
curl https://manufacturing-dashboard.pages.dev/api/subsections/1/subsections2
```

### 방법 3: 현재 데이터베이스 ID 목록

#### 생산운영 → Main 라인 운영 → 생산량 현황
- **월별** (subsection_id: 1)
  - 전체 (subsection2_id: 1)
  - 일반 (subsection2_id: 2)
  - 대형 (subsection2_id: 3)

- **주별** (subsection_id: 2)
  - 전체 (subsection2_id: 4)
  - 일반 (subsection2_id: 5)
  - 대형 (subsection2_id: 6)

- **일별** (subsection_id: 3)
  - 전체 (subsection2_id: 7)
  - 일반 (subsection2_id: 8)
  - 대형 (subsection2_id: 9)

#### 생산운영 → Main 라인 운영 → 가동라인 현황
- **월별** (subsection_id: 4)
  - 전체 (subsection2_id: 10)
  - 일반 (subsection2_id: 11)
  - 대형 (subsection2_id: 12)

... (더 많은 ID는 API로 확인)

---

## 📤 업로드 방법

1. **Excel 파일 준비**
   - 위 형식에 맞게 데이터 작성
   - .xlsx 또는 .xls 형식으로 저장

2. **대시보드 접속**
   - https://manufacturing-dashboard.pages.dev

3. **업로드 버튼 클릭**
   - 헤더의 "Excel 업로드" 버튼 클릭
   - Excel 파일 선택

4. **확인**
   - 데이터 개수 확인 후 "확인" 클릭
   - 업로드 완료 메시지 확인

---

## 📝 Excel 템플릿 예시

```
subsection2_id | metric_name | value | unit | metric_date
1 | 생산량 | 125000 | 개 | 2024-01-01
1 | 생산량 | 132000 | 개 | 2024-02-01
1 | 생산량 | 145000 | 개 | 2024-03-01
1 | 생산량 | 158000 | 개 | 2024-04-01
1 | 생산량 | 162000 | 개 | 2024-05-01
1 | 생산량 | 178000 | 개 | 2024-06-01
2 | 생산량 | 45000 | 개 | 2024-01-01
2 | 생산량 | 48000 | 개 | 2024-02-01
```

---

## ⚠️ 주의사항

1. **subsection2_id는 필수**: 반드시 존재하는 ID를 사용해야 합니다
2. **날짜 형식**: YYYY-MM-DD 형식 사용 (예: 2024-01-01)
3. **값(value)**: 숫자만 입력 (쉼표 없이)
4. **중복 데이터**: 같은 subsection2_id + metric_name + metric_date 조합은 중복 삽입됩니다

---

## 🔍 문제 해결

**"subsection2_id가 없습니다" 에러:**
- subsection2_id를 API로 확인하세요
- 존재하는 ID만 사용 가능합니다

**"날짜 형식 오류" 에러:**
- 날짜는 YYYY-MM-DD 형식이어야 합니다
- Excel에서 날짜 셀 형식을 "텍스트"로 설정하세요

**"업로드 실패" 에러:**
- Excel 파일 형식 확인 (.xlsx, .xls)
- 필수 컬럼 확인 (5개 모두 필수)
- 브라우저 Console(F12)에서 상세 에러 확인
