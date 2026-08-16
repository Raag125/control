import ServiceDetailPage from './ServiceDetailPage'
import { getServiceBySlug } from '../../data/servicesData'

/**
 * TickPestControl View Frame
 * 👉 All content, meta, alt tags, images, FAQs, and processes are centralized in:
 *     under the ID 'tick-pest-control'
 * You can also pass overrides directly to <ServiceDetailPage />
 */
export default function TickPestControl() {
  const service = getServiceBySlug('tick-pest-control')
  return <ServiceDetailPage service={service} />
}
