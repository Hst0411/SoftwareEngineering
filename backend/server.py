from flask import Flask, Blueprint, render_template, redirect, make_response
from pymongo import MongoClient, DESCENDING
from flask_cors import CORS
import os
import datetime


import config
import mainDB
from recordModule import appRecord
from recordCategoryModule import appRecordCategory
from budgetModule import appBudget
from accountModule import appAccount
from recordChartModule import appRecordChart
from currencyExchangeModule import appCurrencyExchange
from signInModule import appSignIn


from flask_jwt_extended import (
    JWTManager, get_jwt, create_access_token, set_access_cookies, get_jwt_identity, unset_jwt_cookies, jwt_required, unset_access_cookies)

jwt = JWTManager()

app = Flask(__name__)
CORS(app)
app.debug = True
app.config['JWT_SECRET_KEY'] = '5568601483A9F34E5D2EB329A71D4EBDC5BF2449A8D7C7CA9812EEC021CC2567'
#app.config['JWT_TOKEN_LOCATION'] = ['headers', 'query_string']
app.config['JWT_TOKEN_LOCATION'] = ['cookies']
app.config['JWT_ACCESS_COOKIE_PATH'] = '/'
app.config['JWT_REFRESH_COOKIE_PATH'] = '/token/refresh'
app.config['JWT_QUERY_STRING_NAME'] = 'jwt'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = datetime.timedelta(minutes=10)
jwt.init_app(app)

app.register_blueprint(appRecord)
app.register_blueprint(appRecordCategory)
app.register_blueprint(appBudget)
app.register_blueprint(appAccount)
app.register_blueprint(appRecordChart)
app.register_blueprint(appCurrencyExchange)
app.register_blueprint(appSignIn)


# 使用者每次發request之後，都更新快過期的jwt token
#@app.after_request
def refresh_expiring_jwts(response):
    try:
        print("after request")
        exp_timestamp = get_jwt()["exp"]
        now = datetime.datetime.now(datetime.timezone.utc)
        target_timestamp = datetime.datetime.timestamp(
            now + datetime.timedelta(minutes=3))
        if target_timestamp > exp_timestamp:
            access_token = create_access_token(identity=get_jwt_identity())
            set_access_cookies(response, access_token)
        return response
    except (RuntimeError, KeyError):
        # Case where there is not a valid JWT. Just return the original respone
        return response

# 發的request沒有有效的jwt token，重新導向至入口網頁


@jwt.unauthorized_loader
def unauthorized_callback(callback):
    # No auth header
    print("unauth")
    return redirect('/', 302)

# 發的request沒有有效的jwt token，重新導向至入口網頁


@jwt.invalid_token_loader
def invalid_token_callback(callback):
    # Invalid Fresh/Non-Fresh Access token in auth header
    print("invalid")
    resp = make_response(redirect('/', 302))
    unset_jwt_cookies(resp)
    return resp
    # return render_template('testSignIn.html')

# 發的request沒有有效的jwt token，重新導向至入口網頁


@jwt.expired_token_loader
def expired_token_callback(callback, para):
    # Expired auth header
    print("expired")
    resp = make_response(redirect('/', 302))
    unset_access_cookies(resp)
    return resp


@app.route('/', methods=["GET"])
def index_page():
    return render_template("signIn.html")


@app.route('/testSignIn.html', methods=["GET"])
def sign_in_page():
    return render_template("testSignIn.html")


@app.route('/home.html', methods=["GET"])
@jwt_required()
def home_page():
    return render_template("home.html")


@app.route('/category.html', methods=["GET"])
@jwt_required()
def category_page():
    return render_template("category.html")


@app.route('/account.html', methods=["GET"])
@jwt_required()
def account_page():
    return render_template("account.html")


@app.route('/barChart.html', methods=["GET"])
@jwt_required()
def barChart_page():
    return render_template("barChart.html")


@app.route('/register&login.html', methods=["GET"])
@jwt_required()
def register_login_page():
    return render_template("register&login.html")


@app.route('/selection.html', methods=["GET"])
@jwt_required()
def selection_page():
    return render_template("selection.html")


@app.route('/setting.html', methods=["GET"])
@jwt_required()
def setting_page():
    return render_template("setting.html")


@app.route('/testBudget.html', methods=["GET"])
@jwt_required()
def testBudget_page():
    return render_template("testBudget.html")


@app.route('/testPie.html', methods=["GET"])
@jwt_required()
def testPie_page():
    return render_template("testPie.html")


@app.route('/transfer.html', methods=["GET"])
@jwt_required()
def transfer_page():
    return render_template("transfer.html")


@app.route('/transferrecord.html', methods=["GET"])
@jwt_required()
def transferrecord_page():
    return render_template("transferrecord.html")


def printAvailableAPIs():
    basic_methods = ["GET", "POST", "PUT", "DELETE"]
    print("")
    print("  {:^40} | {:^15}".format("URL", "METHODS"))
    # Flask app's property "url_map" has a function iter_rules() to loop through all available APIs.
    for p in app.url_map.iter_rules():
        print("  {:<40} | {:<15}".format(str(p), ", ".join(
            set(p.methods).intersection(basic_methods))))
    print("")


myPort = int(os.environ.get('PORT', 5000))


def main():

    print(mainDB.connect_db(config.host, config.db))
    printAvailableAPIs()
    app.run(host="0.0.0.0", debug=True, port=myPort)


if __name__ == "__main__":
    main()
