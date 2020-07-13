const http = require('http')
const nodeStatic = require('node-static')

let server

before(function () {
    // Lance un serveur HTTP
    let file = new nodeStatic.Server('./dist')
    server = http.createServer(function (request, response) {
        request
            .addListener('end', function () {
                file.serve(request, response)
            })
            .resume()
    })
    server.listen(8080)
})

after(function () {
    server.close()
})
