var discs = []
$.ajax({
    'url': 'getSearchDiscs',
    'async': false,
    'success': function(result) {
        console.log(result)
        discs = result
    },
    'error': function(error) {
        console.error(error)
    }
}).done($(function () {
    $('#searchDiscs').autocomplete({
        source: discs,
        delay: 0,
        select: function(event, ui) {getDisc(ui.item.value)}
    })
}))

function getDisc(name) {
    if(discs.map((x) => x.toLowerCase()).includes(name.toLowerCase())) {
        $.ajax({
            url: "getDisc",
            data: {name: name.toLowerCase()},
            success: function(result) {
                console.log(result)
                $('.searchHeader')[0].innerHTML = result.brand + ' ' + result.name
                $('.searchSpeed')[0].innerHTML = result.speed
                $('.searchGlide')[0].innerHTML = result.glide
                $('.searchTurn')[0].innerHTML = result.turn
                $('.searchFade')[0].innerHTML = result.fade
                if (result.data_picture !== '')
                    $('.searchImage')[0].src = result.data_picture
                else
                    $('.searchImage')[0].src = 'img/no_image.jpg'
                $('.searchPurchaseDisc')[0].innerHTML = 'Available for purchase <a href="' + result.purchase_url + '" target="_blank">here</a>'
            }
        }).then(function() {
            $.ajax({
                url: "getRelatedDiscs",
                data: {name: name.toLowerCase()},
                success: function(result) {
                    relatedDiscs = result.map(function (x) {return JSON.parse(x)})
                    $('.relatedDiscHeader')[0].classList.remove('hide')
                    let discContainer = $('.discContainer')[0]
                    discContainer.innerHTML = ''
                    relatedDiscs.forEach((x) => {
                        let disc = document.createElement('div')
                        disc.innerText = x.name
                        disc.classList.add('circle')
                        disc.classList.add('pointer')
                        disc.classList.add(x.distance_category.replace(' ', '-').toLowerCase())
                        disc.setAttribute('data-name', x.name)
                        discContainer.appendChild(disc)
                    })
                }
            })
        })
    }
    else {
        console.log('no')
    }
    
}

$(document).ready(function () {
    const urlParams = new URLSearchParams(window.location.search);
    const nameParam = urlParams.get('name');
    if(nameParam !== null) {
        $('#searchDiscs').val(nameParam)
        getDisc(nameParam)
    }
    $('.discContainer').on('click', '.circle', function(e) {
        window.location.href = window.location.href.split('?')[0] + '?name=' + e.target.getAttribute('data-name')
    })
    $("#selectDisc").click(function (e) {
        getDisc($('#searchDiscs').val())
    })
    $("#searchDiscs").keyup(function (e) {
        if (event.keyCode === 13) {
            $('.ui-autocomplete').hide('');
            $("#selectDisc").click();
        }
    })
})
