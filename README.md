# Uptime Monitoring Tool

A modern, real-time website uptime monitoring tool built with Next.js, featuring a beautiful UI and comprehensive monitoring capabilities.

## 🚀 Features

- **Real-time Monitoring**: Continuously monitor website uptime with customizable intervals
- **Beautiful Dashboard**: Modern, responsive UI with dark mode support
- **Detailed Analytics**: Charts and graphs showing response times, uptime percentages, and status history
- **Smart Notifications**: Get alerts for downtime, slow response times, and low uptime
- **Multiple Metrics**: Track response time, status codes, uptime percentage, and error messages
- **Monitor Management**: Easy-to-use interface for adding, editing, and managing monitors
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices

## 🛠️ Technology Stack

- **Frontend**: Next.js 15, React 18, Tailwind CSS
- **Backend**: Next.js API Routes
- **Charts**: Recharts
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Monitoring**: Node.js with custom monitoring service

## 📦 Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd up-time-monitering-tool
   ```

2. **Install dependencies**:
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Getting Started

### Adding Your First Monitor

1. Click the **"Add Monitor"** button in the top right corner
2. Fill in the monitor details:
   - **Name**: A friendly name for your website
   - **URL**: The full URL to monitor (include http:// or https://)
   - **Check Interval**: How often to check (minimum 30 seconds)
   - **Timeout**: How long to wait for a response
   - **HTTP Method**: GET, POST, or HEAD
   - **Expected Status Code**: Usually 200 for successful responses

3. Click **"Add Monitor"** and monitoring will start immediately

### Understanding the Dashboard

- **Stats Overview**: See total monitors, online/offline status, average uptime, and response times
- **Monitor Cards**: Each monitor shows current status, response time, and uptime percentage
- **Notifications**: Alerts appear at the top when issues are detected
- **Monitor Details**: Click "View Details" for comprehensive charts and logs

## 📊 Features Overview

### Dashboard
- Overview of all monitors with key metrics
- Real-time status indicators
- Smart notifications for issues
- Quick actions (pause, resume, delete monitors)

### Monitor Details
- Response time charts over time
- Status history visualization
- Detailed check logs
- Comprehensive statistics

### Monitoring Service
- Automatic health checks at specified intervals
- Tracks response time, status codes, and errors
- Maintains historical data for analysis
- Configurable timeout and retry settings

## 🔧 Configuration

### MongoDB

This app stores monitors and status checks in MongoDB.

Create a `.env.local` in the project root with:

```
MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority
MONGODB_DB=uptime_monitor
```

Install dependencies and run the dev server:

```
npm install
npm run dev
```

The default Google/GitHub sample monitors have been removed. Add your own monitors via the UI.

### Monitor Settings

| Setting | Description | Default |
|---------|-------------|---------|
| Name | Display name for the monitor | Required |
| URL | Website URL to monitor | Required |
| Interval | Check frequency in seconds | 60s |
| Timeout | Request timeout in seconds | 30s |
| Method | HTTP method (GET/POST/HEAD) | GET |
| Expected Status | Expected HTTP status code | 200 |

### Notification Triggers

- **Downtime**: When a monitor returns an error or unexpected status
- **Low Uptime**: When uptime falls below 95%
- **Slow Response**: When average response time exceeds 5 seconds

## 🏗️ Architecture

### File Structure
```
app/
├── api/
│   └── monitors/           # API routes for CRUD operations
├── components/            # Reusable UI components
├── monitor/[id]/         # Monitor details page
├── globals.css           # Global styles
├── layout.js            # Root layout
└── page.js             # Main dashboard

lib/
├── models.js           # Data models and storage
└── monitor-service.js  # Monitoring logic
```

### Data Models

**Monitor**:
- Basic information (name, URL, settings)
- Monitoring configuration
- Active/inactive status

**Status Check**:
- Timestamp and status (up/down)
- Response time and status code
- Error messages if any

## 🚨 Notifications

The system provides intelligent notifications for:

1. **Downtime Alerts**: Immediate notification when a site goes down
2. **Performance Warnings**: Alerts for slow response times
3. **Uptime Monitoring**: Warnings when uptime drops below thresholds

## 🔮 Future Enhancements

- **Email/SMS Notifications**: External alerting
- **Database Integration**: Persistent data storage
- **User Authentication**: Multi-user support
- **Advanced Analytics**: More detailed reporting
- **Webhook Integration**: Custom alert endpoints
- **SSL Certificate Monitoring**: Track certificate expiration

## 🛟 Troubleshooting

### Common Issues

**Dependencies conflicts**:
```bash
npm install --legacy-peer-deps
```

**Monitoring not starting**:
- Check that the monitoring service is properly initialized
- Verify URL format includes protocol (http/https)
- Ensure monitor is set to active

**Charts not displaying**:
- Check that Recharts is properly installed
- Verify browser compatibility

## 📝 API Reference

### Monitors

- `GET /api/monitors` - Get all monitors with status
- `POST /api/monitors` - Create new monitor
- `GET /api/monitors/[id]` - Get specific monitor
- `PUT /api/monitors/[id]` - Update monitor
- `DELETE /api/monitors/[id]` - Delete monitor

### Status Checks

- `GET /api/monitors/[id]/checks` - Get monitor check history

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Charts powered by [Recharts](https://recharts.org/)
- Icons by [Lucide](https://lucide.dev/)# up-time-moniter
