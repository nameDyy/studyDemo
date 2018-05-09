$(function(){
    $(".user").click(function(){
        var display=$(".div_log").css('display');
        if(display==="none"){
            $(".div_log").css('display','block' );
        }else{
            $(".div_log").css('display','none' );
        }
        
    })
    $(".clickbox").click(function(){
        var display=$(".lettlebox").css('display');
        if(display==="none"){
            $(".lettlebox").css('display','block' );
        }else{
            $(".lettlebox").css('display','none' );
        }
    })
})
