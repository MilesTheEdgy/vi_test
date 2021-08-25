const handleError = (err, res, resErrorString) => {
    console.log(err)
    return res.status(500).json(resErrorString)
}





module.exports = {
    handleError
}