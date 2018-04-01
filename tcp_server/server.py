import socket
import sys
import requests
import json

URL = "127.0.0.1:8080/pager"

sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server_address = ('localhost', 8000)
sock.bind(server_address)
sock.listen(1)

while True:
    connection, client_address = sock.accept()
    try:
        while True:
            data = json.loads(connection.recv(32))
            if not requests.get("{0}/{1}".format(URL, data['id']).json:
                code = 1
                print("accepted connection")
            else:
                print("rejected connection")
                code = 0
            connection.sendall(json.dumps({"type": "pair", "code": code}))
            
                
    finally:
        connection.close()
