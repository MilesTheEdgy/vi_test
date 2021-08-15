
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
const SdcKullanicilar = React.lazy(() => import('../../views/sdckullanıcılar/SdcKullanicilar'))
const SdcKullanici = React.lazy(() => import('../../views/sdckullanıcılar/SdcKullanici'))
const SdcIslemler = React.lazy(() => import('../../views/sdckullanıcılar/SdcIslemler'))
const SdcIslem = React.lazy(() => import('../../views/sdckullanıcılar/SdcIslem'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/anasayfa', exact: true, name: 'anasayfa', component: Anasayfa },
  { path: '/duyurular', exact: true, name: 'duyurular', component: Duyurular },
  { path: '/basvuru/yeni', exact: true, name: 'yeni basvuru', component: YeniBasvuru },
  { path: '/basvuru/takip', exact: true, name: 'basvuru takibi', component: BasvuruTakibi},
  { path: "/rapor/islemler/onaylanan", exact: true, name: "Onaylanan başvurular", component: RaporOnaylanan},
  { path: "/rapor/islemler/iptal", exact: true, name: "İptal başvurular", component: RaporIptal},
  { path: "/rapor/islemler/beklemede", exact: true, name: "Beklemede başvurular", component: RaporBekleyen},
  { path: '/basvurular/goruntule', exact: true, name: 'basvurular goruntule', component: BasvurularGoruntule},
  { path: '/basvurular/detay/:id', exact: true, name: 'Basvuru detay', component: BasvuruDetay},
  { path: '/muhasebe/stok/cihazekle', exact: true, name: 'Cihaz Ekle', component: CihazEkle},
  { path: '/sdc/kullanicilar', exact: true, name: 'SDC Kullanıcılar', component: SdcKullanicilar},
  { path: '/sdc/kullanici/:id', exact: true, name: 'SDC Kullanıcı', component: SdcKullanici},
  { path: '/sdc/islemler', exact: true, name: 'SDC İşlemler', component: SdcIslemler},
  { path: '/sd/islem/:id', exact: true, name: 'SDC İşlemler', component: SdcIslem}
];

export default routes;
