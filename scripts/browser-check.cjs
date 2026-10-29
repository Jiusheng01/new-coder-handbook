const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { loadHandbook, root } = require('./test-loader.cjs');

const playwrightPath = process.env.HANDBOOK_PLAYWRIGHT_PATH;
if (!playwrightPath) throw new Error('请通过 HANDBOOK_PLAYWRIGHT_PATH 指定本机 Playwright 包路径');
const { chromium } = require(playwrightPath);
const baseURL = process.env.HANDBOOK_BASE_URL || 'http://127.0.0.1:4387';
const book = loadHandbook();
const chapterURL = id => `${baseURL}/#/chapter/${id}`;

async function checkChapters(page) {
  for (const chapter of book.chapters) {
    await page.goto(chapterURL(chapter.id));
    await page.getByRole('heading', { name: chapter.title, exact: true }).waitFor();
    assert.equal(await page.locator('.lesson-flow-node').count(), 4);
    assert.equal(await page.locator('.lesson-task').count(), 3);
    assert.equal(await page.locator('.lesson-quiz-option').count(), 3);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, chapter.id);
  }
  console.log('通过：22 章内容、图解、练习、自测与桌面布局');
}

async function checkLearning(page) {
  await page.goto(chapterURL('mcp'));
  await page.locator('[data-action="flow"]').nth(2).click();
  assert.ok((await page.locator('#lesson-flow-detail').innerText()).includes('tools/call'));
  await page.getByRole('checkbox').first().check();
  await page.getByRole('radio').nth(0).check();
  assert.ok((await page.locator('#lesson-quiz-feedback').innerText()).includes('再想一想'));
  await page.getByRole('radio').nth(1).check();
  assert.ok((await page.locator('#lesson-quiz-feedback').innerText()).includes('答对了'));
  await page.getByRole('button', { name: '收藏章节', exact: true }).click();
  await page.locator('#lesson-note-input').fill('测试笔记：工具调用 ≠ 执行成功。\n保留调用 ID。');
  await page.getByRole('button', { name: '标记本章已学完', exact: true }).click();
  await page.reload();
  assert.equal(await page.getByRole('checkbox').first().isChecked(), true);
  assert.equal(await page.getByRole('radio').nth(1).isChecked(), true);
  assert.ok((await page.locator('#lesson-note-input').inputValue()).includes('测试笔记'));
  assert.equal(await page.getByRole('button', { name: '取消收藏', exact: true }).getAttribute('aria-pressed'), 'true');
  assert.equal(await page.locator('progress').getAttribute('value'), '1');
  console.log('通过：流程节点、自测正误反馈、勾选、收藏、完成标记与刷新持久化');
}

async function downloadText(page, label) {
  const received = page.waitForEvent('download');
  await page.getByRole('button', { name: label, exact: true }).click();
  const download = await received;
  const text = await fs.readFile(await download.path(), 'utf8');
  await download.delete();
  return text;
}

