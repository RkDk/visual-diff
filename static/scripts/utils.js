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

function enforceWordWrapping (text) {
  const lines = text.split('\n');
  let wrappedText = '';
  lines.forEach((line, index) => {
    let lineLen = 0;
    const indent = line.match(/^( |\t)*/)[0];
    const words = line.replace(/ {2,}/g, '').split(' ');
    wrappedText += indent;
    words.forEach(word => {
      const nextPart = ((lineLen ? ' ' : '') + word);
      wrappedText += nextPart;
      lineLen += nextPart.length;
      if (lineLen > 80) {
        wrappedText += '\n' + indent;
        lineLen = 0;
      }
    });
    if (index + 1 < lines.length) {
      wrappedText += '\n';
    }
  });
  return wrappedText;
}
