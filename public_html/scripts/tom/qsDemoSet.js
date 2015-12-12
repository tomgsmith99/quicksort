var QSDemoSet = function() {

    this.trees = [];
    this.canvasDivID;
    this.canvasX;
    this.canvasY;
    this.formDivID;
};

QSDemoSet.prototype.render = function (btree) {
    /* global jsPlumb */
    jsPlumb.empty(this.canvasDivID);
    $(this.canvasDivIDjq).empty();
    btree.render(this.canvasDivID, this.canvasDivIDjq, this.canvasX, this.canvasY);
};

QSDemoSet.prototype.renderForm = function (n) {
    var numFields;
    var initialArray = this.trees[0].inputArray;

    if (typeof(n) === "undefined") { numFields = this.numFields; }
    else { numFields = n; }
    
    var thisform = "<form id='qsArray' name='qsArray'>";
    var id = "";
    var i;

    for (i = 0; i <= (numFields - 1); i++) {
        id = "value" + i;
        thisform += "<input class='inputVals' type='text' size='2' ";
        thisform += "id='" + id + "' value=" + initialArray[i] + ">";
    }
    thisform += "<p>";
    thisform += "<input type = 'text' size = '2' name = 'numFields'>";
    thisform += "</form>";

    thisform += "<button type = 'button' id = 'runButton' onclick='run()'>run</button>";

    thisform += "<button type = 'button' id = 'randButton' onclick='randomize()'>randomize</button>";

    $(this.formDivIDjq).append(thisform);

};

QSDemoSet.prototype.run = function (dataSet) {
    var binaryTree = new BinaryTree(dataSet);
    binaryTree.runQuickSort();
    binaryTree.build();

    this.trees.push(binaryTree);
    this.render(binaryTree);
};

QSDemoSet.prototype.setCanvasID = function (divID) {
    this.canvasDivID = divID;
    this.canvasDivIDjq = "#" + this.canvasDivID;
};

QSDemoSet.prototype.setFormID = function (divID) {
    this.formDivID = divID;
    this.formDivIDjq = "#" + divID;
};

function randomize () {
    var i;
    var id;
    
    var inputArray = $(".inputVals").toArray();
    var length = inputArray.length;

    for (i=0; i<=(length-1); i++){
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

    qsDemoSet.run(dataSet);
};