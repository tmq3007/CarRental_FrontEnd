import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {Transaction} from "@/lib/services/wallet-api";

interface TransactionTableProps {
    transactions: Transaction[]
    startIndex: number
}

export function TransactionTable({ transactions, startIndex }: TransactionTableProps) {
    const formatTransactionAmount = (transaction: Transaction) => {
        const isWithdrawal =
            transaction.type?.toLowerCase().includes("withdraw") || transaction.type?.toLowerCase().includes("pay")
        const isTopup =
            transaction.type?.toLowerCase().includes("top_up") || transaction.type?.toLowerCase().includes("receive")

        let colorClass = "text-gray-900"
        let sign = ""

        if (isWithdrawal) {
            colorClass = "text-red-600"
            sign = "-"
        } else if (isTopup) {
            colorClass = "text-green-600"
            sign = "+"
        }

        return (
            <span className={`font-medium ${colorClass}`}>
        {sign}
                {transaction.formattedAmount}
      </span>
        )
    }

    return (
        <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-12">No.</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Date/Time</TableHead>
                        <TableHead>Booking No.</TableHead>
                        <TableHead>Car Name</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {transactions.map((transaction, index) => (
                        <TableRow key={transaction.id}>
                            <TableCell>{startIndex + index + 1}</TableCell>
                            <TableCell>{formatTransactionAmount(transaction)}</TableCell>
                            <TableCell>{transaction.type}</TableCell>
                            <TableCell>{transaction.formattedDateTime}</TableCell>
                            <TableCell>{transaction.bookingNumber || "N/A"}</TableCell>
                            <TableCell>{transaction.carName || "N/A"}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
