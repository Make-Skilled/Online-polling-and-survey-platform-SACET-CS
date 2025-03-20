const app = require("./app");
const { connectDatabase } = require("./config/db");
require('dotenv').config();  // Changed this line to use root .env file

// Connect to database
connectDatabase();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
})
