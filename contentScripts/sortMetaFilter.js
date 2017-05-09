//document.body.style.border = "10px solid blue"; // for testing only
// A note on themes: testing reveals that the scripts identiclaly on all themes whether logged in or out, so we only need to know if the user is logged in, not what theme they're using.
// A note on determining if the user is logged in: Handled getting Favorites  in getCommentFavorites() without explicitly detecting whether logged in.

console.log('sortMetaFilter.js ran.');

// Call each function in order, depending on whether the user is logged in with the modern theme, logged in with the classic theme, or not logged in.
runAllCode();
function runAllCode() {
  let allDataObject = {
    commentsArray: [],
    newCommentsArray: [],
    loggedIn: false
  }
  getAllComments(allDataObject);
  removeNonCommentsFromCommentsArray(allDataObject);
  createDuplicateComments(allDataObject);
  sortDuplicateCommentsArrayByFavorites(allDataObject);
  replaceCommentsWithSortedComments(allDataObject);
}

function getAllComments(allDataObject) {
  allDataObject.commentsArray = document.getElementsByClassName('comments');
}

function removeNonCommentsFromCommentsArray(allDataObject) {
  let arrayOfComments = convertNodeListToArray(allDataObject.commentsArray);
  if (arrayOfComments[arrayOfComments.length - 1].id == 'prevDiv2') { // If you're logged in, there will be preview Divs: prevDiv and prevDiv2. Remove them.
    arrayOfComments.splice(-2,1); // Remove the second=-to-last element.
    arrayOfComments.splice(-1,1); // Remove the last element.
  }
  for (let [index, value] of arrayOfComments.entries()) { // Logged in or not there will be an unwanted p and an unwanted div.
    if (value.className === 'comments copy whitesmallcopy') {
      arrayOfComments.splice(-1,1);
    }
  }
  allDataObject.commentsArray = arrayOfComments;
}

function createDuplicateComments(allDataObject) {
  allDataObject.newCommentsArray = [];
  for (comment of allDataObject.commentsArray) {
    allDataObject.newCommentsArray.push(comment.cloneNode(true));
  }
}

function sortDuplicateCommentsArrayByFavorites(allDataObject) {
  allDataObject.newCommentsArray.sort(compareTwoFavorites);
}

function compareTwoFavorites(a,b) {
  //console.log(a);
  a = parseInt(getCommentFavorites(a)); // get Favorites as an integer.
  b = parseInt(getCommentFavorites(b)); // get Favorites as an integer.
  if(a > b) {
    //console.log(a + '>' + b);
    return -1;
  }
  if(a < b) {
    //console.log(a + '<' + b);
    return 1;
  }
  //console.log(a + '==' + b);
  return 0;
}

function getCommentFavorites(comment) {
  // Brute force: just treat the HTML as a string and find the phrase 'users marked this as favorite', and grab the 4 characters (for comments with over 1K Favorites) that might be number of Favorites. Works whether or not the user is logged in.
  let commentHtmlString = comment.innerHTML;
  let indexOfTargetPhrase = comment.innerHTML.search(' marked this as favorite">'); // Can't say 'users' because if there's 1 favorite it's missing the 's'.
  if (indexOfTargetPhrase === -1 ) { // The phrase doesn't appear in the HTML, so it has no favorites.
    return 0;
  } else {
    let totalFavorites = '';
    let firstChar = parseInt(commentHtmlString.substr(indexOfTargetPhrase + 26, 1));
    if (Number.isInteger(firstChar)) { totalFavorites += firstChar; } // String concatenation, not addition.

    let secondChar = parseInt(commentHtmlString.substr(indexOfTargetPhrase + 27, 1));
    if (Number.isInteger(secondChar)) { totalFavorites += secondChar; } // String concatenation, not addition.

    let thirdChar = parseInt(commentHtmlString.substr(indexOfTargetPhrase + 28, 1));
    if (Number.isInteger(thirdChar)) { totalFavorites += thirdChar; } // String concatenation, not addition.

    let fourthChar = parseInt(commentHtmlString.substr(indexOfTargetPhrase + 29, 1)); // Yes, there are a couple comments with over 1K favorites, so we have to handle that situation.
    if (Number.isInteger(fourthChar)) { totalFavorites += fourthChar; } // String concatenation, not addition.

    return parseInt(totalFavorites);
  }
}

function replaceCommentsWithSortedComments(allDataObject) {
  for (let i=0; i < allDataObject.commentsArray.length; i++) {
    allDataObject.commentsArray[i].innerHTML = allDataObject.newCommentsArray[i].innerHTML;
  }
}

function convertNodeListToArray(nodeListToConvert) {
  return nodeListToConvert = Array.prototype.slice.call(nodeListToConvert); // convert NodeList to an Array for easier functional iterating - NodeList doesn't have forEach but arrays do. From https://developer.mozilla.org/en-US/docs/Web/API/NodeList
}

function TESTlistAllCommentFavorites(arrayToIterate) {
  //console.log(allDataObject);
  for (comment of arrayToIterate) {
    console.log(comment);
    console.log(getCommentFavorites(comment));
  }
}
//TESTlistAllCommentFavorites(allDataObject.commentsArray);
//TESTlistAllCommentFavorites(allDataObject.newCommentsArray);
