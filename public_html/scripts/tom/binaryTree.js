var BinaryTree = function(inputArray) {
    this.inputArray = inputArray;
    this.sortedInts = inputArray; // array of ints, the result of the quicksort
    this.qsCount = 0; // a counter to stop runaway while looops
    
    this.leaves = []; // array of leaves, in the order in which they were created
    this.flatArray = []; // array of leaves, ordered by horizontal position
                            // in the tree
    this.html = "";
};

BinaryTree.prototype.runQuickSort = function() {
    this.quickSort(this.sortedInts, 0, (this.sortedInts.length - 1));
};

BinaryTree.prototype.quickSort = function (A, left, right) {
    var pivot;

    this.qsCount++;

    if (this.qsCount > 100) { throw new Error("too many qs loops"); }
    console.log("----------QSBEGIN----------");
    console.log("Starting a qs function.");
    console.log("Iteration number: " + this.qsCount);
    console.log("The left index is: " + left);
    console.log("The right index is: " + right);

    if (left < right) {
        console.log("left is < right.");
        console.log("starting the partition function.");
        pivot = this.partition(A, left, right);
        console.log("partition function complete.");
        console.log("result of partition function - pivot index is: " + pivot);
        this.quickSort (A, left, (pivot-1));
        this.quickSort (A, (pivot+1), right);
    }
    else if (left === right) { // Note: this clause is not needed for qs!
        console.log("Nope. This partition is a singleton: " + A[left]);
        var leaf = new Leaf();
        leaf.setArray("pre", A.slice(left, left+1));
        leaf.setArray("post", A.slice(left, left+1));
        this.addLeaf(leaf);
    }
    else { console.log("right > left, so we are done!"); } // also unnecessary
};

BinaryTree.prototype.partition = function (A, left, right){
    var pivot = A[left];
    var i = left;
    var j;
    var temp;

    // Store the subarray in the binary tree
    // this procedure is not necessary for quicksort
    var leaf = new Leaf();
    this.addLeaf(leaf);
    leaf.setArray("pre", A.slice(left, (right + 1)));

    console.log("--------PBEGIN------------");
    console.log("This is the partition we are going to work on:");

    printSubArray(A, left, right);

    for (j = left; j <= right; j++){
        console.log("beginning state, at top of loop: ");
        printSubArray(A, left, right);

        console.log("The index of j is: " + j);
        console.log("The index of i is: " + i);
        console.log("Comparing A[" + j + "] (" + A[j] + ") to the pivot value: " + pivot);

        if (A[j] <= pivot) {
            console.log("A[j] is less than or equal to the pivot, so we are going to swap A[j] " + A[j] + " with A[i]: " + A[i]);

            temp = A[j];
            A[j] = A[i];
            A[i] = temp;

            console.log("end state, at bottom of loop:");
            printSubArray(A, left, right);

            i = i + 1;
        }
        else { 
            console.log("A[j] is greater than the pivot value, so no values were swapped.");
            console.log("A[j] is: " + A[j] + " and the pivot is: " + pivot);
            console.log("The type of A[j] is: " + typeof(A[j]) + " and the type of pivot is: " + typeof(pivot));
        }

        console.log("i is now: " + i);
        console.log("-----------------");
    }

    console.log("For loop complete. Swapping the A[i-1] value " + A[i-1] + " with the pivot " + A[left]);

    temp = A[i -1];
    A[i - 1] = A[left];
    A[left] = temp;

    console.log("This partition is now:");

    printSubArray(A, left, right);

    // Store the subarray in the binary tree
    // this procedure is not necessary for quicksort
    leaf.setArray("post", A.slice(left, (right + 1)));

    // console.log("The full array is now: " + A.join(' '));

    // console.log("The length of the list of arrays is now: " + binaryTree.getTotal());

    retVal = i - 1;
    return retVal;
};

function printSubArray(A, l, r) { console.log(A.slice(l, r+1)); }


BinaryTree.prototype.addLeaf = function(leaf) {
    this.total = this.leaves.push(leaf);
    leaf.setIndex(this.total - 1);
};

