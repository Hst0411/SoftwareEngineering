from io import BytesIO
from os import path
from uuid import uuid4

from magic import from_file

FILE_DIR = "cache/"

def saveFile(file):
    file_attr = dict()
    file_attr["filename"] = file.filename
    file_attr["uuid"] = str(uuid4())

    file_path = path.join(FILE_DIR, file_attr['uuid'])
    file.save(file_path)
    
    file_attr["mime"] = from_file(file_path, mime=True)
    return file_attr

def getFile(id_):
    with open(path.join(FILE_DIR, id_), "rb") as f:
        return BytesIO(f.read())