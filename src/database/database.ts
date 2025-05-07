import * as SQLite from 'expo-sqlite';

/**
 * Database service for managing local SQLite operations
 */
class DatabaseService {
  private db: SQLite.SQLiteDatabase;

  /**
   * Initialize database connection
   */
  constructor() {
    this.db = SQLite.openDatabaseSync('ecommerce.db');
    this.initializeDatabase();
  }

  /**
   * Set up database tables
   */
  private initializeDatabase = async (): Promise<void> => {
    try {
      // Create users table
      await this.db.execAsync(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          role TEXT NOT NULL,
          avatar TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      
      // Create products table
      await this.db.execAsync(`
        CREATE TABLE IF NOT EXISTS products (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          description TEXT,
          price REAL NOT NULL,
          stock INTEGER NOT NULL,
          category TEXT,
          image TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      
      // Create orders table
      await this.db.execAsync(`
        CREATE TABLE IF NOT EXISTS orders (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          customer_id INTEGER NOT NULL,
          status TEXT NOT NULL,
          total REAL NOT NULL,
          date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (customer_id) REFERENCES users (id)
        )
      `);
      
      // Create order_items table
      await this.db.execAsync(`
        CREATE TABLE IF NOT EXISTS order_items (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          order_id INTEGER NOT NULL,
          product_id INTEGER NOT NULL,
          quantity INTEGER NOT NULL,
          price REAL NOT NULL,
          FOREIGN KEY (order_id) REFERENCES orders (id),
          FOREIGN KEY (product_id) REFERENCES products (id)
        )
      `);
      
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Error initializing database:', error);
      throw error;
    }
  };

  /**
   * Generic fetch method with SQL query
   * @param sql SQL query string
   * @param params Query parameters
   * @returns Promise with query results
   */
  executeQuery = async <T>(sql: string, params: any[] = []): Promise<T[]> => {
    try {
      const result = await this.db.getAllAsync<T>(sql, params);
      return result;
    } catch (error) {
      console.error('Error executing query:', error);
      throw error;
    }
  };

  /**
   * Insert data into a table
   * @param table Table name
   * @param data Object with column:value pairs
   * @returns Promise with inserted ID
   */
  insert = async (table: string, data: Record<string, any>): Promise<number> => {
    try {
      const columns = Object.keys(data).join(', ');
      const placeholders = Object.keys(data).map(() => '?').join(', ');
      const values = Object.values(data);

      const result = await this.db.runAsync(
        `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`,
        values
      );

      return result.lastInsertRowId;
    } catch (error) {
      console.error(`Error inserting into ${table}:`, error);
      throw error;
    }
  };

  /**
   * Update data in a table
   * @param table Table name
   * @param data Object with column:value pairs to update
   * @param whereClause WHERE clause string (e.g., "id = ?")
   * @param whereArgs Arguments for WHERE clause
   * @returns Promise with number of rows affected
   */
  update = async (
    table: string,
    data: Record<string, any>,
    whereClause: string,
    whereArgs: any[]
  ): Promise<number> => {
    try {
      const setClause = Object.keys(data)
        .map(column => `${column} = ?`)
        .join(', ');
      const values = [...Object.values(data), ...whereArgs];

      const result = await this.db.runAsync(
        `UPDATE ${table} SET ${setClause} WHERE ${whereClause}`,
        values
      );

      return result.changes;
    } catch (error) {
      console.error(`Error updating ${table}:`, error);
      throw error;
    }
  };

  /**
   * Delete data from a table
   * @param table Table name
   * @param whereClause WHERE clause string
   * @param whereArgs Arguments for WHERE clause
   * @returns Promise with number of rows affected
   */
  delete = async (
    table: string,
    whereClause: string,
    whereArgs: any[]
  ): Promise<number> => {
    try {
      const result = await this.db.runAsync(
        `DELETE FROM ${table} WHERE ${whereClause}`,
        whereArgs
      );

      return result.changes;
    } catch (error) {
      console.error(`Error deleting from ${table}:`, error);
      throw error;
    }
  };
}

// Export a singleton instance
export const Database = new DatabaseService();
