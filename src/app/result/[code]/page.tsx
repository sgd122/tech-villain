import { SharedResultPage } from '@/page-components/result';

interface PageProps {
  params: Promise<{ code: string }>;
}

export default async function Page({ params }: PageProps) {
  const { code } = await params;
  return <SharedResultPage code={code} />;
}

export async function generateMetadata({ params }: PageProps) {
  const { code } = await params;
  // 동적 OG 메타데이터는 클라이언트에서 처리
  void code; // suppress unused variable warning
  return {
    title: 'Tech Villain - 토론 결과',
    description: '기술 면접 토론 결과를 확인하세요',
  };
}