BinaryTree.prototype.associate = function(parent, child) {
    child.setParent(parent);
    parent.setChild(child);

    console.log(child.preArray.data + " is a member of " + parent.preArray.data);
    console.log("---------------");
};


BinaryTree.prototype.build = function() {
    this.connectLeaves(); // associates parents with children
    this.calculateLeafDepths();
    this.flatten(); // calculates horizontal positions of leaves
    this.showProperties(); // displays all btree/leaf properties in the console
};


BinaryTree.prototype.connectLeaves = function() {
    var i, j, z;
    var leaf, pleaf;
    
    // find each leaf's parent and children
    console.log("-----STARTING THE buildTree() function------");

    // I'm going backward through the list; otherwise I would use forEach
    for (i = this.leaves.length - 1; i > 0; i--) {

        j = i - 1;

        leaf = this.leaves[i];

        console.log("the child value is: " + leaf.preArray.data);

        z = 0;

        while (leaf.hasParent() === false && z < 10000) {
            z++;
            var child = leaf.postArray.data;
            pleaf = this.leaves[j];
            var potParent = pleaf.postArray.data;

            if (Array.isArray(potParent)) {
                console.log("looking for " + child + " in " + potParent);
                var item;
                if (child.every(item => potParent.indexOf(item) !== -1)) {
                    this.associate(pleaf, leaf);
                    break;
                }
                else { j = j - 1; }
            }
            else { j = j - 1; }
        }
    }
};

BinaryTree.prototype.render = function(divIDjq, x, y) {
    console.log("------------------------------------------");
    console.log("-----------BUILDING THE HTML--------------");

    this.flatArray.forEach(function(leaf) {
        console.log("the leaf hIndex is: " + leaf.hIndex);
        
        if (leaf.hIndex === 0) { leaf.xpos = x; }
        else { leaf.xpos = this.getXpos(leaf); } // careful! this = binaryTree
        
        leaf.setHTML(y);
        console.log("-----------------------------------------");

        console.log("the div id is: " + this.divIDjq);
        $(divIDjq).append(leaf.html);

    }, this);
};

BinaryTree.prototype.calculateLeafDepths = function() {
    console.log("------STARTING THE calculateLeafDepths() function ------");

    this.leaves.forEach(function(leaf) {
        console.log("my index is: " + leaf.index);
        console.log("my binPos is: " + leaf.binPos);
        
        if (leaf.index === 0) { leaf.depth = 0; }
        else { leaf.depth = leaf.parent.depth + 1; }
        
        console.log("Leaf is: " + leaf.preArray.data + " Depth is: " + leaf.depth);
        console.log("------------");
    });
    
    this.leaves.forEach(function(leaf) { leaf.setAncestors(); });
};

BinaryTree.prototype.display = function() {

    this.showValues();

    this.build();

    this.calculateLeafDepths();

    this.flatten();

    this.show();

    this.buildHTML();

    this.drawLines();
};

BinaryTree.prototype.drawLines = function() {
    /* global jsPlumb */
    var leaves = this.leaves;
    var divID = this.divID;
    
    jsPlumb.ready(function() {

        // jsPlumb.repaintEverything();
        

        jsPlumb.setContainer(divID);

        jsPlumb.importDefaults({
            Connector : "Straight",
            PaintStyle:{ strokeStyle:"black", lineWidth:1 },
            EndpointStyle:{ radius: 1 },
            Overlays:[ 
                ["Arrow", { location: 1, width: 5, length: 5 }]
            ]
        });
    

        leaves.forEach(function(leaf) {

            if (leaf.hasChildren()) {
                var source = leaf.postArray.getPivotDivID();
                var target;
                
                var anchorDest = "Top";
                var anchorSrc = "Bottom";
                
                if (leaf.hasLeftChild()) {
                    target = leaf.leftChild.preArray.divID;
                    anchorSrc = "BottomLeft";
                    if (leaf.leftChild.hasChildren()) {
                        anchorDest = "TopRight";
                    }
                    drawLine(source, target, anchorSrc, anchorDest);
                }
                anchorDest = "Top";
                if (leaf.hasRightChild()) {
                    target = leaf.rightChild.preArray.divID;
                    anchorSrc = "BottomRight";
                    if (leaf.rightChild.hasChildren()) {
                        anchorDest = "TopLeft";
                    }
                    drawLine(source, target, anchorSrc, anchorDest);
                }
            }
        });
    }, this);
    
    
    function drawLine(source, target, anchorSrc, anchorDest) {
        jsPlumb.connect({
            anchors:[anchorSrc, anchorDest],

            source:source,
            target:target
        });
    }
};

