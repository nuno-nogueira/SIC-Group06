import mongoose from 'mongoose';
import 'dotenv/config'; 
import FairModel from './fairs.model.js';


const db = {};
db.mongoose = mongoose;

(async () => {
    try {
        const config = {
            USER: process.env.DB_USER,
            PASSWORD: process.env.DB_PASSWORD,
            DB: process.env.DB_NAME,
            HOST: process.env.DB_HOST
        };
        
        const mongoDBURL = `mongodb+srv://${config.USER}:${config.PASSWORD}@${config.HOST}/${config.DB}?retryWrites=true&w=majority`;

        await db.mongoose.connect(mongoDBURL);
        console.log("Connected to the database!");
    } catch (error) {
        console.log("❌ Unable to connect to the database:", error);
        process.exit(1);
    }
})();

db.Fair = FairModel(mongoose);
export default db;







// let fairs = [
//   {
//     "id": 1,
//     "name": "Mercado do Bolhão",
//     "description": "O mercado mais emblemático do Porto, com produtos frescos e alma tripeira.",
//     "imageUrl": "https://www.oporto.pt/wp-content/uploads/2022/09/mercado-bolhao-porto.jpg",
//     "address": "Rua Formosa 305, 4000-214 Porto",
//     "latitude": 41.1496,
//     "longitude": -8.6064,
//     "openingHours": "Seg-Sáb: 08:00 - 20:00",
//     "ratings":[{
//     "id": "rate_001",
//     "userId": "user_88",
//     "fairId": 1, 
//     "rating": 3.5
//   }],
//     "categories": ["Alimentação", "Vestuário"],
//     "sellers": [
//       { "id": "sel_1", "name": "Joaquim da Fruta" },
//       { "id": "sel_2", "name": "Maria Albertina" }
//     ]
//   },
//   {
//     "id": 2,
//     "name": "Feira da Vandoma",
//     "description": "Feira tradicional de velharias e artigos em segunda mão.",
//     "imageUrl": "https://visitas.cm-porto.pt/assets/images/feiras/vandoma.jpg",
//     "address": "Av. 25 de Abril, Porto",
//     "latitude": 41.1579,
//     "longitude": -8.5779,
//     "openingHours": "Sábados: 08:00 - 13:00",
//     "ratings": [{
//     "id": "rate_002",
//     "userId": "user_95",
//     "fairId": 2,
//     "rating": 4
//   }],
//     "categories": ["Vestuário", "Artesanato"],
//     "sellers": [
//       { "id": "sel_3", "name": "Carolina Artesã" }
//     ]
//   },
//   {
//     "id": 3,
//     "name": "Mercadinho dos Clérigos",
//     "description": "Pequeno mercado urbano com artesanato local e souvenirs.",
//     "imageUrl": "https://static.globalnoticias.pt/jn/image.jpg?id=12345",
//     "address": "Rua das Carmelitas, Porto",
//     "latitude": 41.1456,
//     "longitude": -8.6146,
//     "openingHours": "Todos os dias: 10:00 - 19:00",
//     "ratings": [{
//     "id": "rate_003",
//     "userId": "user_12",
//     "fairId": 3,
//     "rating": 5
//   }],
//     "categories": ["Artesanato", "Souvenirs"],
//     "sellers": [
//       { "id": "sel_2", "name": "Maria Albertina" },
//       { "id": "sel_3", "name": "Carolina Artesã" }
//     ]
//   }
// ]

// export default fairs;