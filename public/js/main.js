(function() {
  var httpRequest;
  var makeRequest = function(url) {
    httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = alertContents;
    httpRequest.open('GET', url);
    httpRequest.send();
  };

  var alertContents = function() {
    if (httpRequest.readyState === 4) {
      if (httpRequest.status === 200) {
        parseJSONResponse(httpRequest.responseText);
      } else {
        console.log('There was a problem with the request.');
      }
    }
  };

  var parseJSONResponse = function(response) {
    var parsedResponse = JSON.parse(response),
        mainNav = document.getElementById('js-main-nav');

    buildNav(parsedResponse.items, mainNav);
  };

  var buildNav = function(data, parent) {
    var items = data,
        newUnorderedList = document.createElement('ul'),
        i, newListItem, newAnchor;

    for(i = 0; i < items.length; i++) {
      newListItem = document.createElement('li');
      newAnchor = document.createElement('a');
      newAnchor.text = items[i]['label'];
      newAnchor.href = items[i]['url'];
      
      //append the <a> to the <li>
      newListItem.appendChild(newAnchor);

      //append the <li> to the mainNav
      newUnorderedList.appendChild(newListItem);

      // check if this contains a submenu
      if(items[i].hasOwnProperty('items')) {
        if(items[i]['items'].length > 0) {
          newListItem.className = 'sub-nav';
          buildNav(items[i]['items'], newListItem);
        }
      }
    }
    //append the <li> to the mainNav
    parent.appendChild(newUnorderedList);
  };

  makeRequest('/api/nav.json');

})();