BinaryTree.prototype.flatten = function() {
    console.log("--------------STARTING THE flatten() function-------------");
    var i, j;
    var flatArray = this.leaves;
    var temp;

    // First, sort the leaves by pivot value
    for (i = 1; i < flatArray.length; i++ ) {
        j = i;
        while (j > 0 && (flatArray[j-1].pivotValue > flatArray[j].pivotValue)) {
            temp = flatArray[j];
            flatArray[j] = flatArray[j-1];
            flatArray[j-1] = temp;
            j = j - 1;
        }
    }

    console.log("After the first pass, the flat array is: ");

    flatArray.forEach(function(leaf){
        console.log("pivot value: " + leaf.pivotValue + " data: " + leaf.preArray.data);
    });

    // Second, make sure that parent/child pairs appear in proper order
    for (i = (flatArray.length - 1); i > 0; i-- ) {
        j = i - 1;
        while (j >= 0 && (flatArray[i].pivotValue === flatArray[j].pivotValue)) {
            if (flatArray[i] === flatArray[j].leftChild) {
                temp = flatArray[i];
                flatArray[i] = flatArray[j];
                flatArray[j] = temp;
            }
            j--;
        }
    }

    console.log("After the second pass, the flat array is: ");

    flatArray.forEach(function(leaf){
        console.log("pivot value: " + leaf.pivotValue + " data: " + leaf.preArray.data);
    });
    
    // Third, assign an hIndex value to each of the leaves
    i = 0;
    flatArray.forEach(function(leaf){
        leaf.set_H_index(i);
        i++;
    });
    
    this.flatArray = flatArray;
};

BinaryTree.prototype.getLeaf = function(index) { return this.leaves[index]; };

BinaryTree.prototype.getLeaves = function() { return this.leaves; };

BinaryTree.prototype.getTotal = function() { return this.leaves.length; };

BinaryTree.prototype.getXpos = function(leaf){
    console.log("getting the xpos for: " + leaf.preArray.data);
    var prevLeaf;
    var xpos;
    
    prevLeaf = this.flatArray[leaf.hIndex - 1];
    prevLeaf.setWidth(); // this needs to happen here so that the div
                         // can get added to the DOM and measured.

    // Now that the pivot value is staying in the parent partition, this
    // logic could probably be significantly reduced. But, I spent so much time
    // on it I can't bring myself to trash it just yet.
    if (prevLeaf.isSingleton() && prevLeaf.isLeftChild()) {
        xpos = prevLeaf.xpos + (prevLeaf.width / 2);
    }
    else if (leaf.isSingleton() && leaf.isRightChild()) {
        var cell = prevLeaf.getLastCell();
        xpos = 
                prevLeaf.xpos + 
                prevLeaf.width - (cell.getWidth() / 2);
    }
    else {
        // change to a ratio where if you have a small child and a large 
        // parent, the xpos of the child needs to be larger.
        xpos = prevLeaf.xpos + (prevLeaf.width * .8);
    }

    return Math.round(xpos);
};

BinaryTree.prototype.showProperties = function() {
    console.log("-------------- STARTING THE show() function ---------------");
    this.leaves.forEach(function(leaf) { leaf.show(); });
};

BinaryTree.prototype.showValues = function() {
    console.log("The list of values is: ");
    this.leaves.forEach(function(leaf) { console.log(leaf.preArray.data); });
};

