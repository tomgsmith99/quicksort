var BinaryTree = function() {
    this.leaves = [];
    this.sortedInts = [];
    this.flatArray = [];
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

// creates an array with all of the leaves in horizontal order
// logic is a little complocated, but it works
// [explanation]
BinaryTree.prototype.flatten = function() {
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
};

BinaryTree.prototype.getTotal = function() {
    return this.leaves.length;
};

BinaryTree.prototype.show = function() {
    this.leaves.forEach(function(leaf) {
        console.log("-----------------------");

        console.log("my index is: " + leaf.index);
        console.log("my data is: " + leaf.data);
        
        if (leaf.parent !== null) {
            console.log("my parent's data is: " + leaf.parent.getData());
            console.log("my parent index is: " + leaf.parent.index);
            console.log("my position relative to my parent is: " + leaf.binPos);
            console.log("my depth is: " + leaf.depth);
            console.log("my horizontal position is: " + leaf.hpos);
            console.log("my ancestors are: " + leaf.getAncestors());
        }
        if (leaf.hasChildren()) {
            if (leaf.hasLeftChild()) {
                console.log("my left child is: " + leaf.leftChild.getData());
            }
            if (leaf.hasRightChild()) {
                console.log("my right child is: " + leaf.rightChild.getData());
            }
        }
        else { console.log("I have no children."); }
    });
};
BinaryTree.prototype.showValues = function() {
    this.leaves.forEach(function(leaf) {
        console.log("my data is: " + leaf.data);
    });
};

BinaryTree.prototype.getLeaf = function(index) {
    return this.leaves[index];
};

BinaryTree.prototype.getLeaves = function() {
    return this.leaves;
};

BinaryTree.prototype.calculateLeafPositions = function() {
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
    this.index = null;
    this.hpos = null;
};

Leaf.prototype.getAncestors = function() {
    var output = "";
    
    this.ancestors.forEach(function(leaf) {
        output = output + leaf.getData().toString() + " | ";
    });
    
    return output;

};

Leaf.prototype.setAncestors = function() {
    this.ancestors = [];
    
    if (this.parent !== null) {
        var thisLeaf = this;

        for (i = this.depth; i > 0; i--) {
            thisLeaf = thisLeaf.parent;
            this.ancestors.push(thisLeaf);
        }
        console.log("my ancestors are: " + this.ancestors);
    }
};

Leaf.prototype.setIndex = function(index) {
    this.index = index;
};
Leaf.prototype.hasParent = function() {
    if (this.parent) { return true; }
    else { return false; }
};
Leaf.prototype.setParent = function(parent) {
    this.parent = parent;
};
Leaf.prototype.setData = function(data) {
    this.data = data;
};
Leaf.prototype.getData = function() {
    if (this.data === null) { return "no data set yet"; }
    else { return this.data; }
};
Leaf.prototype.hasChildren = function() {
    if (this.leftChild === null && this.rightChild === null) {
        return false;
    }
    else { return true; }
};
Leaf.prototype.hasLeftChild = function() {
    if (this.leftChild === null) {
        return false;
    }
    else { return true; }
};
Leaf.prototype.hasRightChild = function() {
    if (this.rightChild === null) {
        return false;
    }
    else { return true; }
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