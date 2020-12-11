import http from 'http'
import path from 'path'
import st from 'st'

let server

before(function () {
    // Lance un serveur HTTP
    server = http.createServer(
        st({
            path: path.join(process.cwd(), '/dist'),
            index: 'index.html',
        })
    )
    server.listen(8080)
})

after(function () {
    server.close()
})
