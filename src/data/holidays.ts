export interface Holiday {
  id: number
  name: string
  date: string
  themeColor: string
  bannerImage: string
  description: string
  active: boolean
  sortOrder: number
}

export const holidays: Holiday[] = [
  {
    id: 1,
    name: '情人节',
    date: '02-14',
    themeColor: '#FF6B9D',
    bannerImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=valentines%20day%20romantic%20flowers%20pink%20red%20love&image_size=landscape_16_9',
    description: '浪漫情人节，爱意满满',
    active: false,
    sortOrder: 1
  },
  {
    id: 2,
    name: '妇女节',
    date: '03-08',
    themeColor: '#9B59B6',
    bannerImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=womens%20day%20flowers%20purple%20pink%20celebration&image_size=landscape_16_9',
    description: '致敬最美的她',
    active: false,
    sortOrder: 2
  },
  {
    id: 3,
    name: '母亲节',
    date: '05-sunday-2',
    themeColor: '#FF8E72',
    bannerImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=mothers%20day%20flowers%20carnation%20pink%20warm&image_size=landscape_16_9',
    description: '感恩母爱，温暖相伴',
    active: false,
    sortOrder: 3
  },
  {
    id: 4,
    name: '父亲节',
    date: '06-sunday-3',
    themeColor: '#3498DB',
    bannerImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=fathers%20day%20flowers%20blue%20yellow%20warm%20love&image_size=landscape_16_9',
    description: '父爱如山，感恩有您',
    active: false,
    sortOrder: 4
  },
  {
    id: 5,
    name: '高考',
    date: '06-07',
    themeColor: '#E74C3C',
    bannerImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=college%20entrance%20exam%20celebration%20flowers%20red%20gold%20success&image_size=landscape_16_9',
    description: '金榜题名，前程似锦',
    active: false,
    sortOrder: 5
  },
  {
    id: 6,
    name: '教师节',
    date: '09-10',
    themeColor: '#F1C40F',
    bannerImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=teachers%20day%20flowers%20yellow%20white%20gratitude&image_size=landscape_16_9',
    description: '师恩难忘，桃李芬芳',
    active: false,
    sortOrder: 6
  },
  {
    id: 7,
    name: '中秋节',
    date: '09-17',
    themeColor: '#F39C12',
    bannerImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=mid%20autumn%20festival%20flowers%20golden%20moon%20celebration&image_size=landscape_16_9',
    description: '花好月圆，情意绵绵',
    active: false,
    sortOrder: 7
  },
  {
    id: 8,
    name: '国庆节',
    date: '10-01',
    themeColor: '#E74C3C',
    bannerImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=national%20day%20china%20flowers%20red%20yellow%20celebration&image_size=landscape_16_9',
    description: '举国同庆，盛世华章',
    active: false,
    sortOrder: 8
  },
  {
    id: 9,
    name: '圣诞节',
    date: '12-25',
    themeColor: '#E74C3C',
    bannerImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=christmas%20flowers%20red%20green%20holiday%20celebration&image_size=landscape_16_9',
    description: '圣诞快乐，温馨祝福',
    active: false,
    sortOrder: 9
  }
]

export function getCurrentHoliday(): Holiday | null {
  const now = new Date()
  const currentMonth = String(now.getMonth() + 1).padStart(2, '0')
  const currentDay = String(now.getDate()).padStart(2, '0')
  const currentDateStr = `${currentMonth}-${currentDay}`
  
  for (const holiday of holidays) {
    if (holiday.date === currentDateStr) {
      return holiday
    }
    
    if (holiday.date.includes('sunday')) {
      const [month, , weekIndex] = holiday.date.split('-')
      const targetMonth = parseInt(month)
      const targetWeek = parseInt(weekIndex)
      
      if (now.getMonth() + 1 === targetMonth) {
        const firstDay = new Date(now.getFullYear(), targetMonth - 1, 1)
        const firstSunday = firstDay.getDay() === 0 ? firstDay : new Date(firstDay.getTime() + (7 - firstDay.getDay()) * 24 * 60 * 60 * 1000)
        const targetDate = new Date(firstSunday.getTime() + (targetWeek - 1) * 7 * 24 * 60 * 60 * 1000)
        
        if (targetDate.getDate() === now.getDate()) {
          return holiday
        }
      }
    }
  }
  
  const upcomingHoliday = holidays.find(h => {
    if (h.date.includes('sunday')) return false
    const [month, day] = h.date.split('-').map(Number)
    const holidayDate = new Date(now.getFullYear(), month - 1, day)
    const diffDays = Math.floor((holidayDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    return diffDays >= 0 && diffDays <= 7
  })
  
  return upcomingHoliday || null
}

export function getHolidayTheme(): Holiday | null {
  const current = getCurrentHoliday()
  if (current) return current
  
  return holidays.find(h => h.active) || null
}
