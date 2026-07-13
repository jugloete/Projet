# Deploiement backend pour recevoir les candidatures

Le site GitHub Pages est statique. Pour que les candidatures de vos proches arrivent dans la meme plateforme, il faut aussi deployer le backend Express avec une base MongoDB en ligne.

## 1. Base MongoDB

Creer une base MongoDB Atlas, puis recuperer l'URI de connexion. Exemple de forme :

```env
mongodb+srv://UTILISATEUR:MOT_DE_PASSE@cluster.mongodb.net/internship_platform
```

## 2. Backend Render

Le fichier `render.yaml` est pret pour Render.

Variables a renseigner dans Render :

```env
MONGODB_URI=mongodb+srv://...
CORS_ORIGIN=https://jugloete.github.io
```

Render donnera ensuite une URL du type :

```text
https://internship-platform-api.onrender.com
```

Tester :

```text
https://internship-platform-api.onrender.com/api/health
```

## 3. Frontend GitHub Pages

Dans GitHub, ajouter une variable de depot :

```env
VITE_API_URL=https://internship-platform-api.onrender.com/api
```

Puis relancer le workflow GitHub Pages ou reconstruire/publier `gh-pages`.

Une fois cette URL configuree, les candidatures seront sauvegardees dans MongoDB et visibles par les comptes entreprise/admin depuis plusieurs appareils.
