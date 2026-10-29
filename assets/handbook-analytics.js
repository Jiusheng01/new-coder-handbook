class HandbookAnalytics {
  constructor({ document, location, send }) {
    this.document = document;
    this.location = location;
    this.send = send;
    this.previousPage = null;
    this.queue = Promise.resolve();
    this.pages = new Set([
      '/', '/resources', '/notes', '/about', '/search',
      ...HANDBOOK_STAGES.map((stage, index) => `/stage/${index}`),
      ...HANDBOOK_CHAPTERS.map(chapter => `/chapter/${chapter.id}`)
    ]);
  }

  record() {
    // 离线文件阅读不接入统计；在线事件只发送固定页面标识。
    if (!['http:', 'https:'].includes(this.location.protocol)) return;
    const page = this.location.hash.replace(/^#/, '').split('?')[0] || '/';
    if (!this.pages.has(page) || page === this.previousPage) return;
    this.previousPage = page;
    const event = this.createEvent(page);
    this.queue = this.queue.then(() => this.send(event)).catch(error => {
      console.error('访问统计上报失败；本次访问未计入统计，阅读功能不受影响。', error);
    });
  }

  createEvent(page) {
    const bytes = crypto.getRandomValues(new Uint8Array(16));
    const eventId = Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
    const mobileWidth = 768;
    const tabletWidth = 1024;
    const device = innerWidth < mobileWidth ? 'mobile' : innerWidth < tabletWidth ? 'tablet' : 'desktop';
    const referrer = this.document.referrer ? new URL(this.document.referrer).hostname : '';
    return { event_id: eventId, page, referrer, device };
  }

  listen() {
    this.document.addEventListener('handbook:navigation', () => this.record());
  }
}

async function handbookSendVisit(event) {
  const response = await fetch('/analytics/events', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    credentials: 'same-origin', body: JSON.stringify(event), keepalive: true
  });
  if (!response.ok) throw new Error(`统计接口返回 HTTP ${response.status}`);
}

new HandbookAnalytics({ document, location, send: handbookSendVisit }).listen();
