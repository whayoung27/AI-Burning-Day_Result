const { UserKeywords } = require('../../models')

const showList = (req, res) => {
    UserKeywords.findAll({
        attributes: ['name'],
        offset: 0,
        limit: 5,
        order: [['updatedAt', 'DESC']]
    })
        .then((result) => {
            res.json(JSON.parse(JSON.stringify(result)))
        })
        .catch(err => {
            res.status(400).send(err.message)
        })
}

const create = (req, res) => {
    const keyword = (req.body.keyword);
    if (keyword.length == 0 || keyword == " ") res.status(400).send({ error: "단어가 입력되지 않았습니다" })
    else {
        UserKeywords.findOrCreate({
            where: { name: keyword },
            default: {
                name: keyword,
            }
        })
            .spread((name, created) => {
                if (created) {
                    res.send('New Memo: ' + name.name);
                } else {
                    res.send("old : " + name.name)
                    UserKeywords.update({ name: keyword }, { where: { name: keyword } })
                }
            });
    }
}

module.exports = {
    showList,
    create
}