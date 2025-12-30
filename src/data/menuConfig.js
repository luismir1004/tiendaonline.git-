export const MENU_CONFIG = {
  explorar: {
    label: "Explorar",
    type: "grid",
    columns: [
      {
        title: "Dispositivos",
        items: [
          { label: "Laptops Pro", href: "/?category=Computadoras" },
          { label: "Smartphones AI", href: "/?category=Telefonos" },
          { label: "Tablets Creativas", href: "/?category=Tablets" },
          { label: "Wearables", href: "/?category=Wearables" },
        ]
      },
      {
        title: "Audio & Hogar",
        items: [
          { label: "Auriculares Noise-Cancelling", href: "/?category=Audio" },
          { label: "Altavoces Inteligentes", href: "/?category=Audio" },
          { label: "Domótica", href: "/?category=SmartHome" },
          { label: "Accesorios Desk", href: "/?category=Accesorios" },
        ]
      }
    ],
    trending: [
      {
        id: "trend-1",
        label: "Sony WH-1000XM5",
        price: "$349",
        image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=300&q=80",
        href: "/product/1",
        badge: "Top Rated"
      },
      {
        id: "trend-2",
        label: "Keychron Q1 Pro",
        price: "$199",
        image: "https://images.unsplash.com/photo-1587829741301-dc798b91add1?auto=format&fit=crop&w=300&q=80",
        href: "/product/7",
        badge: "New"
      }
    ],
    editorial: {
      title: "La Oficina del Futuro",
      subtitle: "Minimalismo y productividad.",
      bgImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80",
      href: "/?collection=office"
    }
  },
  colecciones: {
    label: "Colecciones",
    type: "visual-list",
    items: [
      { 
        label: "Minimalist Desk", 
        desc: "Estética limpia para creadores", 
        href: "/?collection=minimalist",
        icon: "Box" 
      },
      { 
        label: "Gaming Setup", 
        desc: "Alto rendimiento y RGB sutil", 
        href: "/?collection=gaming",
        icon: "Zap" 
      },
      { 
        label: "Digital Nomad", 
        desc: "Portabilidad sin compromisos", 
        href: "/?collection=nomad",
        icon: "Globe" 
      }
    ],
    editorial: {
      title: "Edición Limitada",
      subtitle: "Accesorios de Titanio.",
      bgImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80",
      href: "/?collection=titanium"
    }
  }
};
