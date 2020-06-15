
function onWordWrapToggle () {
  const toggleControlValue = $('#enableWordWrapInput').prop('checked');
  AppState.shouldWordWrap = toggleControlValue;
  if (!AppState.editModeOn) {
    getDiffApiData();
  }
}

function onInputSpacesChange () {
  AppState.minSpaces = $('#minSpacesInput').val();
  if (!AppState.editModeOn) {
    processDiffsFromData(AppState.diffData);
  }
}

function onConvertSpaceToggle () {
  const toggleControlValue = $('#convertSpacesToTabsInput').prop('checked');
  AppState.shouldConvertSpacesToTabs = toggleControlValue;
  if (toggleControlValue) {
    $('#inputSpacesForm').show();
  } else {
    $('#inputSpacesForm').hide();
  }
  if (!AppState.editModeOn) {
    processDiffsFromData(AppState.diffData);
  }
}
