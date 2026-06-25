const machines = [
  {
    machineId: 1,
    address: '27-й микрорайон, 8/2',
    district: '27-й микрорайон',
    description:
      'Автомат питьевой воды у входа в жилой комплекс. Работает в режиме 24/7, ежедневная проверка качества воды и остатков тары.',
    lat: 43.661,
    lng: 51.171,
    status: 'active',
    photosFolder: '1',
    photosCount: 5,
  },
  {
    machineId: 2,
    address: 'ЖК Birlik, 19-й микрорайон, 36/1',
    district: '19-й микрорайон',
    description:
      'Установлен на территории ЖК Birlik. Популярная точка среди жителей комплекса — очищенная питьевая вода по 10 тенге за литр.',
    lat: 43.6745,
    lng: 51.2003,
    status: 'active',
    photosFolder: '2',
    photosCount: 3,
  },
  {
    machineId: 3,
    address: '17-й микрорайон',
    district: '17-й микрорайон',
    description: 'Компактный автомат питьевой воды рядом с остановкой общественного транспорта.',
    lat: 43.6505,
    lng: 51.1665,
    status: 'active',
    photosFolder: '3',
    photosCount: 3,
  },
  {
    machineId: 4,
    address: 'ЖК Мамыр, 3-й микрорайон, 8',
    district: '3-й микрорайон',
    description:
      'Крупная точка с автоматом питьевой воды и удобным навесом. Одна из самых посещаемых локаций сети.',
    lat: 43.6452,
    lng: 51.2104,
    status: 'active',
    photosFolder: '4',
    photosCount: 7,
  },
  {
    machineId: 5,
    address: '8-й микрорайон, 28',
    district: '8-й микрорайон',
    description: 'Автомат питьевой воды у входа в торговый павильон, доступен ежедневно.',
    lat: 43.6553,
    lng: 51.1822,
    status: 'active',
    photosFolder: '5',
    photosCount: 4,
  },
  {
    machineId: 6,
    address: '4-й микрорайон, 31',
    district: '4-й микрорайон',
    description: 'Небольшая точка с питьевой водой рядом с офисным зданием.',
    lat: 43.6488,
    lng: 51.1543,
    status: 'active',
    photosFolder: '6',
    photosCount: 2,
  },
  {
    machineId: 7,
    address: '11-й микрорайон, 11/2',
    district: '11-й микрорайон',
    description: 'Автомат питьевой воды в жилой зоне, рядом с детской площадкой.',
    lat: 43.6699,
    lng: 51.1898,
    status: 'active',
    photosFolder: '7',
    photosCount: 4,
  },
];

const defaultSiteStats = {
  slug: 'homepage',
  stats: [
    { key: 'points', label: 'точек размещения', value: 7, suffix: '', auto: true },
    { key: 'districts', label: 'районов города', value: 7, suffix: '', auto: true },
    { key: 'photos', label: 'фотографий в галерее', value: 28, suffix: '', auto: true },
    { key: 'clients', label: 'клиентов в месяц', value: 1200, suffix: '+', auto: false },
  ],
};

const defaultAdmin = {
  name: 'Администратор',
  email: 'admin@aktauvend.kz',
  password: 'admin123',
  phone: '+77001234567',
  role: 'admin',
};

module.exports = { machines, defaultSiteStats, defaultAdmin };
