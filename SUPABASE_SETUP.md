# Guide de Configuration Supabase

Suivez ces étapes pour configurer votre backend Supabase.

## 1. Création du Projet
1.  Allez sur [https://supabase.com/](https://supabase.com/) et cliquez sur **"Start your project"**.
2.  Connectez-vous avec GitHub ou créez un compte.
3.  Cliquez sur **"New Project"**.
4.  Remplissez le formulaire :
    *   **Name** : `task-manager` (ou ce que vous voulez).
    *   **Database Password** : Générez un mot de passe fort et **sauvegardez-le** quelque part (vous n'en aurez pas besoin pour l'appli tout de suite, mais c'est important).
    *   **Region** : Choisissez une région proche de vous (ex: `EU (Paris)` ou `EU (Frankfurt)`).
    *   **Pricing Plan** : Sélectionnez "Free".
5.  Cliquez sur **"Create new project"**.
6.  Attendez quelques minutes que le projet soit prêt (le statut passera de "Setting up" à vert).

## 2. Création de la Base de Données (Tables)
1.  Dans le menu de gauche (la barre latérale), cliquez sur l'icône **SQL Editor** (c'est le 3ème icône en partant du haut, qui ressemble à une console `>_` ou une page de code).
2.  Cliquez sur **"New query"** (ou utilisez l'onglet vide s'il y en a un).
3.  Copiez le contenu du fichier `database.sql` de votre projet local.
    *   *Vous pouvez le trouver dans VS Code : `database.sql` à la racine.*
4.  Collez le code SQL dans l'éditeur de Supabase.
5.  Cliquez sur le bouton **"Run"** (en bas à droite de l'éditeur).
6.  Vous devriez voir un message "Success" dans la zone de résultats.

## 3. Récupération des Clés API
1.  Dans le menu de gauche, cliquez sur l'icône **Settings** (la roue dentée tout en bas).
2.  Dans le sous-menu qui s'affiche, cliquez sur **"API"**.
3.  Cherchez la section **"Project URL"** :
    *   Copiez l'URL (ex: `https://xyzxyzxyz.supabase.co`).
4.  Cherchez la section **"Project API keys"** :
    *   Repérez la clé marquée `anon` `public`.
    *   Copiez cette clé (c'est une longue chaîne de caractères).

## 4. Configuration de l'Application
1.  Revenez dans votre éditeur de code (VS Code).
2.  Ouvrez le fichier `.env` à la racine du projet.
3.  Collez les valeurs que vous venez de copier :

```env
VITE_SUPABASE_URL=https://votre-url-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre-cle-anon-publique-ici
```

4.  Sauvegardez le fichier `.env`.

## 5. Test
1.  Relancez votre application avec `yarn dev` (si elle tournait déjà, redémarrez-la pour prendre en compte le `.env`).
2.  L'application est maintenant connectée à Supabase !
