import TopNavbar from '@/components/app/top-navbar'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <TopNavbar />
      <main>{children}</main>
    </>
  )
}