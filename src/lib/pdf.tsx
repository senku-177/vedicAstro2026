// src/lib/pdf.tsx

import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

// High-quality, free-to-use cosmic images
const IMAGES = {
  hero: 'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?auto=format&fit=crop&w=1200&q=80',
  divider: 'https://images.pexels.com/photos/998641/pexels-photo-998641.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  mandala: 'https://images.pexels.com/photos/586415/pexels-photo-586415.jpeg?auto=compress&cs=tinysrgb&w=400',
  tarotBg: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?auto=format&fit=crop&w=1200&q=80',
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 60,
    paddingBottom: 80,
    paddingHorizontal: 50,
    backgroundColor: '#0a0a15',
    color: '#e2e8f0',
  },
  header: {
    position: 'absolute',
    top: 30,
    left: 50,
    right: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f59e0b',
    paddingBottom: 12,
  },
  logo: { width: 45, height: 45 },
  pageNumber: { fontSize: 10, color: '#94a3b8' },
  heroImage: { width: '100%', height: 220, borderRadius: 12, marginBottom: 30, objectFit: 'cover' },
  title: { fontSize: 32, color: '#f59e0b', textAlign: 'center', marginBottom: 10, fontFamily: 'Helvetica-Bold' },
  subtitle: { fontSize: 14, color: '#94a3b8', textAlign: 'center', marginBottom: 40 },
  sectionSpacer: { height: 40 },
  divider: { width: '100%', height: 100, marginVertical: 30, objectFit: 'cover', opacity: 0.4 },
  section: {
    marginBottom: 25,
    padding: 20,
    backgroundColor: '#18182f',
    borderRadius: 12,
    borderLeftWidth: 5,
    borderLeftColor: '#f59e0b',
  },
  sectionTitle: {
    fontSize: 18,
    color: '#fbbf24',
    marginBottom: 12,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  text: {
    fontSize: 11,
    lineHeight: 1.8,
    color: '#cbd5e1',
    textAlign: 'justify',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: -10,
  },
  gridItem: {
    width: '48%',
    marginBottom: 20,
    padding: 18,
    backgroundColor: '#1e1e38',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  tarotSection: {
    marginTop: 40,
    padding: 25,
    backgroundColor: '#1e1b4b',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#7c3aed',
  },
  tarotTitle: {
    fontSize: 22,
    color: '#d8b4fe',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Helvetica-Bold',
  },
  questionBox: {
    padding: 15,
    backgroundColor: '#2e1065',
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#7c3aed',
  },
  questionLabel: { fontSize: 10, color: '#a78bfa', marginBottom: 6 },
  questionText: { fontSize: 12, color: '#e9d5ff', fontStyle: 'italic' },
  tarotGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  tarotCard: {
    width: '30%',
    padding: 15,
    backgroundColor: '#4c1d95',
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#a78bfa',
  },
  tarotCardLabel: { fontSize: 10, color: '#ddd6fe', marginBottom: 8 },
  tarotCardName: { fontSize: 13, color: '#fff', fontFamily: 'Helvetica-Bold', textAlign: 'center' },
  tarotAnalysis: { marginTop: 20, fontSize: 11, lineHeight: 1.8, color: '#e9d5ff' },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 50,
    right: 50,
    textAlign: 'center',
    fontSize: 9,
    color: '#475569',
  },
});

interface TarotCard {
  card: string;
  meaning: string;
}

interface ReportData {
  intro: string;
  personality: string;
  transits: string;
  career: string;
  finance: string;
  health: string;
  love: string;
  lucky: string;
  kundli: string;
  conclusion: string;
  isTarot: boolean;
  tarotQuestion?: string;
  tarotCards?: string[];
  tarotAnalysis?: string;
}

