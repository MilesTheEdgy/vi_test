const express = require("express")
const mongoose = require("mongoose")
const app = express()
const ApplicationModel = require("../models/application")
const UserModel = require("../models/user")
const CounterModel = require("../models/counter")

jest.setTimeout(30000);

beforeAll(async () => {
    await mongoose.connect("mongodb+srv://admin:admin@testing.vpwk7.mongodb.net/eczane?retryWrites=true&w=majority",
     {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: true})
    mongoose.connection.once("open", () => {
        // console.log('connecting has been made')
    })
    // console.log("dropping collections...")
    // await mongoose.connection.collections.applications.drop()
    // await mongoose.connection.collections.users.drop()
    app.listen(4000, () => {
        console.log('app is listening on port 4000')
    })
})

afterAll(() => {
    mongoose.connection.close()
})


// describe("Adding An Application Record", () => {
//     it("Should Add A Fucking Application Record", async () => {
//         const application = new ApplicationModel({
//             product_name: "blazing hot cum",
//             goal: 69,
//             condition: "15+20",
//             price: 69.231,
//             submitter: "Hayat Eczanesi",
//             submitter_pledge: 15,
//             description: "need this asap for my Cough collection Cough",
//             final_date: "2021-08-12",
//             transaction_id: 454
//         })
//         await application.save()
//         const savedApp = await ApplicationModel.findOne({transaction_id: 454})
//         expect(savedApp.goal).toBe(69)
//     });

//     it("Should update the application that was sent earlier", async() => {
//         const toBeUpdated = await ApplicationModel.findOneAndUpdate({transaction_id: 454}, {$push: {joiners: {name: "Gül Eczanesi", pledge: 25}}})
//         await toBeUpdated.save()
//         const checkIfUpdated = await ApplicationModel.findOne({transaction_id: 454})
//         expect(checkIfUpdated.joiners[0].pledge).toBe(25)
//     });

//     it("Should run another update on the same application", async() => {
//         const toBeUpdated = await ApplicationModel.findOneAndUpdate({transaction_id: 454}, {$push: {joiners: {name: "Başak Eczanesi", pledge: 30}}})
//         await toBeUpdated.save()
//         const checkIfUpdated = await ApplicationModel.findOne({transaction_id: 454})
//         expect(checkIfUpdated.joiners[1].pledge).toBe(30)
//     })
// });


describe("Adding A User Record", () => {
    it("Should add a new record to the user collection", async () => {
        const user = new UserModel({
            username: "samsun",
            pharmacy_name: "Samsun Eczanesi",
            hash: "$2b$10$mGmgpfAc34T7RqXTXW.km.6YWrLD0OVCcJs2lrFvIstYGXAoo9nau"
        })
        await user.save()
        const isSaved = await UserModel.findOne({username: "samsun"})
        expect(isSaved.username).toMatch("samsun")
    })

    it("Should add another user ", async () => {
        const user = new UserModel({
            username: "gül",
            pharmacy_name: "Gül Eczanesi",
            hash: "$2b$10$mGmgpfAc34T7RqXTXW.km.6YWrLD0OVCcJs2lrFvIstYGXAoo9nau"
        })
        await user.save()
        const isSaved = await UserModel.findOne({username: "gül"})
        // console.log("isaved obj: ", isSaved)
        expect(isSaved.username).toMatch("gül")
    })
})


// describe("Adding A Sequence To The Counter Model", () => {
//     it("Should add Application sequence to the counter model", async () => {
//         const counter = new CounterModel({
//             sequenceName: "application_id",
//             value: 100
//         })
//         await counter.save()
//         const isSaved = await CounterModel.findOne({sequenceName: "application_id"})
//         expect(isSaved.value).toBe(100)
//     })

//     it("Should add Transaction sequence to the counter model ", async () => {
//         const counter = new CounterModel({
//             sequenceName: "transaction_id",
//             value: 50
//         })
//         await counter.save()
//         const isSaved = await CounterModel.findOne({sequenceName: "transaction_id"})
//         expect(isSaved.value).toBe(50)
//     })
// })