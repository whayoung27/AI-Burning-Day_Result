const should = require('should');
const request = require('supertest');
const app = require('../../app');
const path = require('path')

before(done => {
    app.on('dbSettingComplete', () => {
        done();
    })
})

describe('GET /keywords', () => {
    describe('SUCCESS', () => {
        it('키워드 목록을 반납합니다', done => {
            request(app)
                .get('/keywords')
                .end((err, res) => {
                    res.body.should.be.instanceof(Array)
                    res.body.forEach(key => {
                        key.should.have.property('name')
                    });
                })
        })
    })
    describe('FAIL', () => {

    })
})

/*
describe('POST /keywords', () => {
    describe('SUCCESS', () => {
        it('사용자 지정 키워드를 저장한다', done => {
            request(app)
                .post('/keywords')
        })

        it('이미 있는 값일 경우 앞순위로 올린다', done => {
            request(app)
                .post('/keywords')
                .
        })
    })
    describe('FAIL', () => {
    })
})
*/