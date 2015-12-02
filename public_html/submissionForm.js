
function getQSvaluesForm() {
    var thisform = "<form name='initialArray'>";
    var name = "";
    var i;

    for (i = 0; i <= 9; i++) {
        name = "value" + i;
        thisform += "<input type='text' size='2' name='" + name + "'>";
    }
    
    thisform += "</form>";
    return thisform;
}