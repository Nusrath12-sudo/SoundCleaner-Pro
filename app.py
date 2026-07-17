from flask import Flask, render_template, request, send_file
import os, tempfile, noisereduce as nr, soundfile as sf, librosa

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/process', methods=['POST'])
def process_audio():
    file = request.files['audio']
    temp_input = tempfile.NamedTemporaryFile(delete=False, suffix=".mp3")
    file.save(temp_input.name)

    data, rate = librosa.load(temp_input.name, sr=None)
    reduced_noise = nr.reduce_noise(y=data, sr=rate)

    output_path = os.path.join(tempfile.gettempdir(), "hello_clean.mp3")
    sf.write(output_path, reduced_noise, rate)
    os.remove(temp_input.name)

    return send_file(output_path, mimetype="audio/mp3")

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)