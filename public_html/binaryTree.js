var BinaryTree = function() {
    this.leaves = [];
};

BinaryTree.prototype.addLeaf = function(leaf) {
    this.total = this.leaves.push(leaf);
    leaf.setIndex(this.total - 1);
};

BinaryTree.prototype.associate = function(parent, child) {
    child.setParent(parent.index);
    parent.setChild(child.index);
    
    console.log(child.getData() + " is a member of " + parent.getData());
    console.log("---------------");
};

BinaryTree.prototype.getTotal = function() {
    return this.leaves.length;
};

BinaryTree.prototype.setData = function(array) {
    this.data = array;
};

BinaryTree.prototype.show = function() {
    this.leaves.forEach(function(leaf) {
        console.log("-----------------------");

        console.log("my index is: " + leaf.index);
        console.log("my data is: " + leaf.data);
        console.log("my parent index is: " + leaf.parent);
        if (leaf.parent !== null) {
            var pleaf = this.leaves[leaf.parent];
             console.log("my parent's data is: " + pleaf.data);
        }
        if (leaf.hasChildren()) {
            if (leaf.hasLeftChild()) {
                console.log("my left child's index is: " + leaf.leftChild);
            }
            if (leaf.hasRightChild()) {
                console.log("my right child's index is: " + leaf.rightChild);
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
    console.log("CALCULATE");
    this.leaves.forEach(function(leaf) {
        if (leaf.index === 0) {
            leaf.depth = 0;
            leaf.hpos = 0;
        }
        else {
            var pleaf = this.leaves[leaf.parent];
            leaf.depth = pleaf.depth + 1;
        }
        console.log("in the calc function. Leaf is: " + leaf.getData() + " Depth is: " + leaf.depth);
    });
};

var Leaf = function () {
    this.parent = null;
    this.data = null;
    this.leftChild = null;
    this.rightChild = null;
    this.depth = null;
    this.binPos = null; // binary position relative to parent (left || right)
};
Leaf.prototype.setIndex = function(index) {
    this.index = index;
};
Leaf.prototype.hasParent = function() {
    if (this.parent) { return true; }
    else { return false; }
};
Leaf.prototype.setParent = function(pIndex) {
    this.parent = pIndex;
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

Leaf.prototype.setChild = function (index) {
    if (this.hasLeftChild()) {
        this.rightChild = index;
    }
    else { this.leftChild = index; }
};