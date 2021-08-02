

const verifyApplicationInput = async (prdctNameAndBarcode, listOfProducts) => {
    const verifiedProduct = listOfProducts.filter((elm) => {
        return elm.Barcode == prdctNameAndBarcode[1]
    })
    console.log(listOfProducts.length)
    console.log("list of producst is: ", listOfProducts)
    console.log("prdctnameand barcode is: ", prdctNameAndBarcode)
    console.log("verifying barcode: ", verifiedProduct)
    if (verifiedProduct.length !== 1) return false
    else return true
}

// This function verifies the product name server side, I decided not to implement it because it takes too long to run.