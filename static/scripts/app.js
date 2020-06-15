
var AppState = {
  minSpaces: DEFAULT_MIN_SPACES,
  shouldConvertSpacesToTabs: DEFAULT_CONVERT_SPACES_TO_TABS,
  diffData: {},
  editModeOn: true
};

function syncDOMToAppState () {
  $('#convertSpacesToTabsInput').prop('checked', AppState.shouldConvertSpacesToTabs);
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
  const lBody = $('#lBody').val();
  const rBody = $('#rBody').val();
  const headers = {
    'Content-Type': 'application/json'
  };
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
