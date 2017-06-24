
function addRowToTable(tableIdentifier,makeRow,rowIndex)
{
    var rowHTML = makeRow({rowNumber:rowIndex})
    $(tableIdentifier).append(rowHTML);
}

$(document).ready(function(){
debugger;
  var _gFromRowIndex = 0;
  var _gToRowIndex = 0;
  var _gFromTableTemplate = $('#fromTableTemplate').html();
  var _gToTableTemplate = $('#toTableTemplate').html();
  var _gFromMakeRow = Handlebars.compile(_gFromTableTemplate);
  var _gToMakeRow = Handlebars.compile(_gToTableTemplate);
  
  // rowHTML is the same thing as the template but with the row number

  // inserting rows
  addRowToTable('.originating-table',_gFromMakeRow,++_gFromRowIndex);
  addRowToTable('.receiving-table',_gToMakeRow,++_gToRowIndex);

  $("#originating").click(function() {
    addRowToTable('.originating-table',_gFromMakeRow);
  });

  $("#receiving").click(function() {
    addRowToTable('.receiving-table',_gToMakeRow);
  });

  // deleting rows

  $("#originating-delete").click(function() {
    console.log("Delete has been clicked")
    $('.originating-table tr:last').remove();
    i--;
  });

  $("#receiving-delete").click(function() {
    console.log("Delete has been clicked")
    $('.receiving-table tr:last').remove();
    j--;
  });
});
