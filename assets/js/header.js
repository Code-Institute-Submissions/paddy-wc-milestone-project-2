$(".filter-col").click(function(){
    $(".filter-col").removeAttr("id");
    $(this).attr('id', 'filter-button-pressed');
})