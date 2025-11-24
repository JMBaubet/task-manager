# Configuration Supabase

Ce guide vous explique comment configurer Supabase pour votre Task Manager.

## Étape 1 : Créer un compte Supabase

1. Allez sur https://supabase.com/
2. Cliquez sur **"Start your project"**
3. Connectez-vous avec GitHub (recommandé) ou créez un compte

## Étape 2 : Créer un nouveau projet

1. Cliquez sur **"New project"**
2. Remplissez les informations :
   - **Name** : Task Manager
   - **Database Password** : Choisissez un mot de passe fort (notez-le !)
   - **Region** : Choisissez la région la plus proche de vous
3. Cliquez sur **"Create new project"**
4. Attendez 1-2 minutes que le projet soit créé

## Étape 3 : Créer les tables

1. Dans le menu de gauche, cliquez sur **"SQL Editor"**
2. Cliquez sur **"+ New query"**
3. Copiez-collez le contenu du fichier `database.sql` (à la racine du projet)
4. Cliquez sur **"Run"** (ou `Cmd+Enter`)
5. Vous devriez voir : "Success. No rows returned"

## Étape 4 : Récupérer les clés API

1. Dans le menu de gauche, cliquez sur **"Project Settings"** (icône engrenage)
2. Cliquez sur **"API"** dans le sous-menu
3. Vous verrez deux clés importantes :
   - **Project URL** : `https://xxxxx.supabase.co`
   - **anon public** : `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## Étape 5 : Configurer l'application

1. Ouvrez le fichier `.env` à la racine du projet
2. Remplacez les lignes Google Drive par :

```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

3. Sauvegardez le fichier

## Étape 6 : Tester

1. Lancez l'application : `yarn dev` ou `yarn tauri dev`
2. L'application devrait se connecter à Supabase
3. Créez un projet de test
4. Vérifiez dans Supabase :
   - Allez dans **"Table Editor"**
   - Cliquez sur **"projects"**
   - Vous devriez voir votre projet !

## Avantages de Supabase

✅ **Gratuit** jusqu'à 500 MB
✅ **Pas de limite** de requêtes API
✅ **Interface web** pour voir vos données
✅ **Base de données SQL** (plus robuste que JSON)
✅ **Temps réel** (synchronisation automatique entre appareils)

## Dépannage

### "Failed to fetch from Supabase"
- Vérifiez que l'URL et la clé sont correctes dans `.env`
- Vérifiez que vous avez bien exécuté le script SQL
- Redémarrez l'application

### "Row Level Security policy violation"
- Vérifiez que les policies sont bien créées (dans le script SQL)
- Allez dans "Authentication" > "Policies" pour vérifier

### Les données ne s'affichent pas
- Vérifiez dans "Table Editor" que les tables existent
- Vérifiez que les données sont bien dans la base
