document.getElementById('sortButton').addEventListener('click', (event) => {
  console.log('You clicked the sort button.');
  browser.tabs.executeScript(null, {
      file: '/contentScripts/sortMetaFilter.js'
    });
});

document.getElementById('filterButton').addEventListener('click', (event) => {
  console.log('You clicked the filter button.');
  browser.tabs.executeScript(null, {
      file: '/contentScripts/filterMetaFilter.js/'
    });

  let commentsThreshold = document.getElementById('commentsThreshold').value;
  if (commentsThreshold == '') {
    console.log('commentsThreshold blank')
    commentsThreshold = 0;
  }
  let gettingActiveTab = browser.tabs.query({active: true, currentWindow: true});
  gettingActiveTab.then((tabs) => {
    browser.tabs.sendMessage(tabs[0].id, {threshold: commentsThreshold});
  });
});
