from http.server import HTTPServer, SimpleHTTPRequestHandler
import ssl


ADDRESS = "0.0.0.0"
PORT = 8443

class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory="dist", **kwargs)


httpd = HTTPServer((ADDRESS, PORT), Handler)
httpd.socket = ssl.wrap_socket(
    httpd.socket, keyfile="key.pem", certfile="cert.pem", server_side=True
)
print(f"Listening on https://{ADDRESS}:{PORT}/")
httpd.serve_forever()
