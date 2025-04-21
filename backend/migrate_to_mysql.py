import sqlite3
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from database.models import Base, Category, Product, Customer, Cart

# SQLite connection
sqlite_conn = sqlite3.connect('ecommerce.db')
sqlite_cursor = sqlite_conn.cursor()

# MySQL connection
MYSQL_URL = "mysql+pymysql://hoanv:abc13579@localhost/ecommerce"
mysql_engine = create_engine(MYSQL_URL)
SessionLocal = sessionmaker(bind=mysql_engine)
db = SessionLocal()

# Create all tables in MySQL
Base.metadata.create_all(mysql_engine)

try:
    # Migrate Categories
    sqlite_cursor.execute('SELECT id, name FROM categories')
    categories = sqlite_cursor.fetchall()
    for cat_id, name in categories:
        category = Category(id=cat_id, name=name)
        db.add(category)
    db.commit()

    # Migrate Products
    sqlite_cursor.execute('SELECT id, name, price, category_id FROM products')
    products = sqlite_cursor.fetchall()
    for prod_id, name, price, category_id in products:
        product = Product(id=prod_id, name=name, price=price, category_id=category_id)
        db.add(product)
    db.commit()

    # Migrate Customers
    sqlite_cursor.execute('SELECT id, name, address, phone_number FROM customers')
    customers = sqlite_cursor.fetchall()
    for cust_id, name, address, phone_number in customers:
        customer = Customer(id=cust_id, name=name, address=address, phone_number=phone_number)
        db.add(customer)
    db.commit()

    # Migrate Cart
    sqlite_cursor.execute('SELECT id, customer_id, product_id FROM cart')
    cart_items = sqlite_cursor.fetchall()
    for cart_id, customer_id, product_id in cart_items:
        cart_item = Cart(id=cart_id, customer_id=customer_id, product_id=product_id)
        db.add(cart_item)
    db.commit()

    print("Migration completed successfully!")

except Exception as e:
    print(f"Error during migration: {e}")
    db.rollback()

finally:
    db.close()
    sqlite_conn.close()