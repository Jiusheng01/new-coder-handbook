const test = require('node:test');
const assert = require('node:assert/strict');
const { loadHandbook } = require('./test-loader.cjs');
const book = loadHandbook();
const plain = value => JSON.parse(JSON.stringify(value));

test('完成、收藏与练习切换保持原状态不变', () => {
  const initial = plain(book.initial);
  const complete = book.reduce(initial, { type: 'complete', chapter: 'mcp' });
  assert.deepEqual(initial.completed, []);
  assert.deepEqual(plain(complete.completed), ['mcp']);
  assert.deepEqual(plain(book.reduce(complete, { type: 'complete', chapter: 'mcp' }).completed), []);
  const task = book.reduce(initial, { type: 'task', chapter: 'mcp', value: 1 });
  assert.deepEqual(initial.tasks, {});
  assert.deepEqual(plain(task.tasks.mcp), [1]);
  assert.deepEqual(plain(book.reduce(initial, { type: 'bookmark', chapter: 'mcp' }).bookmarks), ['mcp']);
});

test('完整学习记录备份往返保留中文笔记与所有进度', () => {
  let state = plain(book.initial);
  for (const action of [
    { type: 'note', chapter: 'memory', value: '记忆 ≠ 上下文\n保留来源。' },
    { type: 'quiz', chapter: 'memory', value: 0 },
    { type: 'task', chapter: 'memory', value: 2 },
    { type: 'visit', chapter: 'memory' }
  ]) state = book.reduce(state, action);
  assert.deepEqual(plain(book.parse(book.backup(state))), plain(state));
  assert.ok(book.markdown(state).includes('记忆 ≠ 上下文'));
});

test('无效备份显式失败，不以空记录掩盖损坏', () => {
  assert.throws(() => book.parse('{broken'), /JSON|property/);
  assert.throws(() => book.parse('{"version":2,"state":{}}'), /不支持/);
  assert.throws(() => book.parse(book.backup({ ...book.initial, completed: ['not-a-chapter'] })), /无效章节/);
  assert.throws(() => book.parse(book.backup({ ...book.initial, answers: { mcp: 99 } })), /自测选项无效/);
  assert.throws(() => book.parse(book.backup({ ...book.initial, tasks: { mcp: [0, 0] } })), /重复/);
  assert.throws(() => book.parse(book.backup({ ...book.initial, notes: { mcp: {} } })), /必须是文本/);
});

test('存储损坏或不可访问时保留可见错误', () => {
  assert.throws(() => book.load({ getItem: () => '{broken' }), /JSON|property/);
  assert.throws(() => book.load({ getItem() { throw new Error('storage denied'); } }), /storage denied/);
  assert.deepEqual(plain(book.load({ getItem: () => null })), plain(book.initial));
});

test('笔记中的 HTML 与闭合标签被当作文本呈现', () => {
  const payload = '</textarea><img src=x onerror=alert(1)>';
  const chapter = book.chapters.find(item => item.id === 'memory');
  const html = book.lesson(chapter, { ...book.initial, notes: { memory: payload } });
  assert.ok(!html.includes(payload));
  assert.ok(html.includes('&lt;/textarea&gt;&lt;img'));
  assert.equal(book.escape('"\'&<>'), '&quot;&#39;&amp;&lt;&gt;');
});

test('路由支持中文搜索与直接章节链接', () => {
  assert.deepEqual(plain(book.route('#/chapter/mcp')), { page: 'chapter', id: 'mcp', query: '' });
  assert.equal(book.route('#/search?q=%E8%AE%B0%E5%BF%86').query, '记忆');
  assert.equal(book.route('').page, 'home');
});
