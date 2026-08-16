import ServiceDetailPage from './ServiceDetailPage'
import { getServiceBySlug } from '../../data/servicesData'

/**
 * CommercialPestControl View Frame
 * 👉 All content, meta, alt tags, images, FAQs, and processes are centralized in:
 *     under the ID 'commercial-pest-control'
 * You can also pass overrides directly to <ServiceDetailPage />
 */
export default function CommercialPestControl() {
  const service = getServiceBySlug('commercial-pest-control')
  return <ServiceDetailPage service={service} />
}
