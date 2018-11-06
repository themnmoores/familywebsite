//
// Copyright 2017, Richard J. Moore all rights reserved
//
// photoslideshow.js
//
// Collection of common functions for doing a photo slide show
//
// A file containing the JSON string photoFileListJSONString must be src'd in the HTML file
// e.g.
//      <script src="photofilelist.js"></script>
//

// *************************************************************************************************************
// Some globals setup by the initializePhotoSlideShow function, which must be called first!!!
// *************************************************************************************************************

var currentImage;
var currentImageNumberInSlideShow;
var photoSlideShow;
var caption;
var theCanvas;

var leftArrow;
var rightArrow;


// *********************************************************************************************************
//   This function must be called before any other functions!!!!
//
//   Initializes the global variables, parses the JSON string that must be in a global variable
//   photoFileListJSONString initialized by another javascript script file sourced by the HTML page before
//   this function is called, and then initializes the elements for the photo slide show, and finally
//   starts the process of loading the first photo for display.
//
//   Uses standard Javascript FileReader to read the file, which will call ReadOfArchiveFileCompleted
//   below to open and process the zip file.
//
//    jsonFile    File containing json string information about slide show
//    canvasID    The string ID of the canvas element on the HTML page to use for displaying the photos
//    titleID     The string ID of the title element (text <p>) for the photo slide show title, defined in
//                JSON string
//    captionID   The string ID of the caption element (text <p>) for the caption text of each photo,
//                defined in JSON string
//    leftArrowID The string ID of the left arrow element (image) used to set up navigating down the photos
//    rightArrowID The string ID of the right arrow element (image) used to set up navigating up the photos
//
// *********************************************************************************************************


function initializePhotoSlideShow(canvasID, titleID, captionID, leftArrowID, rightArrowID)
{
  // populatePhotoListJSONString();
  photoSlideShow = JSON.parse(photoFileListJSONString);
  
  // So I do not have to change all the HTML files (does not work)
  //tviewport = document.getElementsByName("viewport");
  //tviewport[0].setAttribute("content", "width=1300");
  
  theCanvas = document.getElementById(canvasID);
  theCanvas.height=Number(photoSlideShow.displayWindow.height);
  theCanvas.width=Number(photoSlideShow.displayWindow.width);
  theCanvas.style.borderWidth="3px";
  theCanvas.style.borderStyle = "solid";
  theCanvas.style.borderColor="#000000";
  theCanvas.style.marginLeft = "auto";
  theCanvas.style.marginRight = "auto";
  theCanvas.style.marginTop = "12px";

  caption = document.getElementById(captionID);
  caption.readOnly = true;
  caption.autoFocus = false;
  caption.style.width = theCanvas.width.toString() + "px";
  caption.style.fontFamily = "Arial,serif";
  caption.style.fontSize = "100%";
  caption.style.lineHeight = "1.2";
  caption.style.marginLeft = "auto";
  caption.style.marginRight = "auto";
  caption.style.marginTop = "12px";
  caption.style.textAlign = "left";
  caption.style.backgroundColor = document.body.style.backgroundColor;
  caption.style.borderStyle = "hidden";
  caption.rows = 10;
  caption.cols = 100;
  caption.readOnly = true;
  caption.autoFocus = false;
  
  leftArrow =  document.getElementById(leftArrowID);
  rightArrow =  document.getElementById(rightArrowID);
  
  
  //textToSave = JSON.stringify(photoSlideShow);

  
  theTitle = document.getElementById(titleID);
  theTitle.readOnly = true;
  theTitle.autoFocus = false;
  theTitle.style.width = theCanvas.width.toString() + "px";
  theTitle.style.fontFamily = "Arial,serif";
  theTitle.style.fontSize = "120%";
  theTitle.style.fontWeight = "bold";
  theTitle.style.marginLeft = "auto";
  theTitle.style.marginRight = "auto";
  theTitle.style.marginTop = "10px";
  theTitle.style.textAlign = "center";
  theTitle.style.backgroundColor = document.body.style.backgroundColor;
  theTitle.style.borderStyle = "hidden";
  theTitle.rows = 1;
  theTitle.cols = 100;
  
  theTitle.innerHTML = photoSlideShow.displayWindow.title;
  
  currentImageNumberInSlideShow = 0;
  setCurrentImage(photoSlideShow.images[currentImageNumberInSlideShow].src,photoSlideShow.images[currentImageNumberInSlideShow].caption);
}

// *********************************************************************************************************
//   Uses standard Javascript Image object to read the file, which will call displayCurrentImage
//   below when the image file data is loaded to display the photo.
// *********************************************************************************************************

