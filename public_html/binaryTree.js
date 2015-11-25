var BinaryTree = function() {
    this.leaves = []; // array of leaves, in the order in which they were created
    this.sortedInts = []; // array of ints, the result of the quicksort
    this.flatArray = []; // array of leaves, ordered by horizontal position
                            // in the tree
    this.html = "";
};

BinaryTree.prototype.addLeaf = function(leaf) {
    this.total = this.leaves.push(leaf);
    leaf.setIndex(this.total - 1);
};

BinaryTree.prototype.associate = function(parent, child) {
    child.setParent(parent);
    parent.setChild(child);

    console.log(child.getData() + " is a member of " + parent.getData());
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

        console.log("the child value is: " + leaf.getData());

        z = 0;

        while (leaf.hasParent() === false && z < 10000) {
            z++;
            var child = leaf.getData();
            pleaf = leaves[j];
            var potParent = pleaf.getData();

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
    var xpos = 10; // starting with a 10px buffer from left side of screen
    var prevID = "";
    var prevLeafWidth = 0;
    var prevLeaf;
    var prevCellID = "";
    var prevCellWidth = 0;

    console.log("testing the binarytree html: " + this.html);

    var i = 0;
    var j = 0;
    this.flatArray.forEach(function(leaf) {

        if (i !== 0) {
            j = i - 1;
            prevID = "leaf_" + j;
            prevLeafWidth = document.getElementById(prevID).offsetWidth;
            console.log("xpos is: " + xpos);
            if (prevLeaf.isRoot === false) {
                xpos = xpos + prevLeafWidth;
                
                if (prevLeaf.isSingleton && prevLeaf.binPos === "left") {
                    xpos = xpos - (prevLeafWidth / 2);
                }
                else if (leaf.isSingleton && leaf.binPos === "right") {
                    prevCellID = prevID + "_" + (prevLeaf.data.length - 1);
                    prevCellWidth = document.getElementById(prevCellID).offsetWidth;
                    console.log("the prevCellID is: " + prevCellID);
                    xpos = xpos - (prevCellWidth / 2);
                }
                else if (leaf.data.length > 3) {
                    // xpos = xpos - (leaf.data.length * 5);
                }
            
            }
        }

        prevLeaf = leaf;

        leaf.setDiv(xpos);

        $("#tomQS").append(leaf.html);

        i++;
    });
};
// creates an array with all of the leaves in horizontal order
// logic is a little complocated, but it works
// [explanation]
BinaryTree.prototype.flatten = function() {
    console.log("--------------STARTING THE flatten() function-------------");

    var flatArray = [];
    var usedParents = [];

    var i = 0;

    // NTS: change this to a .every function
    this.leaves.forEach(function(leaf) {
        if (typeof leaf.getData() === "number") {
            flatArray[i] = leaf;
            leaf.hpos = i;
            i++;
            if (leaf.binPos === "left") {
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
        console.log("the flat array is: " + i + " = " + leaf.getData());
        i++;
    });
    this.flatArray = flatArray;
};

BinaryTree.prototype.getHTML = function() {
    return this.html;
};

BinaryTree.prototype.getTotal = function() {
    return this.leaves.length;
};

BinaryTree.prototype.show = function() {
    console.log("-------------- STARTING THE show() function ---------------");

    this.leaves.forEach(function(leaf) { leaf.show(); });
};

BinaryTree.prototype.showValues = function() {
    console.log("The list of values is: ");
    this.leaves.forEach(function(leaf) { console.log(leaf.data); });
};

BinaryTree.prototype.getLeaf = function(index) { return this.leaves[index]; };

BinaryTree.prototype.getLeaves = function() { return this.leaves; };

BinaryTree.prototype.calculateLeafPositions = function() {
    console.log("------STARTING THE calculateLeafPositions() function ------");

    this.leaves.forEach(function(leaf) {
        console.log("my index is: " + leaf.index);
        console.log("my binPos is: " + leaf.binPos);
        
        if (leaf.index === 0) { leaf.depth = 0; }
        else { leaf.depth = leaf.parent.depth + 1; }
        
        console.log("Leaf is: " + leaf.getData() + " Depth is: " + leaf.depth);
        console.log("------------");
    });
    
    this.leaves.forEach(function(leaf) { leaf.setAncestors(); });
};

var Leaf = function () {
    this.parent = null; // leaf object
    this.data = null; // array or number
    this.leftChild = null; // leaf object
    this.rightChild = null; // leaf object
    this.depth = null; // number >= 0
    this.binPos = null; // binary position relative to parent (left || right)
    this.index = null; // number = index in binaryTree.leaves[]
    this.isRoot = false;
    this.hpos = null; // horizotal position in the binary tree
    this.ancestors = []; // array of leaves; parents of parents
    this.width = null; // the number of integers in the data for this leaf
    
    this.xpos = 0; // for layout
    this.ypos = 0; // for layout
    this.divID = "";
};

Leaf.prototype.getAncestors = function() {
    var output = "";
    
    this.ancestors.forEach(function(leaf) {
        output = output + leaf.getData().toString() + " | ";
    });
    
    return output;

};

Leaf.prototype.getData = function() {
    if (this.data === null) { return "no data set yet"; }
    else { return this.data; }
};

Leaf.prototype.getDiv = function() {
    
}
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

// Warning: this logic is dependent on the order
// of the items in the main Leaves array in the binary tree
Leaf.prototype.setChild = function (child) {
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

// NTS: I should force a number value to be a singleton array
Leaf.prototype.setData = function(data) {
    this.data = data;
    if (typeof data === "number") {
        this.width = 1;
        this.isSingleton = true;
    }
    else { 
        this.width = data.length;
        this.isSingleton = false;
    }
};

Leaf.prototype.setDiv = function(x) {
    var y = 0;
    
    this.divID = "leaf_" + this.hpos;
    console.log("my divID is: " + this.divID);
    
    this.style = "left:" + x + "px;";
    
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
        for (i=0; i < this.data.length; i++) {
            this.html += this.getCellDiv(i);
            console.log("the cell div html is: ");
            console.log(this.getCellDiv(i));
        }
    }
    
    this.html += "</div>";
    
    console.log("my HTML is: " + this.html);
};

Leaf.prototype.getCellDiv = function(i) {
    var cellDiv;
    var cellDivID;
    
    cellDivID = this.divID + "_" + i;
    
    cellDiv = "<div class = 'cell' id = '" + cellDivID + "'>";
    cellDiv += this.getValue(i);
    // console.log("this value is: " + this.getValue())
    cellDiv += "</div>";
    
    return cellDiv;
};

Leaf.prototype.getValue = function(i) {
    if (this.isSingleton) { return this.data; }
    else { return this.data[i]; }
};

Leaf.prototype.setIndex = function(index) {
    this.index = index;
    if (index === 0) { this.isRoot = true; }
};
Leaf.prototype.setParent = function(parent) { this.parent = parent; };

Leaf.prototype.show = function() {
    console.log("my index is: " + this.index);
    console.log("my data is: " + this.data);
    console.log("my width is: " + this.width);

    if (this.parent !== null) {
        console.log("my parent's data is: " + this.parent.getData());
        console.log("my parent index is: " + this.parent.index);
        console.log("my position relative to my parent is: " + this.binPos);
        console.log("my depth is: " + this.depth);
        console.log("my horizontal position is: " + this.hpos);
        console.log("my ancestors are: " + this.getAncestors());
    }
    if (this.hasChildren()) {
        if (this.hasLeftChild()) {
            console.log("my left child is: " + this.leftChild.getData());
        }
        if (this.hasRightChild()) {
            console.log("my right child is: " + this.rightChild.getData());
        }
    }
    else { console.log("I have no children."); }
    console.log("-----------------------");
};