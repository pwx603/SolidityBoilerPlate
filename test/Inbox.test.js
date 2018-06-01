const assert = require('assert');
const ganache = require('ganache-cli')
const Web3 = require('web3')

const rpc = "ws://localhost:8545"
const web3 = new Web3(rpc);
const {interface, bytecode} = require('../compile');

let accounts;
let inbox;
const INITIAL_MSG = "Hello World!"




beforeEach(async() => {
    accounts = await web3.eth.getAccounts();
    // web3.eth.getAccounts().then(fetchedAccounts => {
    //     console.log(fetchedAccounts);
    // })

    inbox = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({data: bytecode, arguments:[INITIAL_MSG]})
        .send({from: accounts[0], gas: "1000000"})

})

describe("Inbox", () => {
    it("Success contract deployment: ", () => {
        assert.ok(inbox.options.address)
        //console.log("address: ",inbox.options.address);
        //console.log("methods: ",inbox.methods);
    });

    it("Get message initialMessage: ", async() => {
        const message = await inbox.methods.message().call()
        assert.equal(message, INITIAL_MSG);
    });

    it("Set message: ", async()=>{
        const NEW_MSG = "Goodbye, World"
        const txHash = await inbox.methods.setMessage(NEW_MSG).send({from: accounts[1], gas: "1000000"})
        const message = await inbox.methods.message().call()
        console.log("txHash: ", txHash);
        console.log("message: ", message)
        assert.equal(message, NEW_MSG);
    })
});