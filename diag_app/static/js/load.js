function getCookie(name) {
   var cookieValue = null;
   if (document.cookie && document.cookie !== '') {
       var cookies = document.cookie.split(';');
       for (var i = 0; i < cookies.length; i++) {
           var cookie = jQuery.trim(cookies[i]);
           if (cookie.substring(0, name.length + 1) === (name + '=')) {
               cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
               break;
           }
       }
   }
   return cookieValue;
}


var csrftoken = getCookie('csrftoken');
function csrfSafeMethod(method) {
   return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}


$.ajaxSetup({
    beforeSend: function(xhr, settings) {
        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    }
});

// load database
function loadModels(){
    var url = 'https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeYear/make/suzuki/modelyear/2016/vehicletype/moto?format=json'
    $.ajax({
        url: url,
        type: 'GET'
    }).done(function(results){
        var bike = results.Results
        var year = parseInt(results.SearchCriteria.substring(24,28))
        console.log(year)
        for (var i=0; i < bike.length; i++){
            context = {
                name: bike[i].Model_Name,
                year: year,
                brand: 2,
            }
            // console.log(context)
            $.ajax({
                url: '/api/models/',
                type: 'POST',
                data: context,
            }).done(function(results){
                console.log(results)
            })
        }
    })
}
$("#loadBikes").click(loadModels)



// update solution score
function updateScore(){
    var solutionId = 2
    var url = '/api/solutions/' + solutionId + '/'
    $.ajax({
        url: url,
        type: 'GET'
    }).done(function(results){
        var votes = results.votes
        var currentScore = results.score
        var voteTotal = 0
        for (var i=0; i < votes.length; i++){
            voteTotal += votes[i].value
        }
        currentScore = voteTotal
        var newScore = {
            score: currentScore
        }
        $.ajax({
            url: url,
            type: 'PATCH',
            data: newScore,
        }).done(function(results){
        })
    })
}
$("#updateScore").click(updateScore)



// brand/model listing
function getBrands(){
    $.ajax({
        url: '/api/brands/',
        type: 'GET',
    }).done(function(results){
        var source = $('#brand-template').html()
        var template = Handlebars.compile(source)
        var html = template(results.results)
        $('#listing').append(html)

    })
}
getBrands()


function showModels(id){
    $.ajax({
        url: '/api/models?brand=' + id,
        type: 'GET'
    }).done(function(results){
        $('#listing').empty()
        console.log(results.results)
        var source = $('#model-template').html()
        var template = Handlebars.compile(source)
        var html = template(results.results)
        $('#listing').append(html)
    })
}
