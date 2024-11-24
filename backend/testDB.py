import sqlite3
import os

# Set the path to the exact location of your database file
DATABASE_PATH = os.path.join(os.path.dirname(__file__), 'family_guy_favorites.db')

def connect_db():
    try:
        conn = sqlite3.connect(DATABASE_PATH)
        print("Database connected successfully")
        return conn
    except sqlite3.Error as e:
        print(f"Error connecting to database: {e}")
        return None

def test_query():
    conn = connect_db()
    if conn:
        cursor = conn.cursor()
        try:
            # List all tables in the database
            cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
            tables = cursor.fetchall()
            print("Tables:", tables)

            # Check if the 'users' and 'favorites' tables exist, then fetch sample data
            if ('users',) in tables:
                cursor.execute("SELECT * FROM users LIMIT 5;")
                users = cursor.fetchall()
                print("Sample data from users:", users)
            else:
                print("The 'users' table does not exist in the database.")

            if ('favorites',) in tables:
                cursor.execute("SELECT * FROM favorites LIMIT 5;")
                favorites = cursor.fetchall()
                print("Sample data from favorites:", favorites)
            else:
                print("The 'favorites' table does not exist in the database.")
                
        except sqlite3.Error as e:
            print(f"Error executing query: {e}")
        finally:
            conn.close()
            print("Database connection closed.")

if __name__ == "__main__":
    test_query()
