import { Package, ShoppingBag, Users, CreditCard } from 'lucide-react'

const summary = [
  { label: 'Products', value: '148', icon: Package },
  { label: 'Orders', value: '12', icon: ShoppingBag },
  { label: 'Customers', value: 'N/A', icon: Users },
  { label: 'Payments', value: 'N/A', icon: CreditCard },
]

export default function Dashboard() {
  return (
    <section>
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="mt-1 text-sm text-neutral-500">Welcome to your Velora admin workspace.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summary.map(({ label, value, icon: Icon }) => (
          <article key={label} className="rounded-lg border border-neutral-200 bg-white p-5">
            <div className="flex items-center justify-between text-sm text-neutral-500">
              <span>{label}</span>
              <Icon className="h-4 w-4" />
            </div>
            <p className="mt-3 text-2xl font-semibold text-neutral-900">{value}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
