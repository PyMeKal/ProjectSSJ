import dotenv from "dotenv";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { openDatabase } from "../db/database.js";
import { parseKakaoText } from "../parser/kakaoParser.js";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverRoot = path.resolve(__dirname, "../..");
const inputArg = process.argv[2] ?? "./data/kakao-chat.txt";
const inputPath = path.isAbsolute(inputArg) ? inputArg : path.resolve(serverRoot, inputArg);

if (!existsSync(inputPath)) {
  console.error(`채팅 파일을 찾을 수 없습니다: ${inputPath}`);
  console.error("예: npm run import -- ./data/kakao-chat.txt");
  process.exit(1);
}

const text = readFileSync(inputPath, "utf8");
const messages = parseKakaoText(text);

if (messages.length === 0) {
  console.error("파싱된 메시지가 없습니다. 카카오톡 txt 형식을 확인해 주세요.");
  process.exit(1);
}

const db = openDatabase();
const sourceFile = path.basename(inputPath);

const importMessages = db.transaction((rows) => {
  db.prepare("delete from messages where source_file = ?").run(sourceFile);

  const insert = db.prepare(`
    insert into messages (source_file, sent_at, sent_date, sent_hour, sender, message)
    values (@sourceFile, @sentAt, @sentDate, @sentHour, @sender, @message)
  `);

  for (const row of rows) {
    insert.run({
      sourceFile,
      ...row,
    });
  }
});

importMessages(messages);

console.log(`${messages.length.toLocaleString()}개 메시지를 import했습니다.`);
console.log(`source_file: ${sourceFile}`);
