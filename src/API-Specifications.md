# API Specifications for Personal Investment Tracker

This document outlines all the API endpoints required for the frontend application to communicate with the backend services.

## Authentication APIs

### 1. Login API
**Endpoint:** `POST /api/auth/login`

**Purpose:** Authenticate user with hardcoded password and return session token

**Request Body:**
```json
{
  "password": "string"
}
```

**Response:**
```json
// Success (200)
{
  "success": true,
  "token": "jwt_token_string",
  "expiresIn": "24h"
}

// Failed (401)
{
  "success": false,
  "message": "Invalid password"
}

// Rate Limited (429)
{
  "success": false,
  "message": "Too many login attempts. Please try again later."
}
```

### 2. Logout API
**Endpoint:** `POST /api/auth/logout`

**Purpose:** Invalidate user session token

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Response:**
```json
// Success (200)
{
  "success": true,
  "message": "Logged out successfully"
}
```

### 3. Validate Token API
**Endpoint:** `GET /api/auth/validate`

**Purpose:** Check if current session token is valid

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Response:**
```json
// Valid (200)
{
  "success": true,
  "valid": true
}

// Invalid (401)
{
  "success": false,
  "valid": false,
  "message": "Token expired or invalid"
}
```

## Investment Transaction APIs

### 4. Get All Transactions API
**Endpoint:** `GET /api/transactions`

**Purpose:** Retrieve all investment transactions with optional filtering and sorting

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Query Parameters:**
```
?type=crypto|stock|mutual_fund  (optional)
&transaction_type=buy|sell|deposit|withdrawal  (optional)
&date_from=YYYY-MM-DD  (optional)
&date_to=YYYY-MM-DD  (optional)
&sort_by=date|amount|investment_name  (optional, default: date)
&sort_order=asc|desc  (optional, default: desc)
&limit=number  (optional, default: 100)
&offset=number  (optional, default: 0)
```

**Response:**
```json
// Success (200)
{
  "success": true,
  "data": [
    {
      "id": "transaction_id",
      "investment_type": "crypto",
      "investment_name": "Bitcoin",
      "transaction_type": "buy",
      "date": "2025-07-23",
      "amount": 1000.00,
      "quantity": 0.025,
      "fees": 5.00,
      "notes": "Monthly DCA purchase",
      "created_at": "2025-07-23T10:30:00Z",
      "updated_at": "2025-07-23T10:30:00Z"
    }
  ],
  "pagination": {
    "total": 150,
    "limit": 100,
    "offset": 0,
    "has_more": true
  }
}
```

### 5. Create Transaction API
**Endpoint:** `POST /api/transactions`

**Purpose:** Add a new investment transaction

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Request Body:**
```json
{
  "investment_type": "crypto|stock|mutual_fund",
  "investment_name": "string",
  "transaction_type": "buy|sell|deposit|withdrawal",
  "date": "YYYY-MM-DD",
  "amount": 1000.00,
  "quantity": 0.025,
  "fees": 5.00,
  "notes": "string (optional)"
}
```

**Response:**
```json
// Success (201)
{
  "success": true,
  "data": {
    "id": "transaction_id",
    "investment_type": "crypto",
    "investment_name": "Bitcoin",
    "transaction_type": "buy",
    "date": "2025-07-23",
    "amount": 1000.00,
    "quantity": 0.025,
    "fees": 5.00,
    "notes": "Monthly DCA purchase",
    "created_at": "2025-07-23T10:30:00Z",
    "updated_at": "2025-07-23T10:30:00Z"
  }
}

// Validation Error (400)
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "investment_name",
      "message": "Investment name is required"
    }
  ]
}
```

### 6. Update Transaction API
**Endpoint:** `PUT /api/transactions/{transaction_id}`

**Purpose:** Update an existing investment transaction

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Request Body:**
```json
{
  "investment_type": "crypto|stock|mutual_fund",
  "investment_name": "string",
  "transaction_type": "buy|sell|deposit|withdrawal",
  "date": "YYYY-MM-DD",
  "amount": 1000.00,
  "quantity": 0.025,
  "fees": 5.00,
  "notes": "string (optional)"
}
```

**Response:**
```json
// Success (200)
{
  "success": true,
  "data": {
    // Updated transaction object
  }
}

// Not Found (404)
{
  "success": false,
  "message": "Transaction not found"
}
```

### 7. Delete Transaction API
**Endpoint:** `DELETE /api/transactions/{transaction_id}`

**Purpose:** Delete an investment transaction

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Response:**
```json
// Success (200)
{
  "success": true,
  "message": "Transaction deleted successfully"
}

// Not Found (404)
{
  "success": false,
  "message": "Transaction not found"
}
```

## Portfolio and Performance APIs

### 8. Get Portfolio Summary API
**Endpoint:** `GET /api/portfolio/summary`

**Purpose:** Get overall portfolio performance summary

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Query Parameters:**
```
?currency=USD|EUR|BTC  (optional, default: USD)
```

