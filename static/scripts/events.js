function updatePageMode (inEditModeOn) {
  editModeOn = inEditModeOn;
  if (editModeOn) {
    hideMulti(['#diff-mode', '#diffButton']);
    showMulti(['#input-mode', '#editButton']);
  } else {
    showMulti(['#diff-mode', '#diffButton']);
    hideMulti(['#input-mode', '#editButton']);
  }
}

function onInputSpacesChange () {
  AppState.minSpaces = $('#minSpacesInput').val();
  if (!editModeOn) {
    processDiffsFromData(AppState.diffData);
  }
}

function onConvertSpaceToggle (event) {
  const toggleControlValue = $('#convertSpacesToTabsInput').prop('checked');
  AppState.shouldConvertSpacesToTabs = toggleControlValue;
  if (toggleControlValue) {
    $('#inputSpacesForm').show();
  } else {
    $('#inputSpacesForm').hide();
  }
  if (!editModeOn) {
    processDiffsFromData(AppState.diffData);
  }
}
