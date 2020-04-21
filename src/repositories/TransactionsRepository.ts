import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface CreateRepositoryDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

interface TransactionResponse {
  transactions: Transaction[];
  balance: Balance;
}

class TransactionsRepository {
  private transactions: Transaction[];

  private balance: Balance = {
    income: 0,
    outcome: 0,
    total: 0,
  };

  constructor() {
    this.transactions = [];
  }

  public all(): TransactionResponse {
    const balance = this.getBalance();
    const transactionResponse = {
      transactions: this.transactions,
      balance,
    };
    return transactionResponse;
  }

  public getBalance(): Balance {
    const income = this.transactions.reduce(
      (accumulator: number, transaction: Transaction) => {
        if (transaction.type === 'income') {
          const result = accumulator + transaction.value;
          return result;
        }
        return accumulator;
      },
      this.balance.income,
    );

    const outcome = this.transactions.reduce(
      (accumulator: number, transaction: Transaction) => {
        if (transaction.type === 'outcome') {
          const result = accumulator + transaction.value;
          return result;
        }
        return accumulator;
      },
      this.balance.outcome,
    );
    const total = income - outcome;

    return { income, outcome, total };
  }

  public create({ title, value, type }: CreateRepositoryDTO): Transaction {
    const transaction = new Transaction({ title, value, type });

    const balance = this.getBalance();

    if (balance.total > 0 && type === 'outcome') {
      if (value > balance.total) {
        throw Error('Sorry you dont have enough money');
      }
    }
    this.transactions.push(transaction);
    return transaction;
  }
}

export default TransactionsRepository;