async function checkExports(page) {
  await page.goto(`${baseURL}/#/notes`);
  const markdown = await downloadText(page, '导出笔记');
  assert.ok(markdown.includes('测试笔记'));
  const json = await downloadText(page, '备份学习记录');
  assert.equal(JSON.parse(json).state.completed[0], 'mcp');
  const imported = { version: 1, state: { ...book.initial, completed: ['memory'], notes: { memory: '<img src=x onerror=alert(1)> 记忆笔记' } } };
  const upload = { name: '验证备份.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(imported)) };
  await page.locator('[data-action="import-data"]').setInputFiles(upload);
  await page.getByRole('region', { name: '导入预览' }).waitFor();
  assert.ok((await page.locator('.handbook-note-card').innerText()).includes('测试笔记'));
  await page.getByRole('button', { name: '确认替换并导入' }).click();
  assert.ok((await page.locator('.handbook-note-card').innerText()).includes('<img src=x onerror=alert(1)>'));
  assert.equal(await page.locator('.handbook-note-card img').count(), 0);
  await page.locator('[data-action="import-data"]').setInputFiles({ name: '错误.json', mimeType: 'application/json', buffer: Buffer.from('{"version":2}') });
  await page.locator('.handbook-storage-error').waitFor({ state: 'visible' });
  assert.equal(await page.locator('progress').getAttribute('value'), '1');
  console.log('通过：Markdown / JSON 下载、导入预览、替换、HTML 文本转义与错误导入不覆盖记录');
}

async function checkNavigation(page) {
  await page.goto(baseURL);
  await page.keyboard.press('/');
  assert.equal(await page.locator('#handbook-search').evaluate(element => element === document.activeElement), true);
  await page.locator('#handbook-search').fill('KV Cache');
  await page.getByRole('heading', { name: '关于「KV Cache」' }).waitFor();
  assert.ok(await page.locator('.handbook-reading-card').count() >= 1);
  await page.locator('#handbook-search').fill('一个不可能存在的词xyz');
  await page.locator('.handbook-empty').waitFor();
  await page.goto(`${baseURL}/#/resources`);
  assert.equal(await page.locator('.handbook-resource-card').count(), Object.keys(book.resources).length);
  await page.getByRole('button', { name: '论文', exact: true }).click();
  assert.equal(await page.locator('.handbook-resource-card').count(), 1);
  await page.goto(`${baseURL}/#/chapter/missing`);
  await page.getByRole('heading', { name: '这一页还不在手册里。' }).waitFor();
  console.log('通过：键盘搜索、空结果、资料筛选与无效章节路由');
}

async function checkSidebarCollapse(page) {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1440, height: 1100 });
  await page.goto(chapterURL('mcp'));
  await page.getByRole('button', { name: '收起目录', exact: true }).click();
  assert.equal(await page.getByRole('button', { name: '展开目录', exact: true }).getAttribute('aria-expanded'), 'false');
  assert.equal(await page.locator('#handbook-sidebar').getAttribute('aria-hidden'), 'true');
  assert.equal(await page.evaluate(() => getComputedStyle(document.querySelector('.handbook-workspace')).marginLeft), '0px');
  await page.reload();
  assert.equal(await page.locator('body').evaluate(body => body.classList.contains('is-sidebar-collapsed')), true);
  await page.getByRole('button', { name: '展开目录', exact: true }).click();
  assert.equal(await page.evaluate(() => getComputedStyle(document.querySelector('.handbook-workspace')).marginLeft), '254px');
  await page.setViewportSize({ width: 390, height: 844 });
  assert.equal(await page.locator('.handbook-sidebar-toggle').isVisible(), false);
  await page.setViewportSize({ width: 1440, height: 1100 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  console.log('通过：桌面侧边栏收起、正文让位、刷新保持与移动端隐藏');
}

async function checkResponsive(page) {
  for (const width of [320, 390, 768, 1024]) {
    await page.setViewportSize({ width, height: 844 });
    for (const route of ['/', '/#/chapter/langgraph', '/#/chapter/rag-indexes', '/#/notes', '/#/resources']) {
      await page.goto(`${baseURL}${route}`);
      await page.locator('h1').waitFor();
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${width} ${route}`);
    }
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole('button', { name: '打开目录', exact: true }).click();
  assert.equal(await page.locator('#handbook-sidebar').getAttribute('aria-hidden'), 'false');
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('#handbook-sidebar').getAttribute('aria-hidden'), 'true');
  console.log('通过：320 / 390 / 768 / 1024 宽度布局与移动目录');
}

async function checkOffline(browser) {
  const context = await browser.newContext({ offline: true });
  try {
    const page = await context.newPage();
    await page.goto(`${pathToFileURL(path.join(root, 'index.html')).href}#/chapter/mcp`);
    await page.getByRole('heading', { name: '给 Agent 一套工具插座' }).waitFor();
    await page.locator('#lesson-note-input').fill('离线 file:// 笔记');
    await page.reload();
    assert.equal(await page.locator('#lesson-note-input').inputValue(), '离线 file:// 笔记');
    assert.equal(await page.locator('.lesson-flow-node').count(), 4);
    console.log('通过：断网直接打开 index.html、阅读与笔记持久化');
  } finally { await context.close(); }
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1100 }, acceptDownloads: true });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await checkChapters(page);
    await checkLearning(page);
    await checkExports(page);
    await checkNavigation(page);
    await checkSidebarCollapse(page);
    await checkResponsive(page);
    await checkOffline(browser);
    assert.deepEqual(errors, []);
    await context.close();
    console.log('浏览器验收全部通过，无未捕获脚本异常。');
  } finally { await browser.close(); }
}

main().catch(error => { console.error(error); process.exitCode = 1; });
