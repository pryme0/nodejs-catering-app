const { connect } = require('mongoose');

(async() => {
    try {
        return await connect(process.env.URL/*  || 'mongodb://localhost:27017/carter'*/, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        },(con,cont)=>{console.log('db connected')
        });
    } catch (error) {
        console.log('Error:', error);
    }
})();