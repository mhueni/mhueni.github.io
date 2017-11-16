"use strict";

function updateScrollimage() {
 document.getElementById("scrollimage").style.backgroundPosition = Math.round(document.documentElement.scrollTop/(document.body.scrollHeight-document.documentElement.clientHeight)*100) + '%';
}