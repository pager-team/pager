import socket
import sys
import requests
import json

URL = "http://localhost:6969/api/v1/pagers/{}/connect/{}"

sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server_address = ('localhost', 8005)
sock.bind(server_address)
sock.listen(1)

while True:
    connection, client_address = sock.accept()
    try:
        while True:
            data = connection.recv(32).decode()

            data = json.loads(data)

            res = requests.post(URL.format(data["id"], client_address[1]))

            exit()

    finally:
        connection.close()
