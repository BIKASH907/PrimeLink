// Convenience redirect — primelinkhumancapital.com/romania -> Romania login
export default function Romania() { return null; }

export async function getServerSideProps() {
  return {
    redirect: { destination: '/bhat/login?country=RO', permanent: false },
  };
}
