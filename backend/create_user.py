import sqlite3
import uuid
from datetime import datetime
import bcrypt

def create_test_user():
    conn = sqlite3.connect('orientcam.db')
    cursor = conn.cursor()

    # Vérifier si l'utilisateur existe déjà
    cursor.execute('SELECT email FROM users WHERE email = ?', ('admin@orientcam.cm',))
    existing = cursor.fetchone()

    # Hasher le mot de passe avec bcrypt
    password = 'admin123'
    password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    if existing:
        print('Utilisateur existe deja, mise a jour du mot de passe...')
        cursor.execute('''
            UPDATE users
            SET password_hash = ?, is_active = ?, is_verified = ?, updated_at = ?
            WHERE email = ?
        ''', (password_hash, True, True, datetime.utcnow().isoformat(), 'admin@orientcam.cm'))
    else:
        print('Creation d\'un nouveau utilisateur...')
        user_id = str(uuid.uuid4())
        email = 'admin@orientcam.cm'
        now = datetime.utcnow().isoformat()

        cursor.execute('''
            INSERT INTO users (id, email, password_hash, role, is_active, is_verified, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (user_id, email, password_hash, 'student', True, True, now, now))

    conn.commit()

    # Vérifier la création
    cursor.execute('SELECT id, email, role, is_active FROM users WHERE email = ?', ('admin@orientcam.cm',))
    user = cursor.fetchone()

    print('\n=== UTILISATEUR DE TEST CREE ===')
    print('Email: admin@orientcam.cm')
    print('Mot de passe: admin123')
    print('Role: {}'.format(user[2]))
    print('Actif: {}'.format(user[3]))
    print('================================\n')

    conn.close()

if __name__ == '__main__':
    create_test_user()
