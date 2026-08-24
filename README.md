# E-Commerce Tennis & Padel Store

Progetto di un e-commerce full-stack sviluppato con **Ruby on Rails** (backend API) e **Angular** (frontend), realizzato per l’esame di Progetto di Sistemi Web.

## Prerequisiti software

Assicurarsi di avere installato le seguenti versioni (o compatibili):

### Backend
- **Ruby**: 3.4.6  
- **Rails**: 8.1.1  
- **Bundler**: ≥ 2.7.2 
- **Database**: MySQL 8.0  

### Frontend
- **Node.js**: 20.19.6
- **npm**: 10.8.2
- **Angular**: 21.0.2
- **Angular CLI**: 21.0.3  

### Verifica delle versioni
```bash
ruby -v
rails -v
node -v
npm -v
ng version
```

## Installazione del progetto
Clonare il repository:
```git clone https://github.com/ntonipisano/e-commerce-psw.git```

### Entra nella cartella di progetto
```cd e-commerce-psw```

## Setup backend Rails e database
### Entra nella cartella di backend
```cd flowboard-backend_api```

### Configurazione database
Modificare il file ```config/database.yml``` inserendo le credenziali locali (username, password, host)

### Installa le dipendenze
```bundle install```

### Creare il database
```rails db:create```

### Eseguire le migrazioni
```rails db:migrate```

### Popolare il database con dati iniziali (seeding)
Il progetto include un __seeding iniziale__ dei prodotti all'interno del file ```db/seeds.rb``` utile a testare l'applicazione.
Prima di avviare l'applicazione eseguire il seeding con il comando:
```rails db:seed```

Il seeding inserisce prodotti iniziali per iniziare a testare l'applicazione

### Avvia il server
```rails s```
Il backend sarà disponibile all'indirizzo ```http://localhost:3000```

## Setup frontend Angular
### Entra nella cartella di frontend
```cd flowboard```
### Installa le dipendenze
```npm install```
### Avviare il server di sviluppo Angular
```ng serve```
Il frontend sarà disponibile all'indirizzo ```http://localhost:4200```
