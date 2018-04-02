import socket
import sys
import os.path
import json

FILENAME = "pager_id.json"


def get_id(filename):
    if not os.path.isfile(FILENAME):
        raise FileNotFoundError()

    with open(FILENAME, "r") as f:
        pager_id = json.load(f)["id"]
        return pager_id


user_input = input("Press enter")

sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

server_address = ("localhost", 8005)
sock.connect(server_address)

try:
    pager_id = get_id(FILENAME)

    sock.sendall(json.dumps({"id": pager_id, "type": "pair"}).encode())
    while 1:
        data = json.loads(sock.recv(32))
        if data["code"] == 0:
            raise ValueError("REJECTED")
        print()

finally:
    sock.close()
