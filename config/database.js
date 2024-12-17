import mongoose from "mongoose";


const connectDatabase =  async ()=>{
    try {
        mongoose.connect(process.env.MONGO_URL, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
      } catch (error) {
        console.log(error);
      }
  }

  export default connectDatabase;


