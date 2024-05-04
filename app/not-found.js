import Link from 'next/link'

export const metadata = {
    title: "Page Not Found",
    description: "Page Not Found - Invalid Request"
  }
 
export default function NotFound() {
  return (
    <div className='text-center'>
      <h1 className='p-3'>You are Lost!</h1>
      <p className='p-3'>Start again with some new query</p>
      <div >
      <Link href="/" className='bg-[#75c32c] shadow hover:bg-accent'>Return Home</Link>
      </div>
    </div>
  )
}