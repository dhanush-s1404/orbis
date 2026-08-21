import Image from "next/image"
import Link from "next/link"

export default function Home() {
  return (
    <main className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-zinc-950">
      <div className="flex flex-col items-center justify-between py-24 px-16 w-full max-w-4xl">
        <div className="text-center">
          <h1 className="max-w-xs text-5xl font-semibold leading-[1.2] tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
            Build & Sell Websites
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400 mb-8">
            Browse ready-made websites or let us build a custom website specifically for you.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <a
            href="/marketplace"
            className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-zinc-900 px-8 text-white transition-colors hover:bg-zinc-800"
          >
            <Image
              src="/next.svg"
              alt="Marketplace"
              className="dark:invert h-[16px] w-5"
              width={20}
              height={16}
            />
            Explore Websites
          </a>
          <a
            href="/build"
            className="flex h-14 w-full items-center justify-center rounded-full border border-solid border-zinc-400 px-8 text-zinc-700 transition-colors hover:border-zinc-600 dark:border-zinc-500 dark:hover:border-zinc-400"
          >
            Build My Website
          </a>
        </div>
      </div>

      <div className="mt-16 w-full max-w-3xl">
        <h2 className="text-3xl font-bold text-zinc-900 mb-6 dark:text-zinc-50 text-center">Featured Websites</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <ProductCard
            name="Business Pro"
            price="₹14,999"
            description="Full business website with CMS"
          />
          <ProductCard
            name="Portfolio Studio"
            price="₹8,999"
            description="Professional portfolio website"
          />
          <ProductCard
            name="E-commerce Store"
            price="₹19,999"
            description="Complete online store with payments"
          />
        </div>
      </div>
    </main>
  )
}

interface ProductCardProps {
  name: string
  price: string
  description: string
}

function ProductCard({ name, price, description }: ProductCardProps) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow border">
      <div className="p-6">
        <h3 className="text-xl font-medium text-zinc-900 mb-2">{name}</h3>
        <p className="text-zinc-500 text-sm">{description}</p>
        <p className="text-zinc-900 font-medium mb-3">{price}</p>
        <Link
          href={`/product/1`}
          className="w-full bg-zinc-900 text-white font-medium py-2 rounded-md hover:bg-zinc-800 transition-colors text-center"
        >
          View Details
        </Link>
      </div>
    </div>
  )
}