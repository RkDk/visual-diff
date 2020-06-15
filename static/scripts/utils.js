const escapeMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '/': '&#x2F;',
  '`': '&#x60;',
  '=': '&#x3D;'
};

function escapeHtml (string) {
  return String(string).replace(/[&<>"'`=\/]/g, s => escapeMap[s]);
}

function showMulti (ids) {
  ids.forEach(id => $(id).show());
}

function hideMulti (ids) {
  ids.forEach(id => $(id).hide());
}
