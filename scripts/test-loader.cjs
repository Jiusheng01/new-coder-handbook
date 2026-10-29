const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const files = [
  'content-foundations', 'content-engineering', 'content-retrieval',
  'content-practice', 'handbook-data', 'handbook-render', 'lesson-render', 'handbook-state'
];

function loadHandbook() {
  const context = vm.createContext({ URL, URLSearchParams });
  for (const file of files) {
    vm.runInContext(fs.readFileSync(path.join(root, 'assets', `${file}.js`), 'utf8'), context);
  }
  return vm.runInContext(`({
    chapters: HANDBOOK_CHAPTERS, resources: HANDBOOK_RESOURCES,
    stages: HANDBOOK_STAGES, initial: HANDBOOK_INITIAL_STATE,
    reduce: handbookReduce, parse: handbookParseBackup, backup: handbookBackup,
    escape: handbookEscape, load: handbookLoadState, route: handbookRoute,
    markdown: handbookNotesMarkdown, lesson: lessonPage, home: handbookHome
  })`, context);
}

module.exports = { loadHandbook, root };
