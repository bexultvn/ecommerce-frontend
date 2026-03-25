export function showModal({ title, body, onConfirm, confirmLabel = 'Confirm', danger = false }) {
  const container = document.getElementById('modal-container');
  if (!container) return;

  container.innerHTML = `
    <div id="modal-overlay" class="fixed inset-0 z-50 flex items-center justify-center p-4"
         style="background:rgba(0,0,0,0.45);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);">
      <div id="modal-box" class="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
           style="transform:scale(0.92) translateY(8px);opacity:0;transition:transform 0.3s cubic-bezier(0.34,1.56,0.64,1),opacity 0.2s ease;">

        <!-- Header -->
        <div class="px-6 pt-6 pb-4 flex items-start justify-between gap-4">
          <div>
            <h2 class="text-base font-bold text-gray-900">${title}</h2>
            <div class="text-sm text-gray-500 mt-1 leading-relaxed">${body}</div>
          </div>
          <button id="modal-x" class="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all mt-0.5">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <!-- Actions -->
        <div class="flex gap-3 px-6 pb-6 justify-end">
          <button id="modal-cancel"
                  class="px-5 py-2.5 text-sm font-medium border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button id="modal-confirm"
                  class="px-5 py-2.5 text-sm font-semibold rounded-xl text-white transition-all hover:-translate-y-0.5 ${danger
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-gray-900 hover:bg-gray-800'}"
                  style="box-shadow:0 4px 14px rgba(${danger ? '239,68,68' : '17,24,39'},0.25);">
            ${confirmLabel}
          </button>
        </div>
      </div>
    </div>
  `;

  // Animate in
  requestAnimationFrame(() => requestAnimationFrame(() => {
    const box = document.getElementById('modal-box');
    if (box) { box.style.transform = 'scale(1) translateY(0)'; box.style.opacity = '1'; }
  }));

  const close = () => hideModal();
  document.getElementById('modal-cancel').addEventListener('click', close);
  document.getElementById('modal-x').addEventListener('click', close);
  document.getElementById('modal-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-overlay') close();
  });
  document.getElementById('modal-confirm').addEventListener('click', () => {
    if (typeof onConfirm === 'function') onConfirm();
    close();
  });
}

export function hideModal() {
  const container = document.getElementById('modal-container');
  if (!container) return;
  const box = document.getElementById('modal-box');
  if (box) {
    box.style.transform = 'scale(0.92) translateY(8px)';
    box.style.opacity = '0';
    box.style.transition = 'transform 0.2s ease-in,opacity 0.15s ease';
    setTimeout(() => { container.innerHTML = ''; }, 220);
  } else {
    container.innerHTML = '';
  }
}
