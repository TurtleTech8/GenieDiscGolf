discs = []
brands = []

$(document).ready(function () {

    $.ajax({
        'url': 'getAllBrands',
        'async': false,
        'success': function(result) {
            brands = result
        },
        'error': function(error) {
            console.error(error)
        }
    }).done(createHeaders(function() {
        $.ajax({
            'url': 'getAllDiscs',
            'async': false,
            'success': function(result) {
                discs = result.map(function (x) {return JSON.parse(x)})
            },
            'error': function(error) {
                console.error(error)
            }
        }).done(addDiscs())
    }))
    

    $("#overlay").click(function (e) {
        if(e.target === this || e.target.classList.contains('modalContainer')) {
            this.innerHTML = ''
            this.classList.remove('overlay')
        }
    });

    $('#discs').on('click', '.circle', (e) => createModal(e))

    $('#discs').on('click', '.brandHeader', (e) => {
        if(e.currentTarget.nextElementSibling.classList.contains('hide')) {
            e.currentTarget.nextElementSibling.classList.remove('hide')
        } else {
            e.currentTarget.nextElementSibling.classList.add('hide')
        }
    })
});

function createHeaders(callback) {
    console.log("brands")
    let box = document.getElementById('discs')
    brands.forEach((x) => {
        let innerBox = document.createElement('div')
        box.appendChild(innerBox)

        let headerBox = document.createElement('div')
        headerBox.classList.add('brandHeader')
        innerBox.appendChild(headerBox)

        let title = document.createElement('h2')
        title.innerText = x
        title.classList.add('brandHeaderTitle')
        headerBox.appendChild(title)

        let spacer = document.createElement('span')
        spacer.classList.add('spacer')
        headerBox.appendChild(spacer)

        let downArrow = document.createElement('span')
        downArrow.classList.add('downArrow')
        headerBox.appendChild(downArrow)

        let discBox = document.createElement('div')
        discBox.id = x
        discBox.classList.add('discContainer')
        discBox.classList.add('hide')
        innerBox.appendChild(discBox)
    })

    callback()
}

function createModal(event){
    let name = event.currentTarget.getAttribute('data-name')
    let currentDisc = discs.filter(x => x.name == name)[0]

    let overlay = document.getElementById('overlay')
    overlay.classList.add('overlay')

    let container = document.createElement('div')
    container.classList.add('modalContainer')
    overlay.appendChild(container)

    let box = document.createElement('div')
    box.classList.add('modal')
    container.appendChild(box)

    let modalHeader = document.createElement('div')
    modalHeader.innerHTML = name
    modalHeader.classList.add('modalHeader')
    box.appendChild(modalHeader)

    let category = document.createElement('div')
    category.innerHTML = '(' + currentDisc.distance_category + ')'
    category.classList.add('modalHeader')
    box.appendChild(category)

    let img = document.createElement('img')
    if (currentDisc.data_picture !== '')
        img.src = currentDisc.data_picture
    else
        img.src = './static/no_image.jpg'
    box.appendChild(img)
    
    let flightContainer = document.createElement('div')
    flightContainer.classList.add('flightContainer')
    box.appendChild(flightContainer)

    let speed = document.createElement('div')
    speed.innerHTML = currentDisc.speed
    speed.classList.add('flightNumbers')
    flightContainer.appendChild(speed)
    
    let glide = document.createElement('div')
    glide.innerHTML = currentDisc.glide
    glide.classList.add('flightNumbers')
    flightContainer.appendChild(glide)

    let turn = document.createElement('div')
    turn.innerHTML = currentDisc.turn
    turn.classList.add('flightNumbers')
    flightContainer.appendChild(turn)
    
    let fade = document.createElement('div')
    fade.innerHTML = currentDisc.fade
    fade.classList.add('flightNumbers')
    flightContainer.appendChild(fade)
}

function addDiscs() {
    discs.forEach((x) => {
        let disc = document.createElement('div')
        disc.innerText = x.name
        disc.classList.add('circle')
        disc.classList.add('pointer')
        disc.classList.add(x.distance_category.replace(' ', '-').toLowerCase())
        disc.setAttribute('data-name', x.name)
        document.getElementById(x.brand).appendChild(disc)
    })
}