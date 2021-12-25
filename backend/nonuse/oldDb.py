import hashlib

from datetime import datetime
from threading import Condition
from typing import Dict
import uuid
from bson.son import SON
from flask.json import jsonify
from pymongo import MongoClient, DESCENDING
from bson.objectid import ObjectId
from uuid import uuid4

from pymongo.message import query

import config
import filehandler

OLDDB = None


def connect_db(host, database):
    global OLDDB
    OLDDB = MongoClient(host)[database]
    return OLDDB


def insert_doc(userID, name, incomeOrExpense, category, date, moneyAmount, accountName, budgetName):
    id = str(uuid4())
    doc = {
        "userID": userID,
        "_id": id,
        "name": name,
        "incomeOrExpense": incomeOrExpense,
        "category": category,
        "date": datetime(date["year"], date["month"], date["day"], date["hour"], date["minute"]),
        "moneyAmount": moneyAmount,
        "accountName": accountName,
        "budgetName": budgetName,
    }
    return OLDDB.get_collection(config.recordCol).insert_one(doc)
# , "createdAt": {"$gte": datetime(date["year"], date["month"], date["day"]), "$lt": datetime(date["year"], date["month"], date["day"])}
# "userID": "user001",


def simpleSearch(userID, date):

    query = dict()
    query["userID"] = userID
    query["_id"] = date
    result = OLDDB.get_collection(
        # {"createdAt": {"$eq": datetime(date["year"], date["month"], date["day"])}})
        config.recordCol).find({"userID": userID, "date": {"$gte": datetime(date["year"], date["month"], date["day"]), "$lt":datetime(date["year"], date["month"], date["day"]+1)}})
    r = list()
    for item in result:
        r.append(item)
        print(item)
    # item["_id"] = str(item["_id"])
    # item["date"] = item["date"].isoformat()
    # result["_id"] = str(result["_id"])
    return r
    # print(result)


def search():
    return list(OLDDB.get_collection(config.recordCol).find_one({"userID": "user001"}))


def get_file(uuid):
    file_attr = OLDDB.get_collection(config.fileCol).find_one({
        "uuid": uuid}, {"_id": 0})
    file = filehandler.getFile(file_attr.get("uuid"))
    mime = file_attr.get("mime")
    print(file)
    print(mime)
    return file, mime


def update_doc(name, age, date, new_name, new_age, new_date):
    query = {
        "name": name,
        "age": age,
        "date": date
    }
    new_doc = {
        "name": new_name,
        "age": new_age,
        "date": new_date
    }
    return OLDDB.get_collection(config.postCol).update_one(query, {"$set": new_doc})


def get_doc(uploader, title, tags):
    query = dict()

    if uploader:
        query["uploader"] = uploader

    if title:
        query["title"] = title

    if tags:
        tags_find_condition = dict()
        # find any data that correspond tag in tags
        tags_find_condition["$in"] = tags
        query["tags"] = tags_find_condition
        # {"tags":"{"$in":["color","blue"]}"}"
    return list(OLDDB.get_collection(config.postCol).find(query, {"_id": 0}))


def get_some_doc(begin, end):
    query = dict()
    return list(OLDDB.get_collection(config.postCol).find(filter=query, projection={"_id": 0}, skip=int(begin), limit=int(end)).sort("uploaded_at", DESCENDING))


def delete_doc(secret, filename):
    deleted_data = OLDDB.get_collection(config.postCol).find_one(
        {"filename": filename}, {"_id": 0})
    target_secret = deleted_data.get("secret")
    if hashlib.sha256(secret.encode('utf-8')).hexdigest() == target_secret:
        query = {
            "filename": filename
        }

        # 刪除成功回傳true?
        return OLDDB.get_collection(config.postCol).delete_one(query).acknowledged

    return False  # 讓server.py回傳錯誤?


def search_doc(keyword):
    query = {
        "$or": [
            {'uploader': {'$regex': keyword}},
            {'title': {'$regex': keyword}},
            {'description': {'$regex': keyword}},
            {'tags': {'$regex': keyword}},
        ]
    }
    res = list(OLDDB.get_collection(config.postCol).find(
        query, {"_id": 0}).sort("uploaded_at", DESCENDING))

    print(query)
    print(res)

    return res
