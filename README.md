# 지표 분석 대시보드

## 프로젝트 개요
- **이름**: 지표 분석 대시보드 (Metrics Analysis Dashboard)
- **목표**: 여러 카테고리의 지표를 분석하고 필터링하여 시각화된 정보를 제공하며 CSV로 내보낼 수 있는 대시보드
- **주요 기능**:
  - 📊 카테고리별 대시보드 요약
  - 🔍 계층적 필터링 (카테고리 → 주제 → 소주제)
  - 📈 Chart.js를 이용한 지표 시각화
  - 📋 상세 데이터 테이블 조회
  - 💾 CSV 엑셀 데이터 내보내기

## 현재 완료된 기능

### ✅ 백엔드 API
- **카테고리 API**: 모든 카테고리 조회 (`GET /api/categories`)
- **주제 API**: 카테고리별 주제 조회 (`GET /api/categories/:id/topics`)
- **소주제 API**: 주제별 소주제 조회 (`GET /api/topics/:id/subtopics`)
- **지표 API**: 소주제별 지표 조회 (`GET /api/subtopics/:id/metrics`)
- **대시보드 API**: 카테고리별 통계 요약 (`GET /api/dashboard`)
- **CSV 내보내기**: 필터링된 데이터를 CSV로 내보내기 (`GET /api/export/metrics`)

### ✅ 프론트엔드
- **대시보드 카드**: 카테고리별 주제/소주제/지표 개수 표시
- **계층적 필터**: 카테고리 → 주제 → 소주제 선택
- **차트 시각화**: 선 그래프로 지표 추이 표시
- **데이터 테이블**: 지표 상세 데이터 조회
- **CSV 내보내기**: 필터링된 데이터를 CSV 파일로 다운로드

### ✅ 데이터베이스
- **Cloudflare D1**: SQLite 기반 로컬/프로덕션 데이터베이스
- **테이블 구조**:
  - `categories`: 카테고리 (비즈니스, 마케팅, 재무, 운영)
  - `topics`: 주제 (매출 분석, 고객 분석 등)
  - `subtopics`: 소주제 (월별 매출, 신규 고객 등)
  - `metrics`: 지표 데이터 (값, 단위, 날짜)

## 공개 URL

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

# 특정 소주제의 지표
GET https://3000-i0chfljvgqyqrk0hy5ofh-ea026bf9.sandbox.novita.ai/api/subtopics/1/metrics

# CSV 내보내기 (필터 옵션)
GET https://3000-i0chfljvgqyqrk0hy5ofh-ea026bf9.sandbox.novita.ai/api/export/metrics?category_id=1&topic_id=1
```

## 데이터 아키텍처

### 데이터 모델
```
categories (카테고리)
  ├── topics (주제)
  │     ├── subtopics (소주제)
  │     │     ├── metrics (지표)
```

### 스토리지 서비스
- **Cloudflare D1**: SQLite 기반 관계형 데이터베이스
- **로컬 개발**: `.wrangler/state/v3/d1/` 에 SQLite 파일 저장
- **마이그레이션**: `migrations/` 디렉토리에서 스키마 관리

### 샘플 데이터
- 4개 카테고리: 비즈니스, 마케팅, 재무, 운영
- 6개 주제: 매출 분석, 고객 분석, 광고 성과 등
- 8개 소주제: 월별 매출, 신규 고객, Google Ads 등
- 27개 지표 데이터: 최근 6개월간의 매출, 고객 수, 광고 성과 등

## 사용자 가이드

### 1. 대시보드 보기
- 메인 페이지에 접속하면 4개의 카테고리 카드가 표시됩니다
- 각 카드에는 주제 수, 소주제 수, 지표 수가 표시됩니다
- 카드를 클릭하면 해당 카테고리가 자동으로 선택됩니다

### 2. 지표 조회하기
1. **카테고리 선택**: 필터 영역에서 카테고리를 선택합니다
2. **주제 선택**: 카테고리를 선택하면 주제 목록이 활성화됩니다
3. **소주제 선택**: 주제를 선택하면 소주제 목록이 활성화됩니다
4. 소주제를 선택하면 차트와 테이블에 지표 데이터가 표시됩니다

### 3. 차트 보기
- 소주제를 선택하면 선 그래프가 자동으로 생성됩니다
- 여러 지표가 있는 경우 다양한 색상으로 표시됩니다
- 마우스를 올리면 상세 값을 확인할 수 있습니다

### 4. CSV 내보내기
- 우측 상단의 "CSV 내보내기" 버튼을 클릭합니다
- 현재 선택된 필터(카테고리/주제/소주제)에 맞는 데이터가 다운로드됩니다
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

## 배포 상태
- **플랫폼**: Cloudflare Pages (로컬 개발 환경)
- **상태**: ✅ 활성 (샌드박스)
- **기술 스택**: 
  - 백엔드: Hono + TypeScript + Cloudflare D1
  - 프론트엔드: TailwindCSS + Chart.js + Axios
  - 배포: Cloudflare Pages/Workers
- **마지막 업데이트**: 2026-02-28

## 추천 개발 단계

### 다음 구현 권장 사항
1. **지표 추가/수정/삭제 기능**
   - 새로운 지표 데이터를 추가할 수 있는 폼
   - 기존 지표를 수정하거나 삭제하는 기능

2. **날짜 범위 필터**
   - 시작일/종료일을 선택하여 특정 기간의 지표만 조회
   - 차트에서 날짜 범위 슬라이더 추가

3. **더 많은 차트 유형**
   - 막대 그래프, 파이 차트, 도넛 차트 등
   - 차트 유형 선택 옵션 추가

4. **카테고리/주제/소주제 관리**
   - 관리자 페이지에서 카테고리 구조 편집
   - 새로운 카테고리/주제/소주제 추가

5. **사용자 인증**
   - 로그인/회원가입 기능
   - 사용자별 데이터 분리

6. **대시보드 커스터마이징**
   - 사용자가 자주 보는 지표를 즐겨찾기로 저장
   - 개인화된 대시보드 레이아웃

7. **실시간 데이터 업데이트**
   - WebSocket을 이용한 실시간 지표 업데이트
   - 자동 새로고침 옵션

## 프로젝트 구조
```
webapp/
├── src/
│   └── index.tsx              # Hono 백엔드 애플리케이션
├── public/
│   └── static/
│       └── app.js             # 프론트엔드 JavaScript
├── migrations/
│   └── 0001_initial_schema.sql # 데이터베이스 스키마
├── seed.sql                   # 샘플 데이터
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
- **마이그레이션**: 스키마 변경 이력 관리
- **관계형 데이터**: 외래 키와 JOIN을 활용한 복잡한 쿼리

### 프론트엔드
- **TailwindCSS**: 유틸리티 기반 스타일링
- **Chart.js**: 반응형 차트 라이브러리
- **Axios**: HTTP 클라이언트
- **FontAwesome**: 아이콘 라이브러리
- **Vanilla JavaScript**: 의존성 최소화

## 문의 및 지원
이 프로젝트에 대한 문의사항이나 개선 제안이 있으시면 언제든지 연락주세요.
