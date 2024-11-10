import mongoose from "mongoose";

const mongoConnect = async () => {
  return mongoose
    .connect(process.env.MONGO_URL, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Conectado a MongoDB");
    })
    .catch((error) => {
      console.error("Error conectando a MongoDB:", error);
      // Es importante manejar el rechazo de la promesa aquí
      process.exit(1);
    });
};



export default mongoConnect;