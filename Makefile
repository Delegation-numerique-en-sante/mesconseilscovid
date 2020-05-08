key.pem:
	openssl req -nodes -newkey rsa:2048 -x509  -days 365 -keyout key.pem -out cert.pem -subj "/C=FR/CN=localhost"

serve: key.pem
	python3 serve.py

.PHONY: serve
