
function quickSort(A, left, right) {
    var pivot;

    qsCount = qsCount + 1;
    
    if (qsCount > 100) { throw new Error("too many qs loops"); }
    console.log("----------QSBEGIN----------");
    console.log("Starting the qs function.");
    console.log("Iteration number: " + qsCount);
    console.log("The left index is: " + left);
    console.log("The right index is: " + right);
    console.log("Checking to see if left index < right index:");

    if (left < right) {
        console.log("left is < right.");
        console.log("starting the partition function.");
        pivot = partition(A, left, right);
        console.log("partition function complete.");
        console.log("result of partition function - pivot index is: " + pivot);
        quickSort (A, left, pivot);
        quickSort (A, (pivot+1), right);
    }
    else if (left === right) { // Note: this clause is not needed for qs!
        console.log("Nope. This partition is a singleton: " + A[left]);
        var leaf = new Leaf();
        leaf.setArray("pre", A.slice(left, left+1));
        leaf.setArray("post", A.slice(left, left+1));
        binaryTree.addLeaf(leaf);
    }
    else { console.log("right > left, so we are done!"); } // also unnecessary
}

function partition(A, left, right){
    var pivot = A[left];
    var i = left;
    var j;

    // Store the subarray in the binary tree
    // this procedure is not necessary for quicksort
    var leaf = new Leaf();
    binaryTree.addLeaf(leaf);
    leaf.setArray("pre", A.slice(left, (right + 1)));

    console.log("--------PBEGIN------------");
    console.log("This is the partition we are going to work on:");

    printSubArray(A, left, right);

    for (j = left; j <= right; j++){
        console.log("beginning state, at top of loop: ");
        printSubArray(A, left, right);

        console.log("The index of j is: " + j);
        console.log("The index of i is: " + i);
        console.log("Comparing A[" + j + "] (" + A[j] + ") to the pivot value: " + pivot);

        if (A[j] <= pivot) {
            console.log("A[j] is less than or equal to the pivot, so we are going to swap A[j] " + A[j] + " with A[i]: " + A[i]);

            temp = A[j];
            A[j] = A[i];
            A[i] = temp;

            console.log("end state, at bottom of loop:");
            printSubArray(A, left, right);

            i = i + 1;
        }
        else { console.log("A[j] is greater than the pivot value, so no values were swapped."); }

        console.log("i is now: " + i);
        console.log("-----------------");
    }

    console.log("For loop complete. Swapping the A[i-1] value " + A[i-1] + " with the pivot " + A[left]);

    temp = A[i -1];
    A[i - 1] = A[left];
    A[left] = temp;

    console.log("This partition is now:");

    printSubArray(A, left, right);

    // Store the subarray in the binary tree
    // this procedure is not necessary for quicksort
    leaf.setArray("post", A.slice(left, (right + 1)));

    console.log("The full array is now: " + A.join(' '));

    console.log("The length of the list of arrays is now: " + binaryTree.getTotal());

    retVal = i - 1;
    return retVal;
}

function printSubArray(A, l, r) { console.log(A.slice(l, r+1)); }