function setCurrentImage(imageFileName, captionText)
{
  caption.innerHTML = captionText;
  currentImage = new Image();
  currentImage.onload = displayCurrentImage;
  currentImage.src = imageFileName;
}

// *********************************************************************************************************
//   Called when the Image object has loaded the file data to display the photo. Figures out the dimensions
//   of the image in the canvas element so that the image aspect ration is preserved.
// *********************************************************************************************************

function displayCurrentImage()
{
  ctx = theCanvas.getContext("2d");
  ctx.clearRect(0, 0, theCanvas.width, theCanvas.height);
  // Figure out how to display
  var x = 0;
  var y = 0;
  var width = ctx.canvas.width;
  var height = ctx.canvas.height;
  
  // Figure out how to fit the image to the slide show, we nudge by 1 to make sure we fill the frame.
  scaleFactorX = (width + 1) / currentImage.width;
  scaleFactorY = (height + 1) / currentImage.height;
  if (scaleFactorX < scaleFactorY)      // Means the x dimension gets scaled more
  {
    y = (height - (currentImage.height * scaleFactorX)) / 2.0; // So we center the image vertically
    height = currentImage.height * scaleFactorX;
  }
  else                                  // Means the y dimension gets scaled more
  {
    x = (width - (currentImage.width * scaleFactorY)) / 2.0; // So we center the image horizontally
    width = currentImage.width * scaleFactorY;
    
  }
  
  ctx.drawImage(currentImage, x, y, width, height);

  // Now draw the left and right arrows
  var midY = ctx.canvas.height / 2.0;
  ctx.strokeStyle = "#7F7F7F";
  ctx.lineWidth = 10;
  ctx.lineJoin="round";
  ctx.beginPath();
  ctx.moveTo(50,midY-50);
  ctx.lineTo(20,midY);
  ctx.lineTo(50,midY+50);
  ctx.moveTo(ctx.canvas.width-50,midY-50);
  ctx.lineTo(ctx.canvas.width-20,midY);
  ctx.lineTo(ctx.canvas.width-50,midY+50);
  ctx.stroke();
  
}


// *********************************************************************************************************
// Callback for when there is a mouse click in the canvas. If it is in the left 1/3 of the canvas we go
// like a left arrow was pressed, if it is in the right 1/3 of the canvas we go like right arrow was
// pressed.
// *********************************************************************************************************


function mouseClickInCanvas(evt)
{
  ctx = theCanvas.getContext("2d");
  if ( evt.offsetX < ctx.canvas.width/3)
  {
    leftArrowPressed();
  }
  
  if (evt.offsetX > ctx.canvas.width - ctx.canvas.width/3)
  {
    rightArrowPressed();
  }
  
}

// *********************************************************************************************************
// Callback for the right arrow being pressed, goes to the next higher (N+1) image in the list
// If we are at the end of the list circles back to image 0
// *********************************************************************************************************


function rightArrowPressed()
{
  if (currentImageNumberInSlideShow == photoSlideShow.images.length-1)
  {
    //return;         // Nothing to do we are alread at the end of the list (really an error)
    currentImageNumberInSlideShow = 0;
  }
  else
  {
    currentImageNumberInSlideShow++;
  }
  
  //leftArrow.style.visibility = "visible";
  // if (currentImageNumberInSlideShow == photoSlideShow.images.length-1)
  // {
  //   rightArrow.style.visibility = "hidden";
  // }
  
  setCurrentImage(photoSlideShow.images[currentImageNumberInSlideShow].src,photoSlideShow.images[currentImageNumberInSlideShow].caption);
  displayCurrentImage();
}



// *********************************************************************************************************
// Callback for the left arrow being pressed, goes to the next lower (N-1) image in the list
// If we are at the start of the list circles back to image N
// *********************************************************************************************************

function leftArrowPressed()
{
  if (currentImageNumberInSlideShow === 0)
  {
    //return;         // Nothing to do we are alread at the end of the list (really an error)
    currentImageNumberInSlideShow = photoSlideShow.images.length-1;
  }
  else
  {
    currentImageNumberInSlideShow--;
  }
  
  //rightArrow.style.visibility = "visible";
  // if (currentImageNumberInSlideShow === 0)
  // {
  //   leftArrow.style.visibility = "hidden";
  // }
  
  setCurrentImage(photoSlideShow.images[currentImageNumberInSlideShow].src,photoSlideShow.images[currentImageNumberInSlideShow].caption);
  displayCurrentImage();
}