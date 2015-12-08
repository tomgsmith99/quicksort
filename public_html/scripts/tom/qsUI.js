
function renderUI(divID, numFields) {
    var jqDivID = "#" + divID;
    $(jqDivID).append(getQSvaluesForm(numFields));

};


function getQSvaluesForm(numFields) {
    var thisform = "<form id='qsArray' name='qsArray'>";
    var id = "";
    var i;

    for (i = 0; i <= (numFields - 1); i++) {
        name = "value" + i;
        thisform += "<input class='input' type='text' size='2' id='" + id + "'>";
    }
    thisform += "<button type = 'button' id = 'submitValues' onclick='run()'>run</button>";
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

function run() {

    binaryTree = new BinaryTree("quickSortCanvas", 10, 120);
    jsPlumb.empty(binaryTree.divID);

    var A =[];
    var i;
    var id;
    qsCount = 0;
    
    for (i=0; i<=9; i++){
        id = "value" + i;
        A.push(parseInt(document.getElementById(id).value));
    }
    
    console.log("The main array is now: " + A);
    quickSort(A, 0, (A.length - 1));
    console.log("---------COMPLETE-----------");
    console.log("The sorted array is: " + A);
    binaryTree.display(A);

}