# React + Vite

1. clone the repo <br/>
2. execute npm install <br/>
3. server/ - backend folder. The port which BE is using is 3001

Staring the frontend: npm run dev
Starting the backend: navigate to server/ and execute node server.js

# Email Verification при регистрация

## SQL заявки за новите полета:

```
ALTER TABLE household.users ADD COLUMN is_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE household.users ADD COLUMN verification_token VARCHAR(255);
```

## Настройки за имейл

В .env файла добави:
```
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
```

## Как работи
- При регистрация се изпраща имейл с линк за потвърждение.
- Линкът е: https://your-domain.com/verify?token=...
- При кликване на линка, потребителят се отбелязва като потвърден.
