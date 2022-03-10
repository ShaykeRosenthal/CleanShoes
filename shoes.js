function sortByfirm(shoes_arr) {
    //Returns an object with firm number as key and number of shoes belonging to that firm as value;
    //Example: [1, 2, 1, 1] will return {1:3,2:1} 
    //Example: [1, 4, 3, 2, 4] will return {1:1,4:2,3:1}
    /* 
    How does it work: 
    Loop through the array 'shoes_arr' if 'firms' doesn't have the current firm add it to firms as a key and set the value to 1.
    if however the 'firms' object does have this firm allready then increase the count in the value field by one
    after going through the entire array return 'firms'.
    */
    let firms = {};
    for (let i = 0; i < shoes_arr.length; i++) {
        if (!Object.keys(firms).map(el => parseInt(el)).includes(shoes_arr[i])) {
            firms[shoes_arr[i]] = 1
        }
        else {
            firms[shoes_arr[i] + '']++;
        }
    }
    return firms;
}

function getNumOfPairs(firms) {
    //Returns the number of pairs from a firm-like object (see 'sortByfirm()')
    //Example: {1:3,2:1} returns 1 because there's only one pair of firm 1 and zero pairs of firm 0
    //Example: {1:1,4:2,3:1} returns 1 because there's only one pair of firm 4 and zero pairs of all the rest.
    /*
    How does it work:
    Loop through the key fields of 'firms' if the number of the shoes from that firm is greater than 0 and it's also an even number (such as 2,4,6...) take it into account by adding to 'pairs' this number divided by 2.
    If however the number of shoes is an odd number ,greater than 1 , such as 3,5,9..etc ,substract 1 from the number than divide it by 2 and add the result to 'pairs'.
    (if it's 1 by substracting 1 we get 0. 0/2 = 0,no pairs to add... )
    return the number of pairs
    */
    let pairs = 0;
    for (let i = 0; i < Object.keys(firms).length; i++) {
        let firm = Object.keys(firms)[i]
        if (firms[firm] > 0 && firms[firm] % 2 === 0) {
            pairs += firms[firm] / 2;
        } else if (firms[firm] % 2 !== 0 && firms[firm] - 1 > 1) {
            pairs += (firms[firm] - 1) / 2;
        }
    }
    return pairs;
}
function solve(K, C, D) {
    /*
    How does it work:
    Loop through the entire array D (dirty-shoes suitcase),
    at each iteration check whether the current shoe's firm if we were to add it (after it has been in the laundry) to array C then the total numbers of pairs in the new 'array C' (clean2) would have increased.
    If so, we can consider it as option to put it in the laundry, then we push it to 'goodOptions' as an object.
    Each object in the 'goodOptions' array is of the form {firm :'the firm of the shoe',cleanPairsContribute :'how many pairs of clean shoes we would have had if we were to put it in the laundry and added it to array C' }
    so basically 'goodOptions' gives us an array of shoes that we can take from array D (the dirty ones) and after cleaning them they will contribute to the overall number of clean pairs.
    in the example given 
     C = [1, 2, 1, 1];
     D = [1, 4, 3, 2, 4];
     D[0]=1,D[3]=2 are the only shoes from D that can contribute to the overall number of clean pairs in C.
    The next step is to sort 'goodOptions' by 'cleanPairsContribute' field in a descending order.
    this way we make sure when we take K shoes out of 'goodOptions' we will take the shoes with the highest possibility of increasing the overall number of clean pairs.
    Final step:
    check if K is greater than or equal to the number of dirty shoes, if so then we can put all the dirty shoes in the laundry and we would get the maximum number of clean pairs.
    In the example  given :
     C = [1, 2, 1, 1];
     D = [1, 4, 3, 2, 4];
     Therefore C+D= [1,2,1,1,1,4,3,2,4]
     getNumOfPairs([1,2,1,1,1,4,3,2,4]) would give us 4 pairs.
    So return 4!

    Now for the else{} block:

    If K is less than D.length, that means we won't be able to fit all the dirty shoes in the laundry!
    So we will need to take only K number of shoes that contribute THE MOST to the overall number of clean pairs.
    so we pull an array of K elements from 'goodOptions', we will call them 'dirtyShoesToWash' and these are actually the shoes which will go into the laundry.
    
    [...C, ...dirtyShoesToWash.map(el => el.firm)] is the array of clean shoes after we have added to them the newly cleaned 'dirtyShoesToWash'.
    
    sortByfirm([...C, ...dirtyShoesToWash.map(el => el.firm)] gives us an object {firm , number of shoes from that firm}.
    
    return getNumOfPairs(sortByfirm([...C, ...dirtyShoesToWash.map(el => el.firm)])) ---->WILL GIVE US THE MAXIMAL NUMBER OF CLEAN PAIRS!
-----------------------------------------------------------------------------------------------------
-----------------------------------------------------------------------------------------------------
     In the example given:

     C = [1, 2, 1, 1]
     D = [1, 4, 3, 2, 4]
     K=2
    solve(K, C, D) will give us:
    'goodOptions' =[
        {
            'firm':1,
            'cleanPairsContribute':2
        },
            {
            'firm':2,
            'cleanPairsContribute':2
        },    
    ]
    (in our case the sorting doesn't make a difference since both shoes have the same 'cleanPairsContribute')

    Since K<D.length we will go straight to the else{} block and we will pull the first 2 elements from 'goodOptions' (which means the entire array)
    after washing the shoes in the laundry machine the new array C is [1,2,1,1,1,2]
    sortByfirm([1,2,1,1,1,2]) gives us {1:4,2:2} that means 2 pairs of firm 1 (4/2=2) and one pair of firm 2 (2/2=1)
    
    
    SO OVERALL THE NUMBER OF CLEAN PAIRS IS 2+1=3!

-----------------------------------------------------------------------------------------------------
-----------------------------------------------------------------------------------------------------
    */
    let goodOptions = [] //pick K elements from this arr so that max pairs are found
    for (let i = 0; i < D.length; i++) { //goes through the entire dirty suitcase. 
        let currentShoeFirm = D[i];
        let clean2 = [...C];
        clean2.push(currentShoeFirm);
        if (getNumOfPairs(sortByfirm(clean2)) > getNumOfPairs(sortByfirm(C))) {
            goodOptions.push({ firm: currentShoeFirm, cleanPairsContribute: getNumOfPairs(sortByfirm(clean2)) });
        }
    }
    console.log("goodOptions", goodOptions)
    goodOptions = goodOptions.sort((a, b) => (b.cleanPairsContribute - a.cleanPairsContribute))
    console.log("goodOptions after sorting", goodOptions)
    if (K >= D.length) return getNumOfPairs(sortByfirm([...C, ...D]));
    else {
        //if K is smaller than the max number of pairs than we need to take K shoes from goodOptions so that overall number of pairs is the highest and return 
        let dirtyShoesToWash = goodOptions.slice(0, K);
        return getNumOfPairs(sortByfirm([...C, ...dirtyShoesToWash.map(el => el.firm)]))
    }


}
function insertExampleData() {
    let C = document.getElementById("c").value = '1, 2, 1, 1';
    let D = document.getElementById("d").value = '1, 4, 3, 2, 4';
    let K = document.getElementById("k").value = '2';
}
function clearData() {
    let C = document.getElementById("c").value = '';
    let D = document.getElementById("d").value = '';
    let K = document.getElementById("k").value = '';
    document.getElementById("c-display").innerText = "";
    document.getElementById("d-display").innerText = "";
    document.getElementById("k-display").innerText = "";
    document.getElementById("result-display").innerText = "";
}
function calcCleanPairs() {
    let C = document.getElementById("c").value.split(',').map(c_el => parseInt(c_el));
    let D = document.getElementById("d").value.split(',').map(c_el => parseInt(c_el));
    let K = parseInt(document.getElementById("k").value)
    let result = solve(K, C, D);
    document.getElementById("c-display").innerText = "C is: " + (C + "");
    document.getElementById("d-display").innerText = "D is: " + (D + "");
    document.getElementById("k-display").innerText = "K is: " + (K + "");
    document.getElementById("result-display").innerText = "Overall Maximal Number Of Clean Pairs: " + (result + "");
}
/*
//Test Case
let C = [1, 2, 1, 1];
let D = [1, 4, 3, 2, 4];
let K = 2;
console.log(solve(K, C, D));
*/
