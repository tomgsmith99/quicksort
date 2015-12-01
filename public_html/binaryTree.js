var BinaryTree = function() {
    this.leaves = []; // array of leaves, in the order in which they were created
    this.sortedInts = []; // array of ints, the result of the quicksort
    this.flatArray = []; // array of leaves, ordered by horizontal position
                            // in the tree
    this.html = "";
    this.xpos = 10; // starting with a 10px buffer from left side of screen

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
                if (typeof child === "number") {
                    if (potParent.indexOf(child) !== -1) {
                        this.associate(pleaf, leaf);
                    }
                    else { j = j - 1; }
                }
                else { // typeof child === "array"
                    var item;
                    if (child.every(item => potParent.indexOf(item) !== -1)) {
                        this.associate(pleaf, leaf);
                        break;
                    }
                    else { j = j - 1; }
                }
            }
            else { j = j - 1; }
        }
    }
};

BinaryTree.prototype.buildHTML = function() {
    console.log("------------------------------------------");
    console.log("-----------BUILDING THE HTML--------------");

    this.flatArray.forEach(function(leaf) {
        console.log("the leaf hIndex is: " + leaf.hIndex);
        
        if (leaf.hIndex === 0) { leaf.xpos = this.xpos; }
        else { leaf.xpos = this.getXpos(leaf); } // careful! this = binaryTree
        
        leaf.setHTML();
        console.log("-----------------------------------------");

        $("#tomQS").append(leaf.html);
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

BinaryTree.prototype.drawLines = function() {
    var leaves = this.leaves;
    jsPlumb.ready(function() {

        // jsPlumb.Defaults.Container=$("tomQS");
        jsPlumb.setContainer("tomQS");
        jsPlumb.importDefaults({
            Connector : "Straight",
            PaintStyle:{ strokeStyle:"black", lineWidth:1 },
            Anchors:["Bottom", "Top"],
            EndpointStyle:{ radius: 1 },
            Overlays:[ 
                ["Arrow", { location: 1, width: 5, length: 5 }]
            ]
        });

        leaves.forEach(function(leaf) {

            if (leaf.hasLeftChild()) {
                var div1 = "";
                var div2 = "";
                div1 = leaf.postArray.divID;
                div2 = leaf.leftChild.preArray.divID;
                
                console.log("connecting " + div1 + " to " + div2);
                jsPlumb.connect({
                    source:div1,
                    target:div2
                });
            }
        });

    //    function isOdd(num) { return num % 2;}
    //
    //    for (i = 1; i <= 4; i++) {
    //        if (isOdd(i)) {
    //            var div1 = "div" + i;
    //            var div2 = "div" + (i + 1);
    //
    //            jsPlumb.connect({
    //                source:div1,
    //                target:div2
    //            });
    //        }
    //    }
    //
    });

};

BinaryTree.prototype.flatten = function() {
// creates an array with all of the leaves in horizontal order
// logic is a little complicated, but it works
// [explanation]
    console.log("--------------STARTING THE flatten() function-------------");

    var usedParents = [];

    var i = 0;

    // NTS: change this to a .every function
    this.leaves.forEach(function(leaf) {
        if (leaf.isSingleton()) {
            this.flatArray[i] = leaf;
            leaf.set_H_index(i);
            i++;
            if (leaf.isLeftChild()) {
                this.flatArray[i] = leaf.parent;
                leaf.parent.set_H_index(i);
                usedParents.push(leaf.parent);
            }
            else {
                if (usedParents.indexOf(leaf.parent) === -1) {
                    this.flatArray[i] = leaf.parent;
                    leaf.parent.set_H_index(i);
                    usedParents.push(leaf.parent);
                }
                else {
                    var thisparent = leaf.parent;
                    while (usedParents.indexOf(thisparent) !== -1) {
                        thisparent = thisparent.parent;
                    }
                    this.flatArray[i] = thisparent;
                    thisparent.set_H_index(i);
                    usedParents.push(thisparent);
                }
            }
            i++;
        }
    }, this);

    i = 0;
    this.flatArray.forEach(function(leaf) {
        console.log("the flat array is: " + i + " = " + leaf.preArray.data);
        i++;
    });
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
    if (prevLeaf.isRoot()) { return prevLeaf.xpos; }
    else {
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
    }
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

Leaf.prototype.isLeftChild = function() {
    return (this.binPos === "left");
};
Leaf.prototype.isRightChild = function() {
    return (this.binPos === "right");
};

Leaf.prototype.isRoot = function() {
    return (this.index === 0);
};

Leaf.prototype.setChild = function (child) {
// Warning: this logic is dependent on the order
// of the items in the main Leaves array in the binary tree
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
};

Leaf.prototype.setHTML = function() {
    var y = 0;
    
    console.log("my divID is: " + this.divID);
    
    this.style = "left:" + this.xpos + "px;";
    
    if (this.depth === 0) { y = 10; }
    else { y = 10 + (this.depth * 100); }
    
    this.style += "top:" + y + "px;";
    
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

Leaf.prototype.setIndex = function(index) {
    this.index = index;
};

Leaf.prototype.setParent = function(parent) { this.parent = parent; };

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

Leaf.prototype.show = function() {
    console.log("my index is: " + this.index);
    console.log("my preArray is: " + this.preArray.data);
    console.log("my postArray is: " + this.postArray.data);
    console.log("my length is: " + this.length);

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

Cell.prototype.getHTML = function(isSingleton) {
    var cssClass = "cell";
    
    if (isSingleton) { cssClass = "singleton"; }
    else if (this.isPivot) { cssClass = "pivot"; }
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
        this.pivotIndex = this.data.indexOf(pivotVal);
        this.cells[this.pivotIndex].isPivot = true;
    }
};

Subarray.prototype.getHTML = function() {
    this.html = "<div class = 'array' id = '" + this.divID + "'>";

    this.cells.forEach(function(cell) {
        this.html += cell.getHTML(this.isSingleton());
    }, this);
    
    this.html += "</div>";
    
    return this.html;
};