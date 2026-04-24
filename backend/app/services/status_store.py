status_store = {}


def set_status(file_id: str, user_id: str, status: str):
    key = f"{user_id}_{file_id}"
    status_store[key] = status


def get_status(file_id: str, user_id: str):
    key = f"{user_id}_{file_id}"
    return status_store.get(key, "not_found")