/*----------------------------------*/

var Leaf = function () {
    this.parent = null; // leaf object
    this.leftChild = null; // leaf object
    this.rightChild = null; // leaf object
    this.depth = null; // number >= 0
    this.binPos = null; // binary position relative to parent (left || right)
    this.index = null; // number = index in binaryTree.leaves[]
    this.hIndex = null; // horizontal position in the binary tree
    this.ancestors = []; // array of leaves; parents of parents
    this.length = null; // the number of integers in the data for this leaf
    this.preArray = null; // the subarray when it arrives at
                        // the partition function; pre "sort"
    this.postArray = null; // the subarray after it is partitioned around the
                         // pivot value
    this.xpos = 0; // for layout
    this.ypos = 0; // for layout
    this.divID = "";
};

Leaf.prototype.getAncestors = function() {
    var output = "";
    this.ancestors.forEach(function(leaf) {
        output += leaf.preArray.data.toString() + " | ";
    });
    return output;
};

Leaf.prototype.getLastCell = function() {
    return this.postArray.cells[this.length-1];
};

Leaf.prototype.setDivIDs = function() {
    this.preArray.divID = this.divID + "_pre";
    this.preArray.setDivIDs();
    this.postArray.divID = this.divID + "_post";
    this.postArray.setDivIDs();
};

Leaf.prototype.set_H_index = function (i) {
// Sets the horizontal order of the Leaf in the binaryTree
// Also sets the divID for the Leaf, as well as its preArray, postArray
// and their cells.
    this.hIndex = i;
    this.divID = "leaf_" + i;
    this.setDivIDs();
};

Leaf.prototype.setWidth = function () {
    this.width = document.getElementById(this.divID).offsetWidth;
};

Leaf.prototype.hasChildren = function() {
    return (this.hasLeftChild() || this.hasRightChild());
};

Leaf.prototype.hasLeftChild = function() {
    return (this.leftChild !== null);
};
Leaf.prototype.hasRightChild = function() {
    return (this.rightChild !== null);
};

Leaf.prototype.hasParent = function() { return (this.parent !== null); };

Leaf.prototype.isSingleton = function() {
    return (this.length === 1);
};

Leaf.prototype.isLeftChild = function() {
    return (this.binPos === "left");
};
Leaf.prototype.isRightChild = function() {
    return (this.binPos === "right");
};

Leaf.prototype.isRoot = function() {
    return (this.index === 0);
};

Leaf.prototype.setAncestors = function() {
    var i;
    if (this.parent) {
        var thisLeaf = this;
        for (i = this.depth; i > 0; i--) {
            thisLeaf = thisLeaf.parent;
            this.ancestors.push(thisLeaf);
        }
    }
};

Leaf.prototype.setChild = function (child) {
    if (child.pivotValue > this.pivotValue) {
        this.rightChild = child;
        child.binPos = "right";
    }
    else if (child.pivotValue < this.pivotValue) {
        this.leftChild = child;
        child.binPos = "left";
    }
    else if (child.pivotValue === this.pivotValue) {
        if (this.hasLeftChild()) {
            this.rightChild = child;
            child.binPos = "right";
        }
        else {
            this.leftChild = child;
            child.binPos = "left";
        }
        
    }
};

Leaf.prototype.setArray = function(type, array) {
    if (type === "pre") {
        this.preArray = new Subarray("pre", array);
        this.preArray.setPivotPos();
        this.pivotValue = this.preArray.pivotValue;
    }
    else {
        // console.log("trying to set up a new postarray with a pivotvalue of: " + this.pivotValue);
        this.postArray = new Subarray("post", array);
        this.postArray.setPivotPos(this.pivotValue);
    }
    this.length = array.length;
};

