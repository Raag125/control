import AdminApp from '../../../src/admin/AdminApp'

export const metadata = {
  title: "Admin Portal | A to Z Pest Solutions",
  robots: {
    index: false,
    follow: false,
  },
}

export default function Page() {
  return <AdminApp />
}
