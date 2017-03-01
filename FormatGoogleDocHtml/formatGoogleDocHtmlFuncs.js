//
// Copyright 2016-2017, Richard J. Moore all rights reserved
//
// formatGoogleDocHtmlFuncs.js
//
// Collection of functions used to convert a Google Docs save as HTML zip file for use on the
// themnmoores.net website
//
// Notes:
//    jszip.min.js must be loaded by the HTML page code
//    FileSaver.js must be loaded by the HTML page code


// *********************************************************************************************************
// Handle some events
// *********************************************************************************************************

function uploadFailed(evt) {
    alert("There was an upload error: " + evt);
}

function uploadCanceled(evt) {
    alert("Operation canceled by the user or the browser dropped the connection.");
}


// *********************************************************************************************************
//   Start the process of up loading a Google Docs save as HTML zip file into local array buffer.
//   Uses standard Javascript FileReader to read the file, which will call ReadOfArchiveFileCompleted
//   below to open and process the zip file.
// *********************************************************************************************************

function StartGoogleDocsHTMLZipConvert() {

    if (!XMLHttpRequest) {
        alert("XMLHttpRequest not supported!!!!");
        return;
    }
    var files = document.getElementById('zipFile').files;
    if (files.length === 0) {
        alert("No files to upload!!!!");
        return;
    }
    var file = files[0];
    imageUploaded = 0;
    document.getElementById('currentFileProcessing').innerHTML = "Processing File: " + file.name;
  

    var reader = new FileReader();
    reader.onloadend = ReadOfArchiveFileCompletedJsZip;
    reader.readAsArrayBuffer(file);

}


// *********************************************************************************************************
// The read of the zip file is complete so get the html file in the zip and transform it, then write it
// back into the zip file and save (download)
// *********************************************************************************************************


function ReadOfArchiveFileCompletedJsZip(evt)
{

    var htmlZipFile = new JSZip();

    htmlZipFile.loadAsync(evt.target.result)
    .then(function success(zip) {
      console.log('Read zip file');
  	  var filesStr = "HTML Files (should only be one):<br><br> ";
      var fileNames = zip.file(/.html/);
  	  for (var file = 0 ; file < fileNames.length ; file++)
	    {
		    filesStr += fileNames[file].name + "<br>";
	    }
      document.getElementById('archiveFileContents').innerHTML = filesStr;
	    
	    if (fileNames.length != 1)
	    {
	      filesStr += "<br><b>Invalid Google Docs Save As HTML ZIP arcive!!!!</b>"
        document.getElementById('archiveFileContents').innerHTML = filesStr;
        return;
	    }
	    
      zip.file(fileNames[0].name).async('string', function (meta) {console.log("Generating the content, we are at " + meta.percent.toFixed(2) + " %");})
      .then(function success(content){

        // *******************************************************************************************************************************
        // ****** Here is where we reformat the html file Google Docs outputs, if you want to play with stuff this is where to do it *****
        // *******************************************************************************************************************************
        
        // Pretty up the beginning so it is more human readable with line feeds, input any javascript files needed
        // also add google analytics all in the <head> tag
        content = '<!doctype html>\n'+ content;
        content = content.replace('<html><head>', '<html>\n\n<head>\n<script src="../../../formatting.js"></script>\n\n');
        // Get the keywords and description from the Google Doc text
        var keywords = '';
        var beginOfKeywords = content.indexOf('>keywords:');
        if (beginOfKeywords != -1)
        {
          keywords = content.substring(beginOfKeywords+11, content.indexOf('</span>', beginOfKeywords));
        }
        var description = '';
        var beginOfDescription = content.indexOf('>description:');
        if (beginOfDescription != -1)
        {
          description = content.substring(beginOfDescription+14, content.indexOf('</span>', beginOfDescription));
        }
        content = content.replace('</style>', '</style>\n\n<script>addGoogleAnalytics();</script>\n\n<meta name="description" content="' + description + '">\n<meta name="keywords" content="' + keywords + '">\n\n');
        
        // Add an onload callback to check for vertical position scrolling
        content = content.replace('<body', '<body onload="setVerticalPositionToSpan()"');
        
        
        // Now set the background formatting, add the header and navigation link areas of the web page in the beginning of the <body>
        content = content.replace('<p class=', '\n\n<script>setBodyBackgroundFormatting();</script>\n<div id="headerTopBar"></div>\n<script>commonPageHeaderBar("","../../../");</script>\n<script>commonNavivationButtons("../../../","");</script>\n\n<p class=');
        
        // Adjust the positioning of the content, 72pt is 1 inch and 36pt is 1/2 inch
        content = content.replace('padding:72pt 72pt 72pt 72pt', 'padding:200px 72pt 72pt 300px')
        content = content.replace('padding:36pt 36pt 36pt 36pt', 'padding:200px 36pt 36pt 300px')
        
        // Finally add the HTMLCommentBox stuff at the end of the <body> stuff
        content = content.replace('</body>', '\n\n<script>addHTMLCommentBox();</script>\n\n</body>');
        
        // This section removed stuff google puts in for html links that causes a redirect warning
        while(content.indexOf('https://www.google.com/url?q=') != -1)
        {
          content = content.replace('https://www.google.com/url?q=', '');
        }
        
        while(content.indexOf('&amp;') != -1)
        {
          var beginningOfTrailerStuff = content.indexOf('&amp;');
          var endOfTrailerStuff = content.indexOf('"', beginningOfTrailerStuff);
          var stringToReplace = content.substring(beginningOfTrailerStuff, endOfTrailerStuff);
          content = content.replace(stringToReplace, '');
        }
        
        while (content.indexOf('?vertscrollspan%3D') != -1)
        {
          content = content.replace('?vertscrollspan%3D', '?vertscrollspan=');
        }
        
        // Replace the modified into the zip file (overwritting the existing one)
        zip.file(fileNames[0].name,content);
        zip.generateAsync({type:"blob"})
        .then(function success(zippedFile) {
          // Save to file
          outputFile = fileNames[0].name.replace('.html', '_new.zip')
          saveAs(zippedFile, outputFile);
        },
        function error(e) {
          document.getElementById('archiveFileContents').innerHTML = '<br><br><b>ERROR creating new zip file: </b>:' + e;
        });
      },
      function error(e){
        document.getElementById('archiveFileContents').innerHTML = '<br><br><b>ERROR reading HTML file ' + fileNames[0].name +' from zip: </b>:' + e;
      });
	    
	    
    },
    function error(e)
    {
      document.getElementById('archiveFileContents').innerHTML = '<br><br><b>ERROR reading zip file: </b>:' + e;
    });

}
