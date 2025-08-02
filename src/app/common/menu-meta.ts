export type MenuItemType = {
  key: string
  label: string
  isTitle?: boolean
  icon?: string
  url?: string
  badge?: {
    variant: string
    text: string
  }
  parentKey?: string
  isDisabled?: boolean
  collapsed?: boolean
  children?: MenuItemType[]
}

export type SubMenus = {
  item: MenuItemType
  linkClassName?: string
  subMenuClassName?: string
  activeMenuItems?: Array<string>
  toggleMenu?: (item: MenuItemType, status: boolean) => void
  className?: string
}

export const MENU_ITEMS: MenuItemType[] = [
  {
    key: 'Seguridad',
    label: 'SEGURIDAD',
    isTitle: true,
  },
  {
    key: 'configuration',
    label: 'Configuracion',
    icon: 'ti-settings',
    collapsed: true,
    children: [
      {
        key: 'maestro-modulos',
        label: 'Maestro de módulos',
        url: '/maestros/modulos',
        parentKey: 'configuracion',
      },
      {
        key: 'consiguration-users',
        label: 'Usuarios',
        url: '/configuration/users',
        parentKey: 'configuration',
      },
      {
        key: 'consiguration-person',
        label: 'Personas',
        url: '/configuration/person',
        parentKey: 'configuration'
      },
      {
        key: 'consiguration-maestro-roles',
        label: 'Maestro de roles',
        url: '/configuration/roles', // <-- corregido
        parentKey: 'configuration',
      },
      {
        key: 'maestro-opciones',
        label: 'Maestro de opciones',
        url: '/maestros/opciones',
        parentKey: 'configuration',
      },
      {
        key: 'maestro-acciones',
        label: 'Maestro de acciones',
        url: '/maestros/acciones',
        parentKey: 'configuration',
      },
    ]
  },
  {
    key: 'operaciones',
    label: 'Operaciones',
    icon: 'ti-user',
    collapsed: true,
    children: [
      {
        key: 'roles',
        label: 'Roles',
        url: '/operaciones/roles',
        parentKey: 'operaciones',
      },
      {
        key: 'roles-por-usuario',
        label: 'Roles por usuarios',
        url: '/operaciones/roles-por-usuario',
        parentKey: 'operaciones',
      },
      {
        key: 'asignar-permisos',
        label: 'Asignar permisos a usuario',
        url: '/operaciones/asignar-permisos',
        parentKey: 'operaciones',
      },
      {
        key: 'asignar-acciones',
        label: 'Asignar acciones a usuario',
        url: '/operaciones/asignar-acciones',
        parentKey: 'operaciones',
      },
      {
        key: 'revocar-permisos',
        label: 'Revocar permisos a usuario',
        url: '/operaciones/revocar-permisos',
        parentKey: 'operaciones',
      },
      {
        key: 'revocar-acciones',
        label: 'Revocar acciones a usuario',
        url: '/operaciones/revocar-acciones',
        parentKey: 'operaciones',
      },
      {
        key: 'desactivar-usuario',
        label: 'Desactivar usuario',
        url: '/operaciones/desactivar-usuario',
        parentKey: 'operaciones',
      },
      {
        key: 'cambiar-contrasena',
        label: 'Cambiar contraseña',
        url: '/operaciones/cambiar-contrasena',
        parentKey: 'operaciones',
      },
      {
        key: 'caducidad-contrasena',
        label: 'Establecer caducidad de contraseña',
        url: '/operaciones/caducidad-contrasena',
        parentKey: 'operaciones',
      }

    ]
  },
  {
    key: 'consultas',
    label: 'Consultas',
    icon: 'ti-search',
    collapsed: true,
    children: [
      {
        key: 'reporte-usuarios-por-rol',
        label: 'Reporte de usuarios por rol',
        url: '/consultas/usuarios-por-rol',
        parentKey: 'consultas',
      },
      {
        key: 'reporte-permisos-por-usuario',
        label: 'Reporte de permisos por usuario',
        url: '/consultas/permisos-por-usuario',
        parentKey: 'consultas',
      },
      {
        key: 'reporte-acciones-por-usuario',
        label: 'Reporte de acciones por usuario',
        url: '/consultas/acciones-por-usuario',
        parentKey: 'consultas',
      },
      {
        key: 'reporte-usuarios-inactivos',
        label: 'Reporte de usuarios inactivos',
        url: '/consultas/usuarios-inactivos',
        parentKey: 'consultas',
      }

    ]
  }
]

