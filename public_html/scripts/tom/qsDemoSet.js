var QSDemoSet = function() {
    this.trees = [];
    this.canvasDivID;
    this.canvasX;
    this.canvasY;
    this.formDivID;
    this.cellWidth = null; // determined at runtime
};

QSDemoSet.prototype.render = function (btree) {
    /* global jsPlumb */
    jsPlumb.empty(this.canvasDivID);
    $(this.canvasDivIDjq).empty();
    btree.render(this.canvasDivID, this.canvasDivIDjq);
};

QSDemoSet.prototype.renderForm = function (n) {
    var thisform = "<form id='qsArray'></form>";

    thisform += "<p class ='form'>";
    thisform += "<button type = 'button' id = 'runButton' onclick='run()'>run</button>";
    thisform += "<button type = 'button' id = 'randButton' onclick='randomize()'>randomize</button>";
    thisform += "Number of fields: <input type = 'text' size = '2' id = 'numFields'>";
    thisform += "<button type = 'button' id = 'numButton' onclick='updateFields()'>update</button>";
    thisform += "</p>";

    $(this.formDivIDjq).append(thisform);
    updateFields(this.trees[0].inputArray);
};

QSDemoSet.prototype.run = function (dataSet) {
    var binaryTree = new BinaryTree(dataSet);
    binaryTree.runQuickSort();
    binaryTree.build();

    this.trees.push(binaryTree);
    this.render(binaryTree, "table");
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

    // error-checking input
    inputArray.forEach(function (item) {
        if (item.value !== "") {
            var finalVal = parseInt(item.value);
            console.log("item value is " + item.value + " and finalVal is: "+ finalVal);
            if (isNaN(finalVal)) {}
            else {
                if (finalVal > qsDemoSet.maxVal) {
                    console.log("maxVal for input exceeded, changing " + finalVal + " to " + qsDemoSet.maxVal);
                    finalVal = qsDemoSet.maxVal;
                }
                else if (finalVal < qsDemoSet.minVal) {
                    console.log("minVal for input exceeded, changing" + finalVal + " to " + qsDemoSet.minVal);
                    finalVal = qsDemoSet.minVal;
                }
                dataSet.push(finalVal);
            }
        }
    });

    console.log("the data set is: " + dataSet);
    qsDemoSet.run(dataSet);
};

function updateFields(dataSet) {
    var numFields;
    var i;
    var fields = "";
    var id;
    
    if (dataSet !== undefined) {
        for (i = 0; i <= (dataSet.length - 1); i++) {
            id = "value" + i;
            fields += "<input class='inputVals' type='text' size='2' ";
            fields += "id='" + id + "' value=" + dataSet[i] + ">";
        }
    }
    else {
        if (document.getElementById("numFields").value !== "") {
            numFields = document.getElementById("numFields").value;
        }
        else { numFields = qsDemoSet.numFields; }

        for (i = 0; i <= (numFields - 1); i++) {
            id = "value" + i;
            fields += "<input class='inputVals' type='text' size='2' ";
            fields += "id='" + id + "'>";
        }
    }
    $("#qsArray").html(fields);
}