from flask import Flask
from flask import jsonify
from flask import render_template
from rs.client import RSClient

app = Flask(__name__)
RS = RSClient()

@app.route('/')
@app.route('/<string:line>')
def homepage(line=None):
	return render_template('index.html')

@app.route('/line/all')
def showLineAll():
    return jsonify(RS.getAllLines())

@app.route('/info/<string:line>')
def showInfo(line):
	if RS.hasLine(line):
		return jsonify(RS.getInfo(line))
	elif RS.hasLine("%s路"%line):
		return jsonify(RS.getInfo("%s路"%line))
	else:
		return ''

@app.route('/stop/<string:line>')
def showStop(line):
	if RS.hasLine(line):
		return jsonify(RS.getStations(line))
	else:
		return ''
	
@app.route('/bus/<string:line>')
def showBus(line):
	if RS.hasLine(line):
		return jsonify(RS.getAllBuses(line))
	else:
		return ''

@app.route('/start/<string:line>')
def showStart(line):
	if RS.hasLine(line):
		return jsonify(RS.getStartTime(line))
	else:
		return ''

if __name__ == '__main__':
	# Only for debug
	app.run(host="0.0.0.0",port=5000,debug=False)