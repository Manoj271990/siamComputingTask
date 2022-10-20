//gloablVariables
var createDynamicImageDiv, createFigureImage,createbottomPanel,createbottomPanelSub, pageCount=0, jsonDataArray=[];

window.onload=function(){

    ajax_get('https://api.unsplash.com/photos/?client_id=7sJ04_uYW3y-Yg85QThOBs5QkBMY41MxW1KQdy6EMxc', function(data) {   
    loadDynamicImage(data);
    }); 
}

var closeModal=function(){
    document.getElementById("modal-overlay").style.display="none";
    document.querySelector("body").style.overflowY="auto";
}

var loadDynamicImage=function(jsonData){
    jsonDataArray=jsonData;
    jsonData.map(function(value,ind){
        //create Image Parent Element
        $("<div class='parent-image-items image_"+ind+"' id='parent-image_"+ind+"' data-likes="+value.likes+" data-user="+value.user.name+" data-publishDate="+value.created_at+" data-updatedDate="+value.updated_at+"></div>").appendTo("#main-container");

        var createsubImageSections=document.createElement("div");
        createsubImageSections.className="image-parent ss-img_"+ind;
        createsubImageSections.id="sub-ss-img_"+ind;

        //create Image  Element using create Element
        createDynamicImageDiv=document.createElement("img"); 
        createDynamicImageDiv.id="image_"+ind;
        createDynamicImageDiv.className="image-items image_"+ind;
        createDynamicImageDiv.setAttribute("src",value.urls["raw"]);   
        
        document.getElementById("parent-image_"+ind).appendChild(createsubImageSections);  
        document.getElementById("sub-ss-img_"+ind).appendChild(createDynamicImageDiv);

        $("#parent-image_"+ind).append("<div class='bottom-button-container' id='btn-cont_"+ind+"'></div>"); 

        //create bottom panel sub division using innerHTML
        for(var i=0;i<3;i++){
            $("<div class='bottom-panel-sub butn-"+i+"'><div class='sub_"+i+"'></div></div>").appendTo("#sub-ss-img_"+ind);   
        }



        for(var i=0;i<3;i++){
            var innerCreateDescrbottomPanel=document.createElement("div");
            innerCreateDescrbottomPanel.className="desc-panel-sub descr_"+i;
            innerCreateDescrbottomPanel.innerHTML="Wall Papers"
            document.getElementById("btn-cont_"+ind).appendChild(innerCreateDescrbottomPanel);         
        }

        $(".image-items").on("click",function(event){
            openModal(event);
        });

        $(".image-items").on("mouseover",function(event){
           onmouseEnter(event);
          
        });

        createDynamicImageDiv.addEventListener("mouseout",function(event){
            onmouseLeave(event);
         });
        

    })

    setTimeout(function(){   
        totaltilesGrid();
        showContainer();           
    },1800);
}

var onmouseLeave=function(getCurrentTiles){
    var elems = getCurrentTiles.target.parentElement.id;
    var siblingsElement=$("#"+elems).find(".bottom-panel-sub");
    var index = 0, length = siblingsElement.length;
    for ( ; index < length; index++) {
        $("#"+elems).find(".butn-"+index).css({"transition":"opacity 0.5s linear 0s","opacity":"0"});
    }
}

