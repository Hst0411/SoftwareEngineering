from pymongo import MongoClient, DESCENDING

DB = None

def connect_db(host, database):
    global DB
    DB = MongoClient(host)[database]
    return DB