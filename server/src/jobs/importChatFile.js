import dotenv from "dotenv";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import db from "../models/index.js";
import { parseKakaoText } from "../parser/kakaoParser.js";

dotenv.config();

// Resolve the txt file from the server folder so terminal commands can use relative paths.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverRoot = path.resolve(__dirname, "../..");
const inputArg = process.argv[2] ?? "./inputs/sample-kakao-chat.txt";
const inputPath = path.isAbsolute(inputArg) ? inputArg : path.resolve(serverRoot, inputArg);

if (!existsSync(inputPath)) {
  console.error(`채팅 파일을 찾을 수 없습니다: ${inputPath}`);
  console.error("예: npm run import -- ./inputs/sample-kakao-chat.txt");
  process.exit(1);
}

logStep(`파일 읽는 중: ${inputPath}`);
const text = readFileSync(inputPath, "utf8");
logStep(`파일 읽기 완료: ${formatBytes(Buffer.byteLength(text, "utf8"))}`);

logStep("카카오톡 메시지 파싱 중...");
const messages = parseKakaoText(text);
logStep(`파싱 완료: ${messages.length.toLocaleString()}개 메시지`);

if (messages.length === 0) {
  console.error("파싱된 메시지가 없습니다. 카카오톡 txt 형식을 확인해 주세요.");
  process.exit(1);
}

const sourceFile = path.basename(inputPath);
const senderNames = [...new Set(messages.map((message) => message.sender))];
const importBatchSize = Math.max(Number(process.env.IMPORT_BATCH_SIZE ?? 500), 1);
const totalBatches = Math.ceil(messages.length / importBatchSize);

logStep(`참여자 감지 완료: ${senderNames.length.toLocaleString()}명`);
logStep(`저장 배치 설정: ${importBatchSize.toLocaleString()}개씩, 총 ${totalBatches.toLocaleString()}개 배치`);

try {
  // Confirm MySQL is reachable and create missing tables from the Sequelize models.
  logStep("MySQL 연결 확인 중...");
  await db.sequelize.authenticate();
  logStep("MySQL 연결 확인 완료");

  logStep("Sequelize 모델과 테이블 동기화 중...");
  await db.sequelize.sync();
  logStep("테이블 동기화 완료");

  // Keep each import all-or-nothing: users, cleanup, and text inserts succeed or fail together.
  logStep("DB transaction 시작");
  const result = await db.sequelize.transaction(async (transaction) => {
    const usersByName = new Map();

    // A Kakao sender becomes a local User so each Text can point back to its participant.
    logStep("참여자 User 준비 중...");
    for (const [index, name] of senderNames.entries()) {
      const [user] = await db.User.findOrCreate({
        where: { loginId: `kakao:${name}` },
        defaults: {
          loginId: `kakao:${name}`,
          passwordHash: "kakao-import-placeholder",
          name,
        },
        transaction,
      });

      usersByName.set(name, user);

      if (index + 1 === senderNames.length || (index + 1) % 50 === 0) {
        logStep(`${(index + 1).toLocaleString()} / ${senderNames.length.toLocaleString()}명 User 준비 완료`);
      }
    }

    // Re-importing the same file replaces its old messages instead of duplicating them.
    logStep(`기존 메시지 삭제 중: source_file=${sourceFile}`);
    const deletedTexts = await db.Text.destroy({
      where: { sourceFile },
      transaction,
    });
    logStep(`${deletedTexts.toLocaleString()}개 기존 메시지 삭제 완료`);

    // Convert parser output into Text model fields, including the User association.
    logStep("DB 저장용 row 변환 중...");
    const rows = messages.map((message) => {
      const user = usersByName.get(message.sender);

      return {
        sourceFile,
        sentAt: message.sentAt,
        sentDate: message.sentDate,
        sentYear: message.sentYear,
        sentMonth: message.sentMonth,
        sentDay: message.sentDay,
        sentTime: message.sentTime,
        sentHour: message.sentHour,
        sender: message.sender,
        message: message.message,
        userId: user?.id ?? null,
      };
    });
    logStep(`row 변환 완료: ${rows.length.toLocaleString()}개`);

    let createdTexts = 0;

    // Large KakaoTalk exports can exceed MySQL max_allowed_packet if inserted at once.
    // Insert in smaller batches so each SQL packet stays comfortably below that limit.
    logStep("메시지 배치 저장 시작");
    for (let index = 0; index < rows.length; index += importBatchSize) {
      const batch = rows.slice(index, index + importBatchSize);
      await db.Text.bulkCreate(batch, { transaction });
      createdTexts += batch.length;

      if (createdTexts === rows.length || createdTexts % 10000 < importBatchSize) {
        const completedBatches = Math.ceil(createdTexts / importBatchSize);
        const percent = ((createdTexts / rows.length) * 100).toFixed(1);
        logStep(
          `${createdTexts.toLocaleString()} / ${rows.length.toLocaleString()}개 메시지 저장 중 ` +
            `(${percent}%, ${completedBatches.toLocaleString()} / ${totalBatches.toLocaleString()} batches)`,
        );
      }
    }

    return {
      deletedTexts,
      createdTexts,
      users: usersByName.size,
    };
  });
  logStep("DB transaction commit 완료");

  console.log(`${result.createdTexts.toLocaleString()}개 메시지를 import했습니다.`);
  console.log(`${result.users.toLocaleString()}명 참가자를 User 모델에 연결했습니다.`);
  console.log(`${result.deletedTexts.toLocaleString()}개 기존 메시지를 같은 source_file 기준으로 교체했습니다.`);
  console.log(`source_file: ${sourceFile}`);
} catch (error) {
  console.error(`${error.name}: ${error.message}`);
  process.exitCode = 1;
} finally {
  await db.sequelize.close();
}

function logStep(message) {
  console.log(`[${new Date().toLocaleTimeString("ko-KR", { hour12: false })}] ${message}`);
}

function formatBytes(bytes) {
  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex += 1;
  }

  return `${size.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}
