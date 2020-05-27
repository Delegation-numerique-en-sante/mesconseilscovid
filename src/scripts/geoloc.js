module.exports = function () {
    this.matchDepartement = function (lat, lon, departementFound, departementNotFound) {
        // Warning, in case of multiple polygons, you can have multiple matches.
        var that = this
        this.loadMap(function (featureCollection) {
            var notFound = true
            featureCollection.features.forEach(function (departement) {
                if (departement.geometry.type === 'Polygon') {
                    var polyCoordinates = [departement.geometry.coordinates]
                } else {
                    var polyCoordinates = departement.geometry.coordinates
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
        xhr.open('GET', 'departements-1000m.geojson', true)
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
