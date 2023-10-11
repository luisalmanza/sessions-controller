import "dotenv/config";
import { connect } from "mongoose";

async function dbConnect(): Promise<void> {
    await connect(<string>process.env.DB_URI);
}

export default dbConnect;