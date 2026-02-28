# 지표 분석 대시보드

## 프로젝트 개요
- **이름**: 지표 분석 대시보드 (Metrics Analysis Dashboard)
- **도메인**: 제조업 생산 관리 및 품질 관리
- **목표**: 생산운영, 공급망, 자동화, 품질/제조 관련 지표를 분석하고 필터링하여 시각화된 정보를 제공하며 CSV로 내보낼 수 있는 대시보드
- **주요 기능**:
  - 📊 카테고리별 대시보드 요약
  - 🔍 5단계 계층적 필터링 (카테고리 → 주제 → 소주제 → 구분1 → 구분2)
  - 📈 Chart.js를 이용한 지표 시각화
  - 📋 상세 데이터 테이블 조회
  - 💾 CSV 엑셀 데이터 내보내기
  - 📤 Excel 파일 업로드로 대량 데이터 입력 ⭐ NEW!

## 현재 완료된 기능

### ✅ 백엔드 API
- **카테고리 API**: 모든 카테고리 조회 (`GET /api/categories`)
- **주제 API**: 카테고리별 주제 조회 (`GET /api/categories/:id/topics`)
- **소주제 API**: 주제별 소주제 조회 (`GET /api/topics/:id/subtopics`)
- **구분1 API**: 소주제별 구분1 조회 (`GET /api/subtopics/:id/subsections`)
- **구분2 API**: 구분1별 구분2 조회 (`GET /api/subsections/:id/subsections2`)
- **지표 API**: 구분2별 지표 조회 (`GET /api/subsections2/:id/metrics`)
- **대시보드 API**: 카테고리별 통계 요약 (`GET /api/dashboard`)
- **CSV 내보내기**: 필터링된 데이터를 CSV로 내보내기 (`GET /api/export/metrics`)
- **Excel 업로드 API**: 대량 데이터 일괄 입력 (`POST /api/upload/excel`) ⭐ NEW!

### ✅ 프론트엔드
- **대시보드 카드**: 카테고리별 주제/소주제/구분1/구분2 개수 표시
- **5단계 계층적 필터**: 카테고리 → 주제 → 소주제 → 구분1 → 구분2 선택
- **차트 시각화**: 선 그래프로 지표 추이 표시
- **데이터 테이블**: 지표 상세 데이터 조회
- **CSV 내보내기**: 필터링된 데이터를 CSV 파일로 다운로드
- **Excel 업로드**: 브라우저에서 Excel 파일 파싱 및 일괄 업로드 ⭐ NEW!

### ✅ 데이터베이스
- **Cloudflare D1**: SQLite 기반 로컬/프로덕션 데이터베이스
- **테이블 구조**:
  - `categories`: 카테고리 (생산운영, 수삽라인, 자동화, 품질/제조기술)
  - `topics`: 주제 (Main 라인 운영, 자동화 라인 운영, 재고 운영 등)
  - `subtopics`: 소주제 (생산량 현황, 가동라인 현황, 계획 대비 실적, 마감율 현황, 재고일수, 재고건전성 등)
  - `subsections`: 구분1 (월별, 주별, 일별, 주차별 재고 일수, 주차별 재고금액, 주차별 재고건전성 등)
  - `subsections2`: 구분2 (전체, 일반, 대형, EYELET, AXIAL, RADIAL, RADIAL2, SMD, 원자재, 공정재고, 완제품, 본사출고, 직납, 직구매 등)
  - `metrics`: 지표 데이터 (값, 단위, 날짜)

## 공개 URL

### 프로덕션 환경 (Cloudflare Pages)
- **애플리케이션**: https://manufacturing-dashboard.pages.dev
- **최신 배포**: https://290340d2.manufacturing-dashboard.pages.dev

### 샌드박스 개발 환경
- **애플리케이션**: https://3000-i0chfljvgqyqrk0hy5ofh-ea026bf9.sandbox.novita.ai

