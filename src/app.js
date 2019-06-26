const { MongoClient, ObjectId } = require('mongodb');


MongoClient.connect('mongodb://127.0.0.1:27017', { useNewUrlParser: true }, (err, client) => {
    if (err) {
        return console.log('error occured while connecting');
    }
    console.log('Connected Successfully');
    const db = client.db('Task-Manager');
    const updateOneById = db.collection('tasks').updateOne({
        _id: new ObjectId("5d12ad0f3feb51061215e025")
    }, {
        $set: {
            description: 'Book a Rental car',
            completed: false
        }
    })

    updateOneById.then((result) => {
        console.log(result)
    }, (err) => {
        console.log(err)
    })
});