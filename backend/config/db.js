const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');

    // Manejo de eventos de conexión
    mongoose.connection.on('connected', () => {
      console.log('Mongoose connected to DB');
    });

    mongoose.connection.on('error', (err) => {
      console.error('Mongoose connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('Mongoose disconnected from DB');
    });

    // Cierre limpio de la conexión al detener la aplicación
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('Mongoose connection closed due to app termination');
    });
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
};

module.exports = connectDB;