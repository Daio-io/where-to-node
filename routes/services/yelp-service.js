const got = require('got')
const apiKey = process.env.YELP_TOKEN
const BASE_URL = 'https://api.yelp.com/v3/businesses/'
const reqOptions = {
    headers: { Authorization: 'Bearer ' + apiKey }
}

exports.getPlaces = function (latlng, type, openNow, radius) {
    let latLngSplit = latlng.split(',')
    let open_now = openNow === 'true' ? '&open_now=true' : ''
    let url = BASE_URL + 'search?categories=' + type + '&latitude=' + latLngSplit[0] + "&longitude=" + latLngSplit[1] + "&radius=" + radius + open_now
    return got(url, reqOptions)
        .then(buildData)
}

exports.getPlaceDetails = function (placeId) {

    return got(BASE_URL + placeId, reqOptions)
        .then(buildDetails)
}

function buildDetails(response) {
    return new Promise((resolve, reject) => {
        let res = JSON.parse(response.body)
        let photos = res.photos.map(item => {
            return { image: item }
        })
        let result = { images: photos }
        resolve({ result: result })
    })
}

function buildData(response) {
    return new Promise((resolve, reject) => {
        let res = JSON.parse(response.body)
        let results = res.businesses.map(item => {
            let openNow = !item.is_closed
            data = {
                id: item.id,
                name: item.name,
                rating: item.rating,
                vicinity: item.location.address1,
                image: item.image_url,
                open_now: openNow
            }
            return data
        })

        resolve({ places: results })
    })
}