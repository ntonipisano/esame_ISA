# E-Commerce Tennis & Padel Store

Progetto di un e-commerce full-stack sviluppato con **Ruby on Rails** (backend API) e **Angular** (frontend), realizzato per l’esame di Ingegneria del Software Avanzata.

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


# Esecuzione tramite Docker

L'applicazione può essere eseguita interamente tramite **Docker Compose**.

La configurazione Docker è composta da tre container:

* **Frontend**: Angular, porta `4200`
* **Backend**: Ruby on Rails, porta `3000`
* **Database**: MySQL 8.0, porta `3306`


## Prerequisiti Docker

È necessario avere installato:

* **Docker**
* **Docker Compose** (incluso in Docker Desktop)

Verificare l'installazione con:

```bash
docker --version
docker compose version
```

---

## Configurazione delle variabili d'ambiente

Il progetto utilizza alcune variabili d'ambiente per configurare il database e la chiave JWT.

Creare un file `.env` nella root del progetto `esame_ISA`.

È possibile utilizzare `.env.example` come riferimento.

Il file `.env` deve contenere:

```env
MY_SQL_PASSWORD=your_mysql_password
DEVISE_JWT_SECRET=your_jwt_secret
```

### `MY_SQL_PASSWORD`

È la password dell'utente `root` del database MySQL utilizzato dal container.

### `DEVISE_JWT_SECRET`

È la chiave utilizzata da Devise JWT, ovvero il sistema di autenticazione implementato, per firmare e verificare i token di autenticazione

> **Attenzione:** il file `.env` contiene informazioni sensibili e non deve essere committato nel repository.
>
> La `DEVISE_JWT_SECRET` non deve essere pubblicata su GitHub.

Il file `.env.example`, invece, può essere incluso nel repository in quanto contiene solamente i nomi delle variabili e valori di esempio.

---

## Avvio dell'applicazione tramite Docker

Dalla root del progetto eseguire:

```bash
docker compose up
```

Il comando costruisce le immagini Docker del frontend e del backend e avvia tutti i container necessari.

Al termine saranno disponibili:

* **Frontend Angular**: http://localhost:4200
* **Backend Rails API**: http://localhost:3000
* **MySQL**: localhost:3306

L'applicazione web è accessibile tramite:

```text
http://localhost:4200
```

### Verificare lo stato dei container

In un altro terminale è possibile verificare lo stato dei container con:

```bash
docker compose ps
```

Dovrebbero essere presenti tre servizi:

```text
esame_isa_frontend
esame_isa_backend
esame_isa_db
```

---

## Inizializzazione del database Docker

Al primo avvio, dopo che i container sono stati creati e avviati, da un terminale dalla root del progetto eseguire la migrazione per creare le tabelle dell'applicazione nel database containerizzato:

```bash
docker compose exec backend bundle exec rails db:migrate
```

e popolare il database con i dati iniziali:

```bash
docker compose exec backend bundle exec rails db:seed
```

Il seeding inserisce i prodotti iniziali definiti nel file:

```text
db/seeds.rb
```

Dopo l'inizializzazione, l'applicazione è pronta per essere utilizzata.


---
