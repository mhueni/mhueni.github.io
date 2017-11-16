/* 
    EXERCISE 1:
    show or hide the menu when the burger menu button is clicked
*/

// get a reference to the burger button
var menuButton = document.getElementById('menu-button');

// get a reference to the box containing the menu to be shown / hidden
var menuBox = document.getElementById('menu-box');

/*
    WHERE THE MAGIC HAPPENS:
    this function shall be executed every time the burger button has been pressed
*/
var burgerMenuShowHide = function(event) {
    if (menuBox.style.display == 'block') { // if the menu box is set to "display:block":
        menuBox.style.display = 'none';     // change it to "none"
    } else {                                // otherwise:
        menuBox.style.display = 'block';    // change it to "block"
    }
};

// attach the "onClick" function to the "click" event of the burger button
menuButton.addEventListener('click', burgerMenuShowHide);
