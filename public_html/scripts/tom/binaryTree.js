var BinaryTree = function(divID, x, y) {
    this.leaves = []; // array of leaves, in the order in which they were created
    this.sortedInts = []; // array of ints, the result of the quicksort
    this.flatArray = []; // array of leaves, ordered by horizontal position
                            // in the tree
    this.html = "";
    this.xpos = x; // starting with a 10px buffer from left side of screen
    this.ypos = y;
    this.divID = divID;
    this.divIDjq = "#" + this.divID;
};

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
    // find each leaf's parent and children
    console.log("-----STARTING THE buildTree() function------");

    leaves = this.leaves;

    // I'm going backward through the list; otherwise I would use forEach
    for (i = leaves.length - 1; i > 0; i--) {

        j = i - 1;

        leaf = leaves[i];

        console.log("the child value is: " + leaf.preArray.data);

        z = 0;

        while (leaf.hasParent() === false && z < 10000) {
            z++;
            var child = leaf.postArray.data;
            pleaf = leaves[j];
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

BinaryTree.prototype.buildHTML = function() {
    console.log("------------------------------------------");
    console.log("-----------BUILDING THE HTML--------------");

    $(this.divIDjq).empty();

    this.flatArray.forEach(function(leaf) {
        console.log("the leaf hIndex is: " + leaf.hIndex);
        
        if (leaf.hIndex === 0) { leaf.xpos = this.xpos; }
        else { leaf.xpos = this.getXpos(leaf); } // careful! this = binaryTree
        
        leaf.setHTML(this.ypos);
        console.log("-----------------------------------------");

        $(this.divIDjq).append(leaf.html);

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
    this.sortedInts = A;

    this.showValues();

    this.build();

    this.calculateLeafDepths();

    this.flatten();

    this.show();

    this.buildHTML();

    this.drawLines();
};

BinaryTree.prototype.drawLines = function() {
    var leaves = this.leaves;
    var divID = this.divID;
    
    jsPlumb.ready(function() {

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
    for (i = 0; i < (flatArray.length - 1); i++ ) {
        if (flatArray[i].pivotValue === flatArray[i+1].pivotValue) {
            if (flatArray[i].leftChild === flatArray[i+1]) {
                temp = flatArray[i];
                flatArray[i] = flatArray[i+1];
                flatArray[i + 1] = temp;
            }
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
    var prevLeaf;
    var xpos;
    
    prevLeaf = this.flatArray[leaf.hIndex - 1];
    prevLeaf.setWidth(); // this needs to happen here so that the div
                         // can get added to the DOM and measured.
//    if (prevLeaf.isRoot()) { return (prevLeaf.xpos + 50); }
//    else {
//        if (prevLeaf.isSingleton() && prevLeaf.isLeftChild()) {
//            xpos = prevLeaf.xpos + (prevLeaf.width / 2);
//        }
//        else if (leaf.isSingleton() && leaf.isRightChild()) {
//            var cell = prevLeaf.getLastCell();
//            xpos = 
//                    prevLeaf.xpos + 
//                    prevLeaf.width - (cell.getWidth() / 2);
//        }
//        else { xpos = prevLeaf.xpos + prevLeaf.width; }
//    }

    if (prevLeaf.isSingleton() && prevLeaf.isLeftChild()) {
        xpos = prevLeaf.xpos + (prevLeaf.width / 2);
    }
    else if (leaf.isSingleton() && leaf.isRightChild()) {
        var cell = prevLeaf.getLastCell();
        xpos = 
                prevLeaf.xpos + 
                prevLeaf.width - (cell.getWidth() / 2);
    }
    else { xpos = prevLeaf.xpos + prevLeaf.width; }

    return xpos;
};

BinaryTree.prototype.show = function() {
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
/*
    if (this.hasLeftChild()) {
        this.rightChild = this.leftChild;
        this.rightChild.binPos = "right";
        this.leftChild = child;
        child.binPos = "left";
    }
    else {
        this.leftChild = child;
        child.binPos = "left";
    }
    */
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
    console.log("my pivot value is: " + leaf.pivotValue);

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