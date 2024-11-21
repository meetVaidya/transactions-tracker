import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Transaction {
  id: number;
  date: string;
  client_id: string;
  amount: number;
  merchant_city: string;
  merchant_state: string;
}

export function RecentSales({ transactions }: { transactions: Transaction[] }) {
  return (
    <div className="space-y-8">
      {transactions.map((transaction) => (
        <div key={transaction.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarFallback>
              {transaction.client_id.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">
              Client {transaction.client_id}
            </p>
            <p className="text-sm text-muted-foreground">
              {transaction.merchant_city}, {transaction.merchant_state}
            </p>
          </div>
          <div className="ml-auto font-medium">${transaction.amount}</div>
        </div>
      ))}
    </div>
  );
}
