status_store = {}


def set_status(file_id: str, status: str):
    status_store[file_id] = status


def get_status(file_id: str):
    return status_store.get(file_id, "not_found")
