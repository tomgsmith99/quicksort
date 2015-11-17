var BinaryTree = function() {
    this.leaves = [];
};

BinaryTree.prototype.addLeaf = function(leaf) {
    this.total = this.leaves.push(leaf);
    leaf.setIndex(this.total - 1);
};

BinaryTree.prototype.setData = function(array) {
    this.data = array;
};

BinaryTree.prototype.addChildToParent = function(leaf, pIndex) {
    pLeaf = new Leaf(pIndex);
};

BinaryTree.prototype.show = function() {
    this.leaves.forEach(function(leaf) {
        console.log("-----------------------");

        console.log("my index is: " + leaf.index);
        console.log("my data is: " + leaf.data);
        console.log("my parent index is: " + leaf.parent);
        if (leaf.parent !== null) {
            pleaf = this.leaves[leaf.parent];
        }
        console.log("my parent's data is: " + pleaf.data);
        if (leaf.hasChildren()) {
            if (leaf.hasLeftChild()) {
                console.log("my left child's index is: " + leaf.leftChild);
            }
            if (leaf.hasRightChild()) {
                console.log("my right child is: " + leaf.rightChild);
            }
        }
        else { console.log("I have no children."); }
    });
};
BinaryTree.prototype.getLeaf = function(index) {
    return this.leaves[index];
};

BinaryTree.prototype.getLeaves = function() {
    return this.leaves;
};

var Leaf = function () {
    this.parent = null;
    this.data = null;
    this.leftChild = null;
    this.rightChild = null;
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
Leaf.prototype.setChild = function (pos, index) {
    if (pos === "right") {
        this.rightChild = index;
    }
    else { this.leftChild = index; }
};