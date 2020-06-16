const TextDiff = require('text-diff');

function getDiff (lBody, rBody) {
  const textDiffer = new TextDiff();
  const diff = textDiffer.main(lBody, rBody);
  textDiffer.cleanupSemantic(diff);
  return diff;
}

module.exports = { getDiff };
