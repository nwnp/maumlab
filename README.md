## install

```shell
npm install
```

```shell
npm run build
```

## start

```shell
npm run start:dev
```

## description

- PostgreSQL의 username과 password, database명이 달라서 수정을 해주지 않으면 서버 시작 에러
- 테이블: user, post, reply
  - user 테이블과 post 테이블 -> 1:N 관계로 구현
  - post 테이블과 reply 테이블 -> 1:N 관계로 구현
  - user 테이블과 reply 테이블 -> 1:N 관계로 구현
- reply 테이블
  - reply_type이 false이면 댓글
  - reply_type이 true이면 대댓글
    - true일 때만, 댓글의 id를 replied_id에 insert
- 로그인 기능에 의해서 access token을 return
  - 게시글 CRUD, 댓글/대댓글 등록은 token이 없으면 unauthorization 에러 return
  ```json
  {
    "Authorization": "Bearer <로그인을 한 후에 받은 토큰>"
  }
  ```

## API test

- http://localhost:4000/graphql 에서 확인 가능합니다
