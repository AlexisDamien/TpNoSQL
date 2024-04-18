# TP ReplicatSet noSQL
## Mise en place ReplicatSet

Pour lancer le projet, j'ai commencé par installer mongoDB avec node js :

npm i mongoDB

Une fois le contenu de mon docker-compose.yml en place, je lance la commande suivante pour instancié mes réplicats sets :

Docker-compose up -d

et je vérifie si mes réplicats fonctionne :

docker exec -it mongo3-1 mongosh --eval "rs.status()"

## Génération des fakes datas

J'utilise la librairie faker pour créer de fausses données, donc je commence par l'installer : 

npm install @faker-js/faker

Puis je créer une fonction pour créer des utilisateurs :

function createRandomUser() {
  return {
    age: faker.number.int({ min: 1, max: 100 }),
    email: faker.internet.email(),
    name: faker.person.firstName(),
    createdAt: faker.date.past(),
  };
}

Par la suite, j'appellerai la fonction dans une boucle pour créer une plus grande quantité de FakeData
## Commande CLI pour le CRUD

Je me connecte à mon replicat pour effectuer les commandes :

docker exec -it tpnosql-mongo1-1 mongosh 

Voici les différentes Commande en CLI pour le CRUD avec le résultat du shell :

1. Insérer un utilisateur :

db.users.insertOne({
    "age": 35,
    "email": "example@example.com",
    "name": "John",
    "createdAt": ISODate("2024-04-17T08:00:00Z")
})

```shell
{
  acknowledged: true,
  insertedId: ObjectId('6620d04844eab5b56cc934dd')
}
```

2. Trouver tous les utilisteurs de plus de 30ans :

db.users.find({ "age": { $gt: 30 } })

```shell
[
  {
    _id: ObjectId('661fdb877dff2470e20999ad'),
    age: 50,
    email: 'Marlen.Koch62@hotmail.com',
    name: 'Gia',
    createdAt: ISODate('2023-09-05T17:24:45.976Z')
  },
  {
    _id: ObjectId('661fdb877dff2470e20999ae'),
    age: 81,
    email: 'Craig_Hayes10@hotmail.com',
    name: 'Leora',
    createdAt: ISODate('2023-08-17T21:19:19.145Z')
  },
  {
    _id: ObjectId('661fdb877dff2470e20999af'),
    age: 110,
    email: 'Harmon.Bogisich@gmail.com',
    name: 'Hettie',
    createdAt: ISODate('2023-08-02T20:37:19.558Z')
  },
  {
    _id: ObjectId('661fdb877dff2470e20999b9'),
    age: 56,
    email: 'Maida4@yahoo.com',
    name: 'Dashawn',
    createdAt: ISODate('2023-12-12T19:30:41.723Z')
  },
  {
    _id: ObjectId('661fdb877dff2470e20999bb'),
    age: 96,
    email: 'Jaida56@hotmail.com',
    name: 'Llewellyn',
    createdAt: ISODate('2024-03-30T14:33:20.821Z')
  },
  {
    _id: ObjectId('661fdb877dff2470e20999bc'),
    age: 37,
    email: 'Rosanna67@gmail.com',
    name: 'Luther',
    createdAt: ISODate('2023-08-30T02:20:07.614Z')
  }
]
```
(J'ai volontairement supprimer des données du prompt pour pas que le readeMe fasse la longueur du Nil)

3.	Mise à jour (Augmenter l'âge de tous les utilisateurs de 5 ans)

db.users.updateMany({}, { $inc: { "age": 5 } })

```shell
{
  acknowledged: true,
  insertedId: null,
  matchedCount: 500,
  modifiedCount: 500,
  upsertedCount: 0
}
```

•	
4.	Suppression (Supprimer un utilisateur spécifique (en passant son email en l'occurence))

db.users.deleteOne({ "email": "example@example.com" })

```shell
{ acknowledged: true, deletedCount: 1 }
```
## Différence observée entre CLI et CRUD

Les différences sont tout simplement qu'avec le CRUD du script, on peut plus simplement manipuler les données et en faire ce que l'on souhaite
## Difficultés rencontrées

La seule et principale difficulté rencontrée était dû à un manque de connaissance de ma part, je souhaitais pouvoir supprimer un user via son email lors de l'execution du script en le demandant lors du prompt.
J'ai donc cherché et importé Readline pour pouvoir résoudre mon problème