import React from 'react';


const Anasayfa = React.lazy(() => import('../../views/anasayfa/Anasayfa'));
const YeniBasvuru = React.lazy(() => import("../../views/yenibasvuru/YeniBasvuru"));
const Duyurular = React.lazy(() => import("../../views/duyurlar/Duyurular"));
const BasvuruTakibi = React.lazy(() => import("../../views/basvurutakibi/BasvuruTakibi"))
const CihazEkle = React.lazy(()=> import('../../views/muhasebe/cihazekle/CihazEkle'))
const BasvurularGoruntule = React.lazy(() => import('../../views/basvurulargoruntule/BasvurularGoruntule'))
const BasvuruDetay = React.lazy(() => import('../../views/basvurulargoruntule/BasvuruDetay'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/anasayfa', name: 'anasayfa', component: Anasayfa },
  { path: '/duyurular', name: 'duyurular', component: Duyurular },
  { path: '/basvuru/yeni', name: 'yeni basvuru', component: YeniBasvuru },
  { path: '/basvuru/takip', name: 'basvuru takibi', component: BasvuruTakibi},
  { path: '/basvurular/goruntule', name: 'basvurular goruntule', component: BasvurularGoruntule},
  { path: '/basvurular/detay/:id', exact: true, name: 'Basvuru detay', component: BasvuruDetay},
  { path: '/muhasebe/stok/cihazekle', exact: true, name: 'Cihaz Ekle', component: CihazEkle}
];

export default routes;
