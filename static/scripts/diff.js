const TYPE_UNCHANGED_LINE = 1;
const TYPE_CHANGED_LINE = 2;
const TYPE_OFFSET_LINE = 3;

function convertSpacesToTabs (part, minSpaces = DEFAULT_MIN_SPACES) {
  const matching = ` {${minSpaces}}`;
  const regEx = new RegExp(matching, 'g');
  return part.replace(regEx, '\t');
}

function convertTabsToSpans (part) {
  return part.replace(/\t/g, '<span id="tab-block" class="tab-block"></span>');
}

function formatLinePart (part) {
  const {
    shouldConvertSpacesToTabs,
    minSpaces
  } = AppState;
  const cleanedPart = escapeHtml(part);

  return convertTabsToSpans(
    shouldConvertSpacesToTabs ? convertSpacesToTabs(cleanedPart, minSpaces) : cleanedPart
  );
}

function processDiff (diffLines) {
  const diff1Lines = [];
  const diff2Lines = [];
  let diff1Line = { lineOffset: null, parts: [] };
  let diff2Line = { lineOffset: null, parts: [] };

  let line1Marker = 1;
  let totalLine1Offset = 0;
  let line2Marker = 1;
  let totalLine2Offset = 0;

  diffLines.forEach(part => {
    const [type, value] = part;
    const newlineCount = (value.match(/\n/g) || []).length;
    const lines = value.split('\n');

    if (lines.length > 1 && !lines[lines.length - 1].length) {
      lines.pop();
    }

    lines.forEach((linePart, index) => {
      const line = linePart.length ? formatLinePart(linePart) : ' ';
      if (type === -1) {
        diff1Line.parts.push({ type, line });
        if (index < newlineCount) {
          diff1Line.lineMarker = line1Marker++;
          if (diff1Line.lineOffset === null) {
            diff1Line.lineOffset = 0;
          }
          diff1Lines.push(diff1Line);
          diff1Line = { lineOffset: null, parts: [] };
        }
      } else if (type === 1) {
        diff2Line.parts.push({ type, line });
        if (index < newlineCount) {
          diff2Line.lineMarker = line2Marker++;
          if (diff2Line.lineOffset === null) {
            diff2Line.lineOffset = 0;
          }
          diff2Lines.push(diff2Line);
          diff2Line = { lineOffset: null, parts: [] };
        }
      } else {
        const n = { type, line };
        diff1Line.parts.push(n);
        diff2Line.parts.push(n);
        if (diff1Line.lineOffset === null) {
          if (line2Marker + totalLine2Offset > line1Marker + totalLine1Offset) {
            diff1Line.lineOffset = (line2Marker + totalLine2Offset) - (line1Marker + totalLine1Offset);
            totalLine1Offset += diff1Line.lineOffset;
          } else {
            diff1Line.lineOffset = 0;
          }
        }
        if (diff2Line.lineOffset === null) {
          if (line1Marker + totalLine1Offset > line2Marker + totalLine2Offset) {
            diff2Line.lineOffset = (line1Marker + totalLine1Offset) - (line2Marker + totalLine2Offset);
            totalLine2Offset += diff2Line.lineOffset;
          } else {
            diff2Line.lineOffset = 0;
          }
        }
        if (index < newlineCount) {
          diff1Line.lineMarker = line1Marker++;
          diff2Line.lineMarker = line2Marker++;
          diff1Lines.push(diff1Line);
          diff2Lines.push(diff2Line);
          diff1Line = { lineOffset: null, parts: [] };
          diff2Line = { lineOffset: null, parts: [] };
        }
      }
    });
  });
  diff1Line.lineMarker = line1Marker;
  diff2Line.lineMarker = line2Marker;
  diff1Lines.push(diff1Line);
  diff2Lines.push(diff2Line);
  return { diff1Lines, diff2Lines };
}

function getLeftStyleContext () {
  return {
    changeHighlightClass: 'line-part-remove',
    lineChangedClass: 'line-content-changed-remove',
    lineContentPrefix: '-'
  };
}

