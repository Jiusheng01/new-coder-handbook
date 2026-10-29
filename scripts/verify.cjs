const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { loadHandbook, root } = require('./test-loader.cjs');

function verifyChapter(chapter, book) {
  assert.ok(chapter.title && chapter.lead, `${chapter.id} 缺少标题或简介`);
  assert.ok(book.stages[chapter.stage], `${chapter.id} 阶段无效`);
  assert.ok(chapter.sections.length >= 3, `${chapter.id} 缺少讲解`);
  assert.equal(chapter.flow.length, 4, `${chapter.id} 流程应包含四步`);
  for (const step of chapter.flow) assert.ok(step[0] && step[1], '流程需要标签与解释');
  assert.equal(chapter.tasks.length, 3, `${chapter.id} 缺少动手任务`);
  assert.ok(chapter.quiz.options[chapter.quiz.answer], `${chapter.id} 自测答案无效`);
  for (const id of chapter.resources) assert.ok(book.resources[id], `资料缺失：${id}`);
  const html = book.lesson(chapter, book.initial);
  assert.equal((html.match(/data-action="flow"/g) || []).length, 4);
  assert.ok(!html.includes('undefined'), `${chapter.id} 渲染出现 undefined`);
}

function verify() {
  const book = loadHandbook();
  assert.equal(book.chapters.length, 22);
  assert.equal(new Set(book.chapters.map(chapter => chapter.id)).size, book.chapters.length);
  book.chapters.forEach(chapter => verifyChapter(chapter, book));
  for (const resource of Object.values(book.resources)) assert.equal(new URL(resource.url).protocol, 'https:');
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  for (const match of html.matchAll(/(?:src|href)="(assets\/[^"#]+)"/g)) {
    assert.ok(fs.existsSync(path.join(root, match[1])), `静态文件不存在：${match[1]}`);
  }
  assert.ok(!book.home(book.initial).includes('undefined'));
  console.log(`内容检查通过：${book.chapters.length} 章，88 个流程节点，66 项练习，22 道自测，${Object.keys(book.resources).length} 份资料。`);
}

verify();
