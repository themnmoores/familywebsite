//
// Copyright 2016-2017, Richard J. Moore all rights reserved
//
// photoslideshow.js
//
// Collection of common functions for doing a photo slide show
//
// A file containing the JSON string photoFileListJSONString must be src'd in the HTML file
// e.g.
//      <script src="photofilelist.js"></script>
//

// Some globals setup by the initializePhotoSlideShow, which must be called first

var currentImage;
var currentImageNumberInSlideShow;
var photoSlideShow;
var caption;
var theCanvas;

var leftArrow;
var rightArrow;


function initializePhotoSlideShow(canvasID, titleID, captionID, leftArrowID, rightArrowID)
{
  populatePhotoListJSONString();
  photoSlideShow = JSON.parse(photoFileListJSONString);

  theCanvas = document.getElementById(canvasID);
  theCanvas.height=Number(photoSlideShow.displayWindow.height);
  theCanvas.width=Number(photoSlideShow.displayWindow.width);
  theCanvas.style.borderWidth="3px";
  theCanvas.style.borderStyle = "solid";
  theCanvas.style.borderColor="#000000";

  caption = document.getElementById(captionID);
  caption.style.width = theCanvas.width.toString() + "px";
  leftArrow =  document.getElementById(leftArrowID);
  rightArrow =  document.getElementById(rightArrowID);
  
  
  
  theTitle = document.getElementById(titleID);
  theTitle.innerHTML = '<b>' + photoSlideShow.displayWindow.title + '</b>';
  
  currentImageNumberInSlideShow = 0;
  setCurrentImage(photoSlideShow.images[currentImageNumberInSlideShow].src,photoSlideShow.images[currentImageNumberInSlideShow].caption);
}


function setCurrentImage(imageFileName, captionText)
{
  caption.innerHTML = captionText;
  currentImage = new Image();
  currentImage.onload = displayCurrentImage;
  currentImage.src = imageFileName;
}


function displayCurrentImage()
{
  ctx = theCanvas.getContext("2d");
  ctx.clearRect(0, 0, theCanvas.width, theCanvas.height);
  // Figure out how to display
  var x = 0;
  var y = 0;
  var width = ctx.canvas.width;
  var height = ctx.canvas.height;
  
  // Figure out how to fit the image to the slide show
  scaleFactorX = width / currentImage.width;
  scaleFactorY = height / currentImage.height;
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
  
}

//
// Callback for the right arrow being pressed, goes to the next higher (N+1) image in the list
// If we are at the end of the list circles back to image 0
//

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
  
  leftArrow.style.visibility = "visible";
  // if (currentImageNumberInSlideShow == photoSlideShow.images.length-1)
  // {
  //   rightArrow.style.visibility = "hidden";
  // }
  
  setCurrentImage(photoSlideShow.images[currentImageNumberInSlideShow].src,photoSlideShow.images[currentImageNumberInSlideShow].caption);
  displayCurrentImage();
}



//
// Callback for the left arrow being pressed, goes to the next lower (N-1) image in the list
// If we are at the start of the list circles back to image N
//

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
  
  rightArrow.style.visibility = "visible";
  // if (currentImageNumberInSlideShow === 0)
  // {
  //   leftArrow.style.visibility = "hidden";
  // }
  
  setCurrentImage(photoSlideShow.images[currentImageNumberInSlideShow].src,photoSlideShow.images[currentImageNumberInSlideShow].caption);
  displayCurrentImage();
}