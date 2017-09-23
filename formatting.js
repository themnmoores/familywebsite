//
// Copyright 2016-2017, Richard J. Moore all rights reserved
//
// formating.js
//
// Collection of common formatting functions, mostly for html generation
//


//
// Sets the body's background color and margins
//
function setBodyBackgroundFormatting() {
  document.body.style.backgroundColor="#E1D6A9";
  document.body.style.margin="0px 0px 0px 0px";
}

//
// Displays a header bar at the top of a web page, and adds a favicon
// *** HTML must create a <div id="headerTopBar"></div> before calling.
//
//    centeredText    Text to display centered in the bar towards to the bottom of the bar (used to indicate the page we are on)
//    pathToBase      How do we get to the base folder of the website e.g. (../../) is empty if page is on base
//
function commonPageHeaderBarNew2(centeredText, pathToBase) {
      textToAdd = '';
      textToAdd += '<div id="themnmoores_headerBar" style="margin:0px 0px 0px 0px;padding:0px 0px 0px 0px;position:relative;left:0px;top:0px;height:160px;width:100vw;background-color:#862507;border=0px none"> ';
      deviceWidth = window.innerWidth;
      deviceWidth3 = screen.width * window.devicePixelRatio;
      if (deviceWidth3 > deviceWidth)
        deviceWidth = deviceWidth3;
      textToAdd += '<a href="' + pathToBase + 'index.html"> <p style="margin:0px 0px 0px 0px;padding:0px 0px 0px 0px;position:absolute;left:20px;width:30%;top:20px;font-family:Georgia, serif;font-size: 40px;color:white">THEMNMOORES.NET</p> </a><img src="' + pathToBase + 'pictures/familysmall.jpg" alt="Family" height="160px" style="position:relative;left:85%;top:0px;margin:0px 0px 0px 0px;padding:0px 0px 0px 0px;border=0px none">'; //<p style="margin:0px 0px 0px 0px;position:relative;left:140px;top:-80px;text-align:left;font-family:Georgia, serif;font-size: 40px;color:white">' + centeredText +'</p>';
     // textToAdd += '<link rel="icon" type="image/x-icon" href="data:image/x-icon;base64,AAABAAEAEBAQAAEABAAoAQAAFgAAACgAAAAQAAAAIAAAAAEABAAAAAAAgAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAA/v7+AP///wCXl5cAZmZmAJ2dnQB9fX0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgIAAgACAgICAgICAgIAIgICAgICAgACAAIEBAQCAgICAgAEAAIAAiIiRERCIiIiIiJEREIiIiIiIkREQiIiIiIiRERCIiIiIiJEREQSIiIiIkREREQiIiAjBAQAAiIiICUGAgIiIiIgIgACACIiIiAiAgICIiIiAAICAgACIiIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" >';
      textToAdd += '</div>';
      docBody = document.getElementsByTagName("body")[0];
      docBody.innerHTML += textToAdd;
}


//
// Displays navivation buttons below the header bar using a div
//    pathToBase      How do we get to the base folder of the website e.g. (../../) is empty if page is on base
//    grayOut         Display the Nth navigation button as a gray button to indicate this is where we are
//                      1 = Home
//                      2 = Pictures
//                      3 = Blogs
//
function commonNavivationButtonsNew2(pathToBase, grayOut) {
      docBody = document.getElementsByTagName("body")[0];
      
      textToAdd = '';
      //textToAdd += '<div id="themnmoores_nav" style="position:absolute;left:20px;top:180px"> ';
      textToAdd += '<div id="themnmoores_nav" style="text-align:center;margin-top:20px;margin-left: auto;margin-right: auto;border:0px none;width=1200px;"> ';
      
      if (grayOut == "1")
        textToAdd += '<img src="' + pathToBase + 'pictures/homegraybutton.png" alt="Home" height="50" style="margin-left:0px;border:0 none">';
      else
        textToAdd += '<a style="margin-left:0px;border:0"href="' + pathToBase + 'index.html"><img src="' + pathToBase + 'pictures/homebutton.png" alt="Home" height="50" ></a>';
      
      if (grayOut == "2")
        textToAdd += '<img src="' + pathToBase + 'pictures/picturesgraybutton.png" alt="Home" height="50" style="margin-left:60px;border:0">';
      else
        textToAdd += '<a style="margin-left:60px;border:0 none" href="' + pathToBase + 'pictures.html"><img src="' + pathToBase + 'pictures/picturesbutton.png" height="50" ></a>';

      if (grayOut == "3")
        textToAdd += '<img src="' + pathToBase + 'pictures/blogsgraybutton.png" alt="Home" height="50" style="margin:0px 0px 0px 0px;margin-left:60px;border:0">';
      else
        textToAdd += '<a style="margin-left:60px;border:0" href="' + pathToBase + 'blogs.html"><img src="' + pathToBase + 'pictures/blogsbutton.png" alt="Home" height="50" ></a>';
      
      textToAdd += "</div>";
      docBody.innerHTML += textToAdd;
}



