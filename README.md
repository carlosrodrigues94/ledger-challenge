# Ledger Challenge

A simple double-entry accounting ledger system built with NestJS that allows you to create accounts, manage transactions, and track balances according to double-entry bookkeeping principles.

## Features

- **Account Management**: Create accounts with debit or credit direction
- **Transaction Processing**: Create balanced transactions with multiple entries
- **Balance Tracking**: Automatic balance calculation based on account and entry directions
- **Data Validation**: Ensures transactions are balanced and accounts exist
- **In-Memory Storage**: Uses JSON file for data persistence

## Quick Start

### Prerequisites

- Node.js (v18 or higher)
- pnpm (recommended) or npm

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd ledger-challenge
```

2. Install dependencies:

```bash
pnpm install
```

3. Start the development server:

```bash
pnpm start:dev
```

The API will be available at `http://localhost:3000`

## API Endpoints

### Accounts

#### Create Account

**Request:**

- Account 1

```bash
curl --request POST \
     --url http://localhost:3000/accounts \
     --header 'Accept: application/json' \
     --header 'Content-Type: application/json' \
     --data '{
  "name": "Cash Account",
  "direction": "debit",
  "id": "71cde2aa-b9bc-496a-a6f1-34964d05e6fd"
}'
```

```bash
curl --request POST \
  --url http://localhost:3000/accounts \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{
  "name": "Cash Account 2",
  "direction": "credit",
  "id": "93956cc8-877b-4151-a455-59632b2c2ef2"
}'
```

**Response:**

```json
{
  "id": "71cde2aa-b9bc-496a-a6f1-34964d05e6fd",
  "name": "Cash Account",
  "balance": 0,
  "direction": "debit"
}
```

```json
{
  "id": "93956cc8-877b-4151-a455-59632b2c2ef2",
  "name": "Cash Account 2",
  "balance": 0,
  "direction": "credit"
}
```

#### Get All Accounts

**Request:**

```bash
curl --location --request GET 'http://localhost:3000/accounts'
```

**Response:**

```json
[
  {
    "id": "71cde2aa-b9bc-496a-a6f1-34964d05e6fd",
    "name": "Cash Account",
    "balance": 500,
    "direction": "debit"
  },
  {
    "id": "93956cc8-877b-4151-a455-59632b2c2ef2",
    "name": "Cash Account 2",
    "balance": 100,
    "direction": "credit"
  }
]
```

#### Get Account by ID

**Request:**

```bash
curl --location --request GET 'http://localhost:3000/accounts/71cde2aa-b9bc-496a-a6f1-34964d05e6fd'
```

**Response:**

```json
{
  "id": "71cde2aa-b9bc-496a-a6f1-34964d05e6fd",
  "name": "Cash Account",
  "balance": 500,
  "direction": "debit"
}
```

### Transactions

#### Create Transaction

- Transaction to increase balance

**Request:**

```bash
curl --location --request POST 'http://localhost:3000/transactions' \
     --header 'Content-Type: application/json' \
     --data-raw '{
      "name": "Transfer to Savings",
      "id": "3256dc3c-7b18-4a21-95c6-146747cf2971",
      "entries": [
        {
          "direction": "debit",
          "account_id": "71cde2aa-b9bc-496a-a6f1-34964d05e6fd",
          "amount": 100,
          "id": "9b7f3ba5-b584-4fab-9f1f-ee99e2731bff"
        },
        {
          "direction": "credit",
          "account_id": "93956cc8-877b-4151-a455-59632b2c2ef2",
          "amount": 100,
          "id": "1b06f616-bf6e-4b4d-a055-661cd57f742b"
        }
      ]
    }'
```

**Response:**

```json
{
  "id": "3256dc3c-7b18-4a21-95c6-146747cf2971",
  "name": "Transfer to Savings",
  "entries": [
    {
      "id": "9b7f3ba5-b584-4fab-9f1f-ee99e2731bff",
      "account_id": "71cde2aa-b9bc-496a-a6f1-34964d05e6fd",
      "amount": 100,
      "direction": "debit"
    },
    {
      "id": "1b06f616-bf6e-4b4d-a055-661cd57f742b",
      "account_id": "93956cc8-877b-4151-a455-59632b2c2ef2",
      "amount": 100,
      "direction": "credit"
    }
  ]
}
```

- Transaction to decrease balance

**Request:**

```bash
curl --request POST \
  --url http://localhost:3000/transactions \
  --header 'Content-Type: application/json' \
  --data '{
  "name": "Transfer from Savings",
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "entries": [
    {
      "direction": "credit",
      "account_id": "71cde2aa-b9bc-496a-a6f1-34964d05e6fd",
      "amount": 100,
      "id": "5cd6d25d-a895-4a51-9c09-2a77548f795a"
    },
    {
      "direction": "debit",
      "account_id": "93956cc8-877b-4151-a455-59632b2c2ef2",
      "amount": 100,
      "id": "1589e692-e5a2-463e-b1fd-765fcf76d559"
    }
  ]
}'
```

**Response:**

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "name": "Transfer from Savings",
  "entries": [
    {
      "id": "f1e2d3c4-b5a6-9780-1234-567890abcdef",
      "account_id": "71cde2aa-b9bc-496a-a6f1-34964d05e6fd",
      "amount": 100,
      "direction": "credit"
    },
    {
      "id": "12345678-90ab-cdef-1234-567890abcdef",
      "account_id": "93956cc8-877b-4151-a455-59632b2c2ef2",
      "amount": 100,
      "direction": "debit"
    }
  ]
}
```

## How Double-Entry Works

In this system, every transaction must be balanced - the sum of all debits must equal the sum of all credits.

### Account Directions

- **Debit Account**: Increases with debit entries, decreases with credit entries
- **Credit Account**: Increases with credit entries, decreases with debit entries

### Balance Calculation

When an entry is applied to an account:

- If entry direction matches account direction → **balance increases**
- If entry direction differs from account direction → **balance decreases**

### Example Transaction

Transfer $100 from Cash (debit account) to Savings (credit account):

| Account | Direction | Entry Direction | Entry Amount | Balance Change |
| ------- | --------- | --------------- | ------------ | -------------- |
| Cash    | debit     | debit           | -$100        | -$100          |
| Savings | credit    | credit          | +$100        | +$100          |

## Testing

Run the test suite:

```bash
pnpm test
```

Run tests in watch mode:

```bash
pnpm test:watch
```

## Development

### Available Scripts

- `pnpm start:dev` - Start development server with hot reload
- `pnpm build` - Build the application
- `pnpm start:prod` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm format` - Format code with Prettier

### Project Structure

```
src/
├── app/
│   ├── contracts/     # Repository interfaces
│   ├── exceptions/    # Custom exceptions
│   └── usecases/      # Business logic
├── domain/
│   └── entities/      # Domain models
├── presentation/
│   ├── controllers/   # HTTP controllers
│   ├── dtos/         # Data transfer objects
│   └── filters/      # Exception filters
└── main.ts           # Application entry point
```

## Data Storage

The application uses an in-memory JSON file (`database.json`) for data persistence. Data is automatically saved and loaded when the application starts.

## Error Handling

The API includes comprehensive error handling:

- **400 Bad Request**: Invalid transaction data, insufficient balance
- **404 Not Found**: Account not found
- **Validation Errors**: Missing required fields, invalid data types

## License

This project is part of the Conduit Financial engineering challenge.
