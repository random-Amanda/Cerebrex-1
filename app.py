from flask import Flask, render_template, request, redirect, Response
import json
app = Flask(__name__)
app.debug = True

@app.route('/')
def output():
	# serve index template
	return render_template('main.html')

@app.route('/receiver', methods = ['POST'])
def worker():
    data = request.get_json(force=True)
    result = ''
# read json + reply
    print(data)
    return result


if __name__ == '__main__':
	app.run()

