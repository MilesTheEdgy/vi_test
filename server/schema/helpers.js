const ProductModel = require("../models/product")
const UserModel = require("../models/user")

class CustomError extends Error {
    code = 451;
    message = this.message ||
      'This content is not available in your country';
}

const getUpdateIDSequence = async (CounterModel, IDSequence) => {
    let counter
    if (IDSequence === "application_id")
        counter = await CounterModel.findOneAndUpdate({sequenceName: IDSequence}, {$inc: {value: 3}})
    else
        counter = await CounterModel.findOneAndUpdate({sequenceName: IDSequence}, {$inc: {value: 4}})
    return counter.value
}

const verifyApplicationInput = async (inputArr, goal, unitPrice, totalPrice, finalDate, submitter_pledge) => {
    try {
        const query = await ProductModel.findOne({Product_name: inputArr[0], Barcode: inputArr[1]})
        if (query == null) throw new Error("Your application name and or barcode did not match")
    } catch (error) {
        console.log(error)
        throw new Error("Could not verify your application name and barcode")
    }
    if (unitPrice == 0 || goal == 0 || totalPrice == 0) throw new Error("Your goal or price input was empty")
    if (goal % 1 != 0 || submitter_pledge % 1 != 0) throw new Error("Your number input cannot contain digits.")
    // if (unitPrice * goal !== Number(totalPrice.toFixed(2))) {
    //     console.log("unitPrice: ", unitPrice, " * goal: ", goal, "!== totalPrice: ", totalPrice)
    //     console.log("expected: ", Number(totalPrice.toFixed(2)), " got: ", unitPrice * goal)
    //     throw new Error("PRICE MATH DOES NOT MATCH")
    // }
    // WILL WORK ON THIS LATER
    if (submitter_pledge >= goal) throw new Error("Your pledge cannot be bigger than your goal")
    const inputDate = new Date(finalDate);
    const todayDate = new Date();
    if (inputDate.setHours(0, 0, 0, 0) <= todayDate.setHours(0, 0, 0, 0)) {
        throw new Error("final date is older than today's date")
    };
    return true
}

const verifyApplicationJoinInput = (app, user, userPledge) => {
    if (app.submitter === user.pharmacyName) {
        console.error("Can not join your own application")
        return false
    }
    if (userPledge % 1 != 0) throw new Error("your number input cannot contain digits")
    if (app.goal < userPledge) throw new Error("Your pledge cannot be bigger than the goal")
    for (let i = 0; i < app.joiners.length; i++) {
        if (app.joiners[i]?.name === user.pharmacyName) {
            console.error("You have already joined this application")
            return false
        }
    }
    return true
}

const returnSellerBalance = async (crntUser, unitPrice, sellerAmount) => {
    const seller = await UserModel.findOne({pharmacy_name: crntUser.pharmacyName})
    const currentBalance = seller.balance.toString()
    console.log(unitPrice)
    const unit_price = unitPrice.toString()
    return Number(sellerAmount) * Number(unit_price) + Number(currentBalance)
}

const returnBuyersList = async (unitPrice, verifiedJoiners) => {
    let returned = []
    const unit_price = unitPrice.toString()
    for (let i = 0; i < verifiedJoiners.length; i++) {
        let user = await UserModel.findOne({pharmacy_name: verifiedJoiners[i].name})
        let currentBalance = user.balance.toString()
        let total = -Math.abs(Number(verifiedJoiners[i].pledge) * Number(unit_price))
        let balanceAfter = total + Number(currentBalance)
        console.log("currentBalance", currentBalance)
        console.log("total", total)
        console.log("balanceAfter", balanceAfter)
        returned.push({
            name: user.pharmacy_name,
            amount: verifiedJoiners[i].pledge,
            total: total,
            balanceAfter: balanceAfter
        })
    }
    return returned
}

const updateSellerBalance = async (crntUser, sellerNewBalance, session) => {
    await UserModel.findOneAndUpdate({pharmacy_name: crntUser.pharmacyName}, {balance: sellerNewBalance}, { session })
}

const updateBuyersBalance = async (unitPrice, verifiedJoiners, session) => {
    const unit_price = unitPrice.toString()
    for (let i = 0; i < verifiedJoiners.length; i++) {
        let user = await UserModel.findOne({pharmacy_name: verifiedJoiners[i].name}, {}, {session})
        let currentBalance = user.balance.toString()
        let total = -Math.abs(Number(verifiedJoiners[i].pledge) * Number(unit_price))
        let balanceAfter = total + Number(currentBalance)
        user.balance = balanceAfter
        await user.save({session})
    }
}

function escapeStringRegexp(string) {
	if (typeof string !== 'string') {
		throw new TypeError('Expected a string');
	}
	return string
		.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
		.replace(/-/g, '\\x2d');
}


//maps unit price to array
const mapUnitPriceToStringArray = (query) => {
    return query.map(obj => {
        return {
            ...obj._doc,
            unit_price: obj.unit_price.toString()
        }
    })
}


module.exports = {
    getUpdateIDSequence,
    verifyApplicationInput,
    verifyApplicationJoinInput,
    returnSellerBalance,
    returnBuyersList,
    updateSellerBalance,
    updateBuyersBalance,
    escapeStringRegexp,
    mapUnitPriceToStringArray,
    CustomError
}


