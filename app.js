const express = require('express');
const { serverPort } = require('./config/index')
const sequelize = require('./db/index');
const userRoutes = require('./modules/user/userRoutes');
const fileRoutes = require('./modules/file/fileRoutes');

const app = express();

app.use(express.json());
app.use('/api/user', userRoutes);
app.use('/api/file', fileRoutes);

sequelize.sync().then(result =>{
    if(result){
        console.log('Database Connected')
    }
})
.catch(err=>{
    console.log(err)
})

const PORT = serverPort.port || 5000;
app.listen(PORT, () => console.log(`Server running on port htpp://localhost:${PORT}`));
