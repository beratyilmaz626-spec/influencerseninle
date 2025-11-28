import { Home, User, Briefcase, FileText, Video, ShoppingBag } from 'lucide-react'
import { NavBar } from "@/components/ui/tubelight-navbar"

export function NavBarDemo() {
  const navItems = [
    { name: 'Ana Sayfa', url: '#hero-title', icon: Home },
    { name: 'Avantajlar', url: '#comparison', icon: Video },
    { name: 'Kullanım Alanları', url: '#use-cases', icon: ShoppingBag },
    { name: 'Fiyatlandırma', url: '#pricing', icon: FileText }
  ]

  const handleItemClick = (item: any) => {
    // Smooth scroll to section
    const element = document.querySelector(item.url)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return <NavBar items={navItems} onItemClick={handleItemClick} />
}