### API 엔드포인트 예시
```bash
# 대시보드 데이터
GET https://3000-i0chfljvgqyqrk0hy5ofh-ea026bf9.sandbox.novita.ai/api/dashboard

# 카테고리 목록
GET https://3000-i0chfljvgqyqrk0hy5ofh-ea026bf9.sandbox.novita.ai/api/categories

# 특정 카테고리의 주제
GET https://3000-i0chfljvgqyqrk0hy5ofh-ea026bf9.sandbox.novita.ai/api/categories/1/topics

# 특정 주제의 소주제
GET https://3000-i0chfljvgqyqrk0hy5ofh-ea026bf9.sandbox.novita.ai/api/topics/1/subtopics

# 특정 소주제의 구분1
GET https://3000-i0chfljvgqyqrk0hy5ofh-ea026bf9.sandbox.novita.ai/api/subtopics/1/subsections

# 특정 구분1의 구분2
GET https://3000-i0chfljvgqyqrk0hy5ofh-ea026bf9.sandbox.novita.ai/api/subsections/1/subsections2

# 특정 구분2의 지표
GET https://3000-i0chfljvgqyqrk0hy5ofh-ea026bf9.sandbox.novita.ai/api/subsections2/1/metrics

# CSV 내보내기 (필터 옵션)
GET https://3000-i0chfljvgqyqrk0hy5ofh-ea026bf9.sandbox.novita.ai/api/export/metrics?category_id=1&topic_id=1&subsection_id=1&subsection2_id=1
```

## 데이터 아키텍처

### 데이터 모델
```
categories (카테고리)
  ├── topics (주제)
  │     ├── subtopics (소주제)
  │     │     ├── subsections (구분1)
  │     │     │     ├── subsections2 (구분2)
  │     │     │     │     ├── metrics (지표)
```

### 스토리지 서비스
- **Cloudflare D1**: SQLite 기반 관계형 데이터베이스
- **로컬 개발**: `.wrangler/state/v3/d1/` 에 SQLite 파일 저장
- **마이그레이션**: `migrations/` 디렉토리에서 스키마 관리

### 샘플 데이터 (생산운영 카테고리 기준)

#### 1. **Main 라인 운영** (주제)
- **생산량 현황** (소주제)
  - 구분1: 월별, 주별, 일별
  - 구분2: 전체, 일반, 대형
- **가동라인 현황** (소주제)
  - 구분1: 월별, 주별, 일별
  - 구분2: 전체, 일반, 대형

#### 2. **자동화 라인 운영** (주제)
- **계획 대비 실적** (소주제)
  - 구분1: 월별, 주별, 일별
  - 구분2: 전체, EYELET, AXIAL, RADIAL, RADIAL2, SMD
- **마감율 현황** (소주제)
  - 구분1: 월별, 주별, 일별
  - 구분2: 전체, EYELET, AXIAL, RADIAL, RADIAL2, SMD

#### 3. **재고 운영** (주제)
- **재고일수** (소주제)
  - 구분1: 주차별 재고 일수, 주차별 재고금액
  - 구분2: 전체, 원자재, 공정재고, 완제품
- **재고건전성** (소주제)
  - 구분1: 주차별 재고건전성
  - 구분2: 전체, 본사출고, 직납, 직구매

### 통계
- **카테고리**: 4개 (생산운영, 수삽라인, 자동화, 품질/제조기술)
- **주제**: 3개 (생산운영 카테고리만 구현됨)
- **소주제**: 6개
- **구분1**: 15개
- **구분2**: 66개
- **지표**: 51개

## 사용자 가이드

### 1. 대시보드 보기
- 메인 페이지에 접속하면 4개의 카테고리 카드가 표시됩니다
  - **생산운영**: 생산 효율 및 설비 가동 지표 (현재 구현됨)
  - **수삽라인**: 재고 관리 및 납기 준수 지표
  - **자동화**: 공정 자동화 및 로봇 운영 지표
  - **품질/제조기술**: 불량률 및 공정 능력 지표
- 각 카드에는 주제 수, 소주제 수, 구분1 수, 구분2 수가 표시됩니다
- 카드를 클릭하면 해당 카테고리가 자동으로 선택됩니다

