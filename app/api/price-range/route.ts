import { NextResponse } from 'next/server';

const WC_URL = process.env.WC_URL;
const WC_KEY = process.env.WC_KEY;
const WC_SECRET = process.env.WC_SECRET;

export async function GET() {
  try {
    const [minRes, maxRes] = await Promise.all([
      fetch(
        `${WC_URL}/wp-json/wc/v3/products?consumer_key=${WC_KEY}&consumer_secret=${WC_SECRET}&status=publish&per_page=1&orderby=price&order=asc&_fields=price`,
        { next: { revalidate: 3600 } }
      ),
      fetch(
        `${WC_URL}/wp-json/wc/v3/products?consumer_key=${WC_KEY}&consumer_secret=${WC_SECRET}&status=publish&per_page=1&orderby=price&order=desc&_fields=price`,
        { next: { revalidate: 3600 } }
      ),
    ]);

    const [minData, maxData] = await Promise.all([minRes.json(), maxRes.json()]);

    const globalMin = Math.floor(parseFloat(minData[0]?.price || '0'));
    const globalMax = Math.ceil(parseFloat(maxData[0]?.price || '10000'));

    return NextResponse.json({ min: globalMin, max: globalMax });
  } catch {
    return NextResponse.json({ min: 0, max: 10000 });
  }
}