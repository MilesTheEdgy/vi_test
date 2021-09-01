
const replaceTURCharWithENG = (string) => {
    const turkishCharactersArray = [ "İ", "ı", "Ö", "ö", "Ü", "ü", "Ç", "ç", "Ğ", "ğ", "Ş", "ş"]
    const englishEquivilant = ["I", "i", "O", "o", "U", "u", "C", "c", "G", "g", "S", "s"]
    const strArray = string.split("")
    let newStr = ""

    for (let i = 0; i < strArray.length; i++) {
        let tempStr = []
        for (let j = 0; j < turkishCharactersArray.length; j++) {
            if (strArray[i] === turkishCharactersArray[j]) {
                tempStr.push(englishEquivilant[j])
            }
        }
        if (tempStr.length !== 0)
            newStr = newStr + tempStr[0]
        else
            newStr = newStr + strArray[i]
        tempStr.splice(0, tempStr.length)
    }
    return newStr.toLowerCase()
}

const newStr = replaceTURCharWithENG("İptal")
console.log(newStr)