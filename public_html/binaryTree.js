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

    console.log(child.getArray() + " is a member of " + parent.getArray());
    console.log("---------------");
};

BinaryTree.prototype.build = function() {
    console.log("-----STARTING THE buildTree() function------");

    // find each leaf's parent and children
    leaves = this.leaves;

    // I'm going backward through the list; otherwise I would use forEach
    for (i = leaves.length - 1; i > 0; i--) {

        j = i - 1;

        leaf = leaves[i];

        console.log("the child value is: " + leaf.postArray);

        z = 0;

        while (leaf.hasParent() === false && z < 10000) {
            z++;
            var child = leaf.postArray;;
            pleaf = leaves[j];
            var potParent = pleaf.postArray;

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

BinaryTree.prototype.buildDivs = function() {
    console.log("------------------------------------------");
    console.log("-----------BUILDING THE HTML--------------");

    this.flatArray.forEach(function(leaf) {
        console.log("the leaf hpos is: " + leaf.hpos);
        leaf.setDivID();
        
        if (leaf.hpos === 0) { leaf.xpos = this.xpos; }
        else { leaf.xpos = this.getXpos(leaf); }
        
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
        
        console.log("Leaf is: " + leaf.preArray + " Depth is: " + leaf.depth);
        console.log("------------");
    });
    
    this.leaves.forEach(function(leaf) { leaf.setAncestors(); });
};

BinaryTree.prototype.flatten = function() {
// creates an array with all of the leaves in horizontal order
// logic is a little complicated, but it works
// [explanation]
    console.log("--------------STARTING THE flatten() function-------------");

    var flatArray = [];
    var usedParents = [];

    var i = 0;

    // NTS: change this to a .every function
    this.leaves.forEach(function(leaf) {
        if (leaf.isSingleton) {
            flatArray[i] = leaf;
            leaf.hpos = i;
            i++;
            if (leaf.isLeftChild) {
                flatArray[i] = leaf.parent;
                leaf.parent.hpos = i;
                usedParents.push(leaf.parent);
            }
            else {
                if (usedParents.indexOf(leaf.parent) === -1) {
                    flatArray[i] = leaf.parent;
                    leaf.parent.hpos = i;
                    usedParents.push(leaf.parent);
                }
                else {
                    var thisparent = leaf.parent;
                    while (usedParents.indexOf(thisparent) !== -1) {
                        thisparent = thisparent.parent;
                    }
                    flatArray[i] = thisparent;
                    thisparent.hpos = i;
                    usedParents.push(thisparent);
                }
            }
            i++;
        }
    });

    i = 0;
    flatArray.forEach(function(leaf) {
        console.log("the flat array is: " + i + " = " + leaf.preArray);
        i++;
    });
    this.flatArray = flatArray;
};

BinaryTree.prototype.getHTML = function() { return this.html; };

BinaryTree.prototype.getLeaf = function(index) { return this.leaves[index]; };

BinaryTree.prototype.getLeaves = function() { return this.leaves; };

BinaryTree.prototype.getTotal = function() { return this.leaves.length; };

BinaryTree.prototype.getXpos = function(leaf){
    var prevLeaf;
    var xpos;
    
    prevLeaf = this.flatArray[leaf.hpos - 1];
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
    this.leaves.forEach(function(leaf) { console.log(leaf.preArray); });
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
    this.ifRightChild = null;
    this.isRoot = false;
    this.hpos = null; // horizotal position in the binary tree
    this.ancestors = []; // array of leaves; parents of parents
    this.length = null; // the number of integers in the data for this leaf
    this.preArray = []; // the subarray when it arrives at
                        // the partition function; pre "sort"
    this.postArray = []; // the subarray after it is partitioned around the
                         // pivot value
    this.xpos = 0; // for layout
    this.ypos = 0; // for layout
    this.divID = "";
};

Leaf.prototype.castToArray = function(value) {
    console.log("the data type of " + value + " is: " + (typeof value));
    if (typeof value === "number") {
        var temp = [];
        temp.push(value);
        return temp;
    }
    else { return value; }
};
Leaf.prototype.getAncestors = function() {
    var output = "";
    
    this.ancestors.forEach(function(leaf) {
        output = output + leaf.preArray.toString() + " | ";
    });
    
    return output;

};

Leaf.prototype.getArray = function(state) {
    if (state === "pre") { return this.preArray; }
    else { return this.postArray; }
};

Leaf.prototype.getCellDiv = function(i) {
    var cellDiv;
    var cellDivID;
    
    cellDivID = this.divID + "_" + i;
    
    cellDiv = "<div class = 'cell' id = '" + cellDivID + "'>";
    cellDiv += this.postArray[i];
    cellDiv += "</div>";
    
    return cellDiv;
};

Leaf.prototype.getLastCell = function(leafID) {
    
    var cell = new Cell();
    cell.setDivID(this.divID, (this.length - 1));
    cell.setWidth();
    return cell;
};
Leaf.prototype.setDivID = function () { this.divID = "leaf_" + this.hpos; };

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
    
    this.divID = "leaf_" + this.hpos;
    console.log("my divID is: " + this.divID);
    
    this.style = "left:" + this.xpos + "px;";
    
    if (this.depth === 0) { y = 10; }
    else { y = 10 + (this.depth * 40); }
    
    this.style += "top:" + y + "px;";
    
    this.html =  "<div class = 'node'";
    this.html += " id = '" + this.divID + "'";
    this.html += " style = '" + this.style + "'";
    this.html += ">";
    
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
    
    this.html += "</div>";
    
    console.log("my HTML is: " + this.html);
};

Leaf.prototype.getArrayDiv = function() {
    
};

Leaf.prototype.setIndex = function(index) {
    this.index = index;
    if (index === 0) { this.isRoot = true; }
};
Leaf.prototype.setParent = function(parent) { this.parent = parent; };

Leaf.prototype.setPreArray = function(preArray) {
    this.preArray = this.castToArray(preArray);
    if (this.preArray.length === 1) {
        this.postArray = this.preArray;
        this.isSingleton = true;
    }
    this.length = this.preArray.length;
};

Leaf.prototype.setPostArray = function(postArray) {
    this.postArray = this.castToArray(postArray);
};

Leaf.prototype.show = function() {
    console.log("my index is: " + this.index);
    console.log("my preArray is: " + this.preArray);
    console.log("my postArray is: " + this.postArray);
    console.log("my length is: " + this.length);

    if (this.parent !== null) {
        console.log("my parent's preArray is: " + this.parent.preArray);
        console.log("my parent's postArray is: " + this.parent.postArray);

        console.log("my parent index is: " + this.parent.index);
        console.log("my position relative to my parent is: " + this.binPos);
        console.log("my depth is: " + this.depth);
        console.log("my horizontal position is: " + this.hpos);
        console.log("my ancestors are: " + this.getAncestors());
    }
    if (this.hasChildren()) {
        if (this.hasLeftChild()) {
            console.log("my left child is: " + this.leftChild.preArray);
        }
        if (this.hasRightChild()) {
            console.log("my right child is: " + this.rightChild.preArray);
        }
    }
    else { console.log("I have no children."); }
    console.log("-----------------------");
};

var Cell = function () {
    this.divID = "";
};

Cell.prototype.setDivID = function(leafID, index) {
    this.divID = leafID + "_" + index;
};

Cell.prototype.setWidth = function() {
    this.width = document.getElementById(this.divID).offsetWidth;

};