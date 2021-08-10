
import React from 'react';

const Anasayfa = React.lazy(() => import('../../views/anasayfa/Anasayfa'));
const YeniBasvuru = React.lazy(() => import("../../views/yenibasvuru/YeniBasvuru"));
const Duyurular = React.lazy(() => import("../../views/duyurlar/Duyurular"));
const BasvuruTakibi = React.lazy(() => import("../../views/basvurutakibi/BasvuruTakibi"))
const CihazEkle = React.lazy(()=> import('../../views/muhasebe/cihazekle/CihazEkle'))
const BasvurularGoruntule = React.lazy(() => import('../../views/basvurulargoruntule/BasvurularGoruntule'))
const BasvuruDetay = React.lazy(() => import('../../views/basvurulargoruntule/BasvuruDetay'))
const RaporOnaylanan = React.lazy(() => import('../../views/rapor/onaylanan/RaporOnaylanan'))
const RaporIptal= React.lazy(() => import('../../views/rapor/iptal/RaporIptal'))
const RaporBekleyen= React.lazy(() => import('../../views/rapor/beklemede/RaporBekleyen'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/anasayfa', name: 'anasayfa', component: Anasayfa },
  { path: '/duyurular', name: 'duyurular', component: Duyurular },
  { path: '/basvuru/yeni', name: 'yeni basvuru', component: YeniBasvuru },
  { path: '/basvuru/takip', name: 'basvuru takibi', component: BasvuruTakibi},
  { path: "/rapor/islemler/onaylanan", name: "Onaylanan başvurular", component: RaporOnaylanan},
  { path: "/rapor/islemler/iptal", name: "İptal başvurular", component: RaporIptal},
  { path: "/rapor/islemler/beklemede", name: "Beklemede başvurular", component: RaporBekleyen},
  { path: '/basvurular/goruntule', name: 'basvurular goruntule', component: BasvurularGoruntule},
  { path: '/basvurular/detay/:id', exact: true, name: 'Basvuru detay', component: BasvuruDetay},
  { path: '/muhasebe/stok/cihazekle', exact: true, name: 'Cihaz Ekle', component: CihazEkle}
];

export default routes;
