# ProjectSSJ

ProjectSSJ는 카카오톡 채팅 txt 파일을 서버에서 직접 import한 뒤, SQLite DB에 정리하고 React 대시보드에서 순위와 통계를 보여주는 웹 애플리케이션입니다.

## 구조

```txt
ProjectSSJ/
  client/   React + Vite 프론트엔드
  server/   Node.js + Express + SQLite 백엔드
  docs/     기획/개발 메모
```

## 첫 실행 순서

1. 서버 데이터 폴더에 카카오톡 내보내기 txt 파일을 넣습니다.

```txt
ProjectSSJ/server/data/kakao-chat.txt
```

2. 의존성을 설치합니다.

```bash
cd ProjectSSJ
npm install
```

3. txt 파일을 SQLite DB로 import합니다.

```bash
npm run import
```

예제 데이터로 먼저 확인하려면 아래 명령을 사용할 수 있습니다.

```bash
npm run import --workspace @project-ssj/server -- ./examples/sample-kakao-chat.txt
```

4. 개발 서버를 실행합니다.

```bash
npm run dev
```

기본 주소:

- Frontend: http://localhost:5173
- Backend: http://localhost:4000

## 개인정보 주의

카카오톡 txt 원문과 SQLite DB 파일은 `.gitignore`에 포함되어 있습니다. GitHub에 원문 대화 파일이 올라가지 않도록 계속 주의하세요.

처음 버전의 권장 운영 방식:

- 친구들이 직접 업로드하지 않음
- 관리자인 내가 서버에 txt 파일을 넣음
- 서버 import 스크립트로 DB 정리
- 프론트는 통계 결과만 조회

## 지원하는 카카오톡 txt 형식

현재 parser는 대표적으로 아래 두 형식을 처리합니다.

```txt
2026. 7. 1. 오후 3:22, 홍길동 : 안녕
```

```txt
--------------- 2026년 7월 1일 수요일 ---------------
[홍길동] [오후 3:22] 안녕
```

내보내기 환경에 따라 형식이 다르면 `server/src/parser/kakaoParser.js`를 보완하면 됩니다.
