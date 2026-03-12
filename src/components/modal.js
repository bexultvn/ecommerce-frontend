export function showModal({ title, body, onConfirm }) {
  const container = document.getElementById('modal-container');
  if (!container) return;

  container.innerHTML = `
    <div id="modal-overlay" class="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h2 class="text-xl font-bold mb-4">${title}</h2>
        <div class="mb-6 text-gray-700">${body}</div>
        <div class="flex gap-3 justify-end">
          <button id="modal-cancel" class="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 text-sm font-medium">
            Cancel
          </button>
          <button id="modal-confirm" class="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 text-sm font-medium">
            Confirm
          </button>
        </div>
      </div>
    </div>
  `;

  document.getElementById('modal-cancel').addEventListener('click', hideModal);
  document.getElementById('modal-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-overlay') hideModal();
  });

  document.getElementById('modal-confirm').addEventListener('click', () => {
    if (typeof onConfirm === 'function') onConfirm();
    hideModal();
  });
}

export function hideModal() {
  const container = document.getElementById('modal-container');
  if (container) container.innerHTML = '';
}