**Response:**
```json
// Success (200)
{
  "success": true,
  "data": {
    "total_invested": 25000.00,
    "current_value": 28500.00,
    "unrealized_gain_loss": 3500.00,
    "unrealized_gain_loss_percentage": 14.0,
    "realized_gain_loss": 1200.00,
    "realized_gain_loss_percentage": 4.8,
    "total_fees": 150.00,
    "currency": "USD",
    "last_updated": "2025-07-23T15:30:00Z"
  }
}
```

### 9. Get Portfolio Allocation API
**Endpoint:** `GET /api/portfolio/allocation`

**Purpose:** Get portfolio allocation breakdown by investment type and individual investments

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Response:**
```json
// Success (200)
{
  "success": true,
  "data": {
    "by_type": [
      {
        "investment_type": "crypto",
        "total_value": 15000.00,
        "percentage": 52.6,
        "count": 5
      },
      {
        "investment_type": "stock",
        "total_value": 13500.00,
        "percentage": 47.4,
        "count": 8
      }
    ],
    "by_investment": [
      {
        "investment_name": "Bitcoin",
        "investment_type": "crypto",
        "total_value": 8000.00,
        "percentage": 28.1,
        "current_holdings": 0.15
      }
    ]
  }
}
```

### 10. Get Individual Investment Performance API
**Endpoint:** `GET /api/investments/{investment_name}/performance`

**Purpose:** Get detailed performance data for a specific investment

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Response:**
```json
// Success (200)
{
  "success": true,
  "data": {
    "investment_name": "Bitcoin",
    "investment_type": "crypto",
    "total_invested": 5000.00,
    "current_value": 7500.00,
    "current_holdings": 0.15,
    "average_purchase_price": 33333.33,
    "current_market_price": 50000.00,
    "unrealized_gain_loss": 2500.00,
    "unrealized_gain_loss_percentage": 50.0,
    "realized_gain_loss": 500.00,
    "realized_gain_loss_percentage": 10.0,
    "total_fees": 25.00,
    "first_purchase_date": "2024-01-15",
    "last_transaction_date": "2025-07-20"
  }
}
```

## Market Data APIs

### 11. Get Current Prices API
**Endpoint:** `GET /api/market/prices`

**Purpose:** Get current market prices for tracked investments

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Query Parameters:**
```
?investments=Bitcoin,NVIDIA,Tesla  (optional, comma-separated)
```

**Response:**
```json
// Success (200)
{
  "success": true,
  "data": [
    {
      "investment_name": "Bitcoin",
      "current_price": 50000.00,
      "currency": "USD",
      "change_24h": 2.5,
      "change_24h_percentage": 5.26,
      "last_updated": "2025-07-23T15:45:00Z"
    }
  ]
}
```

## Performance Trends APIs

### 12. Get Performance Trends API
**Endpoint:** `GET /api/portfolio/trends`

**Purpose:** Get portfolio performance trends over time

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Query Parameters:**
```
?period=7d|30d|90d|1y|all  (optional, default: 30d)
&interval=daily|weekly|monthly  (optional, default: daily)
```

**Response:**
```json
// Success (200)
{
  "success": true,
  "data": {
    "period": "30d",
    "interval": "daily",
    "data_points": [
      {
        "date": "2025-07-01",
        "portfolio_value": 25000.00,
        "invested_amount": 24000.00,
        "gain_loss": 1000.00,
        "gain_loss_percentage": 4.17
      }
    ]
  }
}
```

## Categories and Goals APIs

### 13. Get Categories API
**Endpoint:** `GET /api/categories`

**Purpose:** Get all custom investment categories

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Response:**
```json
// Success (200)
{
  "success": true,
  "data": [
    {
      "id": "category_id",
      "name": "Long-term",
      "description": "Investments for retirement",
      "color": "#3B82F6",
      "created_at": "2025-07-23T10:00:00Z"
    }
  ]
}
```

### 14. Create Category API
**Endpoint:** `POST /api/categories`

**Purpose:** Create a new investment category

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Request Body:**
```json
{
  "name": "string",
  "description": "string (optional)",
  "color": "#3B82F6"
}
```

**Response:**
```json
// Success (201)
{
  "success": true,
  "data": {
    "id": "category_id",
    "name": "Long-term",
    "description": "Investments for retirement",
    "color": "#3B82F6",
    "created_at": "2025-07-23T10:00:00Z"
  }
}
```

## Error Handling

All APIs should return consistent error responses:

```json
// Server Error (500)
{
  "success": false,
  "message": "Internal server error",
  "error_code": "INTERNAL_ERROR"
}

// Unauthorized (401)
{
  "success": false,
  "message": "Authentication required",
  "error_code": "UNAUTHORIZED"
}

// Forbidden (403)
{
  "success": false,
  "message": "Access denied",
  "error_code": "FORBIDDEN"
}
```

## Notes

1. All endpoints require JWT authentication except for the login endpoint
2. All monetary values should be returned as numbers with 2 decimal places
3. All dates should be in ISO 8601 format
4. All endpoints should support CORS for frontend development
5. Rate limiting should be implemented on authentication endpoints
6. Currency conversions should be handled on the backend using real-time exchange rates
