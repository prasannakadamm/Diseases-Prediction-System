import('mongoose').then(async (mongoose) => {
    try {
        await mongoose.connect(Array.from(require('fs').readFileSync('.env', 'utf-8').matchAll(/MONGO_URI=(.*)/g))[0][1].trim());
        const User = (await import('./models/User.js')).default;
        const bcrypt = require('bcrypt');
        
        let admin = await User.findOne({ email: 'admin@diseaseprediction.com' });
        
        if (!admin) {
             const salt = await bcrypt.genSalt(10);
             const hashedPassword = await bcrypt.hash('admin123', salt);
             admin = await User.create({
                 name: 'Admin Node',
                 email: 'admin@diseaseprediction.com',
                 password: hashedPassword,
                 role: 'admin'
             });
             console.log('Created missing admin account.');
        }
        
        console.log('Admin Email:', admin.email);
        console.log('Admin Status: Ready');
        process.exit(0);
    } catch(e) {
        console.error(e);
        process.exit(1);
    }
});
