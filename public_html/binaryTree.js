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

BinaryTree.prototype.flatten = function() {
// creates an array with all of the leaves in horizontal order
// logic is a little complicated, but it works
// [explanation]
    console.log("--------------STARTING THE flatten() function-------------");

    var usedParents = [];

    var i = 0;

    // NTS: change this to a .every function
    this.leaves.forEach(function(leaf) {
        if (leaf.isSingleton) {
            this.flatArray[i] = leaf;
            leaf.set_H_index(i);
            i++;
            if (leaf.isLeftChild) {
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
    if (prevLeaf.isRoot) { return prevLeaf.xpos; }
    else {
        if (prevLeaf.isSingleton && prevLeaf.isLeftChild) {
            xpos = prevLeaf.xpos + (prevLeaf.width / 2);
        }
        else if (leaf.isSingleton && leaf.isRightChild) {
            var cell = prevLeaf.getLastCell();
            xpos = prevLeaf.xpos + prevLeaf.width - (cell.width / 2);
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
    this.isLeftChild = null;
    this.isRightChild = null;
    this.isRoot = false;
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

Leaf.prototype.getCellDiv = function(i) {
    var cellDiv;
    var cellDivID;
    
    cellDivID = this.divID + "_" + i;
    
    cellDiv = "<div class = 'cell' id = '" + cellDivID + "'>";
    cellDiv += this.postArray.data[i];
    cellDiv += "</div>";
    
    return cellDiv;
};


Leaf.prototype.getLastCell = function() {
// Very hacky, needs to be rewritten
    var cell = new Cell();
    // cell.divID = this.divID + "_post_" + (this.length - 1);
    cell.divID = this.divID + "_pre_" + (this.length - 1);

    cell.setWidth();
    return cell;
};

// Sets the horizontal order of the Leaf in the binaryTree
// Also sets its divID
Leaf.prototype.set_H_index = function (i) {
    this.hIndex = i;
    this.divID = "leaf_" + i;
};

Leaf.prototype.setWidth = function () {
    this.width = document.getElementById(this.divID).offsetWidth;
};

Leaf.prototype.hasChildren = function() {
    if (this.leftChild === null && this.rightChild === null) {
        return false;
    }
    else { return true; }
};

Leaf.prototype.hasLeftChild = function() {
    if (this.leftChild === null) { return false; }
    else { return true; }
};
Leaf.prototype.hasRightChild = function() {
    if (this.rightChild === null) { return false; }
    else { return true; }
};
Leaf.prototype.hasParent = function() {
    if (this.parent) { return true; }
    else { return false; }
};

Leaf.prototype.setAncestors = function() {
    if (this.parent) {
        var thisLeaf = this;
        for (i = this.depth; i > 0; i--) {
            thisLeaf = thisLeaf.parent;
            this.ancestors.push(thisLeaf);
        }
    }
};

Leaf.prototype.setBinPos = function(pos) {
    if (pos === "left") {
        this.binPos = "left";
        this.isLeftChild = true;
        this.isRightChild = false;
    }
    else if (pos === "right") {
        this.binPos = "right";
        this.isLeftChild = false;
        this.isRightChild = true;
    }
};

Leaf.prototype.setChild = function (child) {
// Warning: this logic is dependent on the order
// of the items in the main Leaves array in the binary tree
    if (this.hasLeftChild()) {
        this.rightChild = this.leftChild;
        this.rightChild.setBinPos("right");
        this.leftChild = child;
        child.setBinPos("left");
    }
    else {
        this.leftChild = child;
        child.setBinPos("left");
    }
};

Leaf.prototype.setHTML = function() {
    var y = 0;
    
    console.log("my divID is: " + this.divID);
    
    this.style = "left:" + this.xpos + "px;";
    
    if (this.depth === 0) { y = 10; }
    else { y = 10 + (this.depth * 40); }
    
    this.style += "top:" + y + "px;";
    
    this.html =  "<div class = 'node'";
    this.html += " id = '" + this.divID + "'";
    this.html += " style = '" + this.style + "'";
    this.html += ">";

    this.html += this.preArray.getHTML(this.divID, this.depth);
    // this.html += this.postArray.getHTML(this.divID);

/*
    if (this.isSingleton) {
        this.html += this.getCellDiv(0);
    }
    else {
        for (i=0; i < this.length; i++) {
            this.html += this.getCellDiv(i);
            console.log("the cell div html is: ");
            console.log(this.getCellDiv(i));
        }
    }
*/    
    this.html += "</div>";
    
    console.log("my HTML is: " + this.html);
};

/*
Leaf.prototype.getHTML = function() {
    var html = "";

    var divID = this.divID + "_";
    
    if (arrayType === "preArray") {
        divID += "pre";
    }
    else { this.postArray.divID = this.divID + "_post"; }
    
    html = "<div class = 'array' id = '" + "";
};
*/

Leaf.prototype.setIndex = function(index) {
    this.index = index;
    if (index === 0) { this.isRoot = true; }
};
Leaf.prototype.setParent = function(parent) { this.parent = parent; };

Leaf.prototype.setArray = function(type, array) {
    if (type === "pre") { this.preArray = new Subarray("pre", array); }
    else { this.postArray = new Subarray("post", array); }
    this.length = array.length;
    if (this.length === 1) { this.isSingleton = true; }
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

var Cell = function () {
    this.divID = "";
};

/*
Cell.prototype.setDivID = function(leafID, index) {
    this.divID = leafID + "_" + index;
};
*/
Cell.prototype.setWidth = function() {
    this.width = document.getElementById(this.divID).offsetWidth;
};

var Subarray = function(arrayType, data) {
    this.type = arrayType; // "pre" || "post"
    this.data = data;
    console.log("XXXXXX THE DATA IS: " + this.data);
};

Subarray.prototype.setDivID = function(leafID) {
    this.divID = leafID + "_" + this.type;
};

Subarray.prototype.getHTML = function(leafID, depth) {
    var y = 0;
    var style = "";
    
    this.divID = leafID + "_" + this.type;
    
    this.html = "";
    
    if (depth === 0) { y = 10; }
    else { y = 10 + (depth * 40); }
    
    style = "top:" + y + "px;";
    
    this.html += "<div class = 'array' id = '" + this.divID + "'>";
    
    var i = 0;
    this.data.forEach(function(value) {
        var cell = new Cell();
        cell.divID = this.divID + "_" + i;
        cell.html = "<div class='cell' id='" + cell.divID + "'";
        cell.html += " style='" + style + "'>";
        cell.html += value;
        cell.html += "</div>";
        this.html += cell.html;
        i++;
    }, this);
    
    this.html += "</div>";
    
    return this.html;
};