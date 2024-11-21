# Yene Element Editor

## 과제 요구사항

1. 화면 분할: 좌측 레이어 패널, 우측 뷰포트 구성
2. 요소 생성 버튼 (div, span, p) 및 정렬 버튼 구현
3. 생성된 요소의 뷰포트 및 레이어 패널 동기화 표시
4. 요소/레이어 선택 시 상호 동기화
5. 선택된 요소에 2px 테두리 표시
6. Shift 키를 통한 다중 선택 지원
7. Drag & Drop으로 순서 변경 기능
8. Ctrl+G로 그룹화, Ctrl+Shift+G로 그룹 해제
9. CSS flex를 활용한 정렬 기능 구현
10. 뷰포트 요소들의 이미지 다운로드 기능

## 프로젝트 구조

```
src/
├── components/         # 컴포넌트 디렉토리
│   ├── button/        # 버튼 관련 컴포넌트
│   ├── dnd/           # Drag & Drop 관련 컴포넌트
│   ├── layer-pannel/  # 레이어 패널 컴포넌트
│   └── viewport/      # 뷰포트 컴포넌트
├── contents/          # 컨텐츠 관련 파일
│   ├── button.ts     # 버튼 설정
│   └── styles.ts     # 스타일 설정
├── context/          # Context API 관련
│   └── editor-context.tsx  # 에디터 상태 관리
└── lib/             # 유틸리티 함수
    ├── utils.ts     # 공통 유틸리티
    └── types        # 타입 정의
```

## 구현 설명

### 사용 기술

- React 18
- TypeScript
- Tailwind CSS
- @dnd-kit/core & @dnd-kit/sortable: 드래그 앤 드롭 기능
- html2canvas: 뷰포트 이미지 캡처
- lucide-react: 아이콘

### 주요 기능 구현

1. **상태 관리**: Context API를 사용하여 전역 상태 관리
2. **드래그 앤 드롭**: @dnd-kit 라이브러리로 구현
3. **단축키**: useEffect와 이벤트 리스너로 구현
4. **이미지 저장**: html2canvas로 뷰포트 캡처 후 다운로드
