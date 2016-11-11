//
// formating.js
//
// Collection of common formatting functions, mostly for html generation
//

//
// Displays a header bar at the top of a web page, and adds a favicon
// *** HTML must create a <div id="headerTopBar"></div> before calling.
//
//    centeredText    Text to display centered in the bar towards to the bottom of the bar (used to indicate the page we are on)
//    pathToBase      How do we get to the base folder of the website e.g. (../../) is empty if page is on base
//
function commonPageHeaderBar(centeredText, pathToBase) {
      theDivWeWant = document.getElementById("headerTopBar");
      theDivWeWant.style.position="absolute";
      theDivWeWant.style.left="0px";
      theDivWeWant.style.top="0px";
      theDivWeWant.style.height ="160px";
      theDivWeWant.style.backgroundColor="#862507";
      theDivWeWant.style.border="0px none";
      deviceWidth = window.innerWidth - window.pageXOffset;
      if (deviceWidth < screen.width)
        deviceWidth = screen.width;
      window.alert("width = " + deviceWidth.toString());
      theDivWeWant.style.width=deviceWidth.toString() + "px";
      theDivWeWant.style.minWidth="1024px";
      //theDivWeWant.style.minWidth="1200px";
      theDivWeWant.innerHTML = '<a href="' + pathToBase + 'index.html"> <p style="margin:0px 0px 0px 0px;position:absolute;left:20px;width:30%;top:20px;font-family:Georgia, serif;font-size: 40px;color:white">THEMNMOORES.NET</p> </a><img src="' + pathToBase + 'pictures/familysmall.jpg" alt="Family" height="160" style="position:relative;left:85%;top:0px"><p style="margin:0px 0px 0px 0px;position:relative;right;left:0%;width:100%;top:-60px;text-align: center;font-family:Georgia, serif;font-size: 40px;color:white">' + centeredText +'</p>';
      theDivWeWant.innerHTML += '<link rel="icon" type="image/x-icon" href="data:image/x-icon;base64,AAABAAEAEBAQAAEABAAoAQAAFgAAACgAAAAQAAAAIAAAAAEABAAAAAAAgAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAA/v7+AP///wCXl5cAZmZmAJ2dnQB9fX0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgIAAgACAgICAgICAgIAIgICAgICAgACAAIEBAQCAgICAgAEAAIAAiIiRERCIiIiIiJEREIiIiIiIkREQiIiIiIiRERCIiIiIiJEREQSIiIiIkREREQiIiAjBAQAAiIiICUGAgIiIiIgIgACACIiIiAiAgICIiIiAAICAgACIiIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" >'
}


//
// Displays navivation buttons on the left hand side of a wab page (absolute position on document body).
//    pathToBase      How do we get to the base folder of the website e.g. (../../) is empty if page is on base
//    grayOut         Display the Nth navigation button as a gray button to indicate this is where we are
//                      1 = Home
//                      2 = Pictures
//                      3 = Blogs
//
function commonNavivationButtons(pathToBase, grayOut) {
      docBody = document.getElementsByTagName("body")[0];
      if (grayOut == "1")
        docBody.innerHTML += '<img src="' + pathToBase + 'pictures/homegraybutton.png" alt="Home" height="50" style="position:absolute;left:20px;top:180px">';
      else
        docBody.innerHTML += '<a href="' + pathToBase + 'index.html"> <img src="' + pathToBase + 'pictures/homebutton.png" alt="Home" height="50" style="position:absolute;left:20px;top:180px"></a>';
      
      if (grayOut == "2")
        docBody.innerHTML += '<img src="' + pathToBase + 'pictures/picturesgraybutton.png" alt="Home" height="50" style="position:absolute;left:20px;top:250px">';
      else
        docBody.innerHTML += '<a href="' + pathToBase + 'pictures.html"> <img src="' + pathToBase + 'pictures/picturesbutton.png" alt="Home" height="50" style="position:absolute;left:20px;top:250px"></a>';

      if (grayOut == "3")
        docBody.innerHTML += '<img src="' + pathToBase + 'pictures/blogsgraybutton.png" alt="Home" height="50" style="margin:0px 0px 0px 0px;position:absolute;left:20px;top:320px">';
      else
        docBody.innerHTML += '<a href="' + pathToBase + 'blogs.html"> <img src="' + pathToBase + 'pictures/blogsbutton.png" alt="Home" height="50" style="margin:0px 0px 0px 0px;position:absolute;left:20px;top:320px"></a>';
        
}

