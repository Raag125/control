import ServiceDetailPage from './ServiceDetailPage'
import { getServiceBySlug } from '../../data/servicesData'

/**
 * ResidentialPestControl View Frame
 * 👉 All content, meta, alt tags, images, FAQs, and processes are centralized in:
 *     under the ID 'residential-pest-control'
 * You can also pass overrides directly to <ServiceDetailPage />
 */
export default function ResidentialPestControl() {
  const service = getServiceBySlug('residential-pest-control')
  return <ServiceDetailPage service={service} />
}