Leaf.prototype.setHTML = function(y) {
    var y_init = y;
    var offset = 10; // gives some padding at top of div. Probably a better way
    var y_baseline = y_init + offset;
    
    console.log("my divID is: " + this.divID);
    
    this.style = "left:" + this.xpos + "px;";
    
    if (this.depth === 0) { this.ypos = y_baseline; }
    else { this.ypos = y_baseline + (this.depth * 100); }
    
    this.style += "top:" + this.ypos + "px;";
    
    this.html =  "<div class = 'node'";
    this.html += " id = '" + this.divID + "'";
    this.html += " style = '" + this.style + "'";
    this.html += ">";

    this.html += this.preArray.getHTML();

    if (this.isSingleton() === false) {
        this.html += this.postArray.getHTML();
    }

    this.html += "</div>";
    
    console.log("my HTML is: " + this.html);
};

Leaf.prototype.setIndex = function(index) { this.index = index; };

Leaf.prototype.setParent = function(parent) { this.parent = parent; };


Leaf.prototype.show = function() {
    console.log("my index is: " + this.index);
    console.log("my preArray is: " + this.preArray.data);
    console.log("my postArray is: " + this.postArray.data);
    console.log("my length is: " + this.length);
    console.log("my pivot value is: " + this.pivotValue);

    if (this.parent !== null) {
        console.log("my parent's preArray is: " + this.parent.preArray.data);
        console.log("my parent's postArray is: " + this.parent.postArray.data);

        console.log("my parent index is: " + this.parent.index);
        console.log("my position relative to my parent is: " + this.binPos);
        console.log("my depth is: " + this.depth);
        console.log("my horizontal position is: " + this.hIndex);
        console.log("my ancestors are: " + this.getAncestors());
    }
    if (this.hasChildren()) {
        if (this.hasLeftChild()) {
            console.log("my left child is: " + this.leftChild.preArray.data);
        }
        if (this.hasRightChild()) {
            console.log("my right child is: " + this.rightChild.preArray.data);
        }
    }
    else { console.log("I have no children."); }
    console.log("-----------------------");
};

var Cell = function (value) {
    this.divID = "";
    this.html = "";
    this.value = value;
    this.isPivot = false;
};

Cell.prototype.getHTML = function(isSingleton, partitionType) {
    var cssClass = "cell";
    
    if (isSingleton) { cssClass = "singleton"; }
    else if (this.isPivot) {
        if (partitionType === "pre") { cssClass = "pivotPre"; }
        else { cssClass = "pivotPost"; }
    }
    this.html = "<div class='" + cssClass + "' id='" + this.divID + "'>";
    this.html += this.value;
    this.html += "</div>";
    return this.html;
};

Cell.prototype.getWidth = function() {
    return document.getElementById(this.divID).offsetWidth;
};

var Subarray = function(arrayType, data) {
    this.type = arrayType; // "pre" || "post"
    this.data = data;
    this.cells = [];
    this.divID = "";
    
    this.data.forEach(function (value) {
        this.cells.push(new Cell(value));
    }, this);
};

Subarray.prototype.isSingleton = function() {
    return (this.data.length === 1);
};

Subarray.prototype.setDivIDs = function() {
    var i = 0;
    this.cells.forEach(function(cell) {
        cell.divID = this.divID + "_" + i;
        i++;
    }, this);
};

Subarray.prototype.setPivotPos = function(pivotVal) {
    if (this.type === "pre") {
        this.pivotIndex = 0;
        this.pivotValue = this.data[0];
        this.cells[0].isPivot = true;
    }
    else if (this.type === "post") {
        this.pivotValue = pivotVal;
        this.pivotIndex = this.data.lastIndexOf(pivotVal);
        this.cells[this.pivotIndex].isPivot = true;
    }
};

Subarray.prototype.getHTML = function() {
    this.html = "<div class = 'array' id = '" + this.divID + "'>";

    this.cells.forEach(function(cell) {
        this.html += cell.getHTML(this.isSingleton(), this.type);
    }, this);
    
    this.html += "</div>";
    
    return this.html;
};

Subarray.prototype.getPivotCell = function() {
    return this.cells[this.pivotIndex];
};

Subarray.prototype.getPivotDivID = function() {
    return this.getPivotCell().divID;
};