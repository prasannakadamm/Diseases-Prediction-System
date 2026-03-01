const mongoose = require('mongoose');
const User = require('./models/User.js').default;

mongoose.connect('mongodb+srv://kadamyash:jioh1WpLdfV0bHjL@cluster0.h9f6y.mongodb.net/disease_prediction?retryWrites=true&w=majority&appName=Cluster0')
.then(async () => {
    const admins = await User.find({ role: 'admin' }).select('email name');
    console.log(admins);
    process.exit(0);
})
.catch(err => {
    console.error(err);
    process.exit(1);
});
