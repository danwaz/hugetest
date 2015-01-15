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
    addEvents();
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

      //append the <li> to the <ul>
      newUnorderedList.appendChild(newListItem);

      // check if this contains a submenu
      if(items[i].hasOwnProperty('items')) {
        if(items[i]['items'].length > 0) {
          newListItem.className = 'sub-nav';
          buildNav(items[i]['items'], newListItem);
        }
      }
    }
    //append the <ul> to the parent
    parent.appendChild(newUnorderedList);
  };

  var openSubNav = function() {
    // close all other subnavs
    closeSubNav();
    //open target nav
    this.classList.add('open');
    //show overlay
    document.getElementById('js-nav-overlay').classList.add('active');
  };

  var closeSubNav = function() {
    var subNavs = document.querySelectorAll('.sub-nav');
    for(i = 0; i < subNavs.length; i++) {
      subNavs[i].classList.remove('open');
    }
    //hide overlay
    document.getElementById('js-nav-overlay').classList.remove('active');
  };

  var toggleMobileNav = function() {
    this.classList.toggle('active');
    document.querySelector('body').classList.toggle('nav-open');
  }

  var addEvents = function() {
    var subNavs = document.querySelectorAll('.sub-nav'),
        body = document.querySelector('body'),
        mobileNavToggle = document.getElementById('js-nav-toggle'),
        i;

    // Add open events to subnav toggles
    for(i = 0; i < subNavs.length; i++) {
      subNavs[i].addEventListener('click', openSubNav);
    }

    // Add close event to any item other than subnav toggles
    body.addEventListener('click', function(e){
      // check if the parent is open
      if(!e.target.parentNode.classList.contains('open')) {
        closeSubNav();
      }
    });

    // Add navToggle event for mobile nav
    mobileNavToggle.addEventListener('click', toggleMobileNav);
  }

  makeRequest('/api/nav.json');

})();



