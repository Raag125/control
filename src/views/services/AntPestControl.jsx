import ServiceDetailPage from './ServiceDetailPage'
import { getServiceBySlug } from '../../data/servicesData'

/**
 * AntPestControl View Frame
 * 👉 All content, meta, alt tags, images, FAQs, and processes are centralized in:
 *     under the ID 'ant-pest-control'
 * You can also pass overrides directly to <ServiceDetailPage />
 */
export default function AntPestControl() {
  const service = getServiceBySlug('ant-pest-control')
  return <ServiceDetailPage service={service} />
}
