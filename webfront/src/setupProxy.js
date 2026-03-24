const { createProxyMiddleware } = require('http-proxy-middleware');

// npm start 시 react-scripts가 이 파일을 자동으로 읽어서 프록시 설정 적용
// 브라우저 → React(3000) → Spring Boot(8080) 으로 요청을 중계
// CORS 에러 방지 목적
module.exports = function(app) {
  app.use(
    // 아래 경로로 시작하는 요청은 모두 8080으로 전달
    ['/goal', '/task', '/auth', '/ai'],
    createProxyMiddleware({
      target: 'http://localhost:8080', // Spring Boot 서버 주소
      changeOrigin: true,              // 요청 헤더의 Host를 target으로 변경
    })
  );
};
