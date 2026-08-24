# Architettura del progetto e‑commerce-psw Tennis & Padel Store

## 1. Panoramica generale

Il progetto è un'applicazione **full‑stack e‑commerce** composta da:

* **Backend**: Ruby on Rails (API REST) (directory flowboard-backend_api)
* **Frontend**: Angular (directory flowboard)
* **Autenticazione**: JWT Devise
* **Database**: MySQL

L'obiettivo è fornire un flusso completo di acquisto: autenticazione utente, gestione del carrello persistente, checkout, creazione dell'ordine, e altre funzionalità classiche di un e-commerce.

## Funzionalità avanzate implementate

* **Wishlist (Preferiti)** per l'utente
* **Storico ordini avanzato** per l'utente con filtri per data, stato e dettagli completi dell'ordine

---

## 2. Modelli principali del dominio

### User

Rappresenta l'utente registrato dell'applicazione.

**Relazioni:**

* has_one :cart
* has_many :orders
* has_many :wishlist_items

---

### Product

Rappresenta un prodotto acquistabile.

**Attributi principali:**

* title
* description
* price
* thumbnail (immagine)

---

### Cart

Rappresenta il carrello persistente di un utente.

**Relazioni:**

* belongs_to :user
* has_many :cart_items

---

### CartItem

Singolo elemento del carrello.

**Relazioni:**

* belongs_to :cart
* belongs_to :product

---

### Order

Rappresenta un ordine confermat (post checkout)

**Relazioni:**

* belongs_to :user
* has_many :order_items

---

### OrderItem

Singolo prodotto all'interno dell'ordine.

**Relazioni:**

* belongs_to :order
* belongs_to :product

---

### WishlistItem

Rappresenta un prodotto salvato nella wishlist dell'utente.

**Relazioni:**

* belongs_to :user
* belongs_to :product

---

## 3. Flusso applicativo

### Login

* L'utente inserisce email e password
* Il backend valida le credenziali
* Viene restituito un **token JWT** che ha una scadenza
* Il token viene salvato sul frontend

---

### Carrello

* Dopo il login (ricezione token dal backend) viene caricato il carrello (se esiste sul db) dell'utente
* Le operazioni di aggiunta/rimozione avvengono tramite API REST
* Il carrello è persistente sul db MySQL e associato all'utente

---

### Checkout

* L'utente visualizza il riepilogo del carrello
* Viene calcolato il totale dal backend: il frontend fa una chiamata http e lo riceve
* Conferma dell'ordine: il backend crea l'ordine leggendo il carrello persistente e lo salva sul database

---

### Ordine

* Il backend crea un Order e i relativi OrderItem
* Alla creazione il carrello viene svuotato
* L'utente può visualizzare lo storico ordini con tutte le informazioni

---

### Wishlist

* Dopo il login (ricezione token dal backend) viene caricata la wishlist (se esiste sul db) dell'utente
* Dal suo interno l'utente può navigare alla pagina dettaglio prodotto, aggiungere il prodotto al carrello e rimuoverlo dalla wishlist

---

## 5. Considerazioni architetturali

* Il backend espone solo API REST, rendendo il frontend indipendente
* Il dominio è modellato seguendo i principi REST e MVC
