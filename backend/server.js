import app from "./src/app.js"
import connectDB from "./src/db/db.js"
const port = 3000

connectDB()
    .then(() => {
        app.listen(port, () => {
            console.log(`Forma API listening on port ${port}`)
        })
    })
    .catch((error) => {
        console.error('Failed to connect to the database:', error)
        process.exitCode = 1
    })