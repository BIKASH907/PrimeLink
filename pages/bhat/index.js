// =====================================================
// Country gate — public entry to BHAT Overseas
// =====================================================
import Link from 'next/link';
import Head from 'next/head';
import connectDB from '../../lib/db';
import BhatClient from '../../models/BhatClient';
import { BhatStyles } from '../../components/bhat/BhatLayout';

export default function BhatGate({ trCount, roCount }) {
  return (
    <>
      <Head><title>BHAT Overseas — Choose Country</title></Head>
      <BhatStyles />
      <div className="bhat-gate">
        <div className="bhat-gate-brand">
          <div className="bhat-gate-logo">BO</div>
          <div>
            <div style={{ fontSize:20, fontWeight:600, color:'#e6edf7' }}>Bhat Overseas System</div>
            <div style={{ fontSize:12, color:'#6b7a96' }}>Internal recruitment operations</div>
          </div>
        </div>

        <h1 className="bhat-gate-title">Choose Destination System</h1>
        <p className="bhat-gate-sub">Each country runs its own recruitment pipeline</p>

        <div className="bhat-country-grid">
          <Link href="/bhat/login?country=RO" className="bhat-country-card">
            <div className="bhat-country-flag">🇷🇴</div>
            <div className="bhat-country-name">Romania</div>
            <div className="bhat-country-stats">{roCount} active clients</div>
            <div className="bhat-tag-pill">Recruitment Pipeline</div>
          </Link>
          <Link href="/bhat/login?country=TR" className="bhat-country-card">
            <div className="bhat-country-flag">🇹🇷</div>
            <div className="bhat-country-name">Turkey</div>
            <div className="bhat-country-stats">{trCount} active clients</div>
            <div className="bhat-tag-pill new">Recruitment Pipeline</div>
          </Link>
        </div>

        <p className="bhat-gate-note">
          Both countries run on the same system with separate user accounts, clients, and pipelines.
          Pick a country to log in &amp; manage that country's recruitment.
        </p>
      </div>
    </>
  );
}

export async function getServerSideProps() {
  try {
    await connectDB();
    const trCount = await BhatClient.countDocuments({ country: 'TR' });
    const roCount = await BhatClient.countDocuments({ country: 'RO' });
    return { props: { trCount, roCount } };
  } catch (e) {
    return { props: { trCount: 0, roCount: 0 } };
  }
}
