const router = require('express').Router();
const got = require('got');
const apiKey = process.env.GOOGLE_API_KEY

router.get('/:latlng', (req, res) => {
  let latlng = req.params.latlng
  let type = req.query.type || "food"

  getPlaces(latlng, type)
    .then(buildData)
    .then(response => {
      response.places = response.places.map(item => {
        item.details = req.protocol + '://' + req.get('host') + "/v1/location/detail/" + item.details
        return item
      })
      res.json(response)
    })
    .catch(error => {
      res.send(error.message);
    })

});

router.get('/detail/:placeId', (req, res) => {
  got("https://maps.googleapis.com/maps/api/place/details/json?placeid=" + req.params.placeId + "&key=" + apiKey)
    .then(response => {
      res.json(JSON.parse(response.body))
    }).catch(err => {
      res.json({ status: "failed" })
    })
})

function getPlaces(latlng, type) {
    return got("https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + latlng + "&rankby=distance&types=" + type + "&key=" + apiKey)
}

function buildData(response) {
  return new Promise((resolve, reject) => {
    let res = JSON.parse(response.body)
    results = res.results.map(item => {
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

    resolve({ status: "OK", places: results })
  })
}

module.exports = router;