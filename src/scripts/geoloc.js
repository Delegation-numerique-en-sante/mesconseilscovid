import { hideSelector, displayElementById } from './affichage'

import departementsURL from 'url:../departements-1000m.geojson'

var Geolocaliseur = function () {
    this.matchDepartement = function (lat, lon, departementFound, departementNotFound) {
        // Warning, in case of multiple polygons, you can have multiple matches.
        var that = this
        this.loadMap(function (featureCollection) {
            var notFound = true
            featureCollection.features.forEach(function (departement) {
                var polyCoordinates
                if (departement.geometry.type === 'Polygon') {
                    polyCoordinates = [departement.geometry.coordinates]
                } else {
                    polyCoordinates = departement.geometry.coordinates
                }
                polyCoordinates.forEach(function (polyCoordinate) {
                    polyCoordinate.forEach(function (coord) {
                        if (that.booleanPointInPolygon([lon, lat], coord)) {
                            notFound = false
                            departementFound(departement.properties)
                        }
                    })
                })
            })
            notFound && departementNotFound()
        })
    }

    this.loadMap = function (callback) {
        var xhr = new XMLHttpRequest()
        xhr.overrideMimeType('application/json')
        xhr.open('GET', departementsURL, true)
        xhr.onload = function () {
            var jsonResponse = JSON.parse(xhr.responseText)
            callback(jsonResponse)
        }
        xhr.send()
    }

    this.booleanPointInPolygon = function (point, vs) {
        // https://github.com/substack/point-in-polygon/blob/master/index.js
        var x = point[0],
            y = point[1]

        var inside = false
        for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
            var xi = vs[i][0],
                yi = vs[i][1]
            var xj = vs[j][0],
                yj = vs[j][1]

            var intersect =
                yi > y != yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi
            if (intersect) inside = !inside
        }

        return inside
    }
}

export default function geolocalisation(event) {
    event.preventDefault()
    var geolocaliseur = new Geolocaliseur()
    var form = document.querySelector('form#situation-form')
    hideSelector(form, '#error-geolocalisation')
    var onDepartementFound = function (departement) {
        var select = form.querySelector('#departement')
        select.value = departement.code
        // We manually trigger the change event for the submit button toggle.
        select.dispatchEvent(new CustomEvent('change'))
    }
    var onDepartementNotFound = function () {
        // L’utilisateur n’est probablement pas sur le territoire français.
        displayElementById(form, 'error-geolocalisation')
    }
    navigator.geolocation.getCurrentPosition(
        function (position) {
            var latitude = position.coords.latitude
            var longitude = position.coords.longitude
            geolocaliseur.matchDepartement(
                latitude,
                longitude,
                onDepartementFound,
                onDepartementNotFound
            )
        },
        function (error) {
            // L’utilisateur a probablement refusé la géolocalisation.
            console.warn('ERREUR (' + error.code + '): ' + error.message)
            onDepartementNotFound()
        },
        {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
        }
    )
}
