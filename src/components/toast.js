const CONFIGS = {
  success: {
    icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>`,
    iconClass: 'bg-emerald-50 text-emerald-500',
    bar: '#10b981',
    border: '#d1fae5',
  },
  error: {
    icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/></svg>`,
    iconClass: 'bg-red-50 text-red-500',
    bar: '#ef4444',
    border: '#fee2e2',
  },
  info: {
    icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
    iconClass: 'bg-blue-50 text-blue-500',
    bar: '#3b82f6',
    border: '#dbeafe',
  },
};

export function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const c = CONFIGS[type] || CONFIGS.info;
  const DURATION = 3500;

  const toast = document.createElement('div');
  toast.style.cssText = `
    position:relative;
    display:flex;
    align-items:center;
    gap:12px;
    background:white;
    border:1px solid ${c.border};
    border-radius:16px;
    box-shadow:0 8px 24px rgba(0,0,0,0.10),0 2px 6px rgba(0,0,0,0.06);
    padding:12px 14px;
    min-width:280px;
    max-width:360px;
    overflow:hidden;
    transform:translateX(110%);
    opacity:0;
    transition:transform 0.4s cubic-bezier(0.34,1.56,0.64,1),opacity 0.25s ease;
    cursor:default;
  `;

  toast.innerHTML = `
    <div style="width:34px;height:34px;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;" class="${c.iconClass}">${c.icon}</div>
    <p style="font-size:13px;font-weight:500;color:#1f2937;flex:1;line-height:1.4;">${message}</p>
    <button aria-label="Dismiss" style="flex-shrink:0;background:none;border:none;cursor:pointer;padding:2px;color:#d1d5db;display:flex;align-items:center;border-radius:6px;transition:color 0.15s;" onmouseover="this.style.color='#6b7280'" onmouseout="this.style.color='#d1d5db'">
      <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
    </button>
    <div class="toast-bar" style="position:absolute;bottom:0;left:0;height:2px;width:100%;background:${c.bar};border-radius:0 0 16px 16px;transition:width ${DURATION}ms linear;"></div>
  `;

  container.appendChild(toast);

  // Slide in
  requestAnimationFrame(() => requestAnimationFrame(() => {
    toast.style.transform = 'translateX(0)';
    toast.style.opacity = '1';
    const bar = toast.querySelector('.toast-bar');
    if (bar) requestAnimationFrame(() => { bar.style.width = '0%'; });
  }));

  const dismiss = () => {
    toast.style.transform = 'translateX(110%)';
    toast.style.opacity = '0';
    toast.style.transition = 'transform 0.3s ease-in,opacity 0.2s ease';
    setTimeout(() => toast.remove(), 320);
  };

  const timer = setTimeout(dismiss, DURATION);
  toast.querySelector('button').addEventListener('click', () => { clearTimeout(timer); dismiss(); });
}
