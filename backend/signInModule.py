from distutils.command.config import config
from flask import Flask, request, jsonify, Blueprint, render_template, make_response, redirect
from flask.blueprints import Blueprint
import pymongo
from google.oauth2 import id_token
from google.auth.transport import requests
import mainDB
import config
import uuid
import datetime
from flask_jwt_extended import (
    create_access_token, set_access_cookies, unset_jwt_cookies)
import currencyExchangeModule

appSignIn = Blueprint('appSignIn', __name__)

GOOGLE_OAUTH2_CLIENT_ID = "199077799730-3o9nt0qi383e6ikef8i2ea3ipmm90ad4.apps.googleusercontent.com"


@appSignIn.route('/sign-in', methods=["POST"])
def sign_in():
    token = request.get_json().get('id_token')

    try:
        # Specify the GOOGLE_OAUTH2_CLIENT_ID of the app that accesses the backend:
        id_info = id_token.verify_oauth2_token(
            token,
            requests.Request(),
            GOOGLE_OAUTH2_CLIENT_ID
        )

        if id_info['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
            raise ValueError('Wrong issuer.')
        userID = id_info['email']
        if(mainDB.DB.get_collection(config.memberCol).find_one({"userID": userID}) == None):
            print("hello")
            # 新增會員資料
            doc = {
                "_id": str(uuid.uuid4()),
                "userID": userID,
                "selectCurrency": "TWD"
            }
            mainDB.DB.get_collection(config.memberCol).insert_one(doc)
            # 新增預設帳戶(錢包)
            accountDoc = {
                "_id": str(uuid.uuid4()),
                "userID": userID,
                "accountName": "錢包",
                "leftMoneyAmount": 0,
                "transferRecord": []
            }
            mainDB.DB.get_collection(config.accountCol).insert_one(accountDoc)
            # 新增自訂類別名稱表格
            cate_doc = {
                "_id": str(uuid.uuid4()),
                "userID": userID,
                "recordCategoryList": []
            }
            mainDB.DB.get_collection(
                config.recordCategoryCol).insert_one(cate_doc)

        access_token = create_access_token(identity=userID)
        #refresh_token = create_refresh_token(identity=userID)
        resp = jsonify({'login': True, "selectCurrencyExRate": str(currencyExchangeModule.cal_exchange_rate(
            mainDB.DB.get_collection(config.memberCol).find_one({"userID": userID})["selectCurrency"]))})
        set_access_cookies(resp, access_token)
        #set_refresh_cookies(resp, refresh_token)

        return resp, 200

        # ID token is valid. Get the user's Google Account ID from the decoded token.
        # user_id = id_info['sub']
        # reference: https://developers.google.com/identity/sign-in/web/backend-auth
    except ValueError:
        # Invalid token
        raise ValueError('Invalid token')

    print('登入成功')
    access_token = create_access_token(identity=userID)
    return jsonify(access_token), 200


@appSignIn.route('/test-sign-in', methods=["POST"])
def test_sign_in():
    userID = request.get_json().get('id_token')

    if(mainDB.DB.get_collection(config.memberCol).find_one({"userID": userID}) == None):
        print("hello")
        doc = {
            "_id": str(uuid.uuid4()),
            "userID": userID,
            "selectCurrency": "TWD"
        }
        mainDB.DB.get_collection(config.memberCol).insert_one(doc)

    print('登入成功')

    access_token = create_access_token(identity=userID)
    #refresh_token = create_refresh_token(identity=userID)
    resp = jsonify({'login': True})
    set_access_cookies(resp, access_token)
    #set_refresh_cookies(resp, refresh_token)

    return resp, 200


@appSignIn.route('/sign-out', methods=['GET'])
def sign_out():
    resp = make_response(redirect('/', 302))
    #resp = jsonify({'logout': True})
    unset_jwt_cookies(resp)
    return resp