export const AstrologyReport = ({ name, data }: { name: string; data: ReportData }) => (
  <Document>
    {/* Cover Page */}
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Image style={styles.logo} src={IMAGES.mandala} />
        <Text style={styles.pageNumber}>Vedic Wisdom • 2026</Text>
      </View>

      <Image style={styles.heroImage} src={IMAGES.hero} />

      <Text style={styles.title}>Your 2026 Vedic Horoscope</Text>
      <Text style={styles.subtitle}>Personalized Cosmic Guidance for {name}</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>✨ Overview & Cosmic Outlook</Text>
        <Text style={styles.text}>{data.intro || 'Welcome to your journey through 2026...'}</Text>
      </View>

      <View style={styles.sectionSpacer} />
      <Image style={styles.divider} src={IMAGES.divider} />
    </Page>

    {/* Page 2: Personality & Transits */}
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Image style={styles.logo} src={IMAGES.mandala} />
        <Text style={styles.pageNumber}>Page 2</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🌟 Your Core Personality</Text>
        <Text style={styles.text}>{data.personality}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🪐 Major Planetary Transits in 2026</Text>
        <Text style={styles.text}>{data.transits}</Text>
      </View>

      <Image style={styles.divider} src={IMAGES.divider} />
    </Page>

    {/* Page 3: Life Pillars */}
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Image style={styles.logo} src={IMAGES.mandala} />
        <Text style={styles.pageNumber}>Page 3</Text>
      </View>

      <View style={styles.grid}>
        <View style={styles.gridItem}>
          <Text style={styles.sectionTitle}>💼 Career & Professional Growth</Text>
          <Text style={styles.text}>{data.career}</Text>
        </View>
        <View style={styles.gridItem}>
          <Text style={styles.sectionTitle}>💰 Wealth & Financial Flow</Text>
          <Text style={styles.text}>{data.finance}</Text>
        </View>
        <View style={styles.gridItem}>
          <Text style={styles.sectionTitle}>🧘 Health & Well-being</Text>
          <Text style={styles.text}>{data.health}</Text>
        </View>
        <View style={styles.gridItem}>
          <Text style={styles.sectionTitle}>❤️ Love & Relationships</Text>
          <Text style={styles.text}>{data.love}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🍀 Your Lucky Elements</Text>
        <Text style={styles.text}>{data.lucky}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📜 Birth Chart Insights (Kundli)</Text>
        <Text style={styles.text}>{data.kundli}</Text>
      </View>
    </Page>

    {/* Page 4: Tarot + Conclusion */}
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Image style={styles.logo} src={IMAGES.mandala} />
        <Text style={styles.pageNumber}>Final Page</Text>
      </View>

      {data.isTarot && (
        <View style={styles.tarotSection}>
          <Image style={{ width: '100%', height: 120, borderRadius: 12, marginBottom: 20 }} src={IMAGES.tarotBg} />
          <Text style={styles.tarotTitle}>🔮 Your Personal Tarot Guidance</Text>

          {data.tarotQuestion && (
            <View style={styles.questionBox}>
              <Text style={styles.questionLabel}>YOUR QUESTION</Text>
              <Text style={styles.questionText}>{data.tarotQuestion}</Text>
            </View>
          )}

          <View style={styles.tarotGrid}>
            {(data.tarotCards || []).map((card: string, i: number) => (
              <View key={i} style={styles.tarotCard}>
                <Text style={styles.tarotCardLabel}>{i === 0 ? 'PAST' : i === 1 ? 'PRESENT' : 'FUTURE'}</Text>
                <Text style={styles.tarotCardName}>{card}</Text>
              </View>
            ))}
          </View>

          {data.tarotAnalysis && (
            <>
              <Text style={{ fontSize: 12, color: '#d8b4fe', marginBottom: 8, textAlign: 'center' }}>COSMIC INTERPRETATION</Text>
              <Text style={styles.tarotAnalysis}>{data.tarotAnalysis}</Text>
            </>
          )}
        </View>
      )}

      <View style={{ marginTop: data.isTarot ? 40 : 60 }}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🌅 Final Wisdom & Blessing</Text>
          <Text style={{ ...styles.text, fontStyle: 'italic' }}>{data.conclusion}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text>© 2026 Vedic Wisdom • May the stars forever align in your favor</Text>
      </View>
    </Page>
  </Document>
);