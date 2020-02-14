const should = require('should');
const request = require('supertest');
const app = require('../../app');
const path = require('path')

before(done => {
    app.on('dbSettingComplete', () => {
        done();
    })
})

describe('GET /voices', () => {
    describe('SUCCESS', () => {
        it('업로드된 음성파일 목록을 반환한다', (done) => {
            request(app)
                .get('/voices')
                .end((err, res) => {
                    res.body.should.be.instanceof(Array)
                    res.body.forEach(voiceInfo => {
                        voiceInfo.should.have.property('id')
                        voiceInfo.should.have.property('createdAt')
                        voiceInfo.should.have.property('phoneNumber')
                    });

                    done()
                })
        })

        it('업로드된 음성파일 중 오늘 녹음된 목록을 반환한다', done => {
            request(app)
                .get('/voices?today=true')
                .end((err, res) => {
                    res.body.forEach(voiceInfo => {
                        voiceInfo.createdAt.should.containEql('2020.2.13')
                    });

                    done();
                })
        })

        it('업로드된 음성파일 중 즐겨찾기된 목록을 반환한다', done => {
            request(app)
                .get('/voices?star=true')
                .end((err, res) => {
                    res.body.forEach(voiceInfo => {
                        voiceInfo.should.have.property('star', true)
                    });

                    done();
                })
        })
    })
    describe('FAIL', () => {
        it('today 파라메터가 boolean 형식이 아닙니다.', done => {
            request(app)
                .get('/voices?today=2')
                .expect(400).end(done);
        })

        it('star 파라메터가 boolean 형식이 아닙니다.', done => {
            request(app)
                .get('/voices?star=2')
                .expect(400).end(done);
        })
    })
})

describe('POST /voices', () => {
    describe('SUCCESS', () => {
        it('파일 업로드가 완료되면 202를 반환한다', done => {
            request(app)
                .post('/voices')
                .field("Content-Type", "multipart/form-data")
                .field("createdAt", "2020.02.11 10:23")
                .field("phone", "01012341234")
                .field("file_path", "/123/123")
                .attach("voicefile", path.resolve(__dirname, "../../uploads/sample1.m4a"))
                .expect(202)
                .end((err, res) => {
                    if (err) done(err)
                    res.body.should.have.property('id')
                    res.body.should.have.property('createdAt')
                    res.body.should.have.property('phoneNumber')
                    res.body.should.have.property('file_path')
                    done()
                })
        })
    })
    describe('FAIL', () => {
        it('정보 field가 빠지면 400을 응답한다', done => {
            request(app)
                .post('/voices')
                .expect(400)
                .end(done)
        })

        it('파일 형식이 잘못되면 400을 응답한다', done => {
            request(app)
                .post('/voices')
                .field("Content-Type", "multipart/form-data")
                .field("createdAt", "2020.02.11")
                .field("phone", "01012341234")
                .attach("voicefile", path.resolve(__dirname, "../../app.js"))
                .expect(400)
                .end(done)
        })
    })
})

describe('GET /voices/:id', () => {
    describe('SUCCESS', () => {
        it('id로 조회하면 그 파일에 대한 정보를 반환한다', done => {
            request(app)
                .get('/voices/1')
                .end((err, res) => {
                    res.body.should.have.property('id')
                    res.body.should.have.property('createdAt')
                    res.body.should.have.property('file_name')
                    res.body.should.have.property('file_path')
                    res.body.should.have.property('phoneNumber')
                    res.body.should.have.property('script')
                    res.body.should.have.property('star')

                    done()
                })
        })
    })
    describe('FAIL', () => {
        it('찾는 id가 없을 경우 404를 반환한다', done => {
            request(app)
                .get('/voices/1000')
                .expect(404).end(done)
        })
    })
})
