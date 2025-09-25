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

**Response:**

```json
{
  "id": "71cde2aa-b9bc-496a-a6f1-34964d05e6fd",
  "name": "Cash Account",
  "balance": 0,
  "direction": "debit"
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
    "id": "dbf17d00-8701-4c4e-9fc5-6ae33c324309",
    "name": "Savings Account",
    "balance": 1000,
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
      "amount": 100
    },
    {
      "direction": "credit",
      "account_id": "dbf17d00-8701-4c4e-9fc5-6ae33c324309",
      "amount": 100
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
      "id": "9f694f8c-9c4c-44cf-9ca9-0cb1a318f0a7",
      "account_id": "71cde2aa-b9bc-496a-a6f1-34964d05e6fd",
      "amount": 100,
      "direction": "debit"
    },
    {
      "id": "a5c1b7f0-e52e-4ab6-8f31-c380c2223efa",
      "account_id": "dbf17d00-8701-4c4e-9fc5-6ae33c324309",
      "amount": 100,
      "direction": "credit"
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
