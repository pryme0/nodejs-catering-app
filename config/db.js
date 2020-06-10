const { connect } = require('mongoose');
/*  || 'mongodb://localhost:27017/carter'*/
(async() => {
    try {
        return  await connect(process.env.URL , {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        },(con,cont)=>{
            console.log(con)
            console.log(cont)
            console.log('db connected')
        });
    } catch (error) {
        console.log('Error:', error);
    }
})();