### 2. 지표 조회하기
1. **카테고리 선택**: 필터 영역에서 카테고리를 선택합니다 (예: 생산운영)
2. **주제 선택**: 카테고리를 선택하면 주제 목록이 활성화됩니다 (예: Main 라인 운영)
3. **소주제 선택**: 주제를 선택하면 소주제 목록이 활성화됩니다 (예: 생산량 현황)
4. **구분1 선택**: 소주제를 선택하면 구분1 목록이 활성화됩니다 (예: 월별)
5. **구분2 선택**: 구분1을 선택하면 구분2 목록이 활성화됩니다 (예: 전체)
6. 구분2를 선택하면 차트와 테이블에 지표 데이터가 표시됩니다

### 3. 차트 보기
- 구분2를 선택하면 선 그래프가 자동으로 생성됩니다
- 2024년 1월~6월 데이터가 시계열로 표시됩니다
- 마우스를 올리면 상세 값을 확인할 수 있습니다

### 4. CSV 내보내기
- 우측 상단의 "CSV 내보내기" 버튼을 클릭합니다
- 현재 선택된 필터(카테고리/주제/소주제/구분1/구분2)에 맞는 데이터가 다운로드됩니다
- CSV 파일은 카테고리, 주제, 소주제, 구분1, 구분2, 지표명, 값, 단위, 날짜 컬럼을 포함합니다
- 엑셀이나 다른 스프레드시트 프로그램에서 열 수 있습니다

### 5. Excel 업로드로 대량 데이터 입력 ⭐ NEW!

#### 📊 Excel 파일 형식
Excel 파일은 다음 5개 컬럼을 포함해야 합니다:

| subsection2_id | metric_name | value | unit | metric_date |
|---------------|-------------|-------|------|-------------|
| 1 | 생산량 | 125000 | 개 | 2024-01-01 |
| 1 | 생산량 | 132000 | 개 | 2024-02-01 |
| 2 | 생산량 | 45000 | 개 | 2024-01-01 |

**또는 한글 컬럼명 사용 가능:**

| 구분2_ID | 지표명 | 값 | 단위 | 날짜 |
|---------|--------|-----|-----|------|
| 1 | 생산량 | 125000 | 개 | 2024-01-01 |

#### 📤 업로드 방법
1. Excel 파일 준비 (.xlsx 또는 .xls)
2. 대시보드 헤더의 "Excel 업로드" 버튼 클릭
3. 파일 선택
4. 데이터 개수 확인 후 "확인" 클릭
5. 업로드 완료 메시지 확인
6. 대시보드가 자동으로 새로고침됩니다

#### 🔢 subsection2_id 찾기
- **방법 1**: API로 확인
  ```bash
  curl https://manufacturing-dashboard.pages.dev/api/subsections/1/subsections2
  ```
- **방법 2**: 브라우저 개발자 도구(F12) → Console에서 `console.log(subsections2)` 실행
- **방법 3**: [EXCEL_UPLOAD_GUIDE.md](EXCEL_UPLOAD_GUIDE.md) 파일 참조

#### 📁 템플릿 다운로드
- [excel_template.csv](excel_template.csv) - 샘플 데이터 포함 템플릿

#### ⚠️ 주의사항
- subsection2_id는 반드시 존재하는 ID 사용
- 날짜 형식: YYYY-MM-DD (예: 2024-01-01)
- 값(value)은 숫자만, 쉼표 없이 (예: 125000)
- 자세한 내용은 [EXCEL_UPLOAD_GUIDE.md](EXCEL_UPLOAD_GUIDE.md) 참조
- CSV 파일은 카테고리, 주제, 소주제, 구분1, 구분2, 지표명, 값, 단위, 날짜 컬럼을 포함합니다
- 엑셀이나 다른 스프레드시트 프로그램에서 열 수 있습니다

## 개발 환경

