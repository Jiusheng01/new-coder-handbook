function handbookToggle(items, value) {
  return items.includes(value) ? items.filter(item => item !== value) : [...items, value];
}

function handbookReduce(state, action) {
  const { chapter, value } = action;
  switch (action.type) {
    case 'complete': return { ...state, completed: handbookToggle(state.completed, chapter) };
    case 'bookmark': return { ...state, bookmarks: handbookToggle(state.bookmarks, chapter) };
    case 'task': return { ...state, tasks: { ...state.tasks, [chapter]: handbookToggle(state.tasks[chapter] || [], value) } };
    case 'quiz': return { ...state, answers: { ...state.answers, [chapter]: value } };
    case 'note': return { ...state, notes: { ...state.notes, [chapter]: value } };
    case 'visit': return { ...state, lastChapter: chapter };
    default: throw new Error(`未知记录操作：${action.type}`);
  }
}

function handbookValidateState(state) {
  const ids = new Set(HANDBOOK_CHAPTERS.map(chapter => chapter.id));
  if (!handbookIsRecord(state)) throw new Error('学习记录缺少有效 state');
  for (const field of ['completed', 'bookmarks']) {
    handbookValidateChapterList(state[field], ids, field);
  }
  for (const field of ['tasks', 'answers', 'notes']) handbookValidateChapterMap(state, field);
  if (state.lastChapter !== null && !ids.has(state.lastChapter)) throw new Error('上次阅读章节无效');
  return state;
}

function handbookIsRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function handbookValidateChapterList(items, ids, field) {
  if (!Array.isArray(items) || items.some(id => !ids.has(id))) throw new Error(`${field} 含有无效章节`);
  if (new Set(items).size !== items.length) throw new Error(`${field} 含重复章节`);
}

function handbookValidateChapterMap(state, field) {
  const records = state[field];
  if (!handbookIsRecord(records)) throw new Error(`${field} 格式无效`);
  for (const [id, value] of Object.entries(records)) {
    const chapter = HANDBOOK_CHAPTERS.find(item => item.id === id);
    if (!chapter) throw new Error(`${field} 包含未知章节：${id}`);
    handbookValidateRecordValue(field, value, chapter);
  }
}

function handbookValidateRecordValue(field, value, chapter) {
  if (field === 'notes' && typeof value !== 'string') throw new Error('笔记内容必须是文本');
  if (field === 'answers' && (!Number.isInteger(value) || value < 0 || value >= chapter.quiz.options.length)) throw new Error('自测选项无效');
  if (field === 'tasks') handbookValidateTasks(value, chapter);
}

function handbookValidateTasks(value, chapter) {
  if (!Array.isArray(value)) throw new Error('练习记录必须是数组');
  if (value.some(index => !Number.isInteger(index) || index < 0 || index >= chapter.tasks.length)) throw new Error('练习编号无效');
  if (new Set(value).size !== value.length) throw new Error('练习记录重复');
}

function handbookParseBackup(text) {
  const backup = JSON.parse(text);
  if (backup.version !== 1) throw new Error('不支持此备份版本，请使用本手册导出的 v1 备份');
  return handbookValidateState(backup.state);
}

function handbookLoadState(storage) {
  const text = storage.getItem(HANDBOOK_STORAGE_KEY);
  return text === null ? { ...HANDBOOK_INITIAL_STATE } : handbookParseBackup(text);
}

function handbookBackup(state) {
  return JSON.stringify({ version: 1, exportedAt: new Date().toISOString(), state }, null, 2);
}

function handbookNotesMarkdown(state) {
  const heading = `# Agent 学习手记\n\n来源：${HANDBOOK_SOURCE_URL}\n\n已学完 ${state.completed.length} / ${HANDBOOK_CHAPTERS.length} 章。\n`;
  const chapters = HANDBOOK_CHAPTERS.filter(chapter => state.notes[chapter.id]?.trim() || state.completed.includes(chapter.id));
  return heading + chapters.map(chapter => {
    const status = state.completed.includes(chapter.id) ? '已学完' : '学习中';
    const note = state.notes[chapter.id]?.trim() || '尚未记录笔记。';
    return `\n## ${chapter.title}\n\n状态：${status}\n\n${note}\n`;
  }).join('');
}

function handbookDownload({ content, filename, type }) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  const releaseDelayMs = 1000;
  setTimeout(() => URL.revokeObjectURL(url), releaseDelayMs);
}

function handbookRoute(hash) {
  const [path, query = ''] = hash.replace(/^#\/?/, '').split('?');
  const parts = path.split('/');
  return { page: parts[0] || 'home', id: parts[1], query: new URLSearchParams(query).get('q') || '' };
}
