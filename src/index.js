import { faker } from '@faker-js/faker';
import { MongoClient } from 'mongodb';
import readline from 'readline';

const dbName = 'test';
const uri = 'mongodb://127.0.0.1:27017,127.0.0.1:27018,127.0.0.1:27019/?replicaSet=rs0';

//Génération d'un utilisateur au format désiré
function createRandomUser() {
  return {
    age: faker.number.int({ min: 1, max: 100 }),
    email: faker.internet.email(),
    name: faker.person.firstName(),
    createdAt: faker.date.past(),
  };
}

async function performCRUDOperations() {
  const client = new MongoClient(uri);

  try {
    //Connexion à mongoDB
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(dbName);
    const collection = db.collection('users');

    // Création et Insertion de 100 users dans la db
    const usersToInsert = [];
    for (let i = 0; i < 100; i++) {
      usersToInsert.push(createRandomUser());
      console.log(createRandomUser());
    }

    await collection.insertMany(usersToInsert);
    console.log('Insertion: Tous les utilisateurs insérés.');

    // Lecture (Trouver tous les utilisateurs de plus de 30 ans)
    const usersOver30 = await collection.find({ age: { $gt: 30 } }).toArray();
    console.log('Lecture: Utilisateurs de plus de 30 ans:', usersOver30);

    // Mise à jour (Augmenter l'âge de tous les utilisateurs de 5 ans)
    await collection.updateMany({}, { $inc: { age: 5 } });
    console.log('Mise à jour: Âge de tous les utilisateurs augmenté de 5 ans.');
    
    // Interface readline pour récupérer l'email de l'utilisateur à supprimer
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question('Entrer l\'email de l\'utilisateur à supprimer : ', async (email) => {
      try {
        // Recherche de l'utilisateur par email
        const userToDelete = await collection.findOne({ email });

        if (userToDelete) {
          // Suppression de l'utilisateur trouvé
          await collection.deleteOne({ _id: userToDelete._id });
          console.log(`Suppression: Utilisateur avec email ${email} supprimé.`);
        } else {
          console.log(`Suppression: Aucun utilisateur trouvé avec l'email ${email}.`);
        }
      } catch (error) {
        console.log('Erreur lors de la suppression de l\'utilisateur :', error);
      } finally {
        rl.close(); 
        client.close();// Fermer la connexion MongoDB
      }
    });
  } catch (error) {
    console.log('Erreur de connexion à MongoDB :', error);
  }
}

performCRUDOperations();
