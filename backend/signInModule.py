from distutils.command.config import config
from flask import Flask, request, jsonify, Blueprint
from flask.blueprints import Blueprint
import pymongo
from google.oauth2 import id_token
from google.auth.transport import requests
import mainDB
import config
import uuid

appSignIn = Blueprint('appSignIn', __name__)

GOOGLE_OAUTH2_CLIENT_ID = "199077799730-3o9nt0qi383e6ikef8i2ea3ipmm90ad4.apps.googleusercontent.com"


@appSignIn.route('/sign-in')
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
            doc = {
                "_id": str(uuid.uuid4()),
                "userID": userID,
                "selectCurrency": "TWD"
            }
            mainDB.DB.get_collection(config.memberCol).insert_one(doc)
        # ID token is valid. Get the user's Google Account ID from the decoded token.
        # user_id = id_info['sub']
        # reference: https://developers.google.com/identity/sign-in/web/backend-auth
    except ValueError:
        # Invalid token
        raise ValueError('Invalid token')

    print('登入成功')
    return userID, 200