### 로컬 개발 시작
```bash
# 프로젝트 디렉토리로 이동
cd /home/user/webapp

# 데이터베이스 마이그레이션 적용
npm run db:migrate:local

# 샘플 데이터 삽입
npm run db:seed

# 프로젝트 빌드
npm run build

# 개발 서버 시작
pm2 start ecosystem.config.cjs

# 서버 상태 확인
pm2 list

# 로그 확인
pm2 logs webapp --nostream
```

### 데이터베이스 관리
```bash
# 로컬 DB 초기화 및 재시드
npm run db:reset

# 로컬 DB 쿼리 실행
npm run db:console:local

# 프로덕션 DB 마이그레이션
npm run db:migrate:prod
```

### 필터 트리 편집 방법
필터 계층 구조(카테고리, 주제, 소주제, 구분1, 구분2)를 수정하려면 `seed_v4.sql` 파일을 편집하세요:

1. **파일 위치**: `/home/user/webapp/seed_v4.sql`

2. **편집 후 적용**:
```bash
# 데이터베이스 리셋 (기존 데이터 삭제 후 새 seed 적용)
npm run db:reset

# 서버 재시작
pm2 restart webapp
```

3. **구조 설명**:
```sql
-- 1. 카테고리 삽입 (ID는 1부터 시작)
INSERT INTO categories (name, description, icon) VALUES ...

-- 2. 주제 삽입 (category_id로 카테고리와 연결)
INSERT INTO topics (category_id, name, description) VALUES ...

-- 3. 소주제 삽입 (topic_id로 주제와 연결)
INSERT INTO subtopics (topic_id, name, description) VALUES ...

-- 4. 구분1 삽입 (subtopic_id로 소주제와 연결)
INSERT INTO subsections (subtopic_id, name, description) VALUES ...

-- 5. 구분2 삽입 (subsection_id로 구분1과 연결)
INSERT INTO subsections2 (subsection_id, name, description) VALUES ...

-- 6. 지표 삽입 (subsection2_id로 구분2와 연결)
INSERT INTO metrics (subsection2_id, metric_name, value, unit, metric_date) VALUES ...
```

4. **편집 예시**:
```sql
-- 새로운 주제 추가
INSERT INTO topics (category_id, name, description) VALUES
  (1, '에너지 관리', '전력 및 에너지 소비량 분석');

-- 새로운 소주제 추가
INSERT INTO subtopics (topic_id, name, description) VALUES
  (4, '전력 소비량', '시간대별 전력 사용량');
```

## 배포 상태
- **플랫폼**: Cloudflare Pages (로컬 개발 환경)
- **상태**: ✅ 활성 (샌드박스)
- **기술 스택**: 
  - 백엔드: Hono + TypeScript + Cloudflare D1
  - 프론트엔드: TailwindCSS + Chart.js + Axios
  - 배포: Cloudflare Pages/Workers
- **마지막 업데이트**: 2026-02-28

## 아직 구현되지 않은 기능

### 1. 다른 카테고리 데이터
- 현재 **생산운영** 카테고리만 완전히 구현되어 있습니다
- **수삽라인**, **자동화**, **품질/제조기술** 카테고리는 주제/소주제/구분/지표 데이터가 없습니다
- seed_v4.sql 파일을 수정하여 추가 데이터를 입력할 수 있습니다

### 2. 지표 추가/수정/삭제 UI
- 현재는 데이터베이스 직접 편집으로만 지표를 관리할 수 있습니다
- 관리자 페이지에서 GUI로 지표를 추가/수정/삭제하는 기능이 필요합니다

### 3. 날짜 범위 필터
- 시작일/종료일을 선택하여 특정 기간의 지표만 조회하는 기능
- 현재는 모든 날짜의 데이터가 표시됩니다

### 4. 다양한 차트 유형
- 현재는 선 그래프만 지원합니다
- 막대 그래프, 파이 차트, 도넛 차트 등 추가 필요

### 5. 사용자 인증
- 로그인/회원가입 기능
- 사용자별 데이터 분리 및 권한 관리

## 추천 개발 단계