//
// Adds the HTML code for incorporating HTML Comment Box to the bottom of a webpage
//
function addHTMLCommentBox() {
  docBody.innerHTML += '<div id="HCB_comment_box"><a href="http://www.htmlcommentbox.com">Widget</a> is loading comments...</div><link rel="stylesheet" type="text/css" href="//www.htmlcommentbox.com/static/skins/bootstrap/twitter-bootstrap.css?v=0" />';
  
if(!window.hcb_user){hcb_user={};} (function(){var s=document.createElement("script"), l=hcb_user.PAGE || (""+window.location).replace(/'/g,"%27"), h="//www.htmlcommentbox.com";s.setAttribute("type","text/javascript");s.setAttribute("src", h+"/jread?page="+encodeURIComponent(l).replace("+","%2B")+"&mod=%241%24wq1rdBcg%248DKVvDwwAtdLRiQpjTnoU0"+"&opts=16862&num=10&ts=1482012402568");if (typeof s!="undefined") document.getElementsByTagName("head")[0].appendChild(s);})();

  
}


//
// Adds google analytics to a page
//
function addGoogleAnalytics() {
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-84283855-1', 'auto');
  ga('send', 'pageview');
}

//
// Sets the vertical scroll position such that a span that contains the specified text
// is at the top of the browser screen, does nothing if a span is not found
//
//  html page url must have the vertscrollspan=text_to_find as a url parameter. _ are replaced with spaces
//
//  e.g.     www.mywebsite.net/thepage.html?vertscrollspan=Wine_To_Buy
//

function setVerticalPositionToSpan () {
  var parameterWeAreLookingFor = 'vertscrollspan=';
  var urlParameters = window.location.search;
  var vertScrollSpanParameter = urlParameters.indexOf(parameterWeAreLookingFor);
  if (vertScrollSpanParameter != -1)
  {
    var stringWeAreLookingFor = urlParameters.substring(vertScrollSpanParameter+parameterWeAreLookingFor.length);
    var endOfParameterText = stringWeAreLookingFor.indexOf('&');
    if (endOfParameterText != -1)
    {
      endOfParameterText += vertScrollSpanParameter+parameterWeAreLookingFor.length;
      stringWeAreLookingFor = urlParameters.substring(vertScrollSpanParameter+parameterWeAreLookingFor.length, endOfParameterText);
    }
    while(stringWeAreLookingFor.indexOf('_') != -1)
    {
      stringWeAreLookingFor = stringWeAreLookingFor.replace('_', ' ');
    }
    var listOfSpans = document.getElementsByTagName("Span");
    var numberOfElements = listOfSpans.length;
    for (var element = 0 ; element < numberOfElements ; element++)
    {
      var span = listOfSpans[element];
      //if (span.innerHTML.length < 120 && span.innerHTML.indexOf(stringWeAreLookingFor) != -1)
      if (span.innerHTML.length > 2 && span.innerHTML.indexOf(stringWeAreLookingFor) != -1)
      {
        window.scroll(0,span.offsetTop - 400);
        break;
      }
    }
  }
  
}


// **************************************************** Used for including Google Docs for blog posting so I do not have to change things

// Creating the viewport

function TextForCreateViewport()
{
  docHead = document.getElementsByTagName("head")[0];
  docBody.innerHTML += '<meta name="viewport" content="width=1200">\n\n';
}

  
  // ********************************* OLD STUFF
  
   
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
      //window.alert("width = " + deviceWidth.toString());
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


