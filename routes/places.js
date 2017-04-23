const router = require('express').Router();
const service = require('./services/yelp-service')

router.get('/:latlng', (req, res) => {
  let latlng = req.params.latlng
  let openNow = req.query.opennow
  let radius = req.query.radius || "1000"
  let type = req.query.type || "bars"

  service.getPlaces(latlng, type, openNow, radius)
    .then(response => {
      response.places = response.places.map(item => {
        item.details = 'https://' + req.get('host') + "/v1/location/detail/" + item.id
        return item
      })
      res.json(response)
    })
    .catch(error => {
      res.send(error.message);
    })

});

router.get('/detail/:placeId', (req, res) => {
  let placeId = req.params.placeId
  service.getPlaceDetails(placeId)
  .then(place => {
    place.result.reviews = 'https://' + req.get('host') + "/v1/location/reviews/" + placeId
    res.json(place)
  }).catch(error => {
    res.json({status: "failed"})
  })
});

router.get('/reviews/:placeId', (req, res) => {
    let placeId = req.params.placeId
    service.getReviews(placeId)
    .then(items => {
    res.json(items)
  }).catch(error => {
    res.json({status: "failed"})
  })
})

module.exports = router;