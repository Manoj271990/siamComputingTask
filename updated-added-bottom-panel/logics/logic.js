//gloablVariables
var createDynamicImageDiv, createFigureImage,createbottomPanel,createbottomPanelSub, pageCount=0, jsonDataArray=[];

$(window).on('load', function () {
    //API using http request 
    ajax_get('https://api.unsplash.com/photos/?client_id=7sJ04_uYW3y-Yg85QThOBs5QkBMY41MxW1KQdy6EMxc', function(data) {   
    loadDynamicImage(data);
    }); 

    //uncomment this to load - API using ajax
    /*$.ajax({
        type: 'GET',
        url: 'https://api.unsplash.com/photos/?client_id=7sJ04_uYW3y-Yg85QThOBs5QkBMY41MxW1KQdy6EMxc',
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            loadDynamicImage(data);
        }
    });*/

    setTimeout(function(){   
        totaltilesGrid();
        showContainer();           
    },1800);
});

var closeModal=function(){
    document.getElementById("modal-overlay").style.display="none";
    document.querySelector("body").style.overflowY="auto";
}

var loadDynamicImage=function(jsonData){
    jsonDataArray=jsonData;
    jsonData.map(function(value,ind){
        //create Image Parent Element
        $("<div class='parent-image-items image_"+ind+"' id='parent-image_"+ind+"' data-likes="+value.likes+" data-user="+value.user.name+" data-publishDate="+value.created_at+" data-updatedDate="+value.updated_at+"></div>").appendTo("#main-container");

        $("<div class='image-parent ss-img_"+ind+"' id='sub-ss-img_"+ind+"'><img class='image-items image_"+ind+"' id='image_"+ind+"' src="+value.urls["raw"]+"/></div>").appendTo("#parent-image_"+ind);  

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

        $(".image-items").on("mouseout",function(event){
            onmouseLeave(event);
         });
        

    })
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
        $(".container").css('opacity','1');
        $("body").css('overflow-y','auto');
        $(".globalLoader").hide();
    },4000);
    
}
var openModal=function(currentImage){
    $("#modal-overlay").show();
    $("body").css('overflow-y','hidden');
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
     $("#view-list").text($("#parent-image_"+pageCount).attr("data-likes"));
     $("#download-list").text($("#parent-image_"+pageCount).attr("data-likes"));
     $("#user-name").text($("#parent-image_"+pageCount).attr("data-user"));
     $("#published-on").text("Published On "+new Date($("#parent-image_"+pageCount).attr("data-publishDate")));

     $("#updated-on").text("Updated On "+new Date($("#parent-image_"+pageCount).attr("data-updatedDate")));
     $("#logo-id").css('background-image',"url("+currentImage.target.getAttribute("src")+")");
}

var ajax_get=function(url, callback) {
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

 var resizeImageGrid=function (item){

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
    $("#user-name").text($("#parent-image_"+pageCount).attr("user"));

    $("#published-on").text("Published On "+new Date($("parent-image_"+pageCount).attr("data-publishDate")));
    $("#updated-on").text("Updated On "+new Date($("parent-image_"+pageCount).attr("data-updatedDate"))); 
    $("#logo-id").css('background',"url("+$("image_"+pageCount).attr("src")+")");
}
