var { Voices, Tags } = require('../../models')
module.exports.renewScript = (voiceId, boldScript) => {
    Voices.update({ script: boldScript }, {
        where: { id: voiceId }
    })
        .then(() => {
            console.log("스크립트 볼드처리 업데이트 완료")
        })
        .catch(err => {
            console.log("FAIL - 스크립트 볼드처리 업데이트 실패")
        })
}
module.exports.addTagToVoice = (voiceId, tagList) => {

    Voices.findOne({
        where: { id: voiceId }
    })
        .then(voice => {
            tagList.forEach((tag, i, array) => {
                Tags.findOne({
                    where: { name: tag }
                })
                    .then(result => {
                        if (!result) {
                            Tags.create({ name: tag })
                                .then(r => {
                                    voice.addTag(r.id, { through: { importance: i } })
                                })
                                .catch(err => console.log(err))
                        }
                        else {
                            voice.addTag(result.id, { through: { importance: i } })
                        }
                    })
                    .catch(err => console.log(err))
            })
            console.log('SUCCESS - connect all tags')
        })
        .catch(err => console.log(err))

}
module.exports.addSummary = (voiceId, summaryList) => {
    Voices.update({ summary: summaryList }, {
        where: { id: voiceId }
    })
        .then(() => console.log('SUCCESS - save the summary'))
        .catch(err => console.log(err))
}
module.exports.addSchedule = (voiceId, scheduleList) => {

    var t = "", d = "", p = ""

    for (var i = 0; i < scheduleList.length; i++) {
        switch (scheduleList[i].charAt(1)) {
            case 'w':
                d += (scheduleList[i].substring(2) + ";")
                break;
            case 'd':
                d += (scheduleList[i].substring(2) + ";")
                break;
            case 'h':
                t += (scheduleList[i].substring(2) + ";")
                break;
            case 'm':
                t += (scheduleList[i].substring(2) + ";")
                break;
            case 'p':
                p += (scheduleList[i].substring(2) + ";")
                break;
            default:
                break;
        }
    }
    Voices.update({
        sch_t: t,
        sch_d: d,
        sch_p: p
    }, {
        where: { id: voiceId }
    })
        .then(() => console.log('SUCCESS - save the schedules'))
        .catch(err => console.log(err))


}