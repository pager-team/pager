import socket
import sys
import os.path
import json
import subprocess
import signal

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

pager_id = get_id(FILENAME)

sock.sendall(json.dumps({"id": pager_id, "type": "pair"}).encode())
while 1:
    data = sock.recv(32).decode()
    print("I made it past here!!")
    if not data:
        exit()

    json_data = json.loads(data)
    if json_data["type"] == "ring":
        proc = subprocess.Popen(["play", "file2.mp3", "repeat", "99999"])
        print("I am ringing!")
    elif json_data["type"] == "deactivate":
        proc.terminate()
        print("I have deactivated")