function getRightStyleContext () {
  return {
    changeHighlightClass: 'line-part-add',
    lineChangedClass: 'line-content-changed-add',
    lineContentPrefix: '+'
  };
}

function createLinePartHtml (styleContext, type, linePart) {
  if (type !== 0) {
    return `<span class="${styleContext.changeHighlightClass}">${linePart}</span>`;
  }
  return linePart;
}

function getLineStyleClass (styleContext, lineType) {
  switch (lineType) {
    case TYPE_UNCHANGED_LINE:
      return 'line-content line-content-unchanged';
    case TYPE_CHANGED_LINE:
      return `line-content ${styleContext.lineChangedClass}`;
    case TYPE_OFFSET_LINE:
      return 'line-content line-content-offset';
    default:
      return 'line-content';
  }
}

function getLineContentPrefixHtml (styleContext, lineType) {
  switch (lineType) {
    case TYPE_CHANGED_LINE:
      return `<span class="line-content-prefix">${styleContext.lineContentPrefix}</span>`;
    default:
      return '<span class="line-content-prefix">&nbsp;</span>';
  }
}

function createLineContentHtml (styleContext, lineType, lineHtml) {
  const lineStyleClass = getLineStyleClass(styleContext, lineType);
  const lineContentPrefixHtml = getLineContentPrefixHtml(styleContext, lineType);
  return `<div class="col h-100 ${lineStyleClass}">${lineContentPrefixHtml}${lineHtml}</div>`;
}

function createLineMarkerHtml (styleContext, lineMarker) {
  return ` <div class="col h-100 line-marker">${lineMarker}</div>`;
}

function createLineRowHtml (styleContext, lineType, lineMarker = '&nbsp', lineHtml = '') {
  const lineMarkerHtml = createLineMarkerHtml(styleContext, lineMarker);
  const lineContentHtml = createLineContentHtml(styleContext, lineType, lineHtml);
  return `
    <div class="row line-row-wrapper">
        ${lineMarkerHtml}
        ${lineContentHtml}
    </div>
      `;
}

function createLineOffsetHtml (styleContext, offsetCount) {
  let lineOffset = '';
  for (let i = 0; i < offsetCount; i++) {
    lineOffset += createLineRowHtml(styleContext, TYPE_OFFSET_LINE);
  }
  return lineOffset;
}

function createLineHtml (styleContext, offsetCount, lineType, lineMarker, lineHtml) {
  const offsetHtml = createLineOffsetHtml(styleContext, offsetCount);
  const lineRowHtml = createLineRowHtml(styleContext, lineType, lineMarker, lineHtml);
  return offsetHtml + lineRowHtml + '\n';
}

function createDiffHtmlSection (styleContext, diffLines, diffType) {
  return diffLines.reduce((body, line) => {
    const parts = line.parts.filter(v => v.type === 0 || v.type === diffType);
    if (!parts.length) {
      return body;
    }
    let lineHtml = '';
    let hasChange = false;
    parts.forEach(({ type, line }) => {
      if (type === diffType) {
        hasChange = true;
      }
      lineHtml += createLinePartHtml(styleContext, type, line);
    });
    const lineType = hasChange ? TYPE_CHANGED_LINE : TYPE_UNCHANGED_LINE;
    return body + createLineHtml(styleContext, line.lineOffset, lineType, line.lineMarker, lineHtml);
  }, '');
}

function createDiffHtml (diffData) {
  const { diff1Lines, diff2Lines } = diffData;

  const diff1Html = createDiffHtmlSection(getLeftStyleContext(), diff1Lines, -1);
  const diff2Html = createDiffHtmlSection(getRightStyleContext(), diff2Lines, 1);

  return { diff1Html, diff2Html };
}

function setDiffHtml (diffHtml) {
  const { diff1Html, diff2Html } = diffHtml;

  $('#lDiff').html(diff1Html);
  $('#rDiff').html(diff2Html);
}

function processDiffsFromData (data) {
  const diffData = processDiff(data);
  const diffHtml = createDiffHtml(diffData);
  setDiffHtml(diffHtml);
}
