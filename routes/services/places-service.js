const got = require('got')
const apiKey = process.env.GOOGLE_API_KEY

exports.getPlaces = function (latlng, type) {
    return got("https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + latlng + "&rankby=distance&types=" + type + "&key=" + apiKey)
        .then(buildData)
}

exports.getPlaceDetails = function (placeId) {
    return got("https://maps.googleapis.com/maps/api/place/details/json?placeid=" + placeId + "&key=" + apiKey)
        .then(buildDetails)
}

function buildDetails(response) {
    return new Promise((resolve, reject) => {
        let res = JSON.parse(response.body)
        let photos = res.result.photos.map(photo => {
                return {image: "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=" + photo.photo_reference + "&key=" + apiKey}
            })
        let result = {
            name: res.result.name,
            phone: res.result.formatted_phone_number,
            address: res.result.formatted_address,
            rating: res.result.rating,
            location : res.result.geometry.location,
            images: photos
        }
        resolve({result:result})   
    })
}

function buildData(response) {
    return new Promise((resolve, reject) => {
        let res = JSON.parse(response.body)
        let results = res.results.map(item => {
            return {
                name: item.name,
                image: item.photos ? "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=" + item.photos[0].photo_reference + "&key=" + apiKey : null,
                rating: item.rating,
                vicinity: item.vicinity,
                details: item.place_id
            }
        }).filter(item => {
            return item.image != null
        })

        resolve({ places: results })
    })
}