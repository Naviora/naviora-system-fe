import { FadeIn } from "@/components/animations/fade-slide-scale";
import { ContactForm } from "@/components/forms/contact-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function FormsPage() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4'>
      <div className='container mx-auto'>
        <FadeIn>
          <div className='text-center mb-8'>
            <h1 className='text-4xl font-bold text-gray-900 mb-4'>
              Form Examples
            </h1>
            <p className='text-lg text-gray-600 mb-8'>
              Explore our form components with validation using React Hook Form
              and Zod
            </p>
            <div className='flex gap-4 justify-center'>
              <Link href='/'>
                <Button variant='outline'>← Back to Home</Button>
              </Link>
              <Link href='/dashboard'>
                <Button>Go to Dashboard →</Button>
              </Link>
            </div>
          </div>
        </FadeIn>

        <div className='grid gap-8 md:grid-cols-2'>
          <div className='bg-white rounded-lg shadow-lg p-6'>
            <ContactForm />
          </div>

          <div className='bg-white rounded-lg shadow-lg p-6'>
            <FadeIn delay={0.2}>
              <h2 className='text-2xl font-bold mb-4'>Login Form</h2>
              <p className='text-muted-foreground mb-6'>
                Try our authentication form with validation
              </p>
              <Link href='/auth/login'>
                <Button className='w-full'>View Login Form</Button>
              </Link>
            </FadeIn>
          </div>
        </div>

        <div className='mt-12'>
          <FadeIn delay={0.4}>
            <div className='bg-white rounded-lg shadow-lg p-6'>
              <h2 className='text-2xl font-bold mb-4'>Features Demonstrated</h2>
              <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
                <div className='p-4 border rounded-lg'>
                  <h3 className='font-semibold text-green-600 mb-2'>
                    ✓ Zod Validation
                  </h3>
                  <p className='text-sm text-gray-600'>
                    Type-safe schema validation with comprehensive error
                    handling
                  </p>
                </div>
                <div className='p-4 border rounded-lg'>
                  <h3 className='font-semibold text-blue-600 mb-2'>
                    ✓ React Hook Form
                  </h3>
                  <p className='text-sm text-gray-600'>
                    Performant forms with minimal re-renders and great UX
                  </p>
                </div>
                <div className='p-4 border rounded-lg'>
                  <h3 className='font-semibold text-purple-600 mb-2'>
                    ✓ shadcn/ui
                  </h3>
                  <p className='text-sm text-gray-600'>
                    Beautiful, accessible UI components with Tailwind CSS
                  </p>
                </div>
                <div className='p-4 border rounded-lg'>
                  <h3 className='font-semibold text-orange-600 mb-2'>
                    ✓ Framer Motion
                  </h3>
                  <p className='text-sm text-gray-600'>
                    Smooth animations and transitions for better user experience
                  </p>
                </div>
                <div className='p-4 border rounded-lg'>
                  <h3 className='font-semibold text-red-600 mb-2'>
                    ✓ Toast Notifications
                  </h3>
                  <p className='text-sm text-gray-600'>
                    User feedback with beautiful toast notifications using
                    Sonner
                  </p>
                </div>
                <div className='p-4 border rounded-lg'>
                  <h3 className='font-semibold text-teal-600 mb-2'>
                    ✓ TypeScript
                  </h3>
                  <p className='text-sm text-gray-600'>
                    Full type safety throughout the application
                  </p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