var onmouseEnter=function(getCurrentTiles){
    var elems = getCurrentTiles.target.parentElement.id;
    var siblingsElement=$("#"+elems).find(".bottom-panel-sub");
    var index = 0, length = siblingsElement.length;
    for ( ; index < length; index++) {
        $("#"+elems).find(".butn-"+index).css({"transition":"opacity 0.5s linear 0s","opacity":"1"});
    }
}
var showContainer=function(){
    setTimeout(function(){
        document.querySelector(".container").style.opacity="1";
        document.querySelector("body").style.overflowY="auto";
        document.querySelector(".globalLoader").style.display="none";
    },4000);
    
}
var openModal=function(currentImage){
    document.getElementById("modal-overlay").style.display="inline-block";
    document.querySelector("body").style.overflowY="hidden";
    var getID=currentImage.target.id;
     var splitId=getID.split("_");
     pageCount=parseInt(splitId[1]);
     if(pageCount==0){
        $(".prev").addClass('disabled');
     }
     else if(pageCount==document.getElementsByClassName('parent-image-items').length-1){
        $(".next").addClass('disabled');
     }
     else{
        $(".prev").removeClass('disabled');
        $(".next").removeClass('disabled');
     }
     $("#modal-image").attr("src",currentImage.target.getAttribute("src"));
     $("#view-list").text(document.getElementById("parent-image_"+pageCount).getAttribute("data-likes"));
     $("#download-list").text(document.getElementById("parent-image_"+pageCount).getAttribute("data-likes"));
     $("#user-name").text(document.getElementById("parent-image_"+pageCount).getAttribute("data-user"));
     $("#published-on").text("Published On "+new Date(document.getElementById("parent-image_"+pageCount).getAttribute("data-publishDate")));

     document.getElementById("updated-on").innerText="Updated On "+new Date(document.getElementById("parent-image_"+pageCount).getAttribute("data-updatedDate"));
     document.getElementById("logo-id").style.backgroundImage="url("+currentImage.target.getAttribute("src")+")";
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

 function resizeImageGrid(item){

    var grid = document.getElementById('main-container'),rowGap = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-row-gap')),
    rowHeight = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-auto-rows'));
    var ImageElement=item.attr("id").split("_");
    var rowSpan = Math.ceil(($("#image_"+ImageElement[1]).get(0).getBoundingClientRect().height)/(rowHeight+rowGap));
    var fixedImageHeight;
    
    if(window.innerWidth<575){
        $(item).css('gridRowEnd','span '+parseInt(rowSpan+15));
        fixedImageHeight=Math.ceil(((($("#image_"+ImageElement[1]).get(0).getBoundingClientRect().height)+rowGap))/(rowGap));
        document.getElementById("sub-ss-img_"+ImageElement[1]).style.height = (fixedImageHeight * 10)+ "px";
    }
    else if(window.innerWidth<767){
        $(item).css('gridRowEnd','span '+parseInt(rowSpan+12));
        fixedImageHeight=Math.ceil(((($("#image_"+ImageElement[1]).get(0).getBoundingClientRect().height)+rowGap))/(rowGap));
        document.getElementById("sub-ss-img_"+ImageElement[1]).style.height = (fixedImageHeight * 10)+ "px";
    }
    else {
        $(item).css('gridRowEnd','span '+parseInt(rowSpan));
        fixedImageHeight=Math.ceil(((($("#image_"+ImageElement[1]).get(0).getBoundingClientRect().height)+rowGap)-(parseInt(document.querySelector(".bottom-button-container").clientHeight) * (item.find(".bottom-panel-sub").length-1)))/(rowGap));
        document.getElementById("sub-ss-img_"+ImageElement[1]).style.height = (fixedImageHeight * 10)+ "px";
    }
  }
  
  var totaltilesGrid=function() {
    let allItems = $('.parent-image-items');
    for(let i=0;i<allItems.length;i++){
        let item = $('#parent-image_'+i);
        resizeImageGrid(item);
    }
  }
  
  window.onresize=function(){
    //totaltilesGrid();
  }

var prevNextLoadImage=function(getNavigation){
 
    if(getNavigation=="prev"){
        pageCount--;
        if(pageCount==0){
            pageCount=0;
            $(".prev").addClass('disabled');
        }else{
            
            $(".prev").removeClass('disabled');
            $(".next").removeClass('disabled');
        }
    }
    else {
        pageCount++;
        if(pageCount==$('.parent-image-items').length-1){
            pageCount=$('.parent-image-items').length-1;
            $(".next").addClass('disabled');
            
        }else{           
            $(".prev").removeClass('disabled');
            $(".next").removeClass('disabled');
        }
    }

    $("#modal-image").attr("src",$("#image_"+pageCount).attr("src"));
    $("#view-list").text($("#parent-image_"+pageCount).attr("data-likes"));
    $("#user-name").text($("#parent-image_"+pageCount).data("user"));

    document.getElementById("published-on").innerText="Published On "+new Date(document.getElementById("parent-image_"+pageCount).getAttribute("data-publishDate"));
    document.getElementById("updated-on").innerText="Updated On "+new Date(document.getElementById("parent-image_"+pageCount).getAttribute("data-updatedDate")); 
    document.getElementById("logo-id").style.backgroundImage="url("+document.getElementById("image_"+pageCount).getAttribute("src")+")";
}
