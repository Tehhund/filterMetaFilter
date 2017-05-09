// This currently doesn't filter everything appropriately. Need to investigate why it misses some comments but not others.
console.log('filterMetaFilter.js ran.');

//browser.runtime.onMessage.addListener(handleMessage);

function handleMessage(request, sender, sendResponse) {
  let allDataObject = {
    commentsArray: [],
    threshold: NaN
  }
  allDataObject.threshold = request.threshold;
  getAllComments(allDataObject);
  removeNonCommentsFromCommentsArray(allDataObject);
  removeCommentsBelowTheThreshold(allDataObject);
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
      console.log(value.className);
      arrayOfComments.splice(-1,1);
    }
  }
  allDataObject.commentsArray = arrayOfComments;
}

function removeCommentsBelowTheThreshold(allDataObject) {
  let threshold = allDataObject.threshold;
  let arrayOfCommentsToRemove = [];
  for (comment of allDataObject.commentsArray) {
    if (parseInt(getCommentFavorites(comment)) < threshold) {
      arrayOfCommentsToRemove.push(comment);
    }
  }
  for (commentToRemove of arrayOfCommentsToRemove) {
    //try {
      commentToRemove.previousSibling.remove(); // Remove unneded a name.
      commentToRemove.nextSibling.remove(); // Remove unneded <br>.
      commentToRemove.nextSibling.remove(); // Remove second unneded <br>.
    //} catch (error) {
      // don't do anything if one of the nodes doesn't exist.
    //} finally {
      commentToRemove.remove();
    //}
  }
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

function convertNodeListToArray(nodeListToConvert) {
  return nodeListToConvert = Array.prototype.slice.call(nodeListToConvert); // convert NodeList to an Array for easier functional iterating - NodeList doesn't have forEach but arrays do. From https://developer.mozilla.org/en-US/docs/Web/API/NodeList
}

function testScript(testThreshold) {
  let request = {
    threshold: testThreshold
  }
  handleMessage(request);
}
//testScript(3);
