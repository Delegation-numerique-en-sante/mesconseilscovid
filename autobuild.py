from livereload import Server, shell

server = Server()
server.watch(
    "contenus/**/[!README]*.md", shell("make build"),
)
server.watch("src/template.html", shell("make build"))
server.watch("src/style.css", shell("make build"))
server.watch("src/version.json", shell("make build"))
server.watch("src/scripts/*.js", shell("make build"))
server.watch("src/scripts/tests/*.js", shell("make build"))
server.serve(root="dist/")
