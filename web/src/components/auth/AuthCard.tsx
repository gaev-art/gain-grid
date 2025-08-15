import { AnimatedCard } from '@/components/ui/animated-card';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FadeIn } from '@/components/ui/fade-in';

interface AuthCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export function AuthCard({ title, description, children }: AuthCardProps) {
  return (
    <AnimatedCard className="w-full max-w-md">
      <CardHeader>
        <FadeIn>
          <CardTitle className="text-2xl text-center">{title}</CardTitle>
        </FadeIn>
        <FadeIn delay={0.1}>
          <CardDescription className="text-center">{description}</CardDescription>
        </FadeIn>
      </CardHeader>
      <CardContent>
        <FadeIn delay={0.2}>{children}</FadeIn>
      </CardContent>
    </AnimatedCard>
  );
}
