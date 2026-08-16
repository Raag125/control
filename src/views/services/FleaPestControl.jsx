import ServiceDetailPage from './ServiceDetailPage'
import { getServiceBySlug } from '../../data/servicesData'

/**
 * FleaPestControl View Frame
 * 👉 All content, meta, alt tags, images, FAQs, and processes are centralized in:
 *     under the ID 'flea-pest-control'
 * You can also pass overrides directly to <ServiceDetailPage />
 */
export default function FleaPestControl() {
  const service = getServiceBySlug('flea-pest-control')
  return <ServiceDetailPage service={service} />
}
