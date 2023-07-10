const { MongoClient, ServerApiVersion } = require("mongodb");
const readline = require("readline-sync");

const uri =
    "mongodb+srv://andakhalo100:AndaKhalo@cluster0.zyhk1mz.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

client.connect().then(async () => {
    let response
    let accName
    let cardNumber
    let amount
    const database = client.db("Mi_database");
    const collection = database.collection("ATM_database")

    while (true) {
        console.log("Choose Operation :");
        console.log("1. Insert");
        console.log("2. Make transaction");
        console.log("press 'ctrl + C' to exit")

        let choose = Number(readline.question());

        switch (choose) {
            case 1: console.log("Enter Name : ");
                accName = String(readline.question());
                console.log("Enter Card Number : ");
                cardNumber = String(readline.question());
                response = await collection.insertOne({
                    Name: accName,
                    OTP: Math.floor(Math.random() * 1000000),
                    CardNumber: cardNumber,
                    Balance: 100000
                })

                console.log(response)
                break;

            case 2: console.log("Enter Name : ");
                accName = String(readline.question());
                console.log("Enter amount to debit");
                amount = Number(readline.question());
                const user = await collection.findOne({
                    Name: accName
                })


                response = await collection.updateOne(
                    { Name: accName },
                    {
                        $set: {
                            Balance: user.Balance - amount > 0
                                ?
                                debit(user.Balance, amount, `Debited ${amount}`)
                                :
                                debit(user.Balance, 0, `Insufficient Balance`)
                        }
                    });

                console.log(response);
                break;

            default: console.log("Enter a valid operation");
        }
    }
})

const debit = (balance, amount, message) => {
    console.log(message)
    return balance - amount;
}