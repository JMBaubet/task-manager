# Guide de Configuration JSONBin.io

Voici comment configurer votre stockage JSON en ligne.

## 1. Création du Compte et de la Clé API
1.  Allez sur [https://jsonbin.io/](https://jsonbin.io/) et cliquez sur **"Login"** (ou Sign Up). Vous pouvez utiliser Google ou GitHub.
2.  Une fois connecté, cliquez sur votre avatar ou le menu en haut à droite, puis sur **"API Keys"**.
3.  Vous devriez voir une "Master Key" par défaut. Copiez-la.
    *   C'est votre `VITE_JSONBIN_API_KEY`.

## 2. Création du Fichier (Bin)
1.  Cliquez sur le logo JSONBin pour revenir à l'accueil ou allez dans le **Dashboard**.
2.  Cliquez sur **"Create New Bin"** (ou "+ Create").
3.  Dans l'éditeur qui s'ouvre, collez ce JSON vide pour initialiser :
    ```json
    {
      "projects": []
    }
    ```
4.  Cliquez sur l'onglet/bouton **"Settings"** (ou l'icône d'engrenage) à côté du bouton Save.
    *   Assurez-vous que **"Private"** est coché (pour que personne d'autre ne puisse lire vos données).
5.  Cliquez sur **"Save Bin"** (ou "Create").
6.  Une fois créé, regardez l'URL ou les métadonnées affichées. Vous verrez un **Bin ID** (ex: `6564a...`).
    *   C'est votre `VITE_JSONBIN_BIN_ID`.

## 3. Configuration de l'Application
1.  Ouvrez votre fichier `.env`.
2.  Remplacez le contenu par :

```env
VITE_JSONBIN_API_KEY=votre_master_key_ici
VITE_JSONBIN_BIN_ID=votre_bin_id_ici
```

3.  Sauvegardez.
