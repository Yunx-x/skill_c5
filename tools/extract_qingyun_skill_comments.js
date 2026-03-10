/* eslint-disable no-console */
/**
 * Extracts JSDoc-style block comments immediately preceding `class SkillXXX extends`
 * from `src/skills/QingYunSkillList.ts` into a markdown document under `docs/整理/`.
 *
 * Usage:
 *   node tools/extract_qingyun_skill_comments.js
 */

const fs = require("fs");
const path = require("path");

function stripLeadingStars(block) {
  return block
    .split(/\r?\n/)
    .map((l) => l.replace(/^\s*\*\s?/, ""))
    .join("\n")
    .trim();
}

function extractIdAndName(comment) {
  const lines = comment.split(/\r?\n/).map((l) => l.trim());
  for (const l of lines) {
    const m = l.match(/^(\d+)\s+(.+?)\s*$/);
    if (m) return { id: m[1], name: m[2] };
  }
  return { id: null, name: null };
}

function main() {
  const repoRoot = path.resolve(__dirname, "..");
  const inFile = path.join(repoRoot, "src", "skills", "QingYunSkillList.ts");
  const outDir = path.join(repoRoot, "docs", "整理");
  const outFile = path.join(outDir, "QingYunSkillList_技能注释提取.md");

  fs.mkdirSync(outDir, { recursive: true });
  const src = fs.readFileSync(inFile, "utf8");

  // 1) extract pairs of (doc block) + (class SkillXXX extends ...)
  const pairRe = /\/\*\*([\s\S]*?)\*\/\s*\r?\n\s*class\s+(Skill\d+)\s+extends/g;
  /** @type {{cls:string,id:string|null,name:string|null,comment:string,order:number}[]} */
  const items = [];
  let m;
  while ((m = pairRe.exec(src))) {
    const comment = stripLeadingStars(m[1]);
    const cls = m[2];
    const { id, name } = extractIdAndName(comment);
    items.push({ cls, id, name, comment, order: m.index });
  }

  // 2) include Skill classes without a doc block right above (mark as no comment)
  const classRe = /^\s*class\s+(Skill\d+)\s+extends/gm;
  /** @type {string[]} */
  const allClasses = [];
  while ((m = classRe.exec(src))) allClasses.push(m[1]);

  const have = new Set(items.map((i) => i.cls));
  for (const cls of allClasses) {
    if (!have.has(cls)) {
      // find approximate order position by locating `class ${cls}`
      const idx = src.indexOf(`class ${cls}`);
      items.push({ cls, id: null, name: null, comment: "", order: idx === -1 ? Number.MAX_SAFE_INTEGER : idx });
    }
  }

  // 3) keep original file order
  items.sort((a, b) => a.order - b.order);

  // 4) build markdown
  let md = "";
  md += "# 青云技能（QingYunSkillList.ts）注释提取\n\n";
  md += `来源：\`src/skills/QingYunSkillList.ts\`\n\n`;
  md += "> 说明：以下为从源码中紧贴 `class SkillXXX` 之前的 `/** ... */` 注释块提取的原文；若某技能类未紧贴注释块，则标记为“无注释”。\n\n";

  for (const it of items) {
    const title = it.id && it.name ? `${it.id} ${it.name}` : it.cls;
    md += `### ${title}\n\n`;
    md += `- **类名**：\`${it.cls}\`\n`;
    if (it.id) md += `- **技能ID**：${it.id}\n`;
    md += "\n";
    if (it.comment) {
      md += "```\n" + it.comment + "\n```\n\n";
    } else {
      md += "（无注释）\n\n";
    }
  }

  fs.writeFileSync(outFile, md, "utf8");
  console.log(`Wrote: ${outFile} (${items.length} skills)`);
}

main();

