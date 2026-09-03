import express from "express";
import cors from "cors";


const app = express();
app.use(cors({
    origin:"*"
}))

app.listen(3000)
    .on("listening", () => {
        console.log("Server is running in port 3000");
    })

app.get("/test", (request, response) => {
    response.json({
        message:"Ola mundo"
    })
})