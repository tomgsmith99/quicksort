var BinaryTree = function() {
    this.leaves = [];
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
        console.log("my position relative to my parent is: " + leaf.binPos);
        
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
    this.leaves.forEach(function(leaf) {
        console.log("my index is: " + leaf.index);
        console.log("my binPos is: " + leaf.binPos);
        
        if (leaf.index === 0) {
            leaf.depth = 0;
            leaf.width = 0;
        }
        else {
            var pleaf = this.leaves[leaf.parent];
            leaf.depth = pleaf.depth + 1;
            
            var thisLeaf = leaf;
            
            console.log("thisLeaf is: " + thisLeaf.getData());
            
            for (i = leaf.depth; i > 0; i--) {
                thisLeaf = this.leaves[thisLeaf.parent];
                console.log("the parent is: " + thisLeaf.getData());
            }
            /*
            if (leaf.binPos === "left") {
                console.log("the pleaf width is: " + pleaf.width);
                leaf.width = pleaf.width -1;
            }
            else { leaf.width = pleaf.width +1; }
            */
        }
        console.log("Leaf is: " + leaf.getData() + " Depth is: " + leaf.depth);
        console.log("------------");
    });
};

var Leaf = function () {
    this.parent = null; // leaf object
    this.data = null; // array or number
    this.leftChild = null; // leaf object
    this.rightChild = null; // leaf object
    this.depth = null; // number >= 0
    this.binPos = null; // binary position relative to parent (left || right)
};
Leaf.prototype.setIndex = function(index) {
    this.index = index;
};
Leaf.prototype.hasParent = function() {
    if (this.parent) { return true; }
    else { return false; }
};
Leaf.prototype.setParent = function(parent) {
    this.parent = parent.index;
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

Leaf.prototype.setChild = function (child) {
    if (this.hasLeftChild()) {
        this.rightChild = this.leftChild;
        this.rightChild.binPos = "right";
        
        this.leftChild = child.index;
        child.binPos = "left";
        
//        this.rightChild = child.index;
//        child.binPos = "right";
    }
    else {
        this.leftChild = child.index;
        child.binPos = "left";
    }
};