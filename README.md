# Sri Ramdoot Dryfruit Store

A modern e-commerce platform for Sri Ramdoot Dryfruit Store built with React, TypeScript, and Supabase.

## Features

- 🛍️ Product catalog with images and details
- 🛒 Shopping cart functionality
- 📦 Order placement system
- 📱 Responsive design for desktop/mobile
- 🔔 Telegram notifications for new orders

## Tech Stack

- Frontend: React + TypeScript
- Build Tool: Vite
- Backend: Supabase
- Notifications: Telegram API
- Deployment: Docker

## Prerequisites

- Node.js 18 or higher
- Docker Desktop
- Supabase account
- Telegram Bot Token

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_TELEGRAM_BOT_TOKEN=your_telegram_bot_token
VITE_TELEGRAM_CHAT_ID=your_telegram_chat_id
VITE_API_BASE_URL=your_api_base_url
```

## Development

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

## Docker Deployment

1. Build and run with Docker:
```bash
docker compose up --build
```

2. Access the application at:
```
http://localhost:80
```

## Project Structure

```
sri-ramdoot-dryfruit-store/
├── src/
│   ├── pages/          # Page components
│   ├── components/     # Reusable components
│   ├── assets/        # Static assets
│   └── App.tsx        # Main application
├── public/            # Public assets
├── Dockerfile         # Docker configuration
├── docker-compose.yml # Docker Compose config
├── nginx.conf        # Nginx configuration
└── package.json      # Project dependencies
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
# store
