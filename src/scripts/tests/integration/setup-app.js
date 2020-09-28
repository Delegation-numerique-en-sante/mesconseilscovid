import http from 'http'
import serveStatic from 'serve-static'

let server

before(function () {
    // Lance un serveur HTTP
    let serve = new serveStatic('./dist')

    server = http.createServer(function (request, response) {
        request
            .addListener('end', function () {
                serve(request, response)
            })
            .resume()
    })
    server.listen(8080)
})

after(function () {
    server.close()
})
