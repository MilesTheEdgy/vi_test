import React from 'react';

const UrunEkle = React.lazy(() => import('../../routes/urunekle/UrunEkle'));
const YeniTeklif = React.lazy(() => import('../../routes/yeniteklif/YeniTeklif'))
const Dashboard = React.lazy(() => import('../../routes/Dashboard'));


const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/urunekle', name: 'Ürün Ekle', component: UrunEkle },
  { path: '/yeniteklif', name: 'Yeni Teklif', component: YeniTeklif }
];

export default routes;
