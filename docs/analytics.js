// Paste the public Cloudflare Web Analytics site token here.
(() => {
 const token = '8f925478c24e413b9a1f142f1074d68f';
 if (!/^[0-9a-f]{32}$/i.test(token) || location.protocol !== 'https:') return;

 const beacon = document.createElement('script');
 beacon.src = 'https://static.cloudflareinsights.com/beacon.min.js';
 beacon.defer = true;
 beacon.dataset.cfBeacon = JSON.stringify({token});
 document.head.append(beacon);
})();
