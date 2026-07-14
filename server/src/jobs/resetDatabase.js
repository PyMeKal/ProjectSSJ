import db from "../models/index.js";

const args = new Set(process.argv.slice(2));
const confirmed = args.has("--yes") || args.has("-y");

if (!confirmed) {
  console.log("DB 초기화는 모든 Sequelize 테이블을 drop 후 다시 생성합니다.");
  console.log("실행하려면 --yes 플래그를 붙여주세요.");
  console.log("예: npm run reset:db -- --yes");
  await db.sequelize.close();
  process.exit(1);
}

try {
  logStep("MySQL 연결 확인 중...");
  await db.sequelize.authenticate();
  logStep("MySQL 연결 확인 완료");

  logStep("DB 초기화 시작: Sequelize 모델 테이블 drop/recreate");
  await db.sequelize.sync({ force: true });
  logStep("DB 초기화 완료");
} catch (error) {
  console.error(`${error.name}: ${error.message}`);
  process.exitCode = 1;
} finally {
  await db.sequelize.close();
}

function logStep(message) {
  console.log(`[${new Date().toLocaleTimeString("ko-KR", { hour12: false })}] ${message}`);
}
