//
// formating.js
//
// Collection of common formatting functions, mostly for html generation
//

//
// Displays a header bar at the top of a web page.
//    centeredText    Text to display centered in the bar towards to the bottom of the bar (used to indicate the page we are on)
//    pathToBase      How do we get to the base folder of the website e.g. (../../) is empty if page is on base
//
function commonPageHeaderBar(centeredText, pathToBase) {
      whatisthepath = window.location.pathname;
      theDivWeWant = document.getElementById("headerTopBar");
      theDivWeWant.style.position="absolute"
      theDivWeWant.style.left="0px"
      theDivWeWant.style.top="0px"
      theDivWeWant.style.width="100%";
      theDivWeWant.style.height ="160px";
      theDivWeWant.style.backgroundColor="#862507";
      theDivWeWant.style.border="0px none";
      theDivWeWant.style.minWidth="1024px";
      theDivWeWant.innerHTML = '<a href="' + pathToBase + 'index.html"> <p style="margin:0px 0px 0px 0px;position:absolute;left:20px;width:30%;top:20px;font-family:Georgia, serif;font-size: 40px;color:white">THEMNMOORES.NET</p> </a><img src="' + pathToBase + 'pictures/familysmall.jpg" alt="Family" height="160" style="position:relative;left:85%;top:0px"><p style="margin:0px 0px 0px 0px;position:relative;right;left:0%;width:100%;top:-60px;text-align: center;font-family:Georgia, serif;font-size: 40px;color:white">' + centeredText +'</p>';
}
