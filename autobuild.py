from livereload import Server, shell

server = Server()
server.watch("contenus/*.md", shell("make build"))
server.watch("src/template.html", shell("make build"))
server.serve(root="src/")
