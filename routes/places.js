const router = require('express').Router();
const service = require('./services/places-service')

router.get('/:latlng', (req, res) => {
  let latlng = req.params.latlng
  let openNow = req.query.opennow
  let type = req.query.type || "food"

  service.getPlaces(latlng, type, openNow)
    .then(response => {
      response.places = response.places.map(item => {
        item.details = 'https://' + req.get('host') + "/v1/location/detail/" + item.details
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
  service.getPlaceDetails(placeId).then(items => {
    res.json(items)
  }).catch(error => {
    res.json({status: "failed"})
  })
});

module.exports = router;