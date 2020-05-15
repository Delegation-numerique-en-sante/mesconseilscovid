from livereload import Server, shell

server = Server()
server.watch("contenus/*.md", shell("make build"))
server.watch("src/*.html", shell("make build"))
server.watch("src/static/version.json", shell("make build"))
server.watch("src/style.css", shell("make build"))
server.watch("src/main.js", shell("make build"))
server.serve(root="dist/")
