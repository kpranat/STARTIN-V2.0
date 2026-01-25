"""
Database Migration Script - Add created_at to otpVerification

This script adds the created_at column to the otpVerification table.
Run this ONCE after deploying the new code.

Usage:
    cd backend
    .vnv/Scripts/activate  # On Windows
    python migrate_db.py
"""

from app import create_app
from app.extensions import db
from datetime import datetime, timezone

def migrate_database():
    app = create_app()
    
    with app.app_context():
        print("Starting database migration...")
        
        try:
            # Check if the column already exists
            inspector = db.inspect(db.engine)
            columns = [col['name'] for col in inspector.get_columns('otp_verification')]
            
            if 'created_at' in columns:
                print("✓ Column 'created_at' already exists in otp_verification table.")
                print("Migration not needed.")
                return
            
            print("Adding 'created_at' column to otp_verification table...")
            
            # Add the column with a default value
            with db.engine.connect() as conn:
                # For SQLite
                conn.execute(db.text("""
                    ALTER TABLE otp_verification 
                    ADD COLUMN created_at DATETIME NOT NULL 
                    DEFAULT CURRENT_TIMESTAMP
                """))
                conn.commit()
            
            print("✓ Successfully added 'created_at' column to otp_verification table.")
            print("\nMigration completed successfully!")
            
        except Exception as e:
            print(f"✗ Error during migration: {str(e)}")
            print("\nIf you see 'duplicate column name' error, the migration may have already been applied.")
            print("You can safely ignore this error.")
            raise

if __name__ == "__main__":
    print("=" * 60)
    print("Database Migration: Add created_at to otpVerification")
    print("=" * 60)
    print()
    
    response = input("This will modify the database. Continue? (yes/no): ")
    
    if response.lower() in ['yes', 'y']:
        migrate_database()
    else:
        print("Migration cancelled.")
