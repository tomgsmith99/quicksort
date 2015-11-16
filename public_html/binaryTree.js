var BinaryTree = function() {
    this.leaves = [];
};

BinaryTree.prototype.addLeaf = function(leaf) {
    this.leaves.push(leaf);
};

BinaryTree.prototype.setData = function(array) {
    this.data = array;
};

BinaryTree.prototype.addChildToParent = function(leaf, pIndex) {
    pLeaf = new Leaf(pIndex);
};

BinaryTree.prototype.show = function() {
    this.leaves.forEach(function(leaf) {
        console.log("my index is: " + leaf.index);
        console.log("the data is: " + leaf.data);
        console.log("the parent index is: " + leaf.parent);
        console.log("the left child is: " + leaf.leftchild);
        console.log("the right child is: " + leaf.rightchild);
    });
};
BinaryTree.prototype.getLeaf = function(index) {
    this.leaves.forEach(function(leaf) {
        if (leaf.index === index) {
            return leaf;
        }
    });
};

var Leaf = function () {
    this.parent = null;
    this.data = null;
    console.log("leaf has been created.");
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