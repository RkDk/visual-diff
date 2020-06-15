
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
