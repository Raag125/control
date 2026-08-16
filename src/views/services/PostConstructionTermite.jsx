import ServiceDetailPage from './ServiceDetailPage'
import { getServiceBySlug } from '../../data/servicesData'

/**
 * PostConstructionTermite View Frame
 * 👉 All content, meta, alt tags, images, FAQs, and processes are centralized in:
 *     under the ID 'post-construction-termite-treatment'
 * You can also pass overrides directly to <ServiceDetailPage />
 */
export default function PostConstructionTermite() {
  const service = getServiceBySlug('post-construction-termite-treatment')
  return <ServiceDetailPage service={service} />
}
