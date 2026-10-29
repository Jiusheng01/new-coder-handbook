const HANDBOOK_RESOURCES = Object.freeze({
  original: { title: '原帖 · 后端转 Agent 的学习与面试复盘', url: 'https://linux.do/t/topic/3054536', kind: '原帖', note: '正文由用户提供；公开访问当前返回 404，可能需要登录或权限。' },
  book: { title: '李博杰 · 深入理解 AI Agent', url: 'https://github.com/bojieli/ai-agent-book', kind: '开源书' },
  book1: { title: '深入理解 AI Agent · 第 1 章：整体认知', url: 'https://github.com/bojieli/ai-agent-book/blob/main/book/chapter1.md', kind: '开源书' },
  book2: { title: '深入理解 AI Agent · 第 2 章：上下文', url: 'https://github.com/bojieli/ai-agent-book/blob/main/book/chapter2.md', kind: '开源书' },
  book3: { title: '深入理解 AI Agent · 第 3 章：记忆与 RAG', url: 'https://github.com/bojieli/ai-agent-book/blob/main/book/chapter3.md', kind: '开源书' },
  book4: { title: '深入理解 AI Agent · 第 4 章：工具与 MCP', url: 'https://github.com/bojieli/ai-agent-book/blob/main/book/chapter4.md', kind: '开源书' },
  'lilian-agent': { title: 'Lil’Log · LLM Powered Autonomous Agents', url: 'https://lilianweng.github.io/posts/2023-06-23-agent/', kind: '文章' },
  'lilian-prompt': { title: 'Lil’Log · Prompt Engineering', url: 'https://lilianweng.github.io/posts/2023-03-15-prompt-engineering/', kind: '文章' },
  '3b1b5': { title: '3Blue1Brown · Transformers（第 5 章）', url: 'https://www.youtube.com/watch?v=wjZofJX0v4M', kind: '视频' },
  '3b1b6': { title: '3Blue1Brown · Attention（第 6 章）', url: 'https://www.youtube.com/watch?v=eMlx5fFNoYc', kind: '视频' },
  '3b1b7': { title: '3Blue1Brown · LLMs store facts（第 7 章）', url: 'https://www.youtube.com/watch?v=9-Jl0dxWQs8', kind: '视频' },
  'llm-visual': { title: 'LLM Visualization · 交互式模型可视化', url: 'https://bbycroft.net/llm', kind: '可视化' },
  'llm-course': { title: 'mlabonne · LLM Course', url: 'https://github.com/mlabonne/llm-course', kind: '课程' },
  nano: { title: 'sanbuphy · nanoAgent', url: 'https://github.com/sanbuphy/nanoAgent', kind: '源码' },
  'learn-claude': { title: 'Learn Claude Code · 教学实现', url: 'https://github.com/shareAI-lab/learn-claude-code', kind: '源码' },
  'react-paper': { title: 'ReAct: Synergizing Reasoning and Acting', url: 'https://arxiv.org/abs/2210.03629', kind: '论文' },
  'mcp-spec': { title: 'MCP 官方文档 · 架构与协议', url: 'https://modelcontextprotocol.io/docs/learn/architecture', kind: '官方' },
  'mcp-beginners': { title: 'Microsoft · MCP for Beginners（中文）', url: 'https://github.com/microsoft/mcp-for-beginners/blob/main/translations/zh-CN/README.md', kind: '课程' },
  jsonrpc: { title: 'JSON-RPC 2.0 Specification', url: 'https://www.jsonrpc.org/specification', kind: '规范' },
  langchain: { title: 'LangChain · Overview', url: 'https://docs.langchain.com/oss/python/langchain/overview', kind: '官方' },
  'lc-tools': { title: 'LangChain · Tools', url: 'https://docs.langchain.com/oss/python/langchain/tools', kind: '官方' },
  'lc-middleware': { title: 'LangChain · Middleware', url: 'https://docs.langchain.com/oss/python/langchain/middleware/overview', kind: '官方' },
  langgraph: { title: 'LangGraph · Overview', url: 'https://docs.langchain.com/oss/python/langgraph/overview', kind: '官方' },
  'graph-memory': { title: 'LangGraph · Memory', url: 'https://docs.langchain.com/oss/python/langgraph/add-memory', kind: '官方' },
  'graph-persistence': { title: 'LangGraph · Persistence', url: 'https://docs.langchain.com/oss/python/langgraph/persistence', kind: '官方' },
  'graph-interrupts': { title: 'LangGraph · Interrupts', url: 'https://docs.langchain.com/oss/python/langgraph/interrupts', kind: '官方' },
  langsmith: { title: 'LangSmith · 可观测性与评估', url: 'https://docs.langchain.com/langsmith/home', kind: '官方' },
  'context-engineering': { title: 'Anthropic · Effective context engineering for AI agents', url: 'https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents', kind: '文章' },
  'all-in-rag': { title: 'All-in-RAG · RAG 技术全栈指南', url: 'https://github.com/datawhalechina/all-in-rag', kind: '课程' },
  'llama-rag': { title: 'LlamaIndex · Advanced RAG Cheat Sheet', url: 'https://www.llamaindex.ai/blog/a-cheat-sheet-and-some-recipes-for-building-advanced-rag-803a9d94c41b', kind: '文章' },
  chroma: { title: 'Chroma · 官方文档', url: 'https://docs.trychroma.com/docs/overview/introduction', kind: '官方' },
  milvus: { title: 'Milvus · 中文文档', url: 'https://milvus.io/docs/zh', kind: '官方' },
  hnsw: { title: 'Pinecone · HNSW 图索引详解', url: 'https://www.pinecone.io/learn/series/faiss/hnsw/', kind: '文章' },
  'ivf-flat': { title: 'Milvus · IVF_FLAT', url: 'https://milvus.io/docs/zh/ivf-flat.md', kind: '官方' },
  'ivf-pq': { title: 'Milvus · IVF_PQ', url: 'https://milvus.io/docs/zh/ivf-pq.md', kind: '官方' },
  'agent-skills': { title: 'Agent Skills · 能力包概览', url: 'https://agentskills.io/what-are-skills', kind: '规范' },
  'skills-spec': { title: 'Agent Skills · Specification', url: 'https://agentskills.io/specification', kind: '规范' },
  'lc-multi': { title: 'LangChain · Multi-agent', url: 'https://docs.langchain.com/oss/python/langchain/multi-agent', kind: '官方' },
  'multi-patterns': { title: 'Claude · Multi-agent coordination patterns', url: 'https://claude.com/resources/articles/multi-agent-coordination-patterns', kind: '文章' },
  'agent-evals': { title: 'Anthropic · Demystifying evals for AI agents', url: 'https://www.anthropic.com/research/demystifying-evals-for-ai-agents', kind: '文章' }
});

const HANDBOOK_STAGES = Object.freeze([
  { title: '建立认知', caption: '先看清全貌', icon: 'compass', color: 'sage' },
  { title: '拆开 Agent', caption: '亲手接好骨架', icon: 'plug', color: 'blue' },
  { title: '走向工程', caption: '从循环到工作流', icon: 'branch', color: 'peach' },
  { title: '知识与检索', caption: '让答案有据可依', icon: 'search', color: 'sage' },
  { title: '能力与评估', caption: '把效果说清楚', icon: 'check', color: 'yellow' },
  { title: '求职与复盘', caption: '带着作品出发', icon: 'compass', color: 'blue' }
]);

const HANDBOOK_CHAPTERS = Object.freeze([
  ...FOUNDATION_CHAPTERS, ...ENGINEERING_CHAPTERS,
  ...RETRIEVAL_CHAPTERS, ...PRACTICE_CHAPTERS
]);

const HANDBOOK_STORAGE_KEY = 'agent-handbook:v1';
const HANDBOOK_SOURCE_URL = 'https://linux.do/t/topic/3054536';
const HANDBOOK_INITIAL_STATE = Object.freeze({ completed: [], bookmarks: [], tasks: {}, answers: {}, notes: {}, lastChapter: null });
