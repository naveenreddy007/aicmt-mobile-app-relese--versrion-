import Image from "next/image"
import NewsletterSubscriptionForm from "./newsletter-subscription-form"

const NewsletterSection = () => {
  return (
    <div className="w-full bg-gray-50 dark:bg-gray-800/50">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-8 px-4 py-12 md:py-16">
        <div className="space-y-4">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50 sm:text-4xl">
            Stay Ahead of the Curve
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Subscribe to our newsletter for the latest industry insights, product updates, and sustainability news.
          </p>
          <NewsletterSubscriptionForm source="footer-banner" />
        </div>
        <div className="hidden md:block">
          <Image
            src="/images/banners/newsletter-banner.png"
            alt="Abstract green and white shapes representing sustainability and technology"
            width={500}
            height={350}
            className="rounded-lg object-cover"
          />
        </div>
      </div>
    </div>
  )
}

export default NewsletterSection