export const HORIZONTAL_MENU_ITEM: MenuItemType[] = [
  {
    key: 'dashboards',
    label: 'Dashboards',
    icon: 'ti-dashboard',
    children: [
      {
        key: 'sales',
        label: 'Sales',
        url: '/dashboards/sales',
        parentKey: 'dashboards',
      },
      {
        key: 'clinic',
        label: 'Clinic',
        url: '/dashboards/clinic',
        parentKey: 'dashboards',
      },
      {
        key: 'wallet',
        label: 'eWallet',
        url: '/dashboards/wallet',
        parentKey: 'dashboards',
      },
    ]
  },
  {
    key: 'apps',
    label: 'Apps',
    icon: 'ti-apps',
    children: [
      {
        key: 'chat',
        label: 'Chat',
        icon: 'ti-message',
        url: '/apps/chat',
        parentKey: 'apps',
      },
      {
        key: 'calendar',
        label: 'Calendar',
        icon: 'ti-calendar',
        url: '/apps/calendar',
        parentKey: 'apps',
      },
      {
        key: 'email',
        label: 'Email',
        icon: 'ti-inbox',
        url: '/apps/email',
        parentKey: 'apps',
      },
      {
        key: 'file-manager',
        label: 'File Manager',
        icon: 'ti-folder',
        url: '/apps/file-manager',
        parentKey: 'apps',
      },
      {
        key: 'hospital',
        label: 'Hospital',
        parentKey: 'apps',
        children: [
          {
            key: 'doctors',
            label: 'Doctors',
            url: '/hospital/doctors',
            parentKey: 'hospital',
          },
          {
            key: 'doctor-details',
            label: 'Doctor Details',
            url: '/hospital/doctors-details',
            parentKey: 'hospital',
          },
          {
            key: 'add-doctors',
            label: 'Add Doctors',
            url: '/hospital/add-doctors',
            parentKey: 'hospital',
          },
          {
            key: 'Patients',
            label: 'Patients',
            url: '/hospital/patients',
            parentKey: 'hospital',
          },
          {
            key: 'patients-details',
            label: 'Patient Details',
            url: '/hospital/patients-details',
            parentKey: 'hospital',
          },
          {
            key: 'add-patients',
            label: 'Add Patient',
            url: '/hospital/add-patients',
            parentKey: 'hospital',
          },
          {
            key: 'appointments',
            label: 'Appointments',
            url: '/hospital/appointments',
            parentKey: 'hospital',
          },
          {
            key: 'payments',
            label: 'Payments',
            url: '/hospital/payments',
            parentKey: 'hospital',
          },
          {
            key: 'departments',
            label: 'Departments',
            url: '/hospital/departments',
            parentKey: 'hospital',
          },
          {
            key: 'reviews',
            label: 'Reviews',
            url: '/hospital/reviews',
            parentKey: 'hospital',
          },
          {
            key: 'staffs',
            label: 'Staffs',
            url: '/hospital/staffs',
            parentKey: 'hospital',
          },
        ]
      },
      {
        key: 'e-commerce',
        label: 'Ecommerce',
        parentKey: 'apps',
        children: [
          {
            key: 'products',
            label: 'Products',
            url: '/ecommerce/products',
            parentKey: 'e-commerce',
          },
          {
            key: 'products-grid',
            label: 'Products Grid',
            url: '/ecommerce/products-grid',
            parentKey: 'e-commerce',
          },
          {
            key: 'product-details',
            label: 'Products Details',
            url: '/ecommerce/product-details',
            parentKey: 'e-commerce',
          },
          {
            key: 'add-products',
            label: 'Add Products',
            url: '/ecommerce/add-products',
            parentKey: 'e-commerce',
          },
          {
            key: 'categories',
            label: 'Categories',
            url: '/ecommerce/categories',
            parentKey: 'e-commerce',
          },
          {
            key: 'orders',
            label: 'Orders',
            url: '/ecommerce/orders',
            parentKey: 'e-commerce',
          },
          {
            key: 'order-details',
            label: 'Order Details',
            url: '/ecommerce/order-details',
            parentKey: 'e-commerce',
          },
          {
            key: 'customers',
            label: 'Customers',
            url: '/ecommerce/customers',
            parentKey: 'e-commerce',
          },
          {
            key: 'sellers',
            label: 'Sellers',
            url: '/ecommerce/sellers',
            parentKey: 'e-commerce',
          },
        ]
      },
      {
        key: 'invoice',
        label: 'Invoice',
        parentKey: 'apps',
        children: [
          {
            key: 'invoices',
            label: 'Invoice',
            url: '/invoice/invoices',
            parentKey: 'invoice',
          },
          {
            key: 'view-invoice',
            label: 'View Invoice',
            url: '/invoice/view',
            parentKey: 'invoice',
          },
          {
            key: 'create-invoice',
            label: 'Create Invoice',
            url: '/invoice/create',
            parentKey: 'invoice',
          },
        ]
      },
    ]
  },
  {
    key: 'pages',
    label: 'Pages',
    icon: 'ti-file-description',
    children: [
      {
        key: 'auth',
        label: 'Authentication',
        parentKey: 'pages',
        children: [
          {
            key: 'login',
            label: 'Login',
            url: '/auth/login',
            parentKey: 'auth',
          },
          {
            key: 'register',
            label: 'Register',
            url: '/auth/register',
            parentKey: 'auth',
          },
          {
            key: 'logout',
            label: 'Logout',
            url: '/auth/logout',
            parentKey: 'auth',
          },
          {
            key: 'recover-password',
            label: 'Recover Password',
            url: '/auth/recover-password',
            parentKey: 'auth',
          },
          {
            key: 'create-password',
            label: 'Create Password',
            url: '/auth/create-password',
            parentKey: 'auth',
          },
          {
            key: 'lock-screen',
            label: 'Lock Screen',
            url: '/auth/lock-screen',
            parentKey: 'auth',
          },
          {
            key: 'confirm-mail',
            label: 'Confirm Mail',
            url: '/auth/confirm-mail',
            parentKey: 'auth',
          },
          {
            key: 'login-pin',
            label: 'Login with PIN',
            url: '/auth/pin-login',
            parentKey: 'auth',
          },
          {
            key: '2FA',
            label: '2FA',
            url: '/auth/2fa',
            parentKey: 'auth',
          },
          {
            key: 'account-deactivation',
            label: 'Account Deactivation',
            url: '/auth/account-deactivation',
            parentKey: 'auth',
          },
        ]
      },
      {
        key: 'errors',
        label: 'Error Pages',
        parentKey: 'pages',
        children: [
          {
            key: 'error-401',
            label: '401 Unauthorized',
            url: '/errors-401',
            parentKey: 'errors',
          },
          {
            key: 'error-400',
            label: '400 Bad Reques',
            url: '/error-400',
            parentKey: 'errors',
          },
          {
            key: 'error-403',
            label: '403 Forbidden',
            url: '/error-403',
            parentKey: 'errors',
          },
          {
            key: 'error-404',
            label: '404 Not Found',
            url: '/error-404',
            parentKey: 'errors',
          },
          {
            key: 'error-408',
            label: '408 Request Timeout',
            url: '/error-408',
            parentKey: 'errors',
          },
          {
            key: 'error-500',
            label: '500 Internal Server',
            url: '/error-500',
            parentKey: 'errors',
          },
          {
            key: 'error-501',
            label: '501 Not Implemented',
            url: '/error-501',
            parentKey: 'errors',
          },
          {
            key: 'error-502',
            label: '502 Service Overloaded',
            url: '/error-502',
            parentKey: 'errors',
          },
          {
            key: 'service-unavailable',
            label: 'Service Unavailable',
            url: '/service-unavailable',
            parentKey: 'errors',
          },
        ]
      },
      {
        key: 'starter-page',
        label: 'Starter Page',
        url: '/pages/starter-page',
        parentKey: 'pages',
      },
      {
        key: 'faq',
        label: 'FAQ',
        url: '/pages/faq',
        parentKey: 'pages',
      },
      {
        key: 'pricing-one',
        label: 'Pricing One',
        url: '/pricing/pricing-one',
        parentKey: 'pages',
      },
      {
        key: 'pricing-two',
        label: 'Pricing Two',
        url: '/pricing/pricing-two',
        parentKey: 'pages',
      },
      {
        key: 'maintenance',
        label: 'Maintenance',
        url: 'maintenance',
        parentKey: 'pages',
      },
      {
        key: 'timeline',
        label: 'Timeline',
        url: '/pages/timeline',
        parentKey: 'pages',
      },
    ]
  },
  {
    key: 'components',
    label: 'Components',
    icon: 'ti-components',
    children: [
      {
        key: 'base-ui',
        label: 'Base UI',
        children: [
          {
            key: 'base-ui-accordions',
            label: 'Accordions',
            url: '/ui/accordions',
            parentKey: 'base-ui',
          },
          {
            key: 'base-ui-alerts',
            label: 'Alerts',
            url: '/ui/alerts',
            parentKey: 'base-ui',
          },
          {
            key: 'base-ui-avatars',
            label: 'Avatars',
            url: '/ui/avatars',
            parentKey: 'base-ui',
          },
          {
            key: 'base-ui-badges',
            label: 'Badges',
            url: '/ui/badges',
            parentKey: 'base-ui',
          },
          {
            key: 'base-ui-breadcrumb',
            label: 'Breadcrumb',
            url: '/ui/breadcrumb',
            parentKey: 'base-ui',
          },
          {
            key: 'base-ui-buttons',
            label: 'Buttons',
            url: '/ui/buttons',
            parentKey: 'base-ui',
          },
          {
            key: 'base-ui-cards',
            label: 'Cards',
            url: '/ui/cards',
            parentKey: 'base-ui',
          },
          {
            key: 'base-ui-carousel',
            label: 'Carousel',
            url: '/ui/carousel',
            parentKey: 'base-ui',
          },
          {
            key: 'base-ui-collapse',
            label: 'Collapse',
            url: '/ui/collapse',
            parentKey: 'base-ui',
          },
          {
            key: 'base-ui-dropdowns',
            label: 'Dropdowns',
            url: '/ui/dropdowns',
            parentKey: 'base-ui',
          },
          {
            key: 'ul-ratio',
            label: 'Ratio',
            url: '/ui/ratio',
            parentKey: 'base-ui',
          },
          {
            key: 'ul-grid',
            label: 'Grid',
            url: '/ui/grid',
            parentKey: 'base-ui',
          },
          {
            key: 'ul-links',
            label: 'Links',
            url: '/ui/links',
            parentKey: 'base-ui',
          },
          {
            key: 'base-ui-list-group',
            label: 'List Group',
            url: '/ui/list-group',
            parentKey: 'base-ui',
          },
          {
            key: 'base-ui-modals',
            label: 'Modals',
            url: '/ui/modals',
            parentKey: 'base-ui',
          },
          {
            key: 'base-ui-notifications',
            label: 'Notifications',
            url: '/ui/notifications',
            parentKey: 'base-ui',
          },
          {
            key: 'base-ui-offcanvas',
            label: 'Offcanvas',
            url: '/ui/offcanvas',
            parentKey: 'base-ui',
          },
          {
            key: 'base-ui-placeholders',
            label: 'Placeholders',
            url: '/ui/placeholders',
            parentKey: 'base-ui',
          },
          {
            key: 'base-ui-pagination',
            label: 'Pagination',
            url: '/ui/pagination',
            parentKey: 'base-ui',
          },
          {
            key: 'base-ui-popovers',
            label: 'Popovers',
            url: '/ui/popovers',
            parentKey: 'base-ui',
          },
          {
            key: 'base-ui-progress',
            label: 'Progress',
            url: '/ui/progress',
            parentKey: 'base-ui',
          },
          {
            key: 'base-ui-spinners',
            label: 'Spinners',
            url: '/ui/spinners',
            parentKey: 'base-ui',
          },
          {
            key: 'base-ui-tabs',
            label: 'Tabs',
            url: '/ui/tabs',
            parentKey: 'base-ui',
          },
          {
            key: 'base-ui-tooltips',
            label: 'Tooltips',
            url: '/ui/tooltips',
            parentKey: 'base-ui',
          },
          {
            key: 'base-ui-typography',
            label: 'Typography',
            url: '/ui/typography',
            parentKey: 'base-ui',
          },
          {
            key: 'base-ui-utilities',
            label: 'Utilities',
            url: '/ui/utilities',
            parentKey: 'base-ui',
          },
        ]
      },
      {
        key: 'extended-ui-pages',
        label: 'Extended UI',
        children: [
          {
            key: 'dragula',
            label: 'Dragula',
            url: '/extended-ui/dragula',
            parentKey: 'extended-ui-pages',
          },
          {
            key: 'sweet-alert',
            label: 'Sweet Alert',
            url: '/extended-ui/sweet-alert',
            parentKey: 'extended-ui-pages',
          },
          {
            key: 'ratings',
            label: 'Ratings',
            url: '/extended-ui/ratings',
            parentKey: 'extended-ui-pages',
          },
          {
            key: 'scrollbar',
            label: 'Scrollbar',
            url: '/extended-ui/scrollbar',
            parentKey: 'extended-ui-pages',
          },
        ]
      },
      {
        key: 'forms',
        label: 'Forms',
        children: [
          {
            key: 'basic',
            label: 'Basic Elements',
            url: '/form/basic-elements',
            parentKey: 'forms',
          },
          {
            key: 'inputmask',
            label: 'Inputmask',
            url: '/form/inputmask',
            parentKey: 'forms',
          },
          {
            key: 'picker',
            label: 'Picker',
            url: '/form/picker',
            parentKey: 'forms',
          },
          {
            key: 'select',
            label: 'Select',
            url: '/form/select',
            parentKey: 'forms',
          },
          {
            key: 'slider',
            label: 'Range Slider',
            url: '/form/slider',
            parentKey: 'forms',
          },
          {
            key: 'validation',
            label: 'Validation',
            url: '/form/validation',
            parentKey: 'forms',
          },
          {
            key: 'wizard',
            label: 'Wizard',
            url: '/form/wizard',
            parentKey: 'forms',
          },
          {
            key: 'file-uploads',
            label: 'File Uploads',
            url: '/form/file-uploads',
            parentKey: 'forms',
          },
          {
            key: 'editors',
            label: 'Editors',
            url: '/form/editors',
            parentKey: 'forms',
          },
          {
            key: 'layouts',
            label: 'Layouts',
            url: '/form/layouts',
            parentKey: 'forms',
          },
        ]
      },
      {
        key: 'charts',
        label: 'charts',
        children: [
          {
            key: 'area',
            label: 'area',
            url: '/charts/area',
            parentKey: 'charts',
          },
          {
            key: 'bar',
            label: 'Bar',
            url: '/charts/bar',
            parentKey: 'charts',
          },
          {
            key: 'bubble',
            label: 'Bubble',
            url: '/charts/bubble',
            parentKey: 'charts',
          },
          {
            key: 'candlestick',
            label: 'Candlestick',
            url: '/charts/candlestick',
            parentKey: 'charts',
          },
          {
            key: 'column',
            label: 'Column',
            url: '/charts/column',
            parentKey: 'charts',
          },
          {
            key: 'heatmap',
            label: 'Heatmap',
            url: '/charts/heatmap',
            parentKey: 'charts',
          },
          {
            key: 'line',
            label: 'Line',
            url: '/charts/line',
            parentKey: 'charts',
          },
          {
            key: 'mixed',
            label: 'Mixed',
            url: '/charts/mixed',
            parentKey: 'charts',
          },
          {
            key: 'timeline-chart',
            label: 'Timeline',
            url: '/charts/timeline',
            parentKey: 'charts',
          },
          {
            key: 'boxplot',
            label: 'Boxplot',
            url: '/charts/boxplot',
            parentKey: 'charts',
          },
          {
            key: 'treemap',
            label: 'Treemap',
            url: '/charts/treemap',
            parentKey: 'charts',
          },
          {
            key: 'pie',
            label: 'Pie',
            url: '/charts/pie',
            parentKey: 'charts',
          },
          {
            key: 'radar',
            label: 'Radar',
            url: '/charts/radar',
            parentKey: 'charts',
          },
          {
            key: 'radialBar',
            label: 'RadialBar',
            url: '/charts/radialbar',
            parentKey: 'charts',
          },
          {
            key: 'scatter',
            label: 'Scatter',
            url: '/charts/scatter',
            parentKey: 'charts',
          },
          {
            key: 'polar',
            label: 'Polar Area',
            url: '/charts/polar',
            parentKey: 'charts',
          },
          {
            key: 'sparklines',
            label: 'Sparklines',
            url: '/charts/sparklines',
            parentKey: 'charts',
          },
        ],
      },
      {
        key: 'tables',
        label: 'Tables',
        children: [
          {
            key: 'basic',
            label: 'Basic Tables',
            url: '/tables/basic-tables',
            parentKey: 'tables',
          },
          {
            key: 'gridJs',
            label: 'GridJs Tables',
            url: '/tables/datatable',
            parentKey: 'tables',
          },
        ]
      },
      {
        key: 'icons',
        label: 'Icons',
        children: [
          {
            key: 'tabler',
            label: 'Tabler',
            url: '/icons/tabler',
            parentKey: 'icons',
          },
          {
            key: 'solar',
            label: 'Solar',
            url: '/icons/solar',
            parentKey: 'icons',
          },
        ]
      },
      {
        key: 'maps',
        label: 'Maps',
        children: [
          {
            key: 'google',
            label: 'Google Maps',
            url: '/maps/google',
            parentKey: 'maps',
          },
          {
            key: 'vector',
            label: 'Vector Maps',
            url: '/maps/vector',
            parentKey: 'maps',
          },
          {
            key: 'leaflet',
            label: 'Leaflet Maps',
            url: '/maps/leaflet',
            parentKey: 'maps',
          },
        ]
      },
    ]
  },
]