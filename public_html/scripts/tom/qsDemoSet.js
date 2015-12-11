var QSDemoSet = function() {

    this.demos = [];

//    jsPlumb.empty(binaryTree.divID);

};

var QSDemo = function(dataSet) {
    this.binaryTree = new BinaryTree(dataSet);
    this.binaryTree.quickSort(this.binaryTree.sortedInts, 0, (this.binaryTree.sortedInts.length - 1));
    console.log("----------- Quicksort function complete--------------------");
    console.log("The sorted array is: " + this.binaryTree.sortedInts);
    this.binaryTree.display();
//    demo.addDataSet(testData[0]);
//    demo.setCanvasParams(config.canvasDivID, config.x, config.y);
//    demo.setFormParams(config.uiDivID, numFields);
//    demo.renderForm();
};

QSDemoSet.prototype.addDemo = function(dataSet) {
    var demo = new QSDemo(dataSet);
    this.demos.push(demo);
};

QSDemoSet.prototype.renderForm = function (n) {
    var numFields;
    
    if (typeof(n) === "undefined") { numFields = this.numFields; }
    else { numFields = n; }
    
    var thisform = "<form id='qsArray' name='qsArray'>";
    var id = "";
    var i;

    for (i = 0; i <= (numFields - 1); i++) {
        id = "value" + i;
        thisform += "<input class='inputVals' type='text' size='2' id='" + id + "'>";
    }
    thisform += "<p>";
    thisform += "<input type = 'text' size = '2' name = 'numFields'>";
    thisform += "</form>";

    thisform += "<button type = 'button' id = 'runButton' onclick='run()'>run</button>";

    thisform += "<button type = 'button' id = 'randButton' onclick='randomize()'>randomize</button>";

    $(this.formJQID).append(thisform);
};

QSDemoSet.prototype.setCanvasParams = function (canvasDivID, x, y) {
    this.canvasDivID = canvasDivID;
    this.canvasX = x;
    this.canvasY = y;
};

QSDemoSet.prototype.setFormParams = function (formDivID, n) {
    this.formDivID = formDivID;
    this.formJQID = "#" + this.formDivID;
    this.numFields = n;
};

function randomize () {
    /* global numFields */
    var i;
    var id;
    
    for (i=0; i<=(numFields-1); i++){
        id = "value" + i;
        document.getElementById(id).value = Math.floor(Math.random() * 100);
    }
};

function run () {
    /* global qsDemoSet */
    var dataSet = [];

    var inputArray = $(".inputVals").toArray();

    inputArray.forEach(function (item) {dataSet.push(parseInt(item.value)); });

    console.log("the data set is: " + dataSet);

    qsDemoSet.addDemo(dataSet);

//    binaryTree = new BinaryTree("quickSortCanvas", 10, 120);
//    jsPlumb.empty(binaryTree.divID);
//
//    // var numFields = config.numFields;
//    var A =[];
//    var i;
//    var id;
//    qsCount = 0;
//
//    
//    for (i=0; i<= (config.numFields - 1); i++){
//        id = "value" + i;
//        A.push(parseInt(document.getElementById(id).value));
//    }
//    
//    console.log("The main array is now: " + A);
//    quickSort(A, 0, (A.length - 1));
//    console.log("---------COMPLETE-----------");
//    console.log("The sorted array is: " + A);
//    binaryTree.display(A);
//    
    


};