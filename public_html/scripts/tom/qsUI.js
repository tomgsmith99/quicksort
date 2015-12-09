
var qsUI = function(divID, numFields) {
    this.divID = divID;
    this.jqDivID = "#" + this.divID;

    this.numFields = numFields;
};

function renderUI(divID, numFields) {
    var qsui = new qsUI(divID, numFields);

    $(qsui.jqDivID).append(qsui.getQSvaluesForm(numFields));

};

qsUI.prototype.getQSvaluesForm = function() {
    var thisform = "<form id='qsArray' name='qsArray'>";
    var id = "";
    var i;

    for (i = 0; i <= (this.numFields - 1); i++) {
        id = "value" + i;
        thisform += "<input class='input' type='text' size='2' id='" + id + "'>";
    }
    thisform += "<p>";
    thisform += "<input type = 'text' size = '2' name = 'numFields'>";
    thisform += "</form>";

    thisform += "<button type = 'button' id = 'runButton' onclick='run()'>run</button>";
    thisform += "<button type = 'button' id = 'randButton' onclick='randomize()'>randomize</button>";

    
    return thisform;
};

// qsUI.prototype.randomize = function() {
function randomize () {
    var i;
    var id;
    
    for (i=0; i<=9; i++){
        id = "value" + i;
        document.getElementById(id).value = Math.floor(Math.random() * 100);
    }
};

function run () {

    binaryTree = new BinaryTree("quickSortCanvas", 10, 120);
    jsPlumb.empty(binaryTree.divID);

    // var numFields = config.numFields;
    var A =[];
    var i;
    var id;
    qsCount = 0;
    
    for (i=0; i<= (config.numFields - 1); i++){
        id = "value" + i;
        A.push(parseInt(document.getElementById(id).value));
    }
    
    console.log("The main array is now: " + A);
    quickSort(A, 0, (A.length - 1));
    console.log("---------COMPLETE-----------");
    console.log("The sorted array is: " + A);
    binaryTree.display(A);

};