import dotenv from 'dotenv';
dotenv.config();

import con from './config/db.js';
import app from './server.js';

(async function() {
    //Wait For Mongoose Connection
    await con(process.env.MONGO_ATLAS_URI);
    
    app.listen(3000,() => {
        console.log("Listenting on port 3000");
    });
})();