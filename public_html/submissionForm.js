
function getQSvaluesForm() {
    var thisform = "<form id='qsArray' name='qsArray'>";
    var name = "";
    var i;

    for (i = 0; i <= 9; i++) {
        name = "value" + i;
        thisform += "<input class='input' type='text' size='2' id='" + name + "'>";
    }
    thisform += "<button type = 'button' id = 'submitValues'>run</button>";
    thisform += "<button type = 'button' id = 'randButton' onclick='randomize()'>randomize</button>";

    thisform += "</form>";
    
    return thisform;
}

function randomize() {
    var i;
    var id;
    
    for (i=0; i<=9; i++){
        id = "value" + i;
        document.getElementById(id).value = Math.floor(Math.random() * 100);
    }
}