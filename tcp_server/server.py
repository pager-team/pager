import socket
import sys
import requests
import json
import select

URL = "http://localhost:8080/api/v1/pagers/{}/connect/{}"
DISCONNECT_URL = "http://localhost:8080/api/v1/pagers/{}/disconnect"

tcp_server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server_address = ('localhost', 8005)
tcp_server.bind(server_address)
tcp_server.listen(5)

http_server = None

while True:
    print("I'm waiting for a connection from server")
    # Accept connection from http server
    connection, client_address = tcp_server.accept()

    data = connection.recv(32).decode()

    print(data)

    if data == "server":
        http_server = connection
        break

inputs = [tcp_server, http_server]
outputs = []

authenticated_clients = {}

while True:

    inputs_ready, outputs_ready, _ = select.select(inputs, outputs, [])

    for socket in inputs_ready:
        if socket == tcp_server:
            # Means a client is trying to get added
            client, address = socket.accept()
            inputs.append(client)
        else:
            data = socket.recv(128).decode()

            if not data and socket is not http_server:
                res = requests.post(
                    DISCONNECT_URL.format(socket.getpeername()[1]))
                del authenticated_clients[socket.getpeername()[1]]
                continue

            print(data)
            data = json.loads(data)

            if data["type"] == "pair":
                res = requests.post(
                    URL.format(data["id"],
                               socket.getpeername()[1]))

                if res.status_code == 200:
                    authenticated_clients[socket.getpeername()[1]] = socket

                    print("I am adding port: ", socket.getpeername())

            elif data["type"] == "ring":
                # Tell the pager to ring
                print("I am trying to access port, ", data["pager_port"])

                authenticated_clients[data["pager_port"]].sendall(
                    json.dumps({
                        "type": "ring"
                    }).encode())
            elif data["type"] == "deactivate":
                # Tell the pager to disconnect
                authenticated_clients[data["pager_port"]].sendall(
                    json.dumps({
                        "type": "deactivate"
                    }).encode())
