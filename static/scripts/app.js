
var AppState = {
  minSpaces: DEFAULT_MIN_SPACES,
  shouldConvertSpacesToTabs: DEFAULT_CONVERT_SPACES_TO_TABS,
  diffData: {},
  editModeOn: true,
  shouldWordWrap: true
};

function syncDOMToAppState () {
  $('#convertSpacesToTabsInput').prop('checked', AppState.shouldConvertSpacesToTabs);
  $('#enableWordWrapInput').prop('checked', AppState.shouldWordWrap);
  $('#minSpacesInput').val(AppState.minSpaces);
}

function updatePageMode (inEditModeOn) {
  AppState.editModeOn = inEditModeOn;
  if (AppState.editModeOn) {
    hideMulti(['#diff-mode', '#diffButton']);
    showMulti(['#input-mode', '#editButton']);
  } else {
    showMulti(['#diff-mode', '#diffButton']);
    hideMulti(['#input-mode', '#editButton']);
  }
}

function togglePageMode () {
  updatePageMode(!AppState.editModeOn);
}

function setEditMode () {
  updatePageMode(true);
}

function setDiffMode () {
  updatePageMode(false);
}

function getDiffApiData () {
  let lBody = $('#lBody').val();
  let rBody = $('#rBody').val();
  const headers = {
    'Content-Type': 'application/json'
  };
  if (AppState.shouldWordWrap) {
    lBody = enforceWordWrapping(lBody);
    rBody = enforceWordWrapping(rBody);
  }
  const data = JSON.stringify({ lBody, rBody });
  $.ajax({
    url: '/diff',
    type: 'post',
    headers,
    data,
    success: function (response) {
      AppState.diffData = response;
      processDiffsFromData(response);
      setDiffMode();
    }
  });
}
