#!/bin/bash
echo "=== 카테고리 목록 ==="
npx wrangler d1 execute webapp-production --remote --command="SELECT * FROM categories;"

echo -e "\n=== 주제 목록 (수삽라인) ==="
npx wrangler d1 execute webapp-production --remote --command="SELECT * FROM topics WHERE category_id=2;"

echo -e "\n=== 소주제 목록 (재고 관리) ==="
npx wrangler d1 execute webapp-production --remote --command="SELECT * FROM subtopics WHERE topic_id IN (4,5);"

echo -e "\n=== 구분1 목록 ==="
npx wrangler d1 execute webapp-production --remote --command="SELECT * FROM subsections ORDER BY id DESC LIMIT 5;"

echo -e "\n=== 구분2 목록 ==="
npx wrangler d1 execute webapp-production --remote --command="SELECT * FROM subsections2 ORDER BY id DESC LIMIT 5;"