### 1단계: 데이터 완성
- 수삽라인, 자동화, 품질/제조기술 카테고리의 주제/소주제/구분/지표 데이터 추가
- seed_v4.sql 파일을 수정하여 실제 업무에 맞는 데이터 입력

### 2단계: 지표 관리 UI
- 관리자 페이지 추가 (`/admin` 경로)
- 카테고리/주제/소주제/구분1/구분2/지표를 GUI로 추가/수정/삭제
- 계층 구조 트리 뷰 추가

### 3단계: 고급 필터링
- 날짜 범위 선택 기능
- 다중 선택 필터 (여러 구분2를 동시에 비교)
- 저장된 필터 프리셋

### 4단계: 차트 개선
- 다양한 차트 유형 (막대, 파이, 도넛, 영역 차트 등)
- 차트 비교 기능 (여러 지표를 한 화면에)
- 차트 이미지 다운로드 기능

### 5단계: 사용자 관리
- 로그인/회원가입
- 역할 기반 접근 제어 (관리자/사용자)
- 사용자별 대시보드 커스터마이징

## 프로젝트 구조
```
webapp/
├── src/
│   └── index.tsx              # Hono 백엔드 애플리케이션
├── public/
│   └── static/
│       └── app.js             # 프론트엔드 JavaScript
├── migrations/
│   ├── 0001_initial_schema.sql    # 초기 스키마
│   ├── 0002_add_subsections.sql   # 구분1 테이블 추가
│   └── 0003_add_subsections2.sql  # 구분2 테이블 추가
├── seed_v4.sql                # 샘플 데이터 (구분1, 구분2 포함)
├── ecosystem.config.cjs       # PM2 설정
├── wrangler.jsonc             # Cloudflare 설정
├── package.json               # 의존성 및 스크립트
└── README.md                  # 프로젝트 문서
```

## 기술 상세

### Hono 백엔드
- **경량 웹 프레임워크**: Express보다 빠른 성능
- **TypeScript 타입 안전성**: D1Database 바인딩 타입 지원
- **CORS 설정**: API 엔드포인트에 CORS 활성화
- **CSV 생성**: 필터링된 데이터를 CSV 형식으로 변환

### Cloudflare D1
- **SQLite 기반**: 익숙한 SQL 문법 사용
- **로컬 개발**: `.wrangler/state/v3/d1/` 에 로컬 DB 자동 생성
- **마이그레이션**: 스키마 변경 이력 관리 (3개 마이그레이션 적용됨)
- **관계형 데이터**: 외래 키와 JOIN을 활용한 복잡한 5단계 계층 쿼리

### 프론트엔드
- **TailwindCSS**: 유틸리티 기반 스타일링
- **Chart.js**: 반응형 차트 라이브러리
- **Axios**: HTTP 클라이언트
- **FontAwesome**: 아이콘 라이브러리
- **Vanilla JavaScript**: 의존성 최소화

## 프로젝트 저장 및 편집 방법

### 방법 1: GitHub로 저장 (권장)
```bash
# 1. Git 원격 저장소 추가
cd /home/user/webapp
git remote add origin https://github.com/your-username/webapp.git

# 2. GitHub에 푸시
git push -f origin main

# 나중에 편집할 때
git clone https://github.com/your-username/webapp.git
cd webapp
npm install
npm run db:reset
npm run build
pm2 start ecosystem.config.cjs
```

### 방법 2: 백업 파일 다운로드
- **백업 URL**: https://www.genspark.ai/api/files/s/Fa4kYqxO
- 백업 파일을 다운로드하여 압축 해제 후 사용

### 필터 트리 편집 인터페이스
- **파일**: `/home/user/webapp/seed_v4.sql`
- **편집 도구**: 텍스트 에디터 (nano, vim, VS Code 등)
- **적용 방법**: `npm run db:reset` 실행
- **구조**: SQL INSERT 문으로 계층 구조 정의

## 문의 및 지원
이 프로젝트에 대한 문의사항이나 개선 제안이 있으시면 언제든지 연락주세요.
