import { OnboardingForm } from '@/widgets/onboarding';

export function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 bg-gradient-to-b from-background to-muted">
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-4">
          💀 Tech Villain
        </h1>
        <p className="text-muted-foreground text-base sm:text-lg md:text-xl max-w-md mx-auto">
          &ldquo;기술 면접, AI한테 먼저 털리고 가라.&rdquo;
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          당신의 기술적 선택을 까칠한 CTO가 검증합니다
        </p>
      </div>
      <OnboardingForm />
    </main>
  );
}
