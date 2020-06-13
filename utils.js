const TextDiff = require('text-diff');

function getDiff (lBody, rBody) {
  const textDiffer = new TextDiff();
  return textDiffer.main(lBody, rBody);
}

module.exports = { getDiff };
