var qsDemo = function(A, divID, x, y) {

    qsCount = 0;

    binaryTree = new BinaryTree(divID, x, y);
    jsPlumb.empty(binaryTree.divID);

    quickSort(A, 0, (A.length - 1));

    console.log("----------- Quicksort function complete--------------------");
    console.log("The sorted array is: " + binaryTree.sortedInts);

    binaryTree.sortedInts = A;

    binaryTree.display();

};