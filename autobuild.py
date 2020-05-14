from livereload import Server, shell

server = Server()
server.watch("contenus/*.md", shell("make build"))
server.serve(root="src/")
