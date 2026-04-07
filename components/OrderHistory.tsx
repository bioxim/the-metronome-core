import { CheckCircle2, Clock } from 'lucide-react';

export default function OrderHistory() {
    const mockOrders = [
        { id: 1, type: 'Buy', amount: '10.00', asset: 'SOL', price: '$145.20', status: 'Completed', date: '2024-04-03' },
        { id: 2, type: 'Buy', amount: '12.00', asset: 'SOL', price: '$142.10', status: 'Completed', date: '2024-04-04' },
        { id: 3, type: 'Buy', amount: '14.40', asset: 'SOL', price: 'Pending', status: 'Waiting Rhythm', date: '-' },
    ];

    return (
        <div className="w-full bg-bgSecondary border border-white/10 rounded-xl overflow-hidden shadow-xl">
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">Execution History</h3>
                <span className="text-xs text-textMuted">Active Position: <b className="text-brandPrimary">SOL/USDC</b></span>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-bgMain/50 text-textMuted uppercase text-[10px] font-bold">
                        <tr>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Type</th>
                            <th className="px-6 py-4">Amount</th>
                            <th className="px-6 py-4">Asset</th>
                            <th className="px-6 py-4">Entry Price</th>
                            <th className="px-6 py-4">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {mockOrders.map((order) => (
                            <tr key={order.id} className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4">
                                    {order.status === 'Completed' ?
                                        <span className="flex items-center gap-2 text-green-400"><CheckCircle2 className="w-4 h-4" /> Done</span> :
                                        <span className="flex items-center gap-2 text-brandPrimary animate-pulse"><Clock className="w-4 h-4" /> Pending</span>
                                    }
                                </td>
                                <td className="px-6 py-4 font-bold text-white">{order.type}</td>
                                <td className="px-6 py-4 font-mono">{order.amount} USDC</td>
                                <td className="px-6 py-4 text-white">{order.asset}</td>
                                <td className="px-6 py-4 font-mono">{order.price}</td>
                                <td className="px-6 py-4 text-textMuted">{order.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}