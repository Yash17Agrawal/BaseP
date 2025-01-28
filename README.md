# BaseP

## Prerequisites

* Python 3   -  (Not mandatory to install)
* Virtualenv -  To enable referencing library code while development (Not mandatory to install)
* docker 
* docker-compose

## Server Setup

1. Go to project root i.e BaseP
2. docker-compose -f deployment/docker-compose.yml up
3. Go to localhost:8000 for app
4. Go to localhost:8000/admin for app
5. Go to localhost:5050 for pgmyadmin for managing postgres
6. Go to localhost:5557 for working with flower to manage celery tasks

## Setting up a virtual environment (Optional)

1. Install virtualenv if you haven't already:
   ```sh
   pip install virtualenv
   ```
2. Create a virtual environment:
   ```sh
   virtualenv venv
   ```
3. Activate the virtual environment:
   - On Windows:
     ```sh
     venv\Scripts\activate
     ```
   - On macOS and Linux:
     ```sh
     source venv/bin/activate
     ```
4. Install the required dependencies:
   ```sh
   pip install -r requirements.txt
   ```

## Setting up the UI

1. Navigate to the frontend directory:
   ```sh
   cd webapp/frontend
   ```
2. Install the required dependencies:
   ```sh
   yarn install
   ```
3. Start the development server:
   ```sh
   yarn start
   ```
4. Open your browser and go to `http://localhost:3000` to view the UI.

## Find vendor wise order details
   ```sql
   SELECT v.id, SUM(oi.price * oi.quantity) AS total_amount, SUM(oi.quantity) AS total_quantity
   FROM store_vendor v
   JOIN store_product p ON v.id = p.vendor_id
   JOIN store_orderitem oi ON p.id = oi.product_id
   JOIN store_order o ON oi.order_id = o.id
   WHERE v.id = 1 and o.status != 'Pending'
   GROUP BY v.id
   ```

