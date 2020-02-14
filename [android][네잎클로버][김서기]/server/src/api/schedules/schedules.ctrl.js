const { Op, Voices } = require('../../models')
//schedule - list _createdAt, file_path, phoneNumber, sch_t, sch_d, sch_p
const showList = (req, res) => {
    Voices.findAll({
        attributes: ['id', 'createdAt', 'file_path', 'phoneNumber', 'sch_t', 'sch_d', 'sch_p'],
        where: {
            [Op.not]: [{ sch_t: null }, { sch_d: null }, { sch_p: null }]
        },
        limit: 10,
    })
        .then((result) => {
            res.json(JSON.parse(JSON.stringify(result)))
        }).catch((err) => {
            res.status(400).send(err.message)
        });
}

module.exports = {
    showList,
}