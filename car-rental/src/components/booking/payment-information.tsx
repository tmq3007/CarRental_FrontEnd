import { Button } from "@/components/ui/button"

export default function PaymentInformation() {
    return (
        <div className="border rounded-md p-6 mt-4">
            <div className="space-y-6">
                <div className="flex items-center gap-2">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-gray-500"
                    >
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M16 8h-6.5a2.5 2.5 0 0 0 0 5h1a2.5 2.5 0 0 1 0 5H4"></path>
                        <path d="M12 18v2"></path>
                        <path d="M12 4v2"></path>
                    </svg>
                    <h3 className="text-lg font-medium">My wallet</h3>
                </div>

                <div className="flex items-center justify-between">
                    <div className="text-gray-600">Current balance:</div>
                    <div className="text-xl font-bold">20,000,000 VND</div>
                </div>

                <p className="text-gray-600">Please make sure to have sufficient balance when you return the car.</p>

                <div>
                    <Button variant="outline" className="text-blue-600 hover:text-blue-700">
                        Go to My wallet
                    </Button>
                </div>
            </div>
        </div>
    )
}
