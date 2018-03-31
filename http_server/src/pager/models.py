
def get_pager(id):
    return {"pager_id": id, "pager_port":4201}

def get_pagers():
    return {"pagers": [{"pager_id": 1, "pager_port":4201}, {"pager_id": 2, "pager_port":4202}, {"pager_id": 4, "pager_port":4204}]}