from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/slot-machine')
def slot_machine():
    return render_template('slot-machine.html')

if __name__ == '__main__':
    app.run(debug=True)
