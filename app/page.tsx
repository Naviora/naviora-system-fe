import { Button } from '@/components/ui/button'
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/animations/fade-slide-scale'
import { Zap, Shield, Palette, Code, Database, Smartphone, Github, ExternalLink } from 'lucide-react'
import Link from 'next/link'

const features = [
  {
    icon: Zap,
    title: 'Next.js 15',
    description: 'Latest Next.js with App Router, server components, and optimizations'
  },
  {
    icon: Palette,
    title: 'shadcn/ui',
    description: 'Beautiful, accessible UI components with Tailwind CSS'
  },
  {
    icon: Shield,
    title: 'Type Safety',
    description: 'Full TypeScript support with Zod validation schemas'
  },
  {
    icon: Code,
    title: 'Form Handling',
    description: 'React Hook Form with Zod resolver for robust form management'
  },
  {
    icon: Database,
    title: 'Data Fetching',
    description: 'TanStack Query for efficient server state management'
  },
  {
    icon: Smartphone,
    title: 'Animations',
    description: 'Smooth animations and transitions with Framer Motion'
  }
]

export default function HomePage() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100'>
      {/* Hero Section */}
      <div className='container mx-auto px-6 pt-16 pb-24'>
        <FadeIn>
          <div className='text-center max-w-4xl mx-auto'>
            <h1 className='text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight'>
              Next.js{' '}
              <span className='bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent'>
                Boilerplate
              </span>
            </h1>
            <p className='text-xl text-gray-600 mb-8 leading-relaxed'>
              A comprehensive, production-ready Next.js starter with modern tooling, beautiful UI components, and best
              practices baked in.
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center mb-12'>
              <Link href='/dashboard'>
                <Button size='lg' className='text-lg px-8'>
                  Explore Dashboard
                  <ExternalLink className='ml-2 h-5 w-5' />
                </Button>
              </Link>
              <Link href='/forms'>
                <Button variant='outline' size='lg' className='text-lg px-8'>
                  View Forms Demo
                </Button>
              </Link>
            </div>
          </div>
        </FadeIn>

        {/* Tech Stack */}
        <FadeIn delay={0.2}>
          <div className='text-center mb-16'>
            <h2 className='text-2xl font-semibold text-gray-800 mb-4'>Built with Modern Stack</h2>
            <div className='flex flex-wrap justify-center gap-4 text-sm'>
              <span className='px-4 py-2 bg-white rounded-full shadow-sm border'>Next.js 15</span>
              <span className='px-4 py-2 bg-white rounded-full shadow-sm border'>shadcn/ui</span>
              <span className='px-4 py-2 bg-white rounded-full shadow-sm border'>React Hook Form</span>
              <span className='px-4 py-2 bg-white rounded-full shadow-sm border'>Zod</span>
              <span className='px-4 py-2 bg-white rounded-full shadow-sm border'>TanStack Query</span>
              <span className='px-4 py-2 bg-white rounded-full shadow-sm border'>Framer Motion</span>
              <span className='px-4 py-2 bg-white rounded-full shadow-sm border'>Axios</span>
              <span className='px-4 py-2 bg-white rounded-full shadow-sm border'>TypeScript</span>
            </div>
          </div>
        </FadeIn>

        {/* Features Grid */}
        <StaggerContainer className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {features.map((feature) => (
            <StaggerItem key={feature.title}>
              <div className='bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100'>
                <div className='w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mb-4'>
                  <feature.icon className='h-6 w-6 text-white' />
                </div>
                <h3 className='text-xl font-semibold text-gray-900 mb-3'>{feature.title}</h3>
                <p className='text-gray-600 leading-relaxed'>{feature.description}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* CTA Section */}
        <FadeIn delay={0.6}>
          <div className='text-center mt-20'>
            <div className='bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto border'>
              <h2 className='text-3xl font-bold text-gray-900 mb-4'>Ready to Build?</h2>
              <p className='text-gray-600 mb-6'>
                Get started with this boilerplate and ship your next project faster than ever.
              </p>
              <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                <a href='https://github.com' target='_blank' rel='noopener noreferrer' className='inline-flex'>
                  <Button variant='outline' size='lg'>
                    <Github className='mr-2 h-5 w-5' />
                    View on GitHub
                  </Button>
                </a>
                <Link href='/auth/login'>
                  <Button size='lg'>
                    Try Authentication
                    <ExternalLink className='ml-2 h-5 w-5' />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  )
}
