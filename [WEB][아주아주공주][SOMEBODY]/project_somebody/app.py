from flask import Flask, render_template, request
from flask import redirect, flash, url_for
from werkzeug.utils import secure_filename
from processes import movie_divide

app = Flask(__name__)


ALLOWED_EXTENSIONS = set(['avi', 'mp4', 'wmv'])


def allowed_file(fname):  # 업로드 파일 형식 지정
    return '.' in fname and \
           fname.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


# 첫 화면(동영상 업로드)
@app.route('/')
def up():
    return render_template('upload.html')


# 제출 버튼 누를 시 작동(동영상 처리 작업)
@app.route('/uploader', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        f = request.files['file']
        filename = f.filename
        allow = allowed_file(filename)
        if 'file' not in request.files:  # 선택한 파일이 위치가 이동되거나 변동 사항이 있을 때
            flash('No file part')
            return redirect(url_for('up'))
        if f.filename == '':  # 선택된 파일이 없을 때
            flash('No selected file')
            return redirect(url_for('up'))
        if allow == True:
            f.save("./static/uploads/" + secure_filename(f.filename))
            return movie_divide(secure_filename(f.filename),1)
        if allow == False:  # 파일 형식이 허용되지 않는 파일일 때
            flash('type error')
            return redirect(url_for('up'))


if __name__ == '__main__':
    app.run()
