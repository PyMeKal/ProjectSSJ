# ProjectSSJ 개발 계획

## MVP 목표

카카오톡 채팅 txt 파일을 서버에 직접 넣고, Node.js import 스크립트가 SQLite DB로 정리한 뒤 React 화면에서 통계를 보여준다.

## 1차 기능

- 전체 메시지 수
- 참여자 수
- 날짜 범위
- 사람별 메시지 수 순위
- 날짜별 채팅량
- 시간대별 채팅량
- 자주 나온 단어

## 이후 확장 후보

- 기간 필터
- 사람별 상세 페이지
- "ㅋㅋ", "ㅎㅎ", 이모티콘 사용량
- 월간/주간 리포트
- 친구별 별명 또는 익명화 기능
- 결과 이미지 저장
- 관리자 로그인

## DB 설계

초기에는 `messages` 테이블 하나만 사용한다.

```sql
messages (
  id integer primary key autoincrement,
  source_file text not null,
  sent_at text not null,
  sent_date text not null,
  sent_hour integer not null,
  sender text not null,
  message text not null,
  created_at text not null
)
```

통계는 API 요청 시 SQL로 계산한다. 데이터가 커지면 `daily_stats`, `user_stats`, `hourly_stats` 같은 집계 테이블을 추가한다.
