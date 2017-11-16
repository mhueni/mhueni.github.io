/*
    EXERCISE 2:
    automatically select menu items according to the document.location property
*/

// get the url of the current page
var pageUrl = document.location.href;

// split the URL into path parts (at the '/' path dividing character):
// ["http:", "", "002.powercoders.org", "matthias-hueni", "index.html"]
var pageUrlParts = pageUrl.split('/');

// the last part of this array contains our current page link
// get it using the Array.pop() method
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/pop
var currentPage = pageUrlParts.pop();

// get the list of all menu links
var menuLinks = menuBox.getElementsByTagName('a');

// now we loop through the menu links and add the "selected" class to the current page link
for (var i = 0; i < menuLinks.length; i++) {
    var currentLink = menuLinks[i];                     // get the current link element
    var href = currentLink.getAttribute('href');        // get the page HREF attribute of this element
    if (href == currentPage) {                          // if the link is the same like our page:
        currentLink.setAttribute('class', 'selected');  // set the class to "selected"
    }
}
