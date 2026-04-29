// Convenience redirect — primelinkhumancapital.com/turkey -> Turkey login
export default function Turkey() { return null; }

export async function getServerSideProps() {
  return {
    redirect: { destination: '/bhat/login?country=TR', permanent: false },
  };
}
