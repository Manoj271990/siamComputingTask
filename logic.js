//gloablVariables
var createDynamicImageDiv, createFigureImage;

window.onload=function(){

    ajax_get('https://api.unsplash.com/photos/?client_id=7sJ04_uYW3y-Yg85QThOBs5QkBMY41MxW1KQdy6EMxc', function(data) {
    loadDynamicImage(data);
    setTimeout(function(){waitForImages()},1000);
   });
}



var loadDynamicImage=function(jsonData){
    jsonData.map(function(value,ind){
        createFigureImage=document.createElement("div")
        createFigureImage.id="parent-image_"+ind;
        createFigureImage.className="parent-image-items image_"+ind;


        createDynamicImageDiv=document.createElement("img"); 
        createDynamicImageDiv.id="image_"+ind;
        createDynamicImageDiv.className="image-items image_"+ind;

        createDynamicImageDiv.setAttribute("src",value.urls["raw"]);
        document.getElementById("main-container").appendChild(createFigureImage);
        document.getElementById("parent-image_"+ind).appendChild(createDynamicImageDiv);

    })
}



function ajax_get(url, callback) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            //console.log('responseText:' + xmlhttp.responseText);
            try {
                var data = JSON.parse(xmlhttp.responseText);
            } catch(err) {
                console.log(err.message + " in " + xmlhttp.responseText);
                return;
            }
            callback(data);
        }
    };

    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

 function resizeMasonryItem(item){

    var grid = document.getElementById('main-container'),
        rowGap = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-row-gap')),
        rowHeight = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-auto-rows'));
        var ImageElement=item.getAttribute("id").split("_");
  console.log(ImageElement);
    var rowSpan = Math.ceil((document.getElementById("image_"+ImageElement[1]).getBoundingClientRect().height+rowGap)/(rowHeight+rowGap));
    item.style.gridRowEnd = 'span '+rowSpan;

    /* Make the images take all the available space in the cell/item */
    document.getElementById("image_"+ImageElement[1]).style.height = rowSpan * 10 + "px";
  }
 
  function resizeAllMasonryItems(){
    // Get all item class objects in one list
    var allItems = document.getElementsByClassName('parent-image-items');

    for(var i=0;i>allItems.length;i++){
        var item = document.getElementById('parent-image_'+i);
        resizeMasonryItem(item);
    }
  }

  
  function waitForImages() {
    var allItems = document.getElementsByClassName('parent-image-items');
    console.log(allItems.length);
    for(var i=0;i<allItems.length;i++){
        var item = document.getElementById('parent-image_'+i);
        resizeMasonryItem(item);
    }
  }
  

  var masonryEvents = ['load', 'resize'];
  masonryEvents.forEach( function(event) {
    window.addEventListener(event, resizeAllMasonryItems);
  } );
  